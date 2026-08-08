import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import {
  InvoicesController,
  PaymentsController,
  PremiumPlansController,
  SubscriptionsController,
} from './payments.controller';

@Module({
  imports: [AuthModule],
  controllers: [
    PaymentsController,
    PremiumPlansController,
    SubscriptionsController,
    InvoicesController,
  ],
})
export class PaymentsModule {}
