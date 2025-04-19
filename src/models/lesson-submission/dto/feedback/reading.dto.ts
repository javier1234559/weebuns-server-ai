import { ApiProperty } from '@nestjs/swagger';

export class ReadingFeedbackDto {
  @ApiProperty()
  totalQuestions: number;
  @ApiProperty()
  correctAnswers: number;
  @ApiProperty()
  incorrectAnswers: number;
  @ApiProperty()
  accuracy: number;
}
