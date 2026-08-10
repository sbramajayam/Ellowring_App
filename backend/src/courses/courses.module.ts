import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { AuthModule } from '../auth/auth.module';

@Module({ imports: [AuthModule], controllers: [CoursesController] })
export class CoursesModule {}
