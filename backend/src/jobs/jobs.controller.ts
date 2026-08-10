import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EmploymentType, WorkMode } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ensureMarketplaceCompany, slugify } from '../common/marketplace-company';

@Controller('jobs')
export class JobsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query('q') q?: string, @Query('all') all?: string) {
    const includeAll = all === '1' || all === 'true';
    return this.prisma.job.findMany({
      where: {
        deletedAt: null,
        ...(includeAll ? {} : { isActive: true }),
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
      where: { OR: [{ id }, { slug: id }], deletedAt: null },
      include: { company: true },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'COMPANY', 'TRAINING')
  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const title = String(body.title || '').trim();
    if (!title) throw new BadRequestException('Title is required');
    const company =
      (await this.prisma.company.findUnique({ where: { userId: req.user.userId } })) ||
      (await ensureMarketplaceCompany(this.prisma));

    const type = (body.type as EmploymentType) || EmploymentType.FULL_TIME;
    const mode = (body.mode as WorkMode) || WorkMode.HYBRID;

    return this.prisma.job.create({
      data: {
        companyId: company.id,
        title,
        slug: slugify(title, 'job'),
        location: body.location || null,
        type,
        mode,
        salaryMin: body.salaryMin !== undefined && body.salaryMin !== '' ? Number(body.salaryMin) : null,
        salaryMax: body.salaryMax !== undefined && body.salaryMax !== '' ? Number(body.salaryMax) : null,
        experience: body.experience || null,
        description: body.description || null,
        skills: Array.isArray(body.skills) ? body.skills.join(',') : body.skills || null,
        isActive: body.isActive === undefined ? true : Boolean(body.isActive),
        createdById: req.user.userId,
      },
      include: { company: { select: { name: true, industry: true, city: true, logoUrl: true } } },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'COMPANY', 'TRAINING')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const existing = await this.prisma.job.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Job not found');
    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = String(body.title).trim();
    if (body.location !== undefined) data.location = body.location || null;
    if (body.experience !== undefined) data.experience = body.experience || null;
    if (body.description !== undefined) data.description = body.description || null;
    if (body.skills !== undefined) {
      data.skills = Array.isArray(body.skills) ? body.skills.join(',') : body.skills || null;
    }
    if (body.salaryMin !== undefined) {
      data.salaryMin = body.salaryMin !== '' && body.salaryMin != null ? Number(body.salaryMin) : null;
    }
    if (body.salaryMax !== undefined) {
      data.salaryMax = body.salaryMax !== '' && body.salaryMax != null ? Number(body.salaryMax) : null;
    }
    if (body.type !== undefined) data.type = body.type;
    if (body.mode !== undefined) data.mode = body.mode;
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);
    return this.prisma.job.update({
      where: { id },
      data,
      include: { company: { select: { name: true, industry: true, city: true, logoUrl: true } } },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'COMPANY', 'TRAINING')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const existing = await this.prisma.job.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Job not found');
    await this.prisma.job.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return { success: true, id };
  }
}
