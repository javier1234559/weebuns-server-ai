import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus, PaymentType } from '@prisma/client';
import { TransactionType } from 'src/common/enum/common';
import { TokenPackage } from './token-package.entity';
import { User } from 'src/models/user/entities/user.entity';
import { ITransaction } from 'src/models/token/interface/token.interface';
export class Transaction implements ITransaction {
  @ApiProperty()
  id: string;

  @ApiProperty()
  transactionId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  packageId: string | null;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  tokenAmount: number;

  @ApiProperty({ enum: PaymentType })
  paymentType: PaymentType;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty()
  paymentDate: Date;

  @ApiProperty({ enum: TransactionType })
  type: string;

  @ApiProperty({ required: false })
  reason: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => TokenPackage, required: false })
  package?: TokenPackage;

  @ApiProperty({ type: () => User, required: false })
  user?: User;
}
