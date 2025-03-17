import { ApiProperty } from '@nestjs/swagger';
import { ContentStatus, LessonType, SkillType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

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
