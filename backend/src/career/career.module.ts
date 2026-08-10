import { Module } from '@nestjs/common';
import { CareerController } from './career.controller';
import { AuthModule } from '../auth/auth.module';

@Module({ imports: [AuthModule], controllers: [CareerController] })
export class CareerModule {}
