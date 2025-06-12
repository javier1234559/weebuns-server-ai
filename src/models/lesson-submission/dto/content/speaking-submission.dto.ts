import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ChatMessageDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty({ enum: ['bot', 'user'] }) // Role có thể là 'bot' hoặc 'user'
  @IsString()
  role: 'bot' | 'user';

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty({ required: false }) // audio_url là optional
  @IsOptional()
  @IsString()
  audio_url?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  timestamp: string;

  @ApiProperty({ type: [String], required: false }) // Mảng recommend_answer (chỉ bot có)
  @IsArray()
  @IsOptional()
  recommend_answer?: string[];
}

export class ContentSpeakingSubmissionDTO {
  @ApiProperty()
  @IsString()
  topic_text: string;

  @ApiProperty()
  @IsString()
  prompt_text: string;

  @ApiProperty({ type: [ChatMessageDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDTO)
  chat_history: ChatMessageDTO[];
}
