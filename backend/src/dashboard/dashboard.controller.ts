import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async summary(@Req() req: any) {
    const role = req.user.role as string;
    const userId = req.user.userId as string;

    if (role === 'STUDENT') {
      const student = await this.prisma.student.findUnique({ where: { userId } });
      const [courses, coaching, apps, wallet, notifs] = await Promise.all([
        student
          ? this.prisma.enrollment.count({ where: { studentId: student.id } })
          : 0,
        student
          ? this.prisma.coachingEnrollment.count({ where: { studentId: student.id } })
          : 0,
        this.prisma.application.count({ where: { userId } }),
        this.prisma.wallet.findUnique({ where: { userId } }),
        this.prisma.notification.count({ where: { userId, isRead: false } }),
      ]);
      return {
        role,
        stats: [
          { label: 'Courses', value: courses },
          { label: 'Coaching', value: coaching },
          { label: 'Applications', value: apps },
          { label: 'Wallet', value: `₹${wallet?.balance ?? 0}` },
        ],
        unread: notifs,
      };
    }

    if (role === 'COMPANY') {
      const company = await this.prisma.company.findUnique({ where: { userId } });
      const [jobs, internships, projects, apps] = await Promise.all([
        company ? this.prisma.job.count({ where: { companyId: company.id } }) : 0,
        company ? this.prisma.internship.count({ where: { companyId: company.id } }) : 0,
        company ? this.prisma.liveProject.count({ where: { companyId: company.id } }) : 0,
        company
          ? this.prisma.application.count({
              where: {
                OR: [
                  { job: { companyId: company.id } },
                  { internship: { companyId: company.id } },
                  { project: { companyId: company.id } },
                ],
              },
            })
          : 0,
      ]);
      return {
        role,
        stats: [
          { label: 'Jobs', value: jobs },
          { label: 'Internships', value: internships },
          { label: 'Projects', value: projects },
          { label: 'Applicants', value: apps },
        ],
      };
    }

    if (role === 'COLLEGE') {
      const college = await this.prisma.college.findUnique({ where: { userId } });
      const admissions = college
        ? await this.prisma.admission.count({ where: { collegeId: college.id } })
        : 0;
      return {
        role,
        stats: [
          { label: 'Open Programs', value: admissions },
          { label: 'Verified', value: college?.verified ? 'Yes' : 'Pending' },
        ],
      };
    }

    if (role === 'TRAINING') {
      const partner = await this.prisma.trainingPartner.findUnique({ where: { userId } });
      const [courses, coaching] = await Promise.all([
        partner ? this.prisma.course.count({ where: { partnerId: partner.id } }) : 0,
        partner ? this.prisma.coachingModule.count({ where: { partnerId: partner.id } }) : 0,
      ]);
      return {
        role,
        stats: [
          { label: 'Courses', value: courses },
          { label: 'Coaching Batches', value: coaching },
          { label: 'Trainers', value: 12 },
          { label: 'MTD Revenue', value: '₹4.8L' },
        ],
        phase: 2,
      };
    }

    if (role === 'PARTNER') {
      const partner = await this.prisma.channelPartner.findUnique({ where: { userId } });
      const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
      return {
        role,
        stats: [
          { label: 'Referral Code', value: partner?.referralCode || '-' },
          { label: 'Commission %', value: `${partner?.commissionPct ?? 0}%` },
          { label: 'Wallet', value: `₹${wallet?.balance ?? 0}` },
          { label: 'Tier', value: 'Silver' },
        ],
        phase: 2,
      };
    }

    const [users, jobs, courses, apps] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.job.count(),
      this.prisma.course.count(),
      this.prisma.application.count(),
    ]);
    return {
      role: 'ADMIN',
      stats: [
        { label: 'Users', value: users },
        { label: 'Jobs', value: jobs },
        { label: 'Courses', value: courses },
        { label: 'Applications', value: apps },
      ],
    };
  }
}
