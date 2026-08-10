import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminOpsController } from './admin-ops.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AdminController, AdminOpsController],
})
export class AdminModule {}
