import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StudentsService } from './students.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(
    private students: StudentsService,
    private prisma: PrismaService,
  ) {}

  @Get('me/dashboard')
  dashboard(@Req() req: any) {
    return this.students.dashboard(req.user.userId);
  }

  @Get('me')
  async me(@Req() req: any) {
    const student = await this.students.resolveStudent(req.user.userId);
    return this.prisma.student.findUnique({
      where: { id: student.id },
      include: { user: { select: { id: true, name: true, email: true, phone: true, avatarUrl: true } } },
    });
  }

  @Patch('me')
  async updateMe(
    @Req() req: any,
    @Body()
    body: {
      dateOfBirth?: string;
      gender?: string;
      grade?: string;
      stream?: string;
      city?: string;
      state?: string;
      country?: string;
      bio?: string;
      resumeUrl?: string;
      linkedinUrl?: string;
      githubUrl?: string;
    },
  ) {
    const student = await this.students.resolveStudent(req.user.userId);
    return this.prisma.student.update({
      where: { id: student.id },
      data: {
        ...(body.dateOfBirth !== undefined ? { dateOfBirth: new Date(body.dateOfBirth) } : {}),
        ...(body.gender !== undefined ? { gender: body.gender } : {}),
        ...(body.grade !== undefined ? { grade: body.grade } : {}),
        ...(body.stream !== undefined ? { stream: body.stream } : {}),
        ...(body.city !== undefined ? { city: body.city } : {}),
        ...(body.state !== undefined ? { state: body.state } : {}),
        ...(body.country !== undefined ? { country: body.country } : {}),
        ...(body.bio !== undefined ? { bio: body.bio } : {}),
        ...(body.resumeUrl !== undefined ? { resumeUrl: body.resumeUrl } : {}),
        ...(body.linkedinUrl !== undefined ? { linkedinUrl: body.linkedinUrl } : {}),
        ...(body.githubUrl !== undefined ? { githubUrl: body.githubUrl } : {}),
      },
    });
  }

  @Get('me/certificates')
  async certificates(@Req() req: any) {
    const student = await this.students.resolveStudent(req.user.userId);
    return this.prisma.certificate.findMany({
      where: { studentId: student.id },
      orderBy: { issuedAt: 'desc' },
    });
  }

  @Get('me/bookmarks')
  async bookmarks(@Req() req: any) {
    const student = await this.students.resolveStudent(req.user.userId);
    return this.prisma.bookmark.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post('me/bookmarks')
  async addBookmark(
    @Req() req: any,
    @Body() body: { entityType: string; entityId: string; notes?: string },
  ) {
    const student = await this.students.resolveStudent(req.user.userId);
    return this.prisma.bookmark.upsert({
      where: {
        studentId_entityType_entityId: {
          studentId: student.id,
          entityType: body.entityType as any,
          entityId: body.entityId,
        },
      },
      update: { notes: body.notes },
      create: {
        studentId: student.id,
        entityType: body.entityType as any,
        entityId: body.entityId,
        notes: body.notes,
      },
    });
  }

  @Delete('me/bookmarks/:id')
  async removeBookmark(@Req() req: any, @Param('id') id: string) {
    const student = await this.students.resolveStudent(req.user.userId);
    await this.prisma.bookmark.deleteMany({ where: { id, studentId: student.id } });
    return { deleted: true, id };
  }

  @Get('me/favorites')
  async favorites(@Req() req: any) {
    const student = await this.students.resolveStudent(req.user.userId);
    return this.prisma.favorite.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post('me/favorites')
  async addFavorite(
    @Req() req: any,
    @Body() body: { entityType: string; entityId: string },
  ) {
    const student = await this.students.resolveStudent(req.user.userId);
    return this.prisma.favorite.upsert({
      where: {
        studentId_entityType_entityId: {
          studentId: student.id,
          entityType: body.entityType as any,
          entityId: body.entityId,
        },
      },
      update: {},
      create: {
        studentId: student.id,
        entityType: body.entityType as any,
        entityId: body.entityId,
      },
    });
  }

  @Get('me/courses')
  async courses(@Req() req: any) {
    const student = await this.students.resolveStudent(req.user.userId);
    return this.prisma.courseEnrollment.findMany({
      where: { studentId: student.id },
      include: {
        course: {
          select: { id: true, title: true, slug: true, thumbnail: true },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  @Get('me/notifications')
  async notifications(@Req() req: any) {
    return this.prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
