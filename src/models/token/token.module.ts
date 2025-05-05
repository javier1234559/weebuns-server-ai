import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { PaymentService } from 'src/models/payment/payment.service';
@Module({
  controllers: [TokenController],
  providers: [TokenService, PaymentService],
  exports: [TokenService],
})
export class TokenModule {}
