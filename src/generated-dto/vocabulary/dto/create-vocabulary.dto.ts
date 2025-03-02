import { ApiProperty } from '@nestjs/swagger';

export class CreateVocabularyDto {
  @ApiProperty({
    type: 'string',
  })
  term: string;
  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  meaning: string[];
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  exampleSentence?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  imageUrl?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  referenceLink?: string | null;
  @ApiProperty({
    type: 'string',
    required: false,
    nullable: true,
  })
  referenceName?: string | null;
  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  tags: string[];
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  nextReview?: Date | null;
}
