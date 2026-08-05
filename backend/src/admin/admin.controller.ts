import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
