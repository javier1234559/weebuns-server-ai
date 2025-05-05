import { ApiProperty } from '@nestjs/swagger';

export class CheckPaymentStatusResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  status: 'success' | 'failed';

  @ApiProperty()
  message: string;
}

export class PaymentUrlResponseDto {
  @ApiProperty()
  paymentUrl: string;
}

export class MomoCallbackDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty()
  requestId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  resultCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  payType: string;

  @ApiProperty()
  signature: string;
}

// ZaloPay callback
export class ZaloCallbackDto {
  @ApiProperty()
  data: string;

  @ApiProperty()
  mac: string;

  @ApiProperty()
  type: number;
}

export type PaymentCallbackDto = MomoCallbackDto | ZaloCallbackDto;
