import { ApiProperty } from '@nestjs/swagger';

export class ListeningFeedbackDto {
  @ApiProperty()
  totalQuestions: number;
  @ApiProperty()
  correctAnswers: number;
  @ApiProperty()
  incorrectAnswers: number;
  @ApiProperty()
  accuracy: number;
}
