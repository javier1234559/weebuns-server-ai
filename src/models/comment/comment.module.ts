import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { CommentService } from './comment.service';
import { CommentController } from 'src/models/comment/comment.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
