import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private prisma: PrismaService) {}

  @Get('dashboard')
  async dashboard(@Req() req: any) {
    const role = req.user.role as string;
    const userId = req.user.userId as string;

    if (role === 'STUDENT') {
      const student = await this.prisma.student.findUnique({ where: { userId } });
      const [courses, apps] = await Promise.all([
        student
          ? this.prisma.courseEnrollment.count({ where: { studentId: student.id } })
          : 0,
        this.prisma.jobApplication.count({ where: { userId } }),
      ]);
      return { role, courses, applications: apps };
    }

    if (role === 'PARTNER') {
      const partner = await this.prisma.partner.findUnique({ where: { userId } });
      const [leads, referrals] = await Promise.all([
        partner ? this.prisma.partnerLead.count({ where: { partnerId: partner.id } }) : 0,
        partner ? this.prisma.referral.count({ where: { partnerId: partner.id } }) : 0,
      ]);
      return { role, leads, referrals };
    }

    if (role === 'COMPANY') {
      const company = await this.prisma.company.findUnique({ where: { userId } });
      const jobs = company ? await this.prisma.job.count({ where: { companyId: company.id } }) : 0;
      return { role, jobs };
    }

    const [users, students, courses, payments] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.student.count(),
      this.prisma.course.count(),
      this.prisma.payment.count({ where: { status: 'SUCCESS' } }),
    ]);
    return { role, users, students, courses, successfulPayments: payments };
  }

  @Get('revenue')
  async revenue() {
    const agg = await this.prisma.payment.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true },
      _count: true,
    });
    return {
      total: agg._sum.amount ?? 0,
      count: agg._count,
    };
  }

  @Get('students')
  students() {
    return this.prisma.student.count().then((count) => ({ count }));
  }

  @Get('placements')
  async placements() {
    const [jobs, internships] = await Promise.all([
      this.prisma.jobOffer.count({ where: { status: 'ACCEPTED' } }),
      this.prisma.internshipOffer.count({ where: { status: 'ACCEPTED' } }),
    ]);
    return { count: jobs + internships, jobOffers: jobs, internshipOffers: internships };
  }

  @Get('courses')
  courses() {
    return this.prisma.course.count().then((count) => ({ count }));
  }

  @Get('partners')
  partners() {
    return this.prisma.partner.count().then((count) => ({ count }));
  }

  @Get('companies')
  companies() {
    return this.prisma.company.count().then((count) => ({ count }));
  }
}
