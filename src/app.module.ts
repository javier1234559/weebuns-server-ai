import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from 'src/models/user/user.module';
import { AiModule } from 'src/ai/ai.module';
import { LessonModule } from 'src/models/lesson/lesson.module';
import { CommentModule } from 'src/models/comment/comment.module';
import { LessonSubmissionModule } from 'src/models/lesson-submission/lesson-submission.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    AiModule,
    UserModule,
    CommonModule,
    LessonModule,
    CommentModule,
    LessonSubmissionModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
