import { ApiProperty } from '@nestjs/swagger';

export class CreateDiscountCodeDto {
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
    type: 'integer',
    format: 'int32',
  })
  usageLimit: number;
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
}
