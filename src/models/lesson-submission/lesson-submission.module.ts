import { Module } from '@nestjs/common';
import { LessonSubmissionController } from './lesson-submission.controller';
import { LessonSubmissionService } from './lesson-submission.service';
import { SubmissionEventHandler } from './events/submission.handler';
import { NotificationModule } from 'src/models/notification/notification.module';
import { TokenModule } from 'src/models/token/token.module';

@Module({
  imports: [NotificationModule, TokenModule],
  controllers: [LessonSubmissionController],
  providers: [LessonSubmissionService, SubmissionEventHandler],
  exports: [LessonSubmissionService],
})
export class LessonSubmissionModule {}
