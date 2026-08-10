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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { CollegesService } from './colleges.service';
import { slugify } from '../common/marketplace-company';

@Controller('colleges')
export class CollegesController {
  constructor(
    private prisma: PrismaService,
    private colleges: CollegesService,
  ) {}

  @Get()
  list(@Query('city') city?: string, @Query('state') state?: string) {
    return this.prisma.college.findMany({
      where: {
        deletedAt: null,
        ...(city ? { city } : {}),
        ...(state ? { state } : {}),
      },
      include: {
        rankings: { orderBy: [{ year: 'desc' }, { rank: 'asc' }], take: 3 },
      },
      orderBy: { name: 'asc' },
      take: 100,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'COLLEGE', 'TRAINING')
  @Post()
  async create(@Body() body: any) {
    const name = String(body.name || '').trim();
    if (!name) throw new BadRequestException('Name is required');
    const college = await this.prisma.college.create({
      data: {
        name,
        slug: slugify(name, 'college'),
        code: body.code || null,
        type: body.type || null,
        city: body.city || null,
        state: body.state || null,
        website: body.website || null,
        description: body.description || null,
        logoUrl: body.logoUrl || null,
        isVerified: body.isVerified === undefined ? false : Boolean(body.isVerified),
      },
      include: { rankings: true },
    });
    const nirf = body.nirfRank !== undefined && body.nirfRank !== '' ? Number(body.nirfRank) : null;
    if (nirf && Number.isFinite(nirf)) {
      await this.prisma.collegeRanking.create({
        data: {
          collegeId: college.id,
          source: 'NIRF',
          rank: nirf,
          year: new Date().getFullYear(),
          category: body.nirfCategory || 'Overall',
        },
      });
    }
    return this.prisma.college.findUnique({
      where: { id: college.id },
      include: { rankings: { orderBy: [{ year: 'desc' }, { rank: 'asc' }], take: 3 } },
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COLLEGE', 'ADMIN')
  me(@Req() req: any) {
    return this.colleges.resolveProfile(req.user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COLLEGE', 'ADMIN')
  async updateMe(
    @Req() req: any,
    @Body()
    body: {
      name?: string;
      code?: string;
      city?: string;
      state?: string;
      type?: string;
      website?: string;
      description?: string;
      logoUrl?: string;
    },
  ) {
    const profile = await this.colleges.resolveProfile(req.user.userId);
    return this.prisma.collegeProfile.update({
      where: { id: profile.id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.code !== undefined ? { code: body.code } : {}),
        ...(body.city !== undefined ? { city: body.city } : {}),
        ...(body.state !== undefined ? { state: body.state } : {}),
        ...(body.type !== undefined ? { type: body.type } : {}),
        ...(body.website !== undefined ? { website: body.website } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.logoUrl !== undefined ? { logoUrl: body.logoUrl } : {}),
      },
    });
  }

  @Get('me/applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COLLEGE', 'ADMIN')
  async applications(@Req() req: any) {
    const { collegeId } = await this.colleges.requireCollegeId(req.user.userId);
    return this.prisma.collegeApplication.findMany({
      where: { collegeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Patch('me/applications/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COLLEGE', 'ADMIN')
  async updateApplication(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status: string; notes?: string },
  ) {
    const { collegeId } = await this.colleges.requireCollegeId(req.user.userId);
    const app = await this.prisma.collegeApplication.findFirst({ where: { id, collegeId } });
    if (!app) return { error: 'Application not found' };
    return this.prisma.collegeApplication.update({
      where: { id },
      data: {
        status: body.status as any,
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
        decisionAt: new Date(),
      },
    });
  }

  @Get('me/departments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COLLEGE', 'ADMIN')
  async departments(@Req() req: any) {
    const { collegeId } = await this.colleges.requireCollegeId(req.user.userId);
    return this.prisma.department.findMany({
      where: { collegeId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  @Post('me/departments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COLLEGE', 'ADMIN')
  async createDepartment(
    @Req() req: any,
    @Body() body: { name: string; slug: string; headName?: string; description?: string },
  ) {
    const { collegeId } = await this.colleges.requireCollegeId(req.user.userId);
    return this.prisma.department.create({
      data: {
        collegeId,
        name: body.name,
        slug: body.slug,
        headName: body.headName,
        description: body.description,
      },
    });
  }

  @Get('me/courses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COLLEGE', 'ADMIN')
  async courses(@Req() req: any) {
    const { collegeId } = await this.colleges.requireCollegeId(req.user.userId);
    return this.prisma.collegeCourse.findMany({
      where: { collegeId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  @Post('me/courses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COLLEGE', 'ADMIN')
  async createCourse(
    @Req() req: any,
    @Body()
    body: {
      name: string;
      slug: string;
      degree: string;
      departmentId?: string;
      duration?: string;
      fees?: number;
      seats?: number;
      eligibility?: string;
      description?: string;
    },
  ) {
    const { collegeId } = await this.colleges.requireCollegeId(req.user.userId);
    return this.prisma.collegeCourse.create({
      data: {
        collegeId,
        name: body.name,
        slug: body.slug,
        degree: body.degree,
        departmentId: body.departmentId,
        duration: body.duration,
        fees: body.fees,
        seats: body.seats ?? 0,
        eligibility: body.eligibility,
        description: body.description,
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'COLLEGE', 'TRAINING')
  @Patch(':id')
  async updateCollege(@Param('id') id: string, @Body() body: any) {
    const existing = await this.prisma.college.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('College not found');
    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = String(body.name).trim();
    if (body.code !== undefined) data.code = body.code || null;
    if (body.type !== undefined) data.type = body.type || null;
    if (body.city !== undefined) data.city = body.city || null;
    if (body.state !== undefined) data.state = body.state || null;
    if (body.website !== undefined) data.website = body.website || null;
    if (body.description !== undefined) data.description = body.description || null;
    if (body.logoUrl !== undefined) data.logoUrl = body.logoUrl || null;
    if (body.isVerified !== undefined) data.isVerified = Boolean(body.isVerified);
    await this.prisma.college.update({ where: { id }, data });
    if (body.nirfRank !== undefined && body.nirfRank !== '') {
      const year = new Date().getFullYear();
      await this.prisma.collegeRanking.upsert({
        where: {
          collegeId_source_year_category: {
            collegeId: id,
            source: 'NIRF',
            year,
            category: body.nirfCategory || 'Overall',
          },
        },
        create: {
          collegeId: id,
          source: 'NIRF',
          rank: Number(body.nirfRank),
          year,
          category: body.nirfCategory || 'Overall',
        },
        update: { rank: Number(body.nirfRank) },
      });
    }
    return this.prisma.college.findUnique({
      where: { id },
      include: { rankings: { orderBy: [{ year: 'desc' }, { rank: 'asc' }], take: 3 } },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'COLLEGE', 'TRAINING')
  @Delete(':id')
  async removeCollege(@Param('id') id: string) {
    const existing = await this.prisma.college.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('College not found');
    await this.prisma.college.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true, id };
  }

  @Get(':id')
  one(@Param('id') id: string) {
    return this.prisma.college.findUnique({
      where: { id },
      include: {
        departments: true,
        courses: { where: { isActive: true } },
        rankings: { orderBy: { year: 'desc' }, take: 5 },
      },
    });
  }
}
