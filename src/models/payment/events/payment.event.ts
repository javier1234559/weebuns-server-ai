import { PaymentType } from '@prisma/client';

export class PaymentCompletedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly amount: number,
    public readonly provider: PaymentType,
    public readonly status: 'success' | 'failed',
  ) {}
}
