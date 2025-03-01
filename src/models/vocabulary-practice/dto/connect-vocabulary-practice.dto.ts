import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

export class VocabularyPracticeUserIdVocabularyIdUniqueInputDto {
  @ApiProperty({
    type: 'string',
  })
  userId: string;
  @ApiProperty({
    type: 'string',
  })
  vocabularyId: string;
}

@ApiExtraModels(VocabularyPracticeUserIdVocabularyIdUniqueInputDto)
export class ConnectVocabularyPracticeDto {
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  id?: string;
  @ApiProperty({
    type: VocabularyPracticeUserIdVocabularyIdUniqueInputDto,
    required: false,
    nullable: true,
  })
  userId_vocabularyId?: VocabularyPracticeUserIdVocabularyIdUniqueInputDto;
}
