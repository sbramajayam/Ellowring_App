import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get('users')
  users() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('overview')
  async overview() {
    const [students, colleges, companies, training, partners, payments] = await Promise.all([
      this.prisma.user.count({ where: { role: 'STUDENT' } }),
      this.prisma.user.count({ where: { role: 'COLLEGE' } }),
      this.prisma.user.count({ where: { role: 'COMPANY' } }),
      this.prisma.user.count({ where: { role: 'TRAINING' } }),
      this.prisma.user.count({ where: { role: 'PARTNER' } }),
      this.prisma.payment.aggregate({ _sum: { amount: true } }),
    ]);
    return {
      students,
      colleges,
      companies,
      training,
      partners,
      revenue: payments._sum.amount || 0,
    };
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
    return this.prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } });
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
