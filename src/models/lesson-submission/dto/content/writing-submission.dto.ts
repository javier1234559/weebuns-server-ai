import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested, IsObject } from 'class-validator';
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

class UserDataDTO {
  @ApiProperty()
  @IsString()
  instruction: string;

  @ApiProperty()
  @IsString()
  body1: string;

  @ApiProperty()
  @IsString()
  body2: string;

  @ApiProperty()
  @IsString()
  conclusion: string;
}

export class ContentWritingSubmissionDTO {
  @ApiProperty({ type: UserDataDTO })
  @IsObject()
  @ValidateNested()
  @Type(() => UserDataDTO)
  user_data: UserDataDTO;

  @ApiProperty()
  @IsString()
  lesson_id: string;

  @ApiProperty({ type: [ChatMessageDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDTO)
  chat_history: ChatMessageDTO[];
}
