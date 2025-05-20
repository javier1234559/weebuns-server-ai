import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaymentType } from '@prisma/client';
import { IPaymentService } from './interface/payment-service.interface';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import {
  CheckPaymentStatusDto,
  PaymentRequestDto,
} from './dto/payment-request.dto';
import { MomoCallbackDto, ZaloCallbackDto } from './dto/payment-callback.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentCompletedEvent } from './events/payment.event';
import { CheckPaymentStatusResponseDto } from 'src/models/payment/dto/payment-response.dto';

@Injectable()
export class PaymentService implements IPaymentService {
  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  async generatePaymentUrl(dto: PaymentRequestDto): Promise<string> {
    const { provider, data } = dto;

    if (!(provider in PaymentType)) {
      throw new BadRequestException('Unsupported payment provider');
    }
    switch (provider) {
      case PaymentType.momo:
        return this.generateMomoUrl(data);
      case PaymentType.zalopay:
        return this.generateZaloUrl(data);
      default:
        throw new BadRequestException('Unsupported payment provider');
    }
  }

  private async generateMomoUrl(data: {
    amount: number;
    transactionId: string;
    description: string;
  }): Promise<string> {
    const { amount, transactionId, description } = data;

    // Get config
    const accessKey = this.configService.get<string>('MOMO_ACCESS_KEY');
    const secretKey = this.configService.get<string>('MOMO_SECRET_KEY');
    const partnerCode = this.configService.get<string>('MOMO_PARTNER_CODE');
    const redirectUrl = this.configService.get<string>('MOMO_REDIRECT_URL');

    if (!accessKey || !secretKey || !partnerCode || !redirectUrl) {
      throw new InternalServerErrorException('Momo configuration is missing');
    }

    const ipnUrl = `${this.configService.get('APP_URL')}/api/payments/momo/callback`;

    // Generate signature
    const rawSignature = [
      'accessKey=' + accessKey,
      'amount=' + amount,
      'extraData=',
      'ipnUrl=' + ipnUrl,
      'orderId=' + transactionId,
      'orderInfo=' + description,
      'partnerCode=' + partnerCode,
      'redirectUrl=' + redirectUrl,
      'requestId=' + transactionId,
      'requestType=payWithMethod',
    ].join('&');

    const signature = crypto
      .createHmac('sha256', secretKey || '')
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: transactionId,
      amount,
      orderId: transactionId,
      orderInfo: description,
      redirectUrl,
      ipnUrl,
      lang: 'vi',
      requestType: 'payWithMethod',
      autoCapture: true,
      extraData: '',
      signature,
    });

    console.log(requestBody);

    try {
      const response = await axios.post(
        'https://test-payment.momo.vn/v2/gateway/api/create',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody),
          },
        },
      );

      return response.data.payUrl;
    } catch (error: any) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to generate Momo payment URL',
      );
    }
  }

  private async generateZaloUrl(data: {
    amount: number;
    transactionId: string;
    description: string;
  }): Promise<string> {
    const { amount, transactionId, description } = data;

    const config = {
      app_id: this.configService.get<string>('ZALO_APP_ID'),
      key1: this.configService.get<string>('ZALO_KEY1'),
      key2: this.configService.get<string>('ZALO_KEY2'),
      endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
    };

    const embed_data = {
      redirecturl: this.configService.get<string>('ZALO_RETURN_URL'),
    };

    const items = [];

    const order = {
      app_id: config.app_id,
      app_trans_id: transactionId,
      app_user: 'user123',
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount,
      callback_url: `${this.configService.get('APP_URL')}/api/payments/zalopay/callback`,
      description,
      bank_code: '',
    };

    const macData =
      config.app_id +
      '|' +
      order.app_trans_id +
      '|' +
      order.app_user +
      '|' +
      order.amount +
      '|' +
      order.app_time +
      '|' +
      order.embed_data +
      '|' +
      order.item;

    order['mac'] = CryptoJS.HmacSHA256(macData, config.key1).toString();

    try {
      const response = await axios.post(config.endpoint, null, {
        params: order,
      });

      if (response.data.return_code === 1) {
        return response.data.order_url;
      }

      throw new Error(
        `${response.data.return_message} (${response.data.sub_return_message || ''})`,
      );
    } catch (error: any) {
      console.error('ZaloPay Error:', error);
      throw new InternalServerErrorException(
        'Failed to generate ZaloPay payment URL: ' + error.message,
      );
    }
  }

  async handleCallback(
    provider: PaymentType,
    payload: MomoCallbackDto | ZaloCallbackDto,
  ) {
    if (!(provider in PaymentType)) {
      throw new BadRequestException('Unsupported payment provider');
    }

    switch (provider) {
      case PaymentType.momo:
        return this.handleMomoCallback(payload as MomoCallbackDto);
      case PaymentType.zalopay:
        return this.handleZaloCallback(payload as ZaloCallbackDto);
      default:
        throw new BadRequestException('Unsupported payment provider');
    }
  }

  private async handleMomoCallback(payload: MomoCallbackDto) {
    const { orderId: transactionId, resultCode, amount } = payload;

    if (!transactionId) {
      throw new BadRequestException(
        'Missing transaction ID in payment callback',
      );
    }

    const response = {
      transactionId,
      status: resultCode === 0 ? 'success' : 'failed',
      amount,
      provider: PaymentType.momo,
    };

    // Emit event for token service to handle
    this.eventEmitter.emit(
      'payment.completed',
      new PaymentCompletedEvent(
        response.transactionId,
        response.amount,
        response.provider,
        response.status as 'success' | 'failed',
      ),
    );

    return response;
  }

  private async handleZaloCallback(payload: ZaloCallbackDto) {
    const { data, type, amount } = payload;
    const parseData = JSON.parse(data);
    const transactionId = parseData?.app_trans_id;

    if (!transactionId) {
      throw new BadRequestException(
        'Missing transaction ID in payment callback',
      );
    }

    const response = {
      transactionId,
      status: type === 1 ? 'success' : 'failed',
      amount,
      provider: PaymentType.zalopay,
    };

    // Emit event for token service to handle
    this.eventEmitter.emit(
      'payment.completed',
      new PaymentCompletedEvent(
        response.transactionId,
        response.amount,
        response.provider,
        response.status as 'success' | 'failed',
      ),
    );

    return response;
  }

  async checkStatus(
    provider: PaymentType,
    dto: CheckPaymentStatusDto,
  ): Promise<CheckPaymentStatusResponseDto> {
    switch (provider) {
      case PaymentType.momo:
        return this.checkMomoStatus(dto.transactionId);
      case PaymentType.zalopay:
        return this.checkZaloStatus(dto.transactionId);
      default:
        throw new BadRequestException('Unsupported payment provider');
    }
  }

  private async checkMomoStatus(
    transactionId: string,
  ): Promise<CheckPaymentStatusResponseDto> {
    const accessKey = this.configService.get('MOMO_ACCESS_KEY');
    const secretKey = this.configService.get('MOMO_SECRET_KEY');
    const partnerCode = this.configService.get('MOMO_PARTNER_CODE');

    const rawSignature = [
      'accessKey=' + accessKey,
      'orderId=' + transactionId,
      'partnerCode=' + partnerCode,
      'requestId=' + transactionId,
    ].join('&');

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = {
      partnerCode,
      requestId: transactionId,
      orderId: transactionId,
      signature,
      lang: 'vi',
    };

    try {
      const response = await axios.post(
        'https://test-payment.momo.vn/v2/gateway/api/query',
        requestBody,
      );

      return {
        success: response.data.resultCode === 0,
        status: response.data.resultCode === 0 ? 'success' : 'failed',
        message: response.data.message,
      };
    } catch (error: any) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to check Momo payment status: ' + error.message,
      );
    }
  }

  private async checkZaloStatus(
    transactionId: string,
  ): Promise<CheckPaymentStatusResponseDto> {
    const appId = this.configService.get('ZALO_APP_ID');
    const key1 = this.configService.get('ZALO_KEY1');

    const data = appId + '|' + transactionId + '|' + key1;
    const mac = CryptoJS.HmacSHA256(data, key1).toString();

    const params = {
      app_id: appId,
      app_trans_id: transactionId,
      mac,
    };

    try {
      const response = await axios.post(
        'https://sb-openapi.zalopay.vn/v2/query',
        null,
        { params },
      );

      return {
        success: response.data.return_code === 1,
        status: response.data.return_code === 1 ? 'success' : 'failed',
        message: response.data.return_message,
      };
    } catch (error: any) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to check ZaloPay payment status: ' + error.message,
      );
    }
  }
}
