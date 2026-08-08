import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('projects')
export class ProjectsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.project.findMany({
      where: { isActive: true },
      include: {
        company: { select: { name: true, industry: true } },
        technologies: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  one(@Param('id') id: string) {
    return this.prisma.project.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { company: true, technologies: true, category: true },
    });
  }
}
