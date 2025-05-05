import { ApiProperty } from '@nestjs/swagger';
import { PaginationOutputDto } from 'src/common/dto/pagination.dto';
import { TokenWallet } from '../entities/token-wallet.entity';
import { TokenPackage } from '../entities/token-package.entity';
import { Transaction } from '../entities/transaction.entity';

export class TokenWalletResponse {
  @ApiProperty({ type: TokenWallet })
  wallet: TokenWallet;
}

export class TokenPackagesResponse {
  @ApiProperty({ type: [TokenPackage] })
  packages: TokenPackage[];
}

export class TransactionResponse {
  @ApiProperty({ type: Transaction })
  transaction: Transaction;
}

export class TransactionsResponse {
  @ApiProperty({ type: [Transaction] })
  data: Transaction[];

  @ApiProperty()
  pagination: PaginationOutputDto;
}

export class PaymentUrlResponse {
  @ApiProperty()
  paymentUrl: string;
}
