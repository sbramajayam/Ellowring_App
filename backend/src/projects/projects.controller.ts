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
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ensureMarketplaceCompany, slugify } from '../common/marketplace-company';

@Controller('projects')
export class ProjectsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query('all') all?: string) {
    const includeAll = all === '1' || all === 'true';
    return this.prisma.project.findMany({
      where: {
        deletedAt: null,
        ...(includeAll ? {} : { isActive: true }),
      },
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
      where: { OR: [{ id }, { slug: id }], deletedAt: null },
      include: { company: true, technologies: true, category: true },
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

    const techList: string[] = Array.isArray(body.technologies)
      ? body.technologies.map(String).filter(Boolean)
      : String(body.skills || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

    return this.prisma.project.create({
      data: {
        companyId: company.id,
        title,
        slug: slugify(title, 'project'),
        domain: body.domain || null,
        description: body.description || null,
        duration: body.duration || null,
        stipend: body.stipend !== undefined && body.stipend !== '' ? Number(body.stipend) : null,
        currency: body.currency || 'INR',
        teamSize: Number(body.teamSize) || 1,
        isActive: body.isActive === undefined ? true : Boolean(body.isActive),
        createdById: req.user.userId,
        technologies: techList.length
          ? { create: techList.map((technology) => ({ technology })) }
          : undefined,
      },
      include: {
        company: { select: { name: true, industry: true } },
        technologies: true,
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'COMPANY', 'TRAINING')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const existing = await this.prisma.project.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Project not found');
    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = String(body.title).trim();
    if (body.domain !== undefined) data.domain = body.domain || null;
    if (body.description !== undefined) data.description = body.description || null;
    if (body.duration !== undefined) data.duration = body.duration || null;
    if (body.stipend !== undefined) {
      data.stipend = body.stipend !== '' && body.stipend != null ? Number(body.stipend) : null;
    }
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);

    if (body.technologies !== undefined || body.skills !== undefined) {
      const techList: string[] = Array.isArray(body.technologies)
        ? body.technologies.map(String).filter(Boolean)
        : String(body.skills || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
      await this.prisma.projectTechnology.deleteMany({ where: { projectId: id } });
      if (techList.length) {
        await this.prisma.projectTechnology.createMany({
          data: techList.map((technology) => ({ projectId: id, technology })),
        });
      }
    }

    return this.prisma.project.update({
      where: { id },
      data,
      include: {
        company: { select: { name: true, industry: true } },
        technologies: true,
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'COMPANY', 'TRAINING')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const existing = await this.prisma.project.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Project not found');
    await this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return { success: true, id };
  }
}
