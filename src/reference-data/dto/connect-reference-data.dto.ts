import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

export class ReferenceDataTypeCodeUniqueInputDto {
  @ApiProperty({
    type: 'string',
  })
  type: string;
  @ApiProperty({
    type: 'string',
  })
  code: string;
}

@ApiExtraModels(ReferenceDataTypeCodeUniqueInputDto)
export class ConnectReferenceDataDto {
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  id?: string;
  @ApiProperty({
    type: ReferenceDataTypeCodeUniqueInputDto,
    required: false,
    nullable: true,
  })
  type_code?: ReferenceDataTypeCodeUniqueInputDto;
}
