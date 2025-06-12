import { Module } from '@nestjs/common';
import { BannerService } from 'src/models/banner/banner.service';
import { BannerController } from 'src/models/banner/banner.controller';

@Module({
  controllers: [BannerController],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule {}
