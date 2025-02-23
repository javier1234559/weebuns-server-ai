import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from 'src/user/user.module';
import { AiModule } from 'src/ai/ai.module';
import { LessonModule } from 'src/lesson/lesson.module';

@Module({
  imports: [AiModule, UserModule, CommonModule, LessonModule],
})
export class AppModule {}
