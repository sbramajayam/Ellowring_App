import { Body, Controller, Get, Param, Post, UseGuards, Req, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('jobs')
export class JobsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query('q') q?: string) {
    return this.prisma.job.findMany({
      where: {
        isActive: true,
        ...(q
          ? {
              OR: [
                { title: { contains: q } },
                { skills: { contains: q } },
                { location: { contains: q } },
              ],
            }
          : {}),
      },
      include: { company: { select: { name: true, industry: true, city: true, logoUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  one(@Param('id') id: string) {
    return this.prisma.job.findUnique({
      where: { id },
      include: { company: true },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COMPANY', 'ADMIN')
  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const company = await this.prisma.company.findUnique({ where: { userId: req.user.userId } });
    if (!company && req.user.role !== 'ADMIN') return { error: 'Company profile required' };
    return this.prisma.job.create({
      data: {
        companyId: company!.id,
        title: body.title,
        location: body.location,
        type: body.type || 'FULL_TIME',
        salaryMin: body.salaryMin,
        salaryMax: body.salaryMax,
        experience: body.experience,
        description: body.description,
        skills: body.skills,
      },
    });
  }
}
