import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class EvaluateEssayDto {
  @ApiProperty({ description: 'The essay topic or prompt' })
  @IsString()
  topic: string;

  @ApiProperty({ description: "The user's essay content to evaluate" })
  @IsString()
  user_content: string;

  @ApiPropertyOptional({
    description: 'Optional teacher prompt for AI to guide the evaluation',
  })
  @IsOptional()
  @IsString()
  teacher_prompt?: string;
}
