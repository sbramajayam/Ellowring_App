import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('projects')
export class ProjectsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.liveProject.findMany({
      where: { isActive: true },
      include: { company: { select: { name: true, industry: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  one(@Param('id') id: string) {
    return this.prisma.liveProject.findUnique({ where: { id }, include: { company: true } });
  }
}
