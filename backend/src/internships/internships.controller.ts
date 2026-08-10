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
import { WorkMode } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ensureMarketplaceCompany, slugify } from '../common/marketplace-company';

@Controller('internships')
export class InternshipsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query('mode') mode?: string, @Query('all') all?: string) {
    const includeAll = all === '1' || all === 'true';
    const workMode =
      mode && Object.values(WorkMode).includes(mode as WorkMode) ? (mode as WorkMode) : undefined;
    return this.prisma.internship.findMany({
      where: {
        deletedAt: null,
        ...(includeAll ? {} : { isActive: true }),
        ...(workMode ? { mode: workMode } : {}),
      },
      include: { company: { select: { name: true, city: true, industry: true, logoUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  one(@Param('id') id: string) {
    return this.prisma.internship.findFirst({
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
    const mode =
      body.mode && Object.values(WorkMode).includes(body.mode as WorkMode)
        ? (body.mode as WorkMode)
        : WorkMode.REMOTE;

    return this.prisma.internship.create({
      data: {
        companyId: company.id,
        title,
        slug: slugify(title, 'internship'),
        location: body.location || null,
        mode,
        stipend: body.stipend !== undefined && body.stipend !== '' ? Number(body.stipend) : null,
        currency: body.currency || 'INR',
        duration: body.duration || null,
        description: body.description || null,
        skills: Array.isArray(body.skills) ? body.skills.join(',') : body.skills || null,
        openings: Number(body.openings) || 1,
        isActive: body.isActive === undefined ? true : Boolean(body.isActive),
        createdById: req.user.userId,
      },
      include: { company: { select: { name: true, city: true, industry: true, logoUrl: true } } },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'COMPANY', 'TRAINING')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const existing = await this.prisma.internship.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Internship not found');
    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = String(body.title).trim();
    if (body.location !== undefined) data.location = body.location || null;
    if (body.duration !== undefined) data.duration = body.duration || null;
    if (body.description !== undefined) data.description = body.description || null;
    if (body.skills !== undefined) {
      data.skills = Array.isArray(body.skills) ? body.skills.join(',') : body.skills || null;
    }
    if (body.stipend !== undefined) {
      data.stipend = body.stipend !== '' && body.stipend != null ? Number(body.stipend) : null;
    }
    if (body.mode !== undefined && Object.values(WorkMode).includes(body.mode as WorkMode)) {
      data.mode = body.mode;
    }
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);
    return this.prisma.internship.update({
      where: { id },
      data,
      include: { company: { select: { name: true, city: true, industry: true, logoUrl: true } } },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'COMPANY', 'TRAINING')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const existing = await this.prisma.internship.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Internship not found');
    await this.prisma.internship.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return { success: true, id };
  }
}
