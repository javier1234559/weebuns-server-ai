import {
  PaymentStatus,
  PaymentType,
  TokenTransactionType,
} from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTokenTransactionDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  amount?: number;
  @ApiProperty({
    enum: TokenTransactionType,
    enumName: 'TokenTransactionType',
    required: false,
  })
  type?: TokenTransactionType;
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
    required: false,
  })
  status?: PaymentStatus;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  transactionId?: string | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  finalAmount?: number;
}
