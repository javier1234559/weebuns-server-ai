import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaymentType } from '@prisma/client';

export class PaymentRequestDto {
  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType)
  @IsNotEmpty()
  provider: PaymentType;

  @ApiProperty()
  @IsNotEmpty()
  data: PaymentDataDto;
}

export class PaymentDataDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class PaymentCallbackDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class CheckPaymentStatusDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  transactionId: string;
}
