import { ApiProperty } from '@nestjs/swagger';

import { IsNumber, IsString } from 'class-validator';

export class RecommendTopicsDto {
  @ApiProperty({ required: false })
  @IsString()
  category?: string;

  @ApiProperty({ required: false, default: 5 })
  @IsNumber()
  count?: number;
}
