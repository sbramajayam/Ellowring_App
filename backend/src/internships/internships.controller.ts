import { Controller, Get, Param, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('internships')
export class InternshipsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query('mode') mode?: string) {
    return this.prisma.internship.findMany({
      where: { isActive: true, ...(mode ? { mode } : {}) },
      include: { company: { select: { name: true, city: true, industry: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  one(@Param('id') id: string) {
    return this.prisma.internship.findUnique({ where: { id }, include: { company: true } });
  }
}
