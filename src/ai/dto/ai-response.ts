import { ApiProperty } from '@nestjs/swagger';

export class StartSpeakingResponseDto {
  @ApiProperty({
    description: 'Session ID for continuing the conversation',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  sessionId: string;

  @ApiProperty({
    description: 'Topic of the conversation',
    example: 'Travel and Tourism',
  })
  topicText: string;
}

export interface ChatSessionData {
  systemPrompt: string;
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  lastActive: number;
  messageCount: number;
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
  @ApiProperty({
    description: 'Status of the session',
    example: true,
  })
  status: boolean;
}
