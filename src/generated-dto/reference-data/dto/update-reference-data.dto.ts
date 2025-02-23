import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReferenceDataDto {
  @ApiProperty({
    type: 'string',
    required: false,
  })
  type?: string;
  @ApiProperty({
    type: 'string',
    required: false,
  })
  code?: string;
  @ApiProperty({
    type: 'string',
    required: false,
  })
  name?: string;
  @ApiProperty({
    type: () => Object,
    required: false,
    nullable: true,
  })
  metadata?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
}
