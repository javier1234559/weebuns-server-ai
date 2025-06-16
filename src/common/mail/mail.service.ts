import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Resend } from 'resend';

import { resetPasswordTemplate } from 'src/common/mail/templates/reset-password.template';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendPasswordResetEmail(email: string, resetCode: string) {
    try {
      await this.resend.emails.send({
        from: 'Weebuns Learning <no-reply@backend.waebuns.com>',
        to: email,
        subject: 'Password Reset Code',
        html: resetPasswordTemplate(resetCode),
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send reset code email');
    }
  }
}
