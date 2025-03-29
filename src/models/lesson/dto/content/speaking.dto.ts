import { ApiProperty } from '@nestjs/swagger';

export class ContentSpeakingDTO {
  @ApiProperty()
  topic_text: string;

  @ApiProperty()
  prompt_text: string;
}
