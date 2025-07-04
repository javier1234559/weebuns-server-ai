import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ContentStatus, LessonType, SkillType } from '@prisma/client';
import { ContentReadingDTO } from './content/reading.dto';
import { ContentListeningDTO } from './content/listening.dto';
import { ContentWritingDTO } from './content/writing.dto';
import { ContentSpeakingDTO } from './content/speaking.dto';
import { PaginationInputDto } from 'src/common/dto/pagination.dto';
import { Type } from 'class-transformer';

export class BaseLessonDTO {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description?: string;

  @ApiProperty({ enum: LessonType })
  @IsEnum(LessonType)
  lessonType: LessonType;

  @ApiProperty()
  @IsString()
  level: string;

  @ApiProperty()
  @IsString()
  topic: string;

  @ApiProperty()
  timeLimit?: number;

  @ApiProperty()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({ enum: ContentStatus })
  @IsEnum(ContentStatus)
  status: ContentStatus;

  @ApiPropertyOptional()
  createdById?: string;
}

export class CreateReadingDTO extends BaseLessonDTO {
  @ApiProperty()
  content: ContentReadingDTO;
}

export class UpdateReadingDTO extends BaseLessonDTO {
  @ApiPropertyOptional()
  @IsOptional()
  content?: ContentReadingDTO;
}

export class CreateListeningDTO extends BaseLessonDTO {
  @ApiProperty()
  content: ContentListeningDTO;
}

export class UpdateListeningDTO extends BaseLessonDTO {
  @ApiPropertyOptional()
  @IsOptional()
  content?: ContentListeningDTO;
}

export class CreateWritingDTO extends BaseLessonDTO {
  @ApiProperty()
  content: ContentWritingDTO;
}

export class UpdateWritingDTO extends BaseLessonDTO {
  @ApiPropertyOptional()
  @IsOptional()
  content?: ContentWritingDTO;
}

export class CreateSpeakingDTO extends BaseLessonDTO {
  @ApiProperty()
  content: ContentSpeakingDTO;
}

export class UpdateSpeakingDTO extends BaseLessonDTO {
  @ApiPropertyOptional()
  @IsOptional()
  content?: ContentSpeakingDTO;
}

export class FindAllLessonQuery extends PaginationInputDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SkillType)
  skill?: SkillType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(LessonType)
  lessonType?: LessonType;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  tag?: string[];
}

export class SubmitReadingLessonDto {
  @ApiProperty({ type: ContentReadingDTO })
  @ValidateNested()
  @Type(() => ContentReadingDTO)
  content: ContentReadingDTO;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tokens_used?: number;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  submitted_at?: string;
}

export class UpdateLessonDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  level?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  topic?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: ContentStatus;
}
