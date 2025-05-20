import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../../notification/notification.service';
import { CommentCreatedEvent, CommentRepliedEvent } from './comment.event';
import { NotificationType } from '@prisma/client';

@Injectable()
export class CommentEventHandler {
  private readonly logger = new Logger(CommentEventHandler.name);
  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent('comment.created')
  async handleCommentCreated(event: CommentCreatedEvent) {
    const {
      createdBy,
      userId,
      type = NotificationType.comment_mention,
      title = 'Bạn có bình luận mới',
      content,
      thumbnailUrl,
      actionUrl,
      isGlobal = false,
    } = event;
    this.logger.log('handleCommentCreated', JSON.stringify(event, null, 2));
    await this.notificationService.sendNotification(createdBy, {
      userId,
      type,
      title,
      content,
      thumbnailUrl,
      actionUrl,
      isGlobal,
    });
  }

  @OnEvent('comment.replied')
  async handleCommentReplied(event: CommentRepliedEvent) {
    const {
      createdBy,
      userId,
      type = NotificationType.comment_reply,
      title = 'Bạn có lượt trả lời bình luận mới',
      content,
      thumbnailUrl,
      actionUrl,
      isGlobal = false,
    } = event;
    this.logger.log('handleCommentReplied', JSON.stringify(event, null, 2));
    await this.notificationService.sendNotification(createdBy, {
      userId,
      type,
      title,
      content,
      thumbnailUrl,
      actionUrl,
      isGlobal,
    });
  }
}
