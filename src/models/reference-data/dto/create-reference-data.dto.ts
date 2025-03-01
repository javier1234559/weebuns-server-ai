import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReferenceDataDto {
  @ApiProperty({
    type: 'string',
  })
  type: string;
  @ApiProperty({
    type: 'string',
  })
  code: string;
  @ApiProperty({
    type: 'string',
  })
  name: string;
  @ApiProperty({
    type: () => Object,
    required: false,
    nullable: true,
  })
  metadata?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
}
