import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { ChatMessageDto } from './chat.dto';

export class StartSpeakingResponseDto {
  @ApiProperty()
  sessionId: string;

  @ApiPropertyOptional()
  @IsOptional()
  topicText?: string;

  @ApiProperty()
  submissionId: string;
}

export interface ChatSessionData {
  systemPrompt: string;
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  lastActive: number;
  messageCount: number;
  submissionId?: string;
}

export class RecommendAnswerResponseDto {
  @ApiProperty({
    description: 'The recommended answers',
  })
  suggestedResponses: string[];

  @ApiProperty({
    description: 'Session ID for continuing the conversation',
  })
  sessionId: string;
}

export class CheckSessionResponseDto {
  @ApiProperty()
  status: boolean;

  @ApiProperty({ type: [ChatMessageDto], required: false })
  history?: ChatMessageDto[];

  @ApiProperty({ required: false })
  systemPrompt?: string;
}
