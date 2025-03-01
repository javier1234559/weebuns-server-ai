import { FeatureCode } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectFeatureTokenConfigDto {
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  id?: string;
  @ApiProperty({
    enum: FeatureCode,
    enumName: 'FeatureCode',
    required: false,
    nullable: true,
  })
  featureCode?: FeatureCode;
}
