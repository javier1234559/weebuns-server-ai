import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';
import { SkillType, LevelType } from '../interface/lesson.interface';
import { ContentStatus, LessonType, Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { Transform } from 'stream';

export class FindAllLessonsDto {
  @ApiProperty({ enum: SkillType, required: false })
  @IsEnum(SkillType)
  @IsOptional()
  skillType?: SkillType;

  @ApiProperty({ enum: LevelType, required: false })
  @IsEnum(LevelType)
  @IsOptional()
  levelType?: LevelType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;
}

export class CreateLessonDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  content: any;

  @ApiProperty({ enum: LevelType })
  @IsEnum(LevelType)
  levelType: LevelType;
}

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
  @IsEnum(LevelType)
  levelType?: LevelType;

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

export class QueryLessonDto {
  @ApiProperty({
    required: false,
    type: Number,
    default: 1,
    description: 'Page number (starts from 1)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    required: false,
    type: Number,
    default: 10,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    required: false,
    enum: SkillType,
    enumName: 'SkillType',
    description: 'Filter by skill type',
  })
  @IsOptional()
  @IsString()
  skill?: string;

  @ApiProperty({
    required: false,
    enum: LessonType,
    enumName: 'LessonType',
    description: 'Filter by lesson type',
  })
  @IsOptional()
  @IsString()
  lessonType?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Filter by topic',
  })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Filter by title (partial match)',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    required: false,
    enum: ContentStatus,
    enumName: 'ContentStatus',
    description: 'Filter by status',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Filter by creator ID',
  })
  @IsOptional()
  @IsString()
  createdById?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Filter by level',
  })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'Filter by tag (comma-separated)',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.split(',').map((tag) => tag.trim()))
  tags?: string;
}
