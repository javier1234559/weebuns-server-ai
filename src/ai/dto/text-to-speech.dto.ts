import { ApiProperty } from '@nestjs/swagger';

export class VoiceSettingDto {
  @ApiProperty()
  stability: number;

  @ApiProperty()
  similarity_boost: number;

  @ApiProperty()
  style: number;

  @ApiProperty()
  use_speaker_boost: boolean;
}

export class TextToSpeechDto {
  @ApiProperty()
  text: string;

  @ApiProperty({ required: false })
  voiceId?: string;

  @ApiProperty({ required: false })
  voiceSettings?: VoiceSettingDto;
}

export class TextToSpeechResponseDto {
  @ApiProperty()
  audioUrl: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  voiceId: string;
}
