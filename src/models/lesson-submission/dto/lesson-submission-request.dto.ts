import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { SkillType, SubmissionStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { ContentReadingSubmissionDTO } from './content/reading-submission.dto';
import { ContentListeningSubmissionDTO } from './content/listening-submission.dto';
import { ContentWritingSubmissionDTO } from './content/writing-submission.dto';
import { ContentSpeakingSubmissionDTO } from './content/speaking-submission.dto';
import { PaginationInputDto } from 'src/common/dto/pagination.dto';
import { WritingFeedbackDTO } from './feedback/writing.dto';

export class BaseLessonSubmissionDTO {
  @ApiProperty()
  @IsString()
  lessonId: string;

  // @ApiProperty()
  // @IsString()
  // userId: string;

  @ApiProperty({ enum: SkillType })
  @IsEnum(SkillType)
  submissionType: SkillType;

  // @ApiProperty({ enum: SubmissionStatus })
  // @IsEnum(SubmissionStatus)
  // status: SubmissionStatus;

  @ApiProperty()
  @IsNumber()
  tokensUsed: number;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // gradedById?: string;
}

export class CreateReadingSubmissionDTO extends BaseLessonSubmissionDTO {
  @ApiProperty()
  @ValidateNested()
  @Type(() => ContentReadingSubmissionDTO)
  content: ContentReadingSubmissionDTO;
}

export class UpdateReadingSubmissionDTO extends BaseLessonSubmissionDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => ContentReadingSubmissionDTO)
  content?: ContentReadingSubmissionDTO;
}

export class CreateListeningSubmissionDTO extends BaseLessonSubmissionDTO {
  @ApiProperty()
  @ValidateNested()
  @Type(() => ContentListeningSubmissionDTO)
  content: ContentListeningSubmissionDTO;
}

export class UpdateListeningSubmissionDTO extends BaseLessonSubmissionDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => ContentListeningSubmissionDTO)
  content?: ContentListeningSubmissionDTO;
}

export class CreateWritingSubmissionDTO extends BaseLessonSubmissionDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;

  @ApiProperty()
  @ValidateNested()
  @Type(() => ContentWritingSubmissionDTO)
  content: ContentWritingSubmissionDTO;
}

export class UpdateWritingSubmissionDTO extends BaseLessonSubmissionDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => ContentWritingSubmissionDTO)
  content?: ContentWritingSubmissionDTO;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => WritingFeedbackDTO)
  feedback?: WritingFeedbackDTO;
}

export class CreateSpeakingSubmissionDTO extends BaseLessonSubmissionDTO {
  @ApiProperty()
  @ValidateNested()
  @Type(() => ContentSpeakingSubmissionDTO)
  content: ContentSpeakingSubmissionDTO;
}

export class UpdateSpeakingSubmissionDTO extends BaseLessonSubmissionDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;

  @ApiProperty()
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => ContentSpeakingSubmissionDTO)
  content?: ContentSpeakingSubmissionDTO;
}

export class FindAllLessonSubmissionQuery extends PaginationInputDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lessonId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SkillType)
  submissionType?: SkillType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;
}

export class FindAllReadingSubmissionsByUserQuery extends PaginationInputDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SkillType)
  submissionType?: SkillType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;
}
