import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { resetPasswordTemplate } from 'src/common/mail/templates/reset-password.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend;
  private readonly fromEmail = 'no-reply@waebuns.com';
  private readonly fromName = 'Weebuns Learning';

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendPasswordResetEmail(email: string, resetCode: string) {
    try {
      this.logger.log(`Sending password reset email to ${email}`);

      console.log(this.configService.get('RESEND_API_KEY'));
      const res = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: email,
        subject: 'Password Reset Code',
        html: resetPasswordTemplate(resetCode),
      });
      console.log(JSON.stringify(res, null, 2));
      return res;
    } catch (error) {
      this.logger.error('Failed to send email:', error);
      throw new Error('Failed to send reset code email');
    }
  }
}
