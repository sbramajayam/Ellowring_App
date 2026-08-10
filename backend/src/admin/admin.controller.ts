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
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get('overview')
  async overview() {
    const [
      users,
      students,
      colleges,
      companies,
      training,
      partners,
      courses,
      coaching,
      payments,
      tickets,
      activeUsers,
    ] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.user.count({ where: { role: 'STUDENT', deletedAt: null } }),
      this.prisma.user.count({ where: { role: 'COLLEGE', deletedAt: null } }),
      this.prisma.user.count({ where: { role: 'COMPANY', deletedAt: null } }),
      this.prisma.user.count({ where: { role: 'TRAINING', deletedAt: null } }),
      this.prisma.user.count({ where: { role: 'PARTNER', deletedAt: null } }),
      this.prisma.course.count({ where: { deletedAt: null } }),
      this.prisma.coachingProgram.count({ where: { deletedAt: null } }),
      this.prisma.payment.aggregate({ _sum: { amount: true }, _count: true }),
      this.prisma.supportTicket.count({
        where: { status: { in: ['OPEN', 'IN_PROGRESS'] } },
      }),
      this.prisma.user.count({ where: { deletedAt: null, isActive: true } }),
    ]);

    const collegeProfiles = await this.prisma.college.count({ where: { deletedAt: null } });
    const recentUsers = await this.prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    const topCourses = await this.prisma.course.findMany({
      where: { deletedAt: null, isPublished: true },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
        _count: { select: { enrollments: true } },
      },
    });

    return {
      users,
      activeUsers,
      students,
      colleges,
      collegeProfiles,
      companies,
      training,
      partners,
      courses,
      coaching,
      revenue: payments._sum.amount || 0,
      transactions: payments._count || 0,
      openTickets: tickets,
      recentUsers,
      topCourses: topCourses.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category?.name || 'General',
        enrollments: c._count.enrollments,
        price: c.price,
        isPublished: c.isPublished,
      })),
    };
  }

  @Get('users')
  users(@Query('role') role?: string, @Query('q') q?: string) {
    const roleFilter =
      role && Object.values(Role).includes(role as Role) ? (role as Role) : undefined;
    return this.prisma.user.findMany({
      where: {
        deletedAt: null,
        ...(roleFilter ? { role: roleFilter } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q } },
                { email: { contains: q } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        isVerified: true,
        lastLoginAt: true,
        createdAt: true,
        student: { select: { id: true, grade: true, stream: true, city: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  @Get('students')
  students(@Query('q') q?: string) {
    return this.prisma.student.findMany({
      where: {
        deletedAt: null,
        ...(q
          ? {
              OR: [
                { user: { name: { contains: q } } },
                { user: { email: { contains: q } } },
                { city: { contains: q } },
              ],
            }
          : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isActive: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  @Post('users')
  async createUser(
    @Body()
    body: {
      name: string;
      email: string;
      password?: string;
      role?: string;
      phone?: string;
      isActive?: boolean;
    },
  ) {
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    if (!name || !email) throw new BadRequestException('Name and email required');
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new BadRequestException('Email already registered');

    const role =
      body.role && Object.values(Role).includes(body.role as Role)
        ? (body.role as Role)
        : Role.STUDENT;
    const password = body.password?.trim() || 'Ellowring@123';
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        phone: body.phone || null,
        passwordHash,
        role,
        isActive: body.isActive === undefined ? true : Boolean(body.isActive),
        isVerified: true,
        ...(role === Role.STUDENT
          ? {
              student: {
                create: { country: 'IN' },
              },
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
    return { ...user, temporaryPassword: body.password ? undefined : password };
  }

  @Patch('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      phone?: string;
      role?: string;
      isActive?: boolean;
      isVerified?: boolean;
      password?: string;
    },
  ) {
    const existing = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('User not found');

    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = String(body.name).trim();
    if (body.phone !== undefined) data.phone = body.phone || null;
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);
    if (body.isVerified !== undefined) data.isVerified = Boolean(body.isVerified);
    if (body.role !== undefined && Object.values(Role).includes(body.role as Role)) {
      data.role = body.role as Role;
    }
    if (body.password?.trim()) {
      data.passwordHash = await bcrypt.hash(body.password.trim(), 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
      },
    });
  }

  @Delete('users/:id')
  async removeUser(@Param('id') id: string) {
    const existing = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('User not found');
    if (existing.role === Role.ADMIN) {
      const adminCount = await this.prisma.user.count({
        where: { role: Role.ADMIN, deletedAt: null, isActive: true },
      });
      if (adminCount <= 1) throw new BadRequestException('Cannot deactivate the last admin');
    }
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return { success: true, id };
  }

  @Get('settings')
  settings() {
    return this.prisma.setting.findMany({ orderBy: { key: 'asc' } });
  }

  @Put('settings/:key')
  upsertSetting(
    @Param('key') key: string,
    @Body() body: { value: string; description?: string },
  ) {
    return this.prisma.setting.upsert({
      where: { key },
      update: {
        value: body.value,
        ...(body.description !== undefined ? { description: body.description } : {}),
      },
      create: {
        key,
        value: body.value,
        description: body.description,
      },
    });
  }

  @Get('announcements')
  announcements() {
    return this.prisma.announcement.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post('announcements')
  createAnnouncement(
    @Body()
    body: {
      title: string;
      content: string;
      targetRole?: string;
      isPublished?: boolean;
      startsAt?: string;
      endsAt?: string;
    },
  ) {
    return this.prisma.announcement.create({
      data: {
        title: body.title,
        content: body.content,
        targetRole: body.targetRole as any,
        isPublished: body.isPublished ?? true,
        startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
        endsAt: body.endsAt ? new Date(body.endsAt) : undefined,
      },
    });
  }

  @Get('banners')
  banners() {
    return this.prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  @Post('banners')
  createBanner(
    @Body()
    body: {
      title: string;
      imageUrl: string;
      linkUrl?: string;
      sortOrder?: number;
      isActive?: boolean;
      startsAt?: string;
      endsAt?: string;
    },
  ) {
    return this.prisma.banner.create({
      data: {
        title: body.title,
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl,
        sortOrder: body.sortOrder ?? 0,
        isActive: body.isActive ?? true,
        startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
        endsAt: body.endsAt ? new Date(body.endsAt) : undefined,
      },
    });
  }

  @Get('support-tickets')
  supportTickets() {
    return this.prisma.supportTicket.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });
  }

  @Patch('support-tickets/:id')
  updateTicket(
    @Param('id') id: string,
    @Body()
    body: { status?: string; priority?: string; assigneeId?: string; category?: string },
  ) {
    return this.prisma.supportTicket.update({
      where: { id },
      data: {
        ...(body.status !== undefined ? { status: body.status as any } : {}),
        ...(body.priority !== undefined ? { priority: body.priority as any } : {}),
        ...(body.assigneeId !== undefined ? { assigneeId: body.assigneeId } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.status === 'RESOLVED' || body.status === 'CLOSED'
          ? { resolvedAt: new Date() }
          : {}),
      },
    });
  }
}
