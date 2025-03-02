import { ApiProperty } from '@nestjs/swagger';

export class UpdateVocabularyDto {
  @ApiProperty({
    type: 'string',
    required: false,
  })
  term?: string;
  @ApiProperty({
    type: 'string',
    isArray: true,
    required: false,
  })
  meaning?: string[];
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
    required: false,
  })
  tags?: string[];
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  nextReview?: Date | null;
}
