import { Module } from '@nestjs/common';
import { EnterpriseController } from './enterprise.controller';
import { ApiKeyGuard } from './api-key.guard';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EnterpriseController],
  providers: [ApiKeyGuard],
})
export class EnterpriseModule {}
