import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LessonController } from 'src/models/lesson/lesson.controller';
import { LessonService } from 'src/models/lesson/lesson.service';

@Module({
  imports: [PrismaModule],
  controllers: [LessonController],
  providers: [LessonService, PrismaService],
  exports: [LessonService],
})
export class LessonModule {}
