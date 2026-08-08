import { Controller, Get, Param, Query } from '@nestjs/common';
import { WorkMode } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Controller('internships')
export class InternshipsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query('mode') mode?: string) {
    const workMode =
      mode && Object.values(WorkMode).includes(mode as WorkMode) ? (mode as WorkMode) : undefined;
    return this.prisma.internship.findMany({
      where: { isActive: true, ...(workMode ? { mode: workMode } : {}) },
      include: { company: { select: { name: true, city: true, industry: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  one(@Param('id') id: string) {
    return this.prisma.internship.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { company: true },
    });
  }
}
