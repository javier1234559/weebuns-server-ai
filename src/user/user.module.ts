import { Module } from '@nestjs/common';

import { MailModule } from 'src/common/mail/mail.module';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { AuthService } from 'src/user/auth.service';
import { AuthController } from 'src/user/restful/auth.controller';
import { UserController } from 'src/user/restful/user.controller';

import { UserResolver } from './graphql/user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, MailModule],
  providers: [UserResolver, UserService, AuthService],
  exports: [UserService],
  controllers: [UserController, AuthController],
})
export class UserModule {}
