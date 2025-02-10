import { ApiProperty } from '@nestjs/swagger';

export class CheckGrammarDto {
  @ApiProperty({ example: 'This is a sample text with grammer mistakes.' })
  text: string;
}
