import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentEventHandler } from './events/payment.handler';
import { NotificationModule } from '../notification/notification.module';
@Module({
  imports: [NotificationModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentEventHandler],
  exports: [PaymentService],
})
export class PaymentModule {}
