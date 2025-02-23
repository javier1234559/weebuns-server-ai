import {
  PaymentStatus,
  PaymentType,
  TokenTransactionType,
} from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenTransactionDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  amount: number;
  @ApiProperty({
    enum: TokenTransactionType,
    enumName: 'TokenTransactionType',
  })
  type: TokenTransactionType;
  @ApiProperty({
    enum: PaymentType,
    enumName: 'PaymentType',
    required: false,
    nullable: true,
  })
  paymentMethod?: PaymentType | null;
  @ApiProperty({
    enum: PaymentStatus,
    enumName: 'PaymentStatus',
  })
  status: PaymentStatus;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  transactionId?: string | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  finalAmount: number;
}
