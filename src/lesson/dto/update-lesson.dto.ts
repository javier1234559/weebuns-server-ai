import { LessonType, Prisma, SkillType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateLessonDto {
  @ApiProperty({
    enum: SkillType,
    enumName: 'SkillType',
    required: false,
  })
  @IsOptional()
  @IsEnum(SkillType)
  skill?: SkillType;
  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
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
    format: 'date-time',
    required: false,
    nullable: true,
  })
  deletedAt?: Date | null;

  // Trong CreateLessonDto và UpdateLessonDto
  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @IsString()
  levelType?: string;
}
