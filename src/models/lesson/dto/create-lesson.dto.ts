import { LessonType, Prisma, SkillType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({
    enum: SkillType,
    enumName: 'SkillType',
  })
  skill: SkillType;
  @ApiProperty({
    type: 'string',
  })
  title: string;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  description?: string | null;
  @ApiProperty({
    enum: LessonType,
    enumName: 'LessonType',
  })
  lessonType: LessonType;
  @ApiProperty({
    type: 'string',
  })
  topic: string;
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

  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
    description: 'URL hình ảnh thumbnail của lesson',
  })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string | null;

  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiProperty({ type: 'string', required: false })
  @IsOptional()
  @IsString()
  levelType?: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
