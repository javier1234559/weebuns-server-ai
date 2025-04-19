import { ApiProperty } from '@nestjs/swagger';

export class ReadingStatisticsDto {
  @ApiProperty()
  totalQuestions: number;
  @ApiProperty()
  correctAnswers: number;
  @ApiProperty()
  incorrectAnswers: number;
  @ApiProperty()
  accuracy: number;
}

// export class ReadingResultFeedbackDto {
//   @ApiProperty({
//     type: ReadingSubmissionFeedbackDto,
//   })
//   submission: ReadingSubmissionFeedbackDto;

//   @ApiProperty({
//     type: LessonFeedbackDto,
//   })
//   lesson: LessonFeedbackDto;

//   @ApiProperty({
//     type: ReadingStatisticsDto,
//   })
//   statistics: ReadingStatisticsDto;
// }

// export class ReadingSubmissionResponse {
//   @ApiProperty()
//   id: string;

//   @ApiProperty()
//   lessonId: string;

//   @ApiProperty()
//   content: ReadingSubmissionContentDto;

//   @ApiProperty()
//   tokensUsed: number;

//   @ApiProperty()
//   submittedAt: Date;
// }
