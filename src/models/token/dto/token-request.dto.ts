import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentStatus, PaymentType } from '@prisma/client';
import { PaginationInputDto } from 'src/common/dto/pagination.dto';

export class CreateTransactionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  packageCode: string;

  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType)
  @IsNotEmpty()
  paymentType: PaymentType;
}

export class UseTokensDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tokenAmount: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reason?: string;
}

export class FindAllTransactionsQuery extends PaginationInputDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: PaymentType })
  @IsEnum(PaymentType)
  @IsOptional()
  paymentType?: PaymentType;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  from?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  to?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
}

export class EarnTokensDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tokenAmount: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reason?: string;
}

export class WithdrawTokensDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tokenAmount: number;
}
