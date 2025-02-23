import { FeatureCode } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeatureTokenConfigDto {
  @ApiProperty({
    enum: FeatureCode,
    enumName: 'FeatureCode',
  })
  featureCode: FeatureCode;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  tokenCost: number;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  description?: string | null;
}
