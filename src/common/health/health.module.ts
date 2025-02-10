import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { PingIndicator } from 'src/common/health/ping.indicator';

import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [PingIndicator],
})
export class HealthModule {}
