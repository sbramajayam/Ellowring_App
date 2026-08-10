import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

function slugify(input: string) {
  return String(input || 'course')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

@Controller('courses')
export class CoursesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query('category') category?: string, @Query('all') all?: string) {
    const includeAll = all === '1' || all === 'true';
    return this.prisma.course.findMany({
      where: {
        deletedAt: null,
        ...(includeAll ? {} : { isPublished: true }),
        ...(category
          ? {
              category: {
                OR: [{ slug: category }, { name: category }],
              },
            }
          : {}),
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        trainingCenter: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** List categories for form dropdowns */
  @Get('meta/categories')
  categories() {
    return this.prisma.courseCategory.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, slug: true },
    });
  }

  /** Study materials (course downloads) */
  @Get('materials')
  materials(@Query('courseId') courseId?: string) {
    return this.prisma.courseDownload.findMany({
      where: {
        deletedAt: null,
        ...(courseId ? { courseId } : {}),
      },
      include: {
        course: { select: { id: true, title: true, slug: true } },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRAINING')
  @Post('materials')
  async createMaterial(@Body() body: any) {
    const title = String(body.title || '').trim();
    const fileUrl = String(body.fileUrl || '').trim();
    let courseId = body.courseId as string | undefined;
    if (!title || !fileUrl) throw new BadRequestException('Title and file URL are required');
    if (!courseId) {
      const course = await this.prisma.course.findFirst({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
      });
      if (!course) throw new BadRequestException('Create a course first, then add study material');
      courseId = course.id;
    }
    return this.prisma.courseDownload.create({
      data: {
        courseId: courseId!,
        title,
        fileUrl,
        fileSize: body.fileSize ? Number(body.fileSize) : null,
        sortOrder: body.sortOrder ? Number(body.sortOrder) : 0,
      },
      include: { course: { select: { id: true, title: true } } },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRAINING')
  @Patch('materials/:id')
  async updateMaterial(@Param('id') id: string, @Body() body: any) {
    const existing = await this.prisma.courseDownload.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Material not found');
    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = String(body.title).trim();
    if (body.fileUrl !== undefined) data.fileUrl = String(body.fileUrl).trim();
    if (body.courseId !== undefined) data.courseId = String(body.courseId);
    if (body.fileSize !== undefined) data.fileSize = body.fileSize ? Number(body.fileSize) : null;
    if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder) || 0;
    return this.prisma.courseDownload.update({
      where: { id },
      data,
      include: { course: { select: { id: true, title: true } } },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRAINING')
  @Delete('materials/:id')
  async removeMaterial(@Param('id') id: string) {
    const existing = await this.prisma.courseDownload.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Material not found');
    await this.prisma.courseDownload.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { success: true, id };
  }

  @Get(':slug')
  async one(@Param('slug') slug: string) {
    const course = await this.prisma.course.findFirst({
      where: {
        deletedAt: null,
        OR: [{ slug }, { id: slug }],
      },
      include: {
        category: true,
        trainingCenter: { select: { name: true, specialty: true } },
        modules: { include: { lessons: true }, orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRAINING')
  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const title = String(body.title || '').trim();
    if (!title) throw new BadRequestException('Title is required');

    let categoryId = body.categoryId as string | undefined;
    if (!categoryId) {
      const fallback = await this.prisma.courseCategory.findFirst({
        where: { deletedAt: null, isActive: true },
        orderBy: { sortOrder: 'asc' },
      });
      if (fallback) {
        categoryId = fallback.id;
      } else {
        const created = await this.prisma.courseCategory.create({
          data: {
            name: 'General',
            slug: `general-${Date.now().toString(36)}`,
            description: 'Auto-created category',
          },
        });
        categoryId = created.id;
      }
    }

    const base = slugify(body.slug || title);
    const slug = `${base || 'course'}-${Date.now().toString(36)}`;

    return this.prisma.course.create({
      data: {
        title,
        slug,
        categoryId: categoryId!,
        level: String(body.level || 'Beginner'),
        duration: body.duration ? String(body.duration) : null,
        price: body.price !== undefined && body.price !== '' ? Number(body.price) : 0,
        currency: String(body.currency || 'INR'),
        description: body.description ? String(body.description) : null,
        thumbnail: body.thumbnail ? String(body.thumbnail) : null,
        isPublished: body.isPublished === undefined ? true : Boolean(body.isPublished),
        createdById: req.user?.userId || null,
        updatedById: req.user?.userId || null,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRAINING')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    const existing = await this.prisma.course.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Course not found');

    const data: Record<string, unknown> = {
      updatedById: req.user?.userId || null,
    };

    if (body.title !== undefined) data.title = String(body.title).trim();
    if (body.level !== undefined) data.level = String(body.level);
    if (body.duration !== undefined) data.duration = body.duration ? String(body.duration) : null;
    if (body.price !== undefined) data.price = Number(body.price) || 0;
    if (body.currency !== undefined) data.currency = String(body.currency || 'INR');
    if (body.description !== undefined) data.description = body.description ? String(body.description) : null;
    if (body.thumbnail !== undefined) data.thumbnail = body.thumbnail ? String(body.thumbnail) : null;
    if (body.isPublished !== undefined) data.isPublished = Boolean(body.isPublished);
    if (body.categoryId !== undefined) data.categoryId = String(body.categoryId);
    if (body.slug !== undefined && String(body.slug).trim()) {
      data.slug = slugify(body.slug);
    }

    return this.prisma.course.update({
      where: { id },
      data,
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRAINING')
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const existing = await this.prisma.course.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Course not found');

    await this.prisma.course.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isPublished: false,
        updatedById: req.user?.userId || null,
      },
    });
    return { success: true, id };
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
