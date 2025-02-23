import { ApiProperty } from '@nestjs/swagger';

export class VocabularyPracticeDto {
  @ApiProperty({
    type: 'string',
  })
  id: string;
  @ApiProperty({
    type: 'number',
    format: 'float',
    nullable: true,
  })
  successRate: number | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  lastPracticed: Date | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  nextReview: Date | null;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;
}
