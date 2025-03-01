import { ApiProperty } from '@nestjs/swagger';
import { TokenTransaction } from '../../token-transaction/entities/token-transaction.entity';

export class DiscountCode {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'string',
  })
  code: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  amount: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  value: number;
  @ApiProperty({
    type: 'boolean',
  })
  isPercentage: boolean;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  usageLimit: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  currentUsage: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  startDate: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  endDate: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
  @ApiProperty({
    type: () => TokenTransaction,
    isArray: true,
    required: false,
  })
  transactions?: TokenTransaction[];
}
