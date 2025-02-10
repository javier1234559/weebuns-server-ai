import { ApiProperty } from '@nestjs/swagger';

export class TranslateDto {
  @ApiProperty({ example: 'Hello world' })
  text: string;

  @ApiProperty({ example: 'English' })
  sourceLanguage: string;

  @ApiProperty({ example: 'Spanish' })
  targetLanguage: string;
}
