import { ApiProperty } from '@nestjs/swagger';

class AnswerDTO {
  @ApiProperty()
  answer: string;
}

export class QuestionDTO {
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

export class ContentListeningDTO {
  @ApiProperty()
  audio_url: string;

  @ApiProperty()
  question_list: QuestionDTO[];
}
