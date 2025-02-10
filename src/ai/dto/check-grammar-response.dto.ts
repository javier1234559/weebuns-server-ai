import { ApiProperty } from '@nestjs/swagger';

class PositionDto {
  @ApiProperty({
    example: 0,
  })
  start: number;

  @ApiProperty({
    example: 5,
  })
  end: number;
}

class CorrectionDto {
  @ApiProperty({
    example: 'grammer',
  })
  original: string;

  @ApiProperty({
    example: 'grammar',
  })
  corrected: string;

  @ApiProperty({})
  explanation: string;

  @ApiProperty({
    enum: ['grammar', 'spelling', 'punctuation', 'style'],
    example: 'spelling',
  })
  type: 'grammar' | 'spelling' | 'punctuation' | 'style';

  @ApiProperty({
    type: () => PositionDto,
  })
  position: PositionDto;
}

export class CheckGrammarResponseDto {
  @ApiProperty({
    type: [CorrectionDto],
  })
  corrections: CorrectionDto[];

  @ApiProperty({
    example: 'Found 2 spelling errors and 1 grammar mistake.',
  })
  summary: string;

  @ApiProperty({
    example: 85,
    minimum: 0,
    maximum: 100,
  })
  overall_score: number;
}
