import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { CacheModule } from 'src/common/cache/cache.module';
import { ValidationModule } from 'src/common/decorators/validation.module';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { UploadModule } from 'src/common/upload/upload.module';
import config, { MAX_AGE } from 'src/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    CacheModule,
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: MAX_AGE },
    }),
    ValidationModule,
    UploadModule,
    ValidationModule,
  ],
  exports: [ConfigModule, ValidationModule],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
