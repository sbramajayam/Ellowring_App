import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admissions')
export class AdmissionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query('stream') stream?: string) {
    return this.prisma.admission.findMany({
      where: { isOpen: true, ...(stream ? { stream } : {}) },
      include: { college: { select: { name: true, city: true, state: true, type: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
