import { Prisma, SkillType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLessonSubmissionDto {
  @ApiProperty({
    enum: SkillType,
    enumName: 'SkillType',
    required: false,
  })
  submissionType?: SkillType;
  @ApiProperty({
    type: () => Object,
    required: false,
    nullable: true,
  })
  content?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
  @ApiProperty({
    type: () => Object,
    required: false,
    nullable: true,
  })
  feedback?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  submittedAt?: Date | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  gradedAt?: Date | null;
}
