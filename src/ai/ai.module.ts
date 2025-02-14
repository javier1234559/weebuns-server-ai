import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UploadService } from 'src/common/upload/upload.service';
import { TtsService } from 'src/ai/tts.service';

import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [ConfigModule],
  controllers: [AiController],
  providers: [AiService, TtsService, UploadService],
  exports: [AiService],
})
export class AiModule {}
