import { Module } from '@nestjs/common';
import { LessonSubmissionController } from './lesson-submission.controller';
import { LessonSubmissionService } from './lesson-submission.service';

@Module({
  imports: [],
  controllers: [LessonSubmissionController],
  providers: [LessonSubmissionService],
})
export class LessonSubmissionModule {}
