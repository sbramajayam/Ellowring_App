import { Module } from '@nestjs/common';
import { AdsController } from './ads.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AdsController],
})
export class AdsModule {}
