import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  mine(@Req() req: any) {
    return this.prisma.application.findMany({
      where: { userId: req.user.userId },
      include: {
        job: { include: { company: { select: { name: true } } } },
        internship: { include: { company: { select: { name: true } } } },
        project: { include: { company: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  create(
    @Req() req: any,
    @Body() body: { jobId?: string; internshipId?: string; projectId?: string; coverLetter?: string },
  ) {
    return this.prisma.application.create({
      data: {
        userId: req.user.userId,
        jobId: body.jobId,
        internshipId: body.internshipId,
        projectId: body.projectId,
        coverLetter: body.coverLetter,
      },
    });
  }
}
