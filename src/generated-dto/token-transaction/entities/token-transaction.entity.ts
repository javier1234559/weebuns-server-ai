import {
  PaymentStatus,
  PaymentType,
  TokenTransactionType,
} from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { DiscountCode } from '../../discount-code/entities/discount-code.entity';

export class TokenTransaction {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  userId: string;
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
    type: 'string',
    nullable: true,
  })
  discountCode: string | null;
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
  @ApiProperty({
    type: () => User,
    required: false,
  })
  user?: User;
  @ApiProperty({
    type: () => DiscountCode,
    required: false,
    nullable: true,
  })
  discount?: DiscountCode | null;
}
