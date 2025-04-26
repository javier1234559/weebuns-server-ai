import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CorrectionDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  sentence: string;

  @ApiProperty()
  @IsString()
  error: string;

  @ApiProperty()
  @IsString()
  suggestion: string;

  @ApiProperty()
  @IsString()
  reason: string;

  @ApiProperty()
  @IsString()
  position: string;
}

export class EvaluateEssayResponseDto {
  @ApiProperty()
  @IsNumber()
  overall_score: number;

  @ApiProperty()
  @IsNumber()
  task_response: number;

  @ApiProperty()
  @IsNumber()
  coherence_cohesion: number;

  @ApiProperty()
  @IsNumber()
  lexical_resource: number;

  @ApiProperty()
  @IsNumber()
  grammar: number;

  @ApiProperty({ type: [CorrectionDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CorrectionDTO)
  corrections: CorrectionDTO[];

  @ApiProperty()
  @IsString()
  overall_feedback: string;
}
