import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class VocabularyItemDTO {
  @ApiProperty({ description: 'Vocabulary term' })
  @IsString()
  @IsNotEmpty()
  term: string;

  @ApiProperty({
    type: [String],
    description: 'Meanings of the vocabulary term',
  })
  @IsArray()
  @IsString({ each: true })
  meaning: string[];

  @ApiProperty({ description: 'Example sentence using the vocabulary term' })
  @IsString()
  @IsNotEmpty()
  example_sentence: string;

  @ApiProperty({
    description: 'URL to an image related to the vocabulary term',
  })
  @IsString()
  @IsOptional()
  image_url: string;

  @ApiProperty({ description: 'Reference link for the vocabulary term' })
  @IsString()
  @IsOptional()
  reference_link: string;

  @ApiProperty({ description: 'Name of the reference for the vocabulary term' })
  @IsString()
  @IsOptional()
  reference_name: string;

  @ApiProperty({
    type: [String],
    description: 'Tags associated with the vocabulary term',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[];

  @ApiProperty({ description: 'Repetition level of the vocabulary term' })
  @IsNumber()
  @IsOptional()
  repetition_level: number;
}

export class SampleEssayDTO {
  @ApiProperty({ description: 'Instructions for the sample essay' })
  @IsString()
  @IsNotEmpty()
  instruction: string;

  @ApiProperty({ description: 'First body paragraph of the sample essay' })
  @IsString()
  @IsNotEmpty()
  body1: string;

  @ApiProperty({ description: 'Second body paragraph of the sample essay' })
  @IsString()
  @IsNotEmpty()
  body2: string;

  @ApiProperty({ description: 'Conclusion of the sample essay' })
  @IsString()
  @IsNotEmpty()
  conclusion: string;
}

export class ResourcesDTO {
  @ApiProperty({ description: 'Guide for analyzing the writing task' })
  @IsString()
  @IsNotEmpty()
  analysis_guide: string;

  @ApiProperty({
    type: SampleEssayDTO,
    description: 'Sample essay for reference',
  })
  @ValidateNested()
  @Type(() => SampleEssayDTO)
  sample_essay: SampleEssayDTO;
}

export class ContentWritingDTO {
  @ApiProperty({ description: 'AI prompt for generating writing content' })
  @IsString()
  @IsNotEmpty()
  ai_prompt: string;

  @ApiProperty({ description: 'Writing task description' })
  @IsString()
  @IsNotEmpty()
  task: string;

  @ApiProperty({
    type: ResourcesDTO,
    description: 'Resources for the writing task',
  })
  @ValidateNested()
  @Type(() => ResourcesDTO)
  resources: ResourcesDTO;

  @ApiProperty({
    type: [VocabularyItemDTO],
    description: 'List of vocabulary items for the writing task',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VocabularyItemDTO)
  vocabulary_list: VocabularyItemDTO[];
}
