import { ApiProperty } from '@nestjs/swagger';
import { ContentStatus, LessonType, SkillType } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class ListLessonQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, enum: SkillType })
  @IsOptional()
  @IsEnum(SkillType)
  skill?: SkillType;

  @ApiProperty({ required: false, enum: LessonType })
  @IsOptional()
  @IsEnum(LessonType)
  lessonType?: LessonType;

  @ApiProperty({ required: false, enum: ContentStatus })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  topic?: string;

  // list-lesson-query.dto.ts
  @ApiProperty({ required: false, type: 'integer' })
  @IsOptional()
  @IsInt()
  page?: number;

  @ApiProperty({ required: false, type: 'integer' })
  @IsOptional()
  @IsInt()
  limit?: number;
}
