import { Controller, Get, Param, Post, UseGuards, Req, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('courses')
export class CoursesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query('category') category?: string) {
    return this.prisma.course.findMany({
      where: {
        isPublished: true,
        ...(category
          ? {
              category: {
                OR: [{ slug: category }, { name: category }],
              },
            }
          : {}),
      },
      include: {
        category: { select: { name: true, slug: true } },
        trainingCenter: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':slug')
  one(@Param('slug') slug: string) {
    return this.prisma.course.findUnique({
      where: { slug },
      include: {
        category: true,
        trainingCenter: { select: { name: true, specialty: true } },
        modules: { include: { lessons: true }, orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/enroll')
  async enroll(@Param('id') id: string, @Req() req: any) {
    const student = await this.prisma.student.findUnique({ where: { userId: req.user.userId } });
    if (!student) return { error: 'Student profile required' };
    return this.prisma.courseEnrollment.upsert({
      where: { studentId_courseId: { studentId: student.id, courseId: id } },
      update: {},
      create: { studentId: student.id, courseId: id, progressPct: 0 },
    });
  }
}
