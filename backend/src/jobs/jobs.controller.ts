import { Body, Controller, Get, Param, Post, UseGuards, Req, Query } from '@nestjs/common';
import { EmploymentType, WorkMode } from '@prisma/client';
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
    return this.prisma.job.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { company: true },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COMPANY', 'ADMIN')
  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const company = await this.prisma.company.findUnique({ where: { userId: req.user.userId } });
    if (!company && req.user.role !== 'ADMIN') return { error: 'Company profile required' };
    if (!company) return { error: 'Company profile required' };

    const baseSlug = String(body.slug || body.title || 'job')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const slug = `${baseSlug || 'job'}-${Date.now().toString(36)}`;

    const type = (body.type as EmploymentType) || EmploymentType.FULL_TIME;
    const mode = (body.mode as WorkMode) || WorkMode.HYBRID;

    return this.prisma.job.create({
      data: {
        companyId: company.id,
        title: body.title,
        slug,
        location: body.location,
        type,
        mode,
        salaryMin: body.salaryMin,
        salaryMax: body.salaryMax,
        experience: body.experience,
        description: body.description,
        skills: Array.isArray(body.skills) ? body.skills.join(',') : body.skills,
      },
    });
  }
}
