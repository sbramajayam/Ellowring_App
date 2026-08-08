import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async resolveStudent(userId: string) {
    const student = await this.prisma.student.findUnique({ where: { userId } });
    if (!student) throw new NotFoundException('Student profile not found');
    return student;
  }

  async dashboard(userId: string) {
    const student = await this.resolveStudent(userId);
    const [courses, certificates, bookmarks, favorites, unread, jobApps, internApps, wallet] =
      await Promise.all([
        this.prisma.courseEnrollment.count({ where: { studentId: student.id } }),
        this.prisma.certificate.count({ where: { studentId: student.id } }),
        this.prisma.bookmark.count({ where: { studentId: student.id } }),
        this.prisma.favorite.count({ where: { studentId: student.id } }),
        this.prisma.notification.count({ where: { userId, isRead: false } }),
        this.prisma.jobApplication.count({ where: { userId } }),
        this.prisma.internshipApplication.count({ where: { userId } }),
        this.prisma.wallet.findUnique({ where: { studentId: student.id } }),
      ]);
    return {
      courses,
      certificates,
      bookmarks,
      favorites,
      unreadNotifications: unread,
      applications: jobApps + internApps,
      walletBalance: wallet?.balance ?? 0,
    };
  }
}
