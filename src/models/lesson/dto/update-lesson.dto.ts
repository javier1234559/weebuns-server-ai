import { LessonType, Prisma, SkillType, ContentStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateLessonDto } from './create-lesson.dto';

export class UpdateLessonDto extends PartialType(CreateLessonDto) {
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
  @IsOptional()
  @IsEnum(LessonType)
  lessonType?: LessonType;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
    nullable: true,
  })
  @IsOptional()
  timeLimit?: number | null;

  @ApiProperty({
    type: () => Object,
    required: false,
    nullable: true,
  })
  @IsOptional()
  content?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  @IsOptional()
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

  @ApiProperty({
    type: 'string',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    enum: ContentStatus,
    enumName: 'ContentStatus',
    description: 'Status of the lesson',
    required: false,
  })
  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;

  @ApiProperty({
    type: String,
    description: 'ID of the editor',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastEditedById?: string;
}
