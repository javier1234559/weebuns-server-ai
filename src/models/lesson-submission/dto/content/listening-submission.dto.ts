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
  answer_list: AnswerDTO[];

  @ApiProperty()
  is_bookmark: boolean;

  @ApiProperty()
  selected_answer: string;
}

export class ContentListeningSubmissionDTO {
  @ApiProperty()
  audio_url: string;

  @ApiProperty({ type: [QuestionDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDTO)
  question_list: QuestionDTO[];
}
