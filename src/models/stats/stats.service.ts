import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { IStatsService } from './interface/stats-service.inteface';
import { StatsResponse, AnalyticsResponse } from './dto/stats-response.dto';
import { TransactionType } from 'src/common/enum/common';
import { UserRole, PaymentStatus, Transaction } from '@prisma/client';
import * as moment from 'moment';

@Injectable()
export class StatsService implements IStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<StatsResponse> {
    const totalLessons = await this.prisma.lesson.count();
    const totalSubmissions = await this.prisma.lessonSubmission.count();

    return { totalLessons, totalSubmissions };
  }

  private async getTransactions(startOfDay: Date, endOfDay: Date) {
    const [allTransactions, todayTransactions] = await Promise.all([
      this.prisma.transaction.findMany({
        where: {
          status: PaymentStatus.completed,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      this.prisma.transaction.findMany({
        where: {
          status: PaymentStatus.completed,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
    ]);

    return { allTransactions, todayTransactions };
  }

  private async getCirculatingSupply() {
    const userBalances = await this.prisma.tokenWallet.aggregate({
      _sum: {
        balance: true,
      },
      where: {
        deletedAt: null,
      },
    });

    return userBalances._sum.balance || 0;
  }

  private calculateTotalSupply(transactions: Transaction[]) {
    return transactions
      .filter((t) => t.tokenAmount > 0)
      .reduce((acc, curr) => acc + curr.tokenAmount, 0);
  }

  private calculateTodaySupply(transactions: Transaction[]) {
    return transactions
      .filter((t) => t.tokenAmount > 0)
      .reduce((acc, curr) => acc + curr.tokenAmount, 0);
  }

  private getWithdrawnTransactions(transactions: Transaction[]) {
    return transactions.filter(
      (t) => t.type === TransactionType.TOKEN_WITHDRAW, // eslint-disable-line @typescript-eslint/no-unsafe-enum-comparison
    );
  }

  private calculateWithdrawnTokens(transactions: Transaction[]) {
    return transactions.reduce(
      (acc, curr) => acc + Math.abs(curr.tokenAmount),
      0,
    );
  }

  private calculateTodayNetChange(transactions: Transaction[]) {
    return transactions.reduce((acc, curr) => acc + curr.tokenAmount, 0);
  }

  private async getUserStats(startOfDay: Date, endOfDay: Date) {
    const [totalUsers, todayNewUsers, latestUser] = await Promise.all([
      this.prisma.user.count({
        where: {
          role: UserRole.user,
          deletedAt: null,
        },
      }),
      this.prisma.user.count({
        where: {
          role: UserRole.user,
          deletedAt: null,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
      this.prisma.user.findFirst({
        where: {
          role: UserRole.user,
          deletedAt: null,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
    ]);

    return { totalUsers, todayNewUsers, latestUser };
  }

  private formatTokenValue(value: number): string {
    return `${(value * 1000).toLocaleString('vi-VN')} VND`;
  }

  private formatTokenChange(value: number): string {
    if (value === 0) return '0 token';
    return `${value > 0 ? '+' : ''}${value} token`;
  }

  async getAnalytics(): Promise<AnalyticsResponse> {
    const now = new Date();
    const startOfDay = moment(now).startOf('day').toDate();
    const endOfDay = moment(now).endOf('day').toDate();

    // Get all transaction data
    const { allTransactions, todayTransactions } = await this.getTransactions(
      startOfDay,
      endOfDay,
    );

    // Calculate token supplies
    const circulatingSupply = await this.getCirculatingSupply();
    const totalTokenSupply = this.calculateTotalSupply(allTransactions);
    const todayNewSupply = this.calculateTodaySupply(todayTransactions);

    // Calculate withdrawn tokens
    const withdrawTransactions = this.getWithdrawnTransactions(allTransactions);
    const totalWithdrawnTokens =
      this.calculateWithdrawnTokens(withdrawTransactions);
    const todayWithdrawnTokens = this.calculateWithdrawnTokens(
      this.getWithdrawnTransactions(todayTransactions),
    );

    // Calculate changes
    const todayNetChange = this.calculateTodayNetChange(todayTransactions);

    // Get user statistics
    const { totalUsers, todayNewUsers, latestUser } = await this.getUserStats(
      startOfDay,
      endOfDay,
    );

    // Get latest update times
    const latestWithdrawTime = withdrawTransactions[0]?.updatedAt || now;
    const latestAddTime =
      allTransactions.find((t) => t.tokenAmount > 0)?.updatedAt || now;

    return {
      circulatingStats: {
        type: 'circulating',
        value: circulatingSupply,
        description: this.formatTokenValue(circulatingSupply),
        changedValue: this.formatTokenChange(todayNetChange),
        updateTime:
          allTransactions[0]?.updatedAt?.toISOString() || now.toISOString(),
      },
      totalSupplyStats: {
        type: 'total_supply',
        value: totalTokenSupply,
        description: this.formatTokenValue(totalTokenSupply),
        changedValue: this.formatTokenChange(todayNewSupply),
        updateTime: latestAddTime.toISOString(),
      },
      commissionStats: {
        type: 'commission',
        value: totalWithdrawnTokens,
        description: this.formatTokenValue(totalWithdrawnTokens),
        changedValue: this.formatTokenChange(todayWithdrawnTokens),
        updateTime: latestWithdrawTime.toISOString(),
      },
      userStats: {
        type: 'user',
        value: totalUsers,
        description: ``,
        changedValue: todayNewUsers > 0 ? `+${todayNewUsers} user` : '0 user',
        updateTime: latestUser?.updatedAt?.toISOString() || now.toISOString(),
      },
    };
  }
}
