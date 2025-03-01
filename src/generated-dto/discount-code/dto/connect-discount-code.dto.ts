import { ApiProperty } from '@nestjs/swagger';

export class ConnectDiscountCodeDto {
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  id?: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  code?: string;
}
