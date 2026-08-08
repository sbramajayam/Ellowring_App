import { Body, Controller, Get, Post, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async mine(@Req() req: any) {
    const userId = req.user.userId as string;
    const [jobApplications, internshipApplications] = await Promise.all([
      this.prisma.jobApplication.findMany({
        where: { userId },
        include: { job: { include: { company: { select: { name: true } } } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.internshipApplication.findMany({
        where: { userId },
        include: { internship: { include: { company: { select: { name: true } } } } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { jobApplications, internshipApplications };
  }

  @Post()
  async create(
    @Req() req: any,
    @Body()
    body: {
      jobId?: string;
      internshipId?: string;
      projectId?: string;
      coverLetter?: string;
      resumeUrl?: string;
    },
  ) {
    const userId = req.user.userId as string;

    if (body.jobId) {
      return this.prisma.jobApplication.create({
        data: {
          userId,
          jobId: body.jobId,
          coverLetter: body.coverLetter,
          resumeUrl: body.resumeUrl,
        },
      });
    }

    if (body.internshipId) {
      const student = await this.prisma.student.findUnique({ where: { userId } });
      if (!student) throw new BadRequestException('Student profile required');
      return this.prisma.internshipApplication.create({
        data: {
          userId,
          studentId: student.id,
          internshipId: body.internshipId,
          coverLetter: body.coverLetter,
          resumeUrl: body.resumeUrl,
        },
      });
    }

    if (body.projectId) {
      const student = await this.prisma.student.findUnique({ where: { userId } });
      if (!student) throw new BadRequestException('Student profile required');
      return this.prisma.projectTeamMember.create({
        data: {
          projectId: body.projectId,
          studentId: student.id,
          role: 'APPLICANT',
        },
      });
    }

    throw new BadRequestException('jobId, internshipId, or projectId is required');
  }
}
