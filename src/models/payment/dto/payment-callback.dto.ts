import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

// Base callback DTO
export class BasePaymentCallbackDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

// Momo callback DTO
export class MomoCallbackDto extends BasePaymentCallbackDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  resultCode: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  payType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  signature: string;
}

// ZaloPay callback DTO
export class ZaloCallbackDto extends BasePaymentCallbackDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  data: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mac: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  type: number;
}
