import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentCompletedEvent } from './payment.event';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { NotificationService } from '../../notification/notification.service';

@Injectable()
export class PaymentEventHandler {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent('payment.completed')
  async handlePaymentCompleted(event: PaymentCompletedEvent) {
    const { transactionId } = event;

    console.log(JSON.stringify(event, null, 2));
    // if (status === 'success') { // TODO: Uncomment this when payment is FIXED
    // Update transaction status
    await this.prisma.transaction.update({
      where: { transactionId },
      data: { status: 'completed' },
    });

    // Add tokens to user balance
    const transaction = await this.prisma.transaction.findUnique({
      where: { transactionId },
      include: { package: true },
    });

    if (transaction) {
      await this.prisma.tokenWallet.upsert({
        where: { userId: transaction.userId },
        create: {
          userId: transaction.userId,
          balance: Math.max(0, transaction.tokenAmount),
        },
        update: {
          balance: {
            increment: transaction.tokenAmount,
          },
        },
      });
    }
    // }
  }
}
