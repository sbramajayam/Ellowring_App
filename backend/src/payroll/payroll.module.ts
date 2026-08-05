import { Module } from '@nestjs/common';
import { PayrollController } from './payroll.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PayrollController],
})
export class PayrollModule {}

