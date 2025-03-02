import { ApiProperty } from '@nestjs/swagger';

export class ConnectVocabularyDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
}
