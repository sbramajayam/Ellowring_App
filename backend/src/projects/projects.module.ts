import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { AuthModule } from '../auth/auth.module';

@Module({ imports: [AuthModule], controllers: [ProjectsController] })
export class ProjectsModule {}
