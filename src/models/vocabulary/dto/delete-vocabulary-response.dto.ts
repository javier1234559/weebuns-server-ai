import { ApiProperty } from '@nestjs/swagger';

export class DeleteVocabularyResponseDto {
  @ApiProperty({
    type: 'string',
    example: 'Vocabulary deleted successfully',
  })
  message: string;
}
