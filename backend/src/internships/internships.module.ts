import { Module } from '@nestjs/common';
import { InternshipsController } from './internships.controller';
import { AuthModule } from '../auth/auth.module';

@Module({ imports: [AuthModule], controllers: [InternshipsController] })
export class InternshipsModule {}
