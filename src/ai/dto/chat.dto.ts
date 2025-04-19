import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ChatMessageDto {
  @ApiProperty({
    description: 'Role of the message sender (user or assistant)',
    example: 'user',
  })
  @IsString()
  @IsNotEmpty()
  role: 'user' | 'assistant';

  @ApiProperty({
    description: 'Content of the message',
    example: 'Tell me about the benefits of learning a new language',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class ChatRequestDto {
  @ApiProperty({
    description: 'The message from the user',
    example: 'Tell me about the benefits of learning a new language',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Session ID to maintain conversation context',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  sessionId?: string;

  @ApiProperty({
    description: 'System prompt to maintain conversation context',
    example: 'You are a helpful assistant',
    required: false,
  })
  @IsString()
  @IsOptional()
  systemPrompt?: string;
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'The response from the AI assistant',
    example:
      'Learning a new language offers numerous cognitive, social, and professional benefits...',
  })
  message: string;

  @ApiProperty({
    description: 'Session ID to maintain conversation context',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  sessionId: string;

  @ApiProperty({
    description: 'Full conversation history',
    type: [ChatMessageDto],
  })
  history: ChatMessageDto[];
}
