import { ApiProperty } from '@nestjs/swagger';

export class ContentWritingDTO {
  @ApiProperty()
  content_text: string;

  @ApiProperty()
  instruction_text: string;

  @ApiProperty()
  prompt_text: string;
}
