import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Subject } from 'rxjs';
import {
  CreateNotificationDto,
  FindAllNotificationQuery,
} from './dto/notification-request.dto';
import { NotificationType } from '@prisma/client';
import { paginationQuery } from 'src/common/helper/prisma-queries.helper';
import { calculatePagination } from 'src/common/utils/pagination';
import { NotificationResponse } from './dto/notification-response.dto';

export interface NotificationEvent {
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  thumbnailUrl?: string;
  actionUrl?: string;
  isGlobal: boolean;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private notificationSubject = new Subject<NotificationEvent>();

  constructor(private readonly prisma: PrismaService) {}

  getNotificationSubject() {
    return this.notificationSubject;
  }

  async sendNotification(
    createdBy: string,
    data: CreateNotificationDto,
  ): Promise<string> {
    try {
      this.logger.log('sendNotification', JSON.stringify(data, null, 2));
      const notification = await this.prisma.notification.create({
        data: {
          userId: data.userId,
          type: data.type,
          title: data.title,
          content: data.content,
          thumbnailUrl: data.thumbnailUrl,
          actionUrl: data.actionUrl,
          isGlobal: data.isGlobal ?? false, // default is false
          isRead: false,
          createdById: createdBy,
        },
      });

      // Emit event to SSE stream
      this.notificationSubject.next({
        userId: data.userId,
        type: data.type,
        title: data.title,
        content: data.content,
        thumbnailUrl: data.thumbnailUrl,
        actionUrl: data.actionUrl,
        isGlobal: data.isGlobal ?? false,
      });
      return 'Notification sent successfully to ' + notification.userId;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async markAsRead(notificationId: string): Promise<string> {
    try {
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });
      return 'Notification marked as read successfully ' + notificationId;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAll(query: FindAllNotificationQuery): Promise<NotificationResponse> {
    const { page, perPage, userId, isGlobal, type, search } = query;

    const queryOptions = {
      where: {
        OR: [
          ...(userId ? [{ userId }] : []),
          ...(isGlobal ? [{ isGlobal: true }] : []),
        ],
        ...(type && { type }),
        ...(search && { title: { contains: search } }),
      },
      orderBy: { createdAt: 'desc' },
      ...paginationQuery(page, perPage),
    };

    const [notifications, totalItems] = await Promise.all([
      this.prisma.notification.findMany(queryOptions),
      this.prisma.notification.count({ where: queryOptions.where }),
    ]);

    return {
      data: notifications,
      pagination: calculatePagination(totalItems, query),
    };
  }

  async deleteNotification(notificationId: string): Promise<string> {
    try {
      await this.prisma.notification.delete({
        where: { id: notificationId },
      });
      return 'Notification deleted successfully ' + notificationId;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
