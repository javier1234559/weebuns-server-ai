import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LessonSubmissionController } from './lesson-submission.controller';
import { LessonSubmissionService } from './lesson-submission.service';
import { LessonModule } from '../lesson/lesson.module';

@Module({
  imports: [PrismaModule, LessonModule],
  controllers: [LessonSubmissionController],
  providers: [LessonSubmissionService, PrismaService],
  exports: [LessonSubmissionService],
})
export class LessonSubmissionModule {}
