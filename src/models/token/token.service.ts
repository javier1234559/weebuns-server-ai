import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ITokenService } from './interface/token-service.interface';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  CreateTransactionDto,
  FindAllTransactionsQuery,
  UseTokensDto,
  EarnTokensDto,
  WithdrawTokensDto,
} from './dto/token-request.dto';
import { paginationQuery } from 'src/common/helper/prisma-queries.helper';
import { PaymentStatus, PaymentType } from '@prisma/client';
import { calculatePagination } from 'src/common/utils/pagination';
import {
  TokenWalletResponse,
  TokenPackagesResponse,
  PaymentUrlResponse,
  TransactionResponse,
  TransactionsResponse,
  TransactionWithUserResponse,
} from './dto/token-response.dto';
import { v4 as uuidv4 } from 'uuid';
import { TransactionType } from 'src/common/enum/common';
import { PaymentService } from 'src/models/payment/payment.service';
import * as moment from 'moment';
import { TokenPackage } from './entities/token-package.entity';

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService,
  ) {}

  async getWallet(userId: string): Promise<TokenWalletResponse> {
    const wallet = await this.prisma.tokenWallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      const newWallet = await this.prisma.tokenWallet.create({
        data: { userId, balance: 0 },
      });
      return { wallet: newWallet };
    }

    return { wallet };
  }

  async getPackages(): Promise<TokenPackagesResponse> {
    const packages = await this.prisma.tokenPackage.findMany();
    return { packages: packages as TokenPackage[] };
  }

  async createTransaction(
    userId: string,
    data: CreateTransactionDto,
  ): Promise<PaymentUrlResponse> {
    const { packageCode, paymentType } = data;

    const tokenPackage = await this.prisma.tokenPackage.findUnique({
      where: { code: packageCode },
    });

    if (!tokenPackage) {
      throw new NotFoundException('Token package not found');
    }

    const transID = Math.floor(Math.random() * 1000000);
    const transactionId = `${moment().format('YYMMDD')}_${transID}`;

    const transaction = await this.prisma.transaction.create({
      data: {
        transactionId: transactionId,
        user: { connect: { id: userId } },
        package: { connect: { code: packageCode } },
        amount: tokenPackage.price,
        tokenAmount: tokenPackage.tokens,
        paymentType,
        status: PaymentStatus.pending,
        reason: `Purchase ${tokenPackage.tokens} tokens`,
        paymentDate: new Date(),
        type: TransactionType.TOKEN_PURCHASE,
      },
    });

    const paymentUrl = await this.paymentService.generatePaymentUrl({
      provider: paymentType,
      data: {
        amount: tokenPackage.price,
        transactionId: transaction.transactionId,
        description: transaction.reason || 'Purchase tokens',
      },
    });

    return { paymentUrl };
  }

  async getTransactions(
    userId: string,
    query: FindAllTransactionsQuery,
  ): Promise<TransactionsResponse> {
    const { page, perPage, paymentType, status, type, from, to } = query;

    const where = {
      userId,
      ...(paymentType && { paymentType }),
      ...(status && { status }),
      ...(type && { type }),
      ...(from &&
        to && {
          paymentDate: {
            gte: new Date(from),
            lte: new Date(to),
          },
        }),
    };

    const [transactions, totalItems] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        ...paginationQuery(page, perPage),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions,
      pagination: calculatePagination(totalItems, query),
    };
  }

  async getAdminTransactions(
    query: FindAllTransactionsQuery,
  ): Promise<TransactionsResponse> {
    const { page, perPage, paymentType, status, type, search, from, to } =
      query;

    const where = {
      ...(paymentType && { paymentType }),
      ...(status && { status }),
      ...(type && { type }),
      ...(search && { transactionId: { contains: search } }),
      ...(from &&
        to && {
          paymentDate: {
            gte: new Date(from),
            lte: new Date(to),
          },
        }),
    };

    const [transactions, totalItems] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        ...paginationQuery(page, perPage),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions,
      pagination: calculatePagination(totalItems, query),
    };
  }

  async useTokens(
    userId: string,
    data: UseTokensDto,
  ): Promise<TransactionResponse> {
    const { tokenAmount, reason } = data;

    const walletResponse = await this.getWallet(userId);

    if (walletResponse.wallet.balance < tokenAmount) {
      throw new BadRequestException('Insufficient token balance');
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        transactionId: uuidv4(),
        user: { connect: { id: userId } },
        amount: 0,
        tokenAmount: -tokenAmount,
        paymentType: PaymentType.internal,
        status: PaymentStatus.completed,
        paymentDate: new Date(),
        type: TransactionType.TOKEN_USE,
        reason,
      },
    });

    await this.updateWalletBalance(userId, -tokenAmount);

    return { transaction };
  }

  async earnTokens(
    userId: string,
    data: EarnTokensDto,
  ): Promise<TransactionResponse> {
    const { tokenAmount, reason } = data;

    const transaction = await this.prisma.transaction.create({
      data: {
        transactionId: uuidv4(),
        user: { connect: { id: userId } },
        amount: 0,
        tokenAmount: tokenAmount,
        paymentType: PaymentType.internal,
        status: PaymentStatus.completed,
        paymentDate: new Date(),
        type: TransactionType.TOKEN_EARN,
        reason,
      },
    });

    await this.updateWalletBalance(userId, tokenAmount);

    return { transaction };
  }

  private async updateWalletBalance(userId: string, amount: number) {
    await this.prisma.tokenWallet.upsert({
      where: { userId },
      create: {
        userId,
        balance: Math.max(0, amount),
      },
      update: {
        balance: {
          increment: amount,
        },
      },
    });
  }

  async withdrawTokens(
    userId: string,
    data: WithdrawTokensDto,
  ): Promise<TransactionResponse> {
    const { tokenAmount } = data;

    const walletResponse = await this.getWallet(userId);

    if (walletResponse.wallet.balance < tokenAmount) {
      throw new BadRequestException('Insufficient token balance');
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        transactionId: uuidv4(),
        user: { connect: { id: userId } },
        amount: 0,
        tokenAmount: -tokenAmount,
        paymentType: PaymentType.internal,
        status: PaymentStatus.pending,
        paymentDate: new Date(),
        type: TransactionType.TOKEN_WITHDRAW,
      },
    });

    return { transaction };
  }

  async getWithdrawalRequests(
    query: FindAllTransactionsQuery,
  ): Promise<TransactionsResponse> {
    const {
      page,
      perPage,
      status,
      type = TransactionType.TOKEN_WITHDRAW,
      from,
      to,
    } = query;

    const where = {
      ...(status && { status }),
      ...(type && { type }),
      ...(from &&
        to && {
          paymentDate: {
            gte: new Date(from),
            lte: new Date(to),
          },
        }),
    };

    const [transactions, totalItems] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        ...paginationQuery(page, perPage),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions,
      pagination: calculatePagination(totalItems, query),
    };
  }

  async getWithdrawalRequestDetails(
    requestId: string,
  ): Promise<TransactionWithUserResponse> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: requestId },
    });

    if (!transaction) {
      throw new NotFoundException('Withdrawal request not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: transaction.userId },
      include: {
        teacherProfile: true,
        studentProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { transaction, user };
  }

  async approveWithdrawalRequest(
    requestId: string,
  ): Promise<TransactionResponse> {
    const transaction = await this.prisma.transaction.update({
      where: { id: requestId },
      data: { status: PaymentStatus.completed },
    });

    await this.updateWalletBalance(transaction.userId, transaction.tokenAmount); // this already in negative

    return { transaction };
  }
}
