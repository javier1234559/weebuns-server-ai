import { Module } from '@nestjs/common';

import { MailModule } from 'src/common/mail/mail.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { AuthService } from 'src/models/user/auth.service';
import { AuthController } from 'src/models/user/auth.controller';
import { UserService } from './user.service';
import { UserController } from 'src/models/user/user.controller';

@Module({
  imports: [PrismaModule, MailModule],
  providers: [UserService, AuthService],
  exports: [UserService],
  controllers: [UserController, AuthController],
})
export class UserModule {}
