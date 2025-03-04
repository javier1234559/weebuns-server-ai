import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MailService } from 'src/common/mail/mail.service';

@Module({
  imports: [ConfigModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
