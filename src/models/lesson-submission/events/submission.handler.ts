import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from 'src/models/notification/notification.service';
import { SubmissionEventType, SubmissionGradedEvent } from './submission.event';
import { NotificationType } from '@prisma/client';
import { TokenService } from 'src/models/token/token.service';

@Injectable()
export class SubmissionEventHandler {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly tokenService: TokenService,
  ) {}

  @OnEvent(SubmissionEventType.SUBMISSION_GRADED)
  async handleSubmissionGraded(payload: SubmissionGradedEvent) {
    await this.notificationService.sendNotification(payload.createdBy, {
      userId: payload.userId,
      type: NotificationType.submission,
      title: 'Bài nộp của bạn đã được chấm điểm',
      content: `Bài "${payload.lessonTitle}" đã được chấm điểm. ${payload.content}`,
      thumbnailUrl: payload.thumbnailUrl,
      actionUrl: payload.actionUrl,
    });
  }

  @OnEvent(SubmissionEventType.SUBMISSION_CLAIMED)
  async handleSubmissionClaimed(payload: {
    teacherId: string;
    tokenUsed: number;
  }) {
    if (payload.tokenUsed > 0) {
      await this.tokenService.earnTokens(payload.teacherId, {
        tokenAmount: payload.tokenUsed,
        reason: 'Earned tokens from grading submission',
      });
    }
  }
}
