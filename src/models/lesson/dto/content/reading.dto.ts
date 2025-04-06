import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

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
}

export class ContentReadingDTO {
  @ApiProperty()
  text: string;

  @ApiProperty({ type: [QuestionDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDTO)
  questions: QuestionDTO[];
}
