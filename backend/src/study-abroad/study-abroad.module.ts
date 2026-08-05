import { Module } from '@nestjs/common';
import { StudyAbroadController } from './study-abroad.controller';

@Module({ controllers: [StudyAbroadController] })
export class StudyAbroadModule {}
