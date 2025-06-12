import {
  CreateTransactionDto,
  EarnTokensDto,
  FindAllTransactionsQuery,
  UseTokensDto,
  WithdrawTokensDto,
} from '../dto/token-request.dto';
import {
  PaymentUrlResponse,
  TokenPackagesResponse,
  TokenWalletResponse,
  TransactionResponse,
  TransactionsResponse,
  TransactionWithUserResponse,
} from '../dto/token-response.dto';

export interface ITokenService {
  getWallet(userId: string): Promise<TokenWalletResponse>;
  getPackages(): Promise<TokenPackagesResponse>;
  createTransaction(
    userId: string,
    data: CreateTransactionDto,
  ): Promise<PaymentUrlResponse>;
  getTransactions(
    userId: string,
    query: FindAllTransactionsQuery,
  ): Promise<TransactionsResponse>;
  getAdminTransactions(
    query: FindAllTransactionsQuery,
  ): Promise<TransactionsResponse>;
  useTokens(userId: string, data: UseTokensDto): Promise<TransactionResponse>;
  earnTokens(userId: string, data: EarnTokensDto): Promise<TransactionResponse>;

  withdrawTokens(
    userId: string,
    data: WithdrawTokensDto,
  ): Promise<TransactionResponse>;

  getWithdrawalRequests(
    query: FindAllTransactionsQuery,
  ): Promise<TransactionsResponse>;

  getWithdrawalRequestDetails(
    requestId: string,
  ): Promise<TransactionWithUserResponse>;
  approveWithdrawalRequest(requestId: string): Promise<TransactionResponse>;
  declineWithdrawalRequest(requestId: string): Promise<TransactionResponse>;
  giveWelcomeTokens(userId: string): Promise<TransactionResponse>;
}
