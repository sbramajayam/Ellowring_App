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
      const [courses, coaching, jobApps, internApps, wallet, notifs] = await Promise.all([
        student
          ? this.prisma.courseEnrollment.count({ where: { studentId: student.id } })
          : 0,
        student
          ? this.prisma.coachingEnrollment.count({ where: { studentId: student.id } })
          : 0,
        this.prisma.jobApplication.count({ where: { userId } }),
        this.prisma.internshipApplication.count({ where: { userId } }),
        student
          ? this.prisma.wallet.findUnique({ where: { studentId: student.id } })
          : null,
        this.prisma.notification.count({ where: { userId, isRead: false } }),
      ]);
      return {
        role,
        stats: [
          { label: 'Courses', value: courses },
          { label: 'Coaching', value: coaching },
          { label: 'Applications', value: jobApps + internApps },
          { label: 'Wallet', value: `₹${wallet?.balance ?? 0}` },
        ],
        unread: notifs,
      };
    }

    if (role === 'COMPANY') {
      const company = await this.prisma.company.findUnique({ where: { userId } });
      const [jobs, internships, projects, jobApps, internApps] = await Promise.all([
        company ? this.prisma.job.count({ where: { companyId: company.id } }) : 0,
        company ? this.prisma.internship.count({ where: { companyId: company.id } }) : 0,
        company ? this.prisma.project.count({ where: { companyId: company.id } }) : 0,
        company
          ? this.prisma.jobApplication.count({ where: { job: { companyId: company.id } } })
          : 0,
        company
          ? this.prisma.internshipApplication.count({
              where: { internship: { companyId: company.id } },
            })
          : 0,
      ]);
      return {
        role,
        stats: [
          { label: 'Jobs', value: jobs },
          { label: 'Internships', value: internships },
          { label: 'Projects', value: projects },
          { label: 'Applicants', value: jobApps + internApps },
        ],
      };
    }

    if (role === 'COLLEGE') {
      const profile = await this.prisma.collegeProfile.findUnique({ where: { userId } });
      const programmes = profile?.collegeId
        ? await this.prisma.collegeCourse.count({
            where: { collegeId: profile.collegeId, isActive: true },
          })
        : await this.prisma.collegeApplication.count({
            where: profile?.collegeId ? { collegeId: profile.collegeId } : { userId },
          });
      return {
        role,
        stats: [
          { label: 'Open Programs', value: programmes },
          { label: 'Verified', value: profile?.verified ? 'Yes' : 'Pending' },
        ],
      };
    }

    if (role === 'TRAINING') {
      const center = await this.prisma.trainingCenter.findUnique({ where: { userId } });
      const [courses, programs, trainers] = await Promise.all([
        center ? this.prisma.course.count({ where: { trainingCenterId: center.id } }) : 0,
        center ? this.prisma.trainingProgram.count({ where: { trainingCenterId: center.id } }) : 0,
        center ? this.prisma.trainer.count({ where: { trainingCenterId: center.id } }) : 0,
      ]);
      return {
        role,
        stats: [
          { label: 'Courses', value: courses },
          { label: 'Programs', value: programs },
          { label: 'Trainers', value: trainers },
          { label: 'MTD Revenue', value: '₹4.8L' },
        ],
        phase: 2,
      };
    }

    if (role === 'PARTNER') {
      const partner = await this.prisma.partner.findUnique({
        where: { userId },
        include: { wallet: true },
      });
      return {
        role,
        stats: [
          { label: 'Referral Code', value: partner?.referralCode || '-' },
          { label: 'Commission %', value: `${partner?.commissionPct ?? 0}%` },
          { label: 'Wallet', value: `₹${partner?.wallet?.balance ?? 0}` },
          { label: 'Tier', value: 'Silver' },
        ],
        phase: 2,
      };
    }

    const [users, jobs, courses, jobApps, internApps] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.job.count(),
      this.prisma.course.count(),
      this.prisma.jobApplication.count(),
      this.prisma.internshipApplication.count(),
    ]);
    return {
      role: 'ADMIN',
      stats: [
        { label: 'Users', value: users },
        { label: 'Jobs', value: jobs },
        { label: 'Courses', value: courses },
        { label: 'Applications', value: jobApps + internApps },
      ],
    };
  }
}
