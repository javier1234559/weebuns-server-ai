import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

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

  @ApiProperty({
    type: 'number',
    required: false,
    nullable: true,
    example: 1,
    description: 'Repetition level from 0 to 6',
  })
  @IsOptional()
  @IsIn([0, 1, 2, 3, 4, 5, 6], {
    message: 'repetitionLevel must be between 0 and 6',
  })
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : null))
  repetitionLevel?: number;
}
