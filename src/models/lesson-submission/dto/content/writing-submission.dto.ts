import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ChatMessageDTO {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ enum: ['bot', 'user'] }) // Role có thể là 'bot' hoặc 'user'
  @IsString()
  role: 'bot' | 'user';

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsString()
  timestamp: string;
}

export class ContentWritingSubmissionDTO {
  @ApiProperty()
  @IsString()
  content_text: string; // Nội dung câu hỏi chính

  @ApiProperty()
  @IsString()
  prompt_text: string; // Tiêu chí chấm điểm hoặc hướng dẫn của AI

  @ApiProperty()
  @IsString()
  content_user_text: string; // Bài viết của người dùng

  @ApiProperty({ type: [ChatMessageDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDTO)
  chat_history: ChatMessageDTO[];
}
