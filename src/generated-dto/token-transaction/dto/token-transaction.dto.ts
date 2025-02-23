import {
  PaymentStatus,
  PaymentType,
  TokenTransactionType,
} from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TokenTransactionDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
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
    nullable: true,
  })
  paymentMethod: PaymentType | null;
  @ApiProperty({
    enum: PaymentStatus,
    enumName: 'PaymentStatus',
  })
  status: PaymentStatus;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  transactionId: string | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  finalAmount: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
}
