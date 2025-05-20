import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';

@Module({
  controllers: [NotificationController, NotificationGateway],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
