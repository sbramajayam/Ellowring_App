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
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ensureMarketplaceCompany, slugify } from '../common/marketplace-company';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminOpsController {
  constructor(private prisma: PrismaService) {}

  // ── Partners ─────────────────────────────────────────────
  @Get('partners')
  partners(@Query('q') q?: string) {
    return this.prisma.partner.findMany({
      where: {
        deletedAt: null,
        ...(q
          ? {
              OR: [
                { name: { contains: q } },
                { region: { contains: q } },
                { referralCode: { contains: q } },
              ],
            }
          : {}),
      },
      include: { user: { select: { id: true, email: true, isActive: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post('partners')
  async createPartner(
    @Body() body: { name: string; email: string; password?: string; region?: string; commissionPct?: number },
  ) {
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    if (!name || !email) throw new BadRequestException('Name and email required');
    if (await this.prisma.user.findUnique({ where: { email } })) {
      throw new BadRequestException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(body.password?.trim() || 'Ellowring@123', 10);
    const code = `REF-${Date.now().toString(36).toUpperCase()}`;
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: Role.PARTNER,
        isVerified: true,
        partner: {
          create: {
            name,
            region: body.region || null,
            referralCode: code,
            commissionPct: body.commissionPct ?? 10,
            wallet: { create: { balance: 0, currency: 'INR' } },
          },
        },
      },
      include: { partner: true },
    });
    return user.partner;
  }

  @Patch('partners/:id')
  async updatePartner(
    @Param('id') id: string,
    @Body() body: { name?: string; region?: string; commissionPct?: number; isActive?: boolean },
  ) {
    const existing = await this.prisma.partner.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Partner not found');
    return this.prisma.partner.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: String(body.name).trim() } : {}),
        ...(body.region !== undefined ? { region: body.region || null } : {}),
        ...(body.commissionPct !== undefined ? { commissionPct: Number(body.commissionPct) } : {}),
        ...(body.isActive !== undefined ? { isActive: Boolean(body.isActive) } : {}),
      },
      include: { user: { select: { id: true, email: true, isActive: true } } },
    });
  }

  @Delete('partners/:id')
  async removePartner(@Param('id') id: string) {
    const existing = await this.prisma.partner.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Partner not found');
    await this.prisma.partner.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return { success: true, id };
  }

  // ── Training centers ─────────────────────────────────────
  @Get('training-centers')
  trainingCenters(@Query('q') q?: string) {
    return this.prisma.trainingCenter.findMany({
      where: {
        deletedAt: null,
        ...(q
          ? {
              OR: [{ name: { contains: q } }, { city: { contains: q } }, { specialty: { contains: q } }],
            }
          : {}),
      },
      include: { user: { select: { id: true, email: true, isActive: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post('training-centers')
  async createTraining(
    @Body()
    body: {
      name: string;
      email: string;
      password?: string;
      specialty?: string;
      city?: string;
      state?: string;
      website?: string;
      description?: string;
    },
  ) {
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    if (!name || !email) throw new BadRequestException('Name and email required');
    if (await this.prisma.user.findUnique({ where: { email } })) {
      throw new BadRequestException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(body.password?.trim() || 'Ellowring@123', 10);
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: Role.TRAINING,
        isVerified: true,
        trainingCenter: {
          create: {
            name,
            specialty: body.specialty || null,
            city: body.city || null,
            state: body.state || null,
            website: body.website || null,
            description: body.description || null,
            verified: true,
          },
        },
      },
      include: { trainingCenter: true },
    });
    return user.trainingCenter;
  }

  @Patch('training-centers/:id')
  async updateTraining(@Param('id') id: string, @Body() body: any) {
    const existing = await this.prisma.trainingCenter.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Training center not found');
    return this.prisma.trainingCenter.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: String(body.name).trim() } : {}),
        ...(body.specialty !== undefined ? { specialty: body.specialty || null } : {}),
        ...(body.city !== undefined ? { city: body.city || null } : {}),
        ...(body.state !== undefined ? { state: body.state || null } : {}),
        ...(body.website !== undefined ? { website: body.website || null } : {}),
        ...(body.description !== undefined ? { description: body.description || null } : {}),
        ...(body.verified !== undefined ? { verified: Boolean(body.verified) } : {}),
      },
      include: { user: { select: { id: true, email: true, isActive: true } } },
    });
  }

  @Delete('training-centers/:id')
  async removeTraining(@Param('id') id: string) {
    const existing = await this.prisma.trainingCenter.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Training center not found');
    await this.prisma.trainingCenter.update({
      where: { id },
      data: { deletedAt: new Date(), verified: false },
    });
    return { success: true, id };
  }

  // ── HR Employees ─────────────────────────────────────────
  @Get('employees')
  async employees(@Query('q') q?: string) {
    return this.prisma.employee.findMany({
      where: {
        deletedAt: null,
        ...(q
          ? {
              OR: [
                { name: { contains: q } },
                { email: { contains: q } },
                { department: { contains: q } },
                { designation: { contains: q } },
              ],
            }
          : {}),
      },
      include: { company: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  @Post('employees')
  async createEmployee(
    @Body()
    body: {
      name: string;
      email?: string;
      phone?: string;
      designation?: string;
      department?: string;
      employeeNo?: string;
      salary?: number;
      isActive?: boolean;
    },
  ) {
    const name = String(body.name || '').trim();
    if (!name) throw new BadRequestException('Name required');
    const company = await ensureMarketplaceCompany(this.prisma);
    const employeeNo = body.employeeNo?.trim() || `EMP-${Date.now().toString(36).toUpperCase()}`;
    return this.prisma.employee.create({
      data: {
        companyId: company.id,
        employeeNo,
        name,
        email: body.email || null,
        phone: body.phone || null,
        designation: body.designation || null,
        department: body.department || null,
        salary: body.salary !== undefined ? Number(body.salary) : null,
        isActive: body.isActive === undefined ? true : Boolean(body.isActive),
        joinedAt: new Date(),
      },
      include: { company: { select: { name: true } } },
    });
  }

  @Patch('employees/:id')
  async updateEmployee(@Param('id') id: string, @Body() body: any) {
    const existing = await this.prisma.employee.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Employee not found');
    return this.prisma.employee.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: String(body.name).trim() } : {}),
        ...(body.email !== undefined ? { email: body.email || null } : {}),
        ...(body.phone !== undefined ? { phone: body.phone || null } : {}),
        ...(body.designation !== undefined ? { designation: body.designation || null } : {}),
        ...(body.department !== undefined ? { department: body.department || null } : {}),
        ...(body.salary !== undefined ? { salary: body.salary !== '' ? Number(body.salary) : null } : {}),
        ...(body.isActive !== undefined ? { isActive: Boolean(body.isActive) } : {}),
      },
      include: { company: { select: { name: true } } },
    });
  }

  @Delete('employees/:id')
  async removeEmployee(@Param('id') id: string) {
    const existing = await this.prisma.employee.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Employee not found');
    await this.prisma.employee.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return { success: true, id };
  }

  // ── Payments (admin all) ─────────────────────────────────
  @Get('payments')
  payments(@Query('status') status?: string) {
    return this.prisma.payment.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        refunds: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  @Patch('payments/:id')
  async updatePayment(
    @Param('id') id: string,
    @Body() body: { status?: string; purpose?: string },
  ) {
    const existing = await this.prisma.payment.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Payment not found');
    return this.prisma.payment.update({
      where: { id },
      data: {
        ...(body.status !== undefined ? { status: body.status as any } : {}),
        ...(body.purpose !== undefined ? { purpose: body.purpose } : {}),
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  // ── Admissions (college courses) ─────────────────────────
  @Get('admissions')
  admissions() {
    return this.prisma.collegeCourse.findMany({
      include: {
        college: { select: { id: true, name: true, city: true, state: true } },
        department: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  @Post('admissions')
  async createAdmission(
    @Body()
    body: {
      collegeId: string;
      name: string;
      degree: string;
      duration?: string;
      fees?: number;
      seats?: number;
      eligibility?: string;
      description?: string;
      isActive?: boolean;
    },
  ) {
    const name = String(body.name || '').trim();
    if (!name || !body.collegeId || !body.degree) {
      throw new BadRequestException('collegeId, name and degree required');
    }
    return this.prisma.collegeCourse.create({
      data: {
        collegeId: body.collegeId,
        name,
        slug: slugify(name, 'admission'),
        degree: body.degree,
        duration: body.duration || null,
        fees: body.fees !== undefined ? Number(body.fees) : null,
        seats: body.seats ?? 0,
        eligibility: body.eligibility || null,
        description: body.description || null,
        isActive: body.isActive === undefined ? true : Boolean(body.isActive),
      },
      include: { college: { select: { id: true, name: true, city: true } } },
    });
  }

  @Patch('admissions/:id')
  async updateAdmission(@Param('id') id: string, @Body() body: any) {
    const existing = await this.prisma.collegeCourse.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Admission course not found');
    return this.prisma.collegeCourse.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: String(body.name).trim() } : {}),
        ...(body.degree !== undefined ? { degree: body.degree } : {}),
        ...(body.duration !== undefined ? { duration: body.duration || null } : {}),
        ...(body.fees !== undefined ? { fees: body.fees !== '' ? Number(body.fees) : null } : {}),
        ...(body.seats !== undefined ? { seats: Number(body.seats) || 0 } : {}),
        ...(body.eligibility !== undefined ? { eligibility: body.eligibility || null } : {}),
        ...(body.description !== undefined ? { description: body.description || null } : {}),
        ...(body.isActive !== undefined ? { isActive: Boolean(body.isActive) } : {}),
      },
      include: { college: { select: { id: true, name: true, city: true } } },
    });
  }

  @Delete('admissions/:id')
  async removeAdmission(@Param('id') id: string) {
    const existing = await this.prisma.collegeCourse.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Admission course not found');
    await this.prisma.collegeCourse.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return { success: true, id };
  }

  // ── Campaigns / Ads (Banner model) ───────────────────────
  @Get('campaigns')
  campaigns() {
    return this.prisma.banner.findMany({
      where: { deletedAt: null },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  @Post('campaigns')
  createCampaign(
    @Body()
    body: {
      title: string;
      imageUrl?: string;
      linkUrl?: string;
      sortOrder?: number;
      isActive?: boolean;
    },
  ) {
    const title = String(body.title || '').trim();
    if (!title) throw new BadRequestException('Title required');
    return this.prisma.banner.create({
      data: {
        title,
        imageUrl: body.imageUrl || 'https://placehold.co/1200x400/0F3DDE/ffffff?text=Ellowring+Ad',
        linkUrl: body.linkUrl || null,
        sortOrder: body.sortOrder ?? 0,
        isActive: body.isActive === undefined ? true : Boolean(body.isActive),
      },
    });
  }

  @Patch('campaigns/:id')
  async updateCampaign(@Param('id') id: string, @Body() body: any) {
    const existing = await this.prisma.banner.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Campaign not found');
    return this.prisma.banner.update({
      where: { id },
      data: {
        ...(body.title !== undefined ? { title: String(body.title).trim() } : {}),
        ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl } : {}),
        ...(body.linkUrl !== undefined ? { linkUrl: body.linkUrl || null } : {}),
        ...(body.sortOrder !== undefined ? { sortOrder: Number(body.sortOrder) || 0 } : {}),
        ...(body.isActive !== undefined ? { isActive: Boolean(body.isActive) } : {}),
      },
    });
  }

  @Delete('campaigns/:id')
  async removeCampaign(@Param('id') id: string) {
    await this.prisma.banner.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return { success: true, id };
  }

  // ── Announcements CRUD extras ────────────────────────────
  @Patch('announcements/:id')
  async updateAnnouncement(@Param('id') id: string, @Body() body: any) {
    return this.prisma.announcement.update({
      where: { id },
      data: {
        ...(body.title !== undefined ? { title: String(body.title).trim() } : {}),
        ...(body.content !== undefined ? { content: body.content } : {}),
        ...(body.isPublished !== undefined ? { isPublished: Boolean(body.isPublished) } : {}),
      },
    });
  }

  @Delete('announcements/:id')
  async removeAnnouncement(@Param('id') id: string) {
    await this.prisma.announcement.update({
      where: { id },
      data: { deletedAt: new Date(), isPublished: false },
    });
    return { success: true, id };
  }

  // ── Reports ──────────────────────────────────────────────
  @Get('reports')
  reports() {
    return this.prisma.report.findMany({ orderBy: { generatedAt: 'desc' }, take: 100 });
  }

  @Post('reports')
  createReport(
    @Body() body: { title: string; reportType: string; parameters?: object; fileUrl?: string },
  ) {
    const title = String(body.title || '').trim();
    const reportType = String(body.reportType || '').trim();
    if (!title || !reportType) throw new BadRequestException('title and reportType required');
    return this.prisma.report.create({
      data: {
        title,
        reportType,
        parameters: (body.parameters as any) || undefined,
        fileUrl: body.fileUrl || null,
        generatedBy: 'ADMIN',
      },
    });
  }

  @Delete('reports/:id')
  async removeReport(@Param('id') id: string) {
    await this.prisma.report.delete({ where: { id } });
    return { success: true, id };
  }

  // ── Simple API keys stored in settings ───────────────────
  @Get('api-keys')
  async apiKeys() {
    const rows = await this.prisma.setting.findMany({
      where: { key: { startsWith: 'api.key.' } },
      orderBy: { key: 'asc' },
    });
    return rows.map((r) => ({
      id: r.id,
      key: r.key.replace(/^api\.key\./, ''),
      value: r.value,
      description: r.description,
      createdAt: r.updatedAt,
      status: 'ACTIVE',
    }));
  }

  @Post('api-keys')
  async createApiKey(@Body() body: { appName: string; description?: string }) {
    const appName = String(body.appName || '').trim();
    if (!appName) throw new BadRequestException('App name required');
    const raw = `ell_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    const key = `api.key.${slugify(appName, 'app')}`;
    const row = await this.prisma.setting.upsert({
      where: { key },
      update: { value: raw, description: body.description || appName },
      create: { key, value: raw, description: body.description || appName },
    });
    return {
      id: row.id,
      key: row.key.replace(/^api\.key\./, ''),
      value: row.value,
      description: row.description,
      createdAt: row.updatedAt,
      status: 'ACTIVE',
    };
  }

  @Delete('api-keys/:id')
  async removeApiKey(@Param('id') id: string) {
    await this.prisma.setting.delete({ where: { id } });
    return { success: true, id };
  }
}
