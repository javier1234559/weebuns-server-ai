import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from 'src/models/comment/comment.controller';
import { CommentEventHandler } from './events/comment.handler';
import { NotificationModule } from '../notification/notification.module';
@Module({
  imports: [NotificationModule],
  controllers: [CommentController],
  providers: [CommentService, CommentEventHandler],
  exports: [CommentService],
})
export class CommentModule {}
