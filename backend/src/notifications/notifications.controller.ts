import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(
    @Req() req: any,
    @Query('filter') filter?: string,
  ) {
    const f = (filter || 'all').toLowerCase();
    return this.prisma.notification.findMany({
      where: {
        userId: req.user.userId,
        ...(f === 'unread' ? { isRead: false } : {}),
        ...(f === 'important'
          ? { type: { in: [NotificationType.WARNING, NotificationType.ALERT, NotificationType.SUCCESS] } }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  @Post()
  create(
    @Req() req: any,
    @Body()
    body: { title: string; message: string; type?: string; link?: string },
  ) {
    const type =
      body.type && Object.values(NotificationType).includes(body.type as NotificationType)
        ? (body.type as NotificationType)
        : NotificationType.INFO;
    return this.prisma.notification.create({
      data: {
        userId: req.user.userId,
        title: String(body.title || 'Notification').trim(),
        message: String(body.message || '').trim(),
        type,
        link: body.link || null,
      },
    });
  }

  @Patch('read-all')
  async markAllRead(@Req() req: any) {
    const result = await this.prisma.notification.updateMany({
      where: { userId: req.user.userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return { success: true, count: result.count };
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @Req() req: any) {
    return this.prisma.notification.updateMany({
      where: { id, userId: req.user.userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    await this.prisma.notification.deleteMany({
      where: { id, userId: req.user.userId },
    });
    return { success: true, id };
  }
}
