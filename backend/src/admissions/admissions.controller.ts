import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admissions')
export class AdmissionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query('stream') stream?: string) {
    return this.prisma.collegeCourse.findMany({
      where: {
        isActive: true,
        ...(stream
          ? {
              OR: [
                { degree: { contains: stream } },
                { name: { contains: stream } },
                { department: { name: { contains: stream } } },
              ],
            }
          : {}),
      },
      include: {
        college: { select: { name: true, city: true, state: true, type: true } },
        department: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
