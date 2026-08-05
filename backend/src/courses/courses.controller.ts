import { Controller, Get, Param, Post, Body, UseGuards, Req, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('courses')
export class CoursesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query('category') category?: string) {
    return this.prisma.course.findMany({
      where: { isPublished: true, ...(category ? { category } : {}) },
      include: { partner: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':slug')
  one(@Param('slug') slug: string) {
    return this.prisma.course.findUnique({
      where: { slug },
      include: { partner: { select: { name: true, specialty: true } } },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/enroll')
  async enroll(@Param('id') id: string, @Req() req: any) {
    const student = await this.prisma.student.findUnique({ where: { userId: req.user.userId } });
    if (!student) return { error: 'Student profile required' };
    return this.prisma.enrollment.upsert({
      where: { studentId_courseId: { studentId: student.id, courseId: id } },
      update: {},
      create: { studentId: student.id, courseId: id },
    });
  }
}
