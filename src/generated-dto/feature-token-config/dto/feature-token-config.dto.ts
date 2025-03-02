import { FeatureCode } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class FeatureTokenConfigDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
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
    type: 'boolean',
  })
  isPercentage: boolean;
  @ApiProperty({
    type: 'string',
    nullable: true,
  })
  description: string | null;
  @ApiProperty({
    type: 'boolean',
  })
  isActive: boolean;
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
}
