import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

import { UploadService } from 'src/common/upload/upload.service';
import { TtsService } from 'src/ai/tts.service';

import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [
    ConfigModule,
    CacheModule.register({
      ttl: 30 * 60 * 1000, // 30 minutes in milliseconds
      max: 100, // maximum number of items in cache
    }),
  ],
  controllers: [AiController],
  providers: [AiService, TtsService, UploadService],
  exports: [AiService],
})
export class AiModule {}
