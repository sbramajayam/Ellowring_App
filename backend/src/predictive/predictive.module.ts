import { Module } from '@nestjs/common';
import { PredictiveController } from './predictive.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PredictiveController],
})
export class PredictiveModule {}
