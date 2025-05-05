import {
  Controller,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { PaymentType } from '@prisma/client';
import { MomoCallbackDto, ZaloCallbackDto } from './dto/payment-callback.dto';

@Controller('payments')
@ApiTags('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':provider/callback')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment callback processed successfully',
  })
  async handleCallback(
    @Param('provider') provider: PaymentType,
    @Body() payload: MomoCallbackDto | ZaloCallbackDto,
  ) {
    console.log('provider', provider);
    console.log(JSON.stringify(payload, null, 2));
    return this.paymentService.handleCallback(provider, payload);
  }
}
