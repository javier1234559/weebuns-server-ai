import { Subject } from 'rxjs';
import {
  CreateNotificationDto,
  FindAllNotificationQuery,
} from '../dto/notification-request.dto';
import { NotificationResponse } from '../dto/notification-response.dto';
import { NotificationEvent } from '../notification.service';

export interface INotificationService {
  sendNotification(
    createdBy: string,
    data: CreateNotificationDto,
  ): Promise<string>;

  getNotificationSubject(): Subject<NotificationEvent>;
  markAsRead(notificationId: string): Promise<string>;
  getAll(query: FindAllNotificationQuery): Promise<NotificationResponse>;
  deleteNotification(notificationId: string): Promise<string>;
}
