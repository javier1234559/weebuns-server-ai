import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from 'src/user/user.module';
import { AiModule } from 'src/ai/ai.module';
import { LessonModule } from 'src/lesson/lesson.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [AiModule, UserModule, CommonModule, LessonModule, CommentModule],
})
export class AppModule {}
