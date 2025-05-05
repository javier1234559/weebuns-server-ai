import {
  CreateTransactionDto,
  FindAllTransactionsQuery,
  UseTokensDto,
} from '../dto/token-request.dto';
import {
  PaymentUrlResponse,
  TokenPackagesResponse,
  TokenWalletResponse,
  TransactionResponse,
  TransactionsResponse,
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
}
