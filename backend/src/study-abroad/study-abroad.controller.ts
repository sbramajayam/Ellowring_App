import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('study-abroad')
export class StudyAbroadController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query('country') country?: string) {
    return this.prisma.studyAbroad.findMany({
      where: { isPublished: true, ...(country ? { country } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }
}
