import { Controller, Get, Param, Post, UseGuards, Req, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('coaching')
export class CoachingController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query('examType') examType?: string) {
    return this.prisma.coachingProgram.findMany({
      where: { isPublished: true, ...(examType ? { examType } : {}) },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('mock-tests')
  mockTests() {
    return this.prisma.mockTest.findMany({
      where: { isPublished: true, deletedAt: null },
      include: { program: { select: { title: true, examType: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  @Get(':id')
  one(@Param('id') id: string) {
    return this.prisma.coachingProgram.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { category: true, subjects: true },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/enroll')
  async enroll(@Param('id') id: string, @Req() req: any) {
    const student = await this.prisma.student.findUnique({ where: { userId: req.user.userId } });
    if (!student) return { error: 'Student profile required' };
    const program = await this.prisma.coachingProgram.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });
    if (!program) return { error: 'Program not found' };
    return this.prisma.coachingEnrollment.upsert({
      where: { studentId_programId: { studentId: student.id, programId: program.id } },
      update: {},
      create: { studentId: student.id, programId: program.id },
    });
  }
}
