import { Module } from '@nestjs/common';
import { LessonSubmissionController } from './lesson-submission.controller';
import { LessonSubmissionService } from './lesson-submission.service';
import { SubmissionEventHandler } from './events/submission.handler';
import { NotificationModule } from 'src/models/notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [LessonSubmissionController],
  providers: [LessonSubmissionService, SubmissionEventHandler],
  exports: [LessonSubmissionService],
})
export class LessonSubmissionModule {}
