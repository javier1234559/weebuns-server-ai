import { Module } from '@nestjs/common';
import { StudyActivityService } from './study-activity.service';
import { StudyActivityController } from './study-activity.controller';

@Module({
  controllers: [StudyActivityController],
  providers: [StudyActivityService],
})
export class StudyActivityModule {}
