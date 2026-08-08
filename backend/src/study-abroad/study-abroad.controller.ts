import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('study-abroad')
export class StudyAbroadController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query('country') country?: string) {
    return this.prisma.abroadProgram.findMany({
      where: {
        isActive: true,
        ...(country
          ? {
              university: {
                country: {
                  OR: [
                    { name: { contains: country } },
                    { code: { equals: country.toUpperCase() } },
                  ],
                },
              },
            }
          : {}),
      },
      include: {
        university: {
          include: { country: { select: { name: true, code: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
