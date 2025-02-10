import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from 'src/user/user.module';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [AiModule, UserModule, CommonModule],
})
export class AppModule {}
