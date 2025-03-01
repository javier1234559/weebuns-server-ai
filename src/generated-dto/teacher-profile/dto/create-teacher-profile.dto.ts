import { Prisma, SkillType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherProfileDto {
  @ApiProperty({
    isArray: true,
    enum: SkillType,
    enumName: 'SkillType',
  })
  specialization: SkillType[];
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  qualification?: string | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
    nullable: true,
  })
  teachingExperience?: number | null;
  @ApiProperty({
    type: 'string',
    format: 'Decimal.js',
    required: false,
    nullable: true,
  })
  hourlyRate?: Prisma.Decimal | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  deletedAt?: Date | null;
}
