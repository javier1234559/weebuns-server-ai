import { FeatureCode } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFeatureTokenConfigDto {
  @ApiProperty({
    enum: FeatureCode,
    enumName: 'FeatureCode',
    required: false,
  })
  featureCode?: FeatureCode;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  tokenCost?: number;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  description?: string | null;
}
