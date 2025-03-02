import { LessonType, Prisma, SkillType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLessonDto {
  @ApiProperty({
    enum: SkillType,
    enumName: 'SkillType',
    required: false,
  })
  skill?: SkillType;
  @ApiProperty({
    type: 'string',
    required: false,
  })
  title?: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  description?: string | null;
  @ApiProperty({
    enum: LessonType,
    enumName: 'LessonType',
    required: false,
  })
  lessonType?: LessonType;
  @ApiProperty({
    type: 'string',
    required: false,
  })
  topic?: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
    nullable: true,
  })
  timeLimit?: number | null;
  @ApiProperty({
    type: () => Object,
    required: false,
    nullable: true,
  })
  content?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  thumbnailUrl?: string | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  deletedAt?: Date | null;
}
