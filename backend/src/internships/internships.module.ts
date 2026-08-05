import { Module } from '@nestjs/common';
import { InternshipsController } from './internships.controller';

@Module({ controllers: [InternshipsController] })
export class InternshipsModule {}
