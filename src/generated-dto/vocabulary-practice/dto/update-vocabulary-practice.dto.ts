import { ApiProperty } from '@nestjs/swagger';

export class UpdateVocabularyPracticeDto {
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
    nullable: true,
  })
  successRate?: number | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  lastPracticed?: Date | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  nextReview?: Date | null;
}
