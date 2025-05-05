import { PaymentType } from '@prisma/client';
import {
  PaymentRequestDto,
  CheckPaymentStatusDto,
} from '../dto/payment-request.dto';
import { CheckPaymentStatusResponseDto } from '../dto/payment-response.dto';
import { MomoCallbackDto, ZaloCallbackDto } from '../dto/payment-callback.dto';

export interface IPaymentService {
  generatePaymentUrl(dto: PaymentRequestDto): Promise<string>;
  handleCallback(
    provider: PaymentType,
    payload: MomoCallbackDto | ZaloCallbackDto,
  ): Promise<any>;
  checkStatus(
    provider: PaymentType,
    dto: CheckPaymentStatusDto,
  ): Promise<CheckPaymentStatusResponseDto>;
}
