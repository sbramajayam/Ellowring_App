import {
  Body,
  Controller,
  Get,
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
      orderBy: { name: 'asc' },
      take: 100,
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
