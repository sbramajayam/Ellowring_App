import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { AuthModule } from '../auth/auth.module';

@Module({ imports: [AuthModule], controllers: [JobsController] })
export class JobsModule {}
