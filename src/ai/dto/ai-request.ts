import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class StartSpeakingDto {
  @ApiProperty({
    description: 'Initial prompt for the AI',
    example: "Let's practice speaking English",
  })
  @IsString()
  @IsNotEmpty()
  promptText: string;

  @ApiProperty({
    description: 'Topic to discuss',
    example: 'Travel and Tourism',
  })
  @IsString()
  @IsNotEmpty()
  topicText: string;

  @ApiProperty({
    description: 'Example follow-up questions',
    example: ['What places have you visited?', 'How was your last trip?'],
  })
  @IsArray()
  @IsOptional()
  followupExamples?: string[];

  @ApiProperty({
    description: 'Background knowledge for the topic',
    example: 'Focus on travel experiences and cultural differences',
  })
  @IsString()
  @IsOptional()
  backgroundKnowledge?: string;
}

export class SpeakingDto {
  @ApiProperty({
    description: 'Session ID for continuing the conversation',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({ description: 'User message', example: "Hi, I'm ready." })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class RecommendAnswerDto {
  @ApiProperty({
    description: 'Session ID for continuing the conversation',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
