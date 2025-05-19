import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from 'src/models/user/user.module';
import { AiModule } from 'src/ai/ai.module';
import { LessonModule } from 'src/models/lesson/lesson.module';
import { CommentModule } from 'src/models/comment/comment.module';
import { LessonSubmissionModule } from 'src/models/lesson-submission/lesson-submission.module';
import { VocabularyModule } from 'src/models/vocabulary/vocabulary.module';
import { TokenModule } from 'src/models/token/token.module';
import { PaymentModule } from 'src/models/payment/payment.module';
import { NotificationModule } from 'src/models/notification/notification.module';
@Module({
  imports: [
    AiModule,
    UserModule,
    CommonModule,
    LessonModule,
    CommentModule,
    LessonSubmissionModule,
    VocabularyModule,
    PaymentModule,
    TokenModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
