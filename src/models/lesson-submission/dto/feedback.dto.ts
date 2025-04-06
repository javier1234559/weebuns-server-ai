import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CorrectionDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  originalText: string;

  @ApiProperty()
  @IsString()
  correctedText: string;

  @ApiProperty()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsString()
  context: string;

  @ApiProperty()
  @IsString()
  positionInContext: string;

  @ApiProperty()
  @IsString()
  createdAt: string;
}

export class FeedbackDTO {
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

  @ApiProperty({ type: CorrectionDTO }) // Định nghĩa correction là một object
  @IsObject()
  @ValidateNested()
  @Type(() => CorrectionDTO)
  corrections: CorrectionDTO;

  @ApiProperty()
  @IsString()
  overall_feedback: string;
}
