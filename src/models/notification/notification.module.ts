import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationController, NotificationGateway],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
