import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TokenService } from './token.service';
import {
  CreateTransactionDto,
  FindAllTransactionsQuery,
  UseTokensDto,
  WithdrawTokensDto,
} from './dto/token-request.dto';
import {
  TokenWalletResponse,
  TokenPackagesResponse,
  TransactionResponse,
  TransactionsResponse,
  PaymentUrlResponse,
  TransactionWithUserResponse,
} from './dto/token-response.dto';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { RolesGuard } from 'src/common/auth/role.guard';
import { Roles, UserRole } from 'src/common/decorators/role.decorator';
import { IAuthPayload } from 'src/common/interface/auth-payload.interface';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('token')
@ApiTags('token')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('wallet')
  @Roles(UserRole.USER, UserRole.TEACHER)
  @ApiResponse({
    status: 200,
    type: TokenWalletResponse,
  })
  getWallet(@CurrentUser() user: IAuthPayload) {
    const userId = String(user.sub);
    return this.tokenService.getWallet(userId);
  }

  @Get('plans')
  @Public()
  @ApiResponse({
    status: 200,
    type: TokenPackagesResponse,
  })
  getPackages() {
    return this.tokenService.getPackages();
  }

  @Post('charge')
  @Roles(UserRole.USER, UserRole.TEACHER)
  @ApiResponse({
    status: 201,
    type: PaymentUrlResponse,
  })
  createTransaction(
    @CurrentUser() user: IAuthPayload,
    @Body() data: CreateTransactionDto,
  ) {
    const userId = String(user.sub);
    return this.tokenService.createTransaction(userId, data);
  }

  @Get('transactions')
  @Roles(UserRole.USER, UserRole.TEACHER)
  @ApiQuery({ type: FindAllTransactionsQuery })
  @ApiResponse({
    status: 200,
    type: TransactionsResponse,
  })
  getTransactions(
    @CurrentUser() user: IAuthPayload,
    @Query() query: FindAllTransactionsQuery,
  ) {
    const userId = String(user.sub);
    return this.tokenService.getTransactions(userId, query);
  }

  @Get('admin/transactions')
  @Roles(UserRole.ADMIN)
  @ApiQuery({ type: FindAllTransactionsQuery })
  @ApiResponse({
    status: 200,
    type: TransactionsResponse,
  })
  getAdminTransactions(@Query() query: FindAllTransactionsQuery) {
    return this.tokenService.getAdminTransactions(query);
  }

  @Post('use')
  @Roles(UserRole.USER, UserRole.TEACHER)
  @ApiResponse({
    status: 200,
    type: TransactionResponse,
  })
  useTokens(@CurrentUser() user: IAuthPayload, @Body() data: UseTokensDto) {
    const userId = String(user.sub);
    return this.tokenService.useTokens(userId, data);
  }

  @Post('withdraw')
  @Roles(UserRole.TEACHER)
  @ApiResponse({
    status: 200,
    type: TransactionResponse,
  })
  withdrawTokens(
    @CurrentUser() user: IAuthPayload,
    @Body() data: WithdrawTokensDto,
  ) {
    const userId = String(user.sub);
    return this.tokenService.withdrawTokens(userId, data);
  }

  @Get('withdrawal-requests')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  @ApiQuery({ type: FindAllTransactionsQuery })
  @ApiResponse({
    status: 200,
    type: TransactionsResponse,
  })
  getWithdrawalRequests(@Query() query: FindAllTransactionsQuery) {
    return this.tokenService.getWithdrawalRequests(query);
  }

  @Get('withdrawal-requests/:requestId')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  @ApiResponse({
    status: 200,
    type: TransactionWithUserResponse,
  })
  getWithdrawalRequestDetails(@Param('requestId') requestId: string) {
    return this.tokenService.getWithdrawalRequestDetails(requestId);
  }

  @Post('withdrawal-requests/:requestId/approve')
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: 200,
    type: TransactionResponse,
  })
  approveWithdrawalRequest(@Param('requestId') requestId: string) {
    return this.tokenService.approveWithdrawalRequest(requestId);
  }

  @Post('withdrawal-requests/:requestId/decline')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiResponse({
    status: 200,
    type: TransactionResponse,
  })
  declineWithdrawalRequest(@Param('requestId') requestId: string) {
    return this.tokenService.declineWithdrawalRequest(requestId);
  }
}
