import { ApiProperty } from '@nestjs/swagger';

export class UpdateDiscountCodeDto {
  @ApiProperty({
    type: 'string',
    required: false,
  })
  code?: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  amount?: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  value?: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  usageLimit?: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  startDate?: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  endDate?: Date;
}
