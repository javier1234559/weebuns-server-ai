import { Controller, Get, Query, Sse, Logger } from '@nestjs/common';
import { filter, map, Observable } from 'rxjs';
import { NotificationService } from './notification.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('notifications-sse')
@ApiTags('notifications')
export class NotificationGateway {
  private readonly logger = new Logger(NotificationGateway.name);

  constructor(private readonly notificationService: NotificationService) {}

  @Get('stream')
  @Sse()
  stream(@Query('userId') userId: string): Observable<MessageEvent> {
    this.logger.log(`New SSE connection request for userId: ${userId}`);

    const notificationSubject =
      this.notificationService.getNotificationSubject();
    this.logger.log('Notification subject created');

    return notificationSubject.asObservable().pipe(
      map((event) => {
        this.logger.log(`Processing event for userId: ${event.userId}`);
        if (event.userId === userId) {
          return new MessageEvent('message', {
            data: JSON.stringify(event),
            lastEventId: String(Date.now()),
          });
        }
        return null;
      }),
      filter((event) => event !== null),
    );
  }
}
