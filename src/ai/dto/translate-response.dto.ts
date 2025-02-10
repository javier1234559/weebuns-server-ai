import { ApiProperty } from '@nestjs/swagger';

export class TranslateResponseDto {
  @ApiProperty({ example: 'Hello world' })
  original_text: string;

  @ApiProperty({ example: 'Hola mundo' })
  translated_text: string;

  @ApiProperty({ example: 'English' })
  source_language: string;

  @ApiProperty({ example: 'Spanish' })
  target_language: string;
}
