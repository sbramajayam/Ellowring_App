import { Module } from '@nestjs/common';
import { CoachingController } from './coaching.controller';
import { AuthModule } from '../auth/auth.module';

@Module({ imports: [AuthModule], controllers: [CoachingController] })
export class CoachingModule {}
