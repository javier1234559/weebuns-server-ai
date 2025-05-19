import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { PaymentModule } from '../payment/payment.module';
import { TokenEventHandler } from './events/token.events';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, PaymentModule, NotificationModule],
  controllers: [TokenController],
  providers: [TokenService, TokenEventHandler],
  exports: [TokenService],
})
export class TokenModule {}
