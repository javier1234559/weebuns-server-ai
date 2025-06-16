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

  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
    description: 'YouTube embed URL for solution/explanation video',
  })
  youtube_embed_url?: string | null;
}
