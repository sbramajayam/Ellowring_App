import { Controller, Get, Param, Post, UseGuards, Req, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('coaching')
export class CoachingController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query('examType') examType?: string) {
    return this.prisma.coachingModule.findMany({
      where: { isPublished: true, ...(examType ? { examType } : {}) },
      include: { partner: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  one(@Param('id') id: string) {
    return this.prisma.coachingModule.findUnique({
      where: { id },
      include: { partner: true },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/enroll')
  async enroll(@Param('id') id: string, @Req() req: any) {
    const student = await this.prisma.student.findUnique({ where: { userId: req.user.userId } });
    if (!student) return { error: 'Student profile required' };
    return this.prisma.coachingEnrollment.upsert({
      where: { studentId_coachingId: { studentId: student.id, coachingId: id } },
      update: {},
      create: { studentId: student.id, coachingId: id },
    });
  }
}
