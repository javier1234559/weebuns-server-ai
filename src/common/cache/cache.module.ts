import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    NestCacheModule.register({
      isGlobal: true,
      max: 100,
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}
