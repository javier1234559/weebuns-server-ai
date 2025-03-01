import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateVocabularyReviewDto {
  @ApiProperty({
    type: 'number',
    example: 1,
    description: 'Repetition level from 0 to 6',
  })
  @IsNotEmpty()
  @IsIn([0, 1, 2, 3, 4, 5, 6], {
    message: 'repetitionLevel must be between 0 and 6',
  })
  @Transform(({ value }) => parseInt(value, 10))
  repetitionLevel: number;
}
