import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from 'src/models/user/user.module';
import { AiModule } from 'src/ai/ai.module';
import { LessonModule } from 'src/models/lesson/lesson.module';
import { VocabularyModule } from 'src/models/vocabulary/vocabulary.module';

@Module({
  imports: [AiModule, UserModule, CommonModule, LessonModule, VocabularyModule],
})
export class AppModule {}
