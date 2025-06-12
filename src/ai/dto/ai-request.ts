import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class StartSpeakingDto {
  @ApiProperty()
  @IsString()
  lessonId: string;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  promptText?: string;

  @ApiProperty()
  @IsString()
  topicText?: string;

  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  followupExamples?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
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
