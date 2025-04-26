import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationInputDto } from 'src/common/dto/pagination.dto';

export class CreateVocabularyDto {
  @ApiProperty()
  @IsString()
  term: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  meaning: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  exampleSentence?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referenceLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referenceName?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiPropertyOptional({
    type: 'number',
    example: 1,
    description: 'Repetition level from 0 to 6',
  })
  @IsOptional()
  @IsIn([0, 1, 2, 3, 4, 5, 6], {
    message: 'repetitionLevel must be between 0 and 6',
  })
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : null))
  repetitionLevel?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  nextReview?: Date;
}

export class UpdateVocabularyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  term?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  meaning?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  exampleSentence?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referenceLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referenceName?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    type: 'number',
    example: 1,
    description: 'Repetition level from 0 to 6',
  })
  @IsOptional()
  @IsIn([0, 1, 2, 3, 4, 5, 6], {
    message: 'repetitionLevel must be between 0 and 6',
  })
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : null))
  repetitionLevel?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  nextReview?: Date;
}

export class UpdateVocabularyReviewDto {
  @ApiProperty({
    type: 'number',
    example: 1,
    description: 'Repetition level from 0 to 6',
  })
  @IsNotEmpty()
  @IsIn([0, 1, 2, 3, 4, 5, 6], {
    message: 'repetitionLevel must be between 0 and 6',
  })
  @Transform(({ value }) => parseInt(value, 10))
  repetitionLevel: number;
}

export class VocabularyFilterDto {
  @ApiProperty({
    type: 'string',
    isArray: true,
    required: false,
    description: 'Filter vocabularies by tags',
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    // Transform string to array if needed
    if (typeof value === 'string') {
      return value.split(',').map((tag) => tag.trim());
    }
    return value;
  })
  tags?: string[];

  @ApiProperty({
    type: 'string',
    required: false,
    description: 'Search vocabularies by term',
  })
  @IsOptional()
  @IsString()
  term?: string;
}

export class FindAllVocabularyQuery extends PaginationInputDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((tag) => tag.trim());
    }
    return value;
  })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  repetitionLevel?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  dueDate?: boolean;
}
