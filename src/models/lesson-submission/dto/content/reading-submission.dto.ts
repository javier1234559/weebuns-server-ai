import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsString,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';

class AnswerDTO {
  @ApiProperty()
  answer: string;
}

export class QuestionDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  question: string;

  @ApiProperty()
  right_answer: string;

  @ApiProperty({ type: [AnswerDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDTO)
  answer_list: AnswerDTO[];

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  is_bookmark: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  selected_answer: string;
}

export class ContentReadingSubmissionDTO {
  @ApiProperty()
  text: string;

  @ApiProperty({ type: [QuestionDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDTO)
  questions: QuestionDTO[];
}
