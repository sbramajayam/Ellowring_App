import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

function slugify(input: string) {
  return String(input || 'program')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

@Controller('coaching')
export class CoachingController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(
    @Query('examType') examType?: string,
    @Query('track') track?: string,
    @Query('all') all?: string,
  ) {
    const includeAll = all === '1' || all === 'true';
    const t = (track || '').toLowerCase();

    let examFilter: Record<string, unknown> | undefined;
    if (examType) {
      examFilter = { examType: { equals: examType } };
    } else if (t === 'neet') {
      examFilter = { examType: { contains: 'NEET' } };
    } else if (t === 'jee') {
      examFilter = { examType: { contains: 'JEE' } };
    } else if (t === 'competitive') {
      examFilter = {
        AND: [
          { NOT: { examType: { contains: 'NEET' } } },
          { NOT: { examType: { contains: 'JEE' } } },
        ],
      };
    }

    return this.prisma.coachingProgram.findMany({
      where: {
        deletedAt: null,
        ...(includeAll ? {} : { isPublished: true }),
        ...examFilter,
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('meta/categories')
  categories() {
    return this.prisma.coachingCategory.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, slug: true },
    });
  }

  @Get('mock-tests')
  mockTests(@Query('track') track?: string, @Query('all') all?: string) {
    const t = (track || '').toLowerCase();
    const includeAll = all === '1' || all === 'true';
    let programFilter: Record<string, unknown> | undefined;
    if (t === 'neet') programFilter = { examType: { contains: 'NEET' } };
    else if (t === 'jee') programFilter = { examType: { contains: 'JEE' } };
    else if (t === 'competitive') {
      programFilter = {
        AND: [
          { NOT: { examType: { contains: 'NEET' } } },
          { NOT: { examType: { contains: 'JEE' } } },
        ],
      };
    }

    return this.prisma.mockTest.findMany({
      where: {
        deletedAt: null,
        ...(includeAll ? {} : { isPublished: true }),
        ...(programFilter ? { program: programFilter } : {}),
      },
      include: {
        program: { select: { title: true, examType: true } },
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRAINING')
  @Post('mock-tests')
  async createMock(@Body() body: any, @Req() req: any) {
    const title = String(body.title || '').trim();
    if (!title) throw new BadRequestException('Title is required');
    const slug = `${slugify(title)}-${Date.now().toString(36)}`;
    return this.prisma.mockTest.create({
      data: {
        title,
        slug,
        programId: body.programId || null,
        durationMin: Number(body.durationMin) || 60,
        totalMarks: Number(body.totalMarks) || 100,
        passingMarks: body.passingMarks !== undefined && body.passingMarks !== '' ? Number(body.passingMarks) : null,
        isPublished: body.isPublished === undefined ? true : Boolean(body.isPublished),
      },
      include: {
        program: { select: { title: true, examType: true } },
        _count: { select: { questions: true } },
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRAINING')
  @Patch('mock-tests/:id')
  async updateMock(@Param('id') id: string, @Body() body: any) {
    const existing = await this.prisma.mockTest.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Mock test not found');
    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = String(body.title).trim();
    if (body.durationMin !== undefined) data.durationMin = Number(body.durationMin) || 60;
    if (body.totalMarks !== undefined) data.totalMarks = Number(body.totalMarks) || 100;
    if (body.passingMarks !== undefined) {
      data.passingMarks = body.passingMarks !== '' && body.passingMarks != null ? Number(body.passingMarks) : null;
    }
    if (body.programId !== undefined) data.programId = body.programId || null;
    if (body.isPublished !== undefined) data.isPublished = Boolean(body.isPublished);
    return this.prisma.mockTest.update({
      where: { id },
      data,
      include: {
        program: { select: { title: true, examType: true } },
        _count: { select: { questions: true } },
      },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRAINING')
  @Delete('mock-tests/:id')
  async removeMock(@Param('id') id: string) {
    const existing = await this.prisma.mockTest.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Mock test not found');
    await this.prisma.mockTest.update({
      where: { id },
      data: { deletedAt: new Date(), isPublished: false },
    });
    return { success: true, id };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRAINING')
  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const title = String(body.title || '').trim();
    if (!title) throw new BadRequestException('Title is required');

    let categoryId = body.categoryId as string | undefined;
    if (!categoryId) {
      const fallback = await this.prisma.coachingCategory.findFirst({
        where: { deletedAt: null, isActive: true },
        orderBy: { sortOrder: 'asc' },
      });
      if (fallback) categoryId = fallback.id;
      else {
        const created = await this.prisma.coachingCategory.create({
          data: {
            name: 'Entrance Exams',
            slug: `entrance-${Date.now().toString(36)}`,
          },
        });
        categoryId = created.id;
      }
    }

    const slug = `${slugify(body.slug || title)}-${Date.now().toString(36)}`;
    return this.prisma.coachingProgram.create({
      data: {
        title,
        slug,
        categoryId: categoryId!,
        examType: String(body.examType || 'NEET'),
        description: body.description ? String(body.description) : null,
        price: body.price !== undefined && body.price !== '' ? Number(body.price) : 0,
        duration: body.duration ? String(body.duration) : null,
        batchSize: body.batchSize ? Number(body.batchSize) : null,
        thumbnail: body.thumbnail ? String(body.thumbnail).trim() : null,
        isPublished: body.isPublished === undefined ? true : Boolean(body.isPublished),
        createdById: req.user?.userId || null,
        updatedById: req.user?.userId || null,
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRAINING')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    const existing = await this.prisma.coachingProgram.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Program not found');

    const data: Record<string, unknown> = { updatedById: req.user?.userId || null };
    if (body.title !== undefined) data.title = String(body.title).trim();
    if (body.examType !== undefined) data.examType = String(body.examType);
    if (body.description !== undefined) data.description = body.description ? String(body.description) : null;
    if (body.price !== undefined) data.price = Number(body.price) || 0;
    if (body.duration !== undefined) data.duration = body.duration ? String(body.duration) : null;
    if (body.batchSize !== undefined) data.batchSize = body.batchSize ? Number(body.batchSize) : null;
    if (body.thumbnail !== undefined) data.thumbnail = body.thumbnail ? String(body.thumbnail).trim() : null;
    if (body.isPublished !== undefined) data.isPublished = Boolean(body.isPublished);
    if (body.categoryId !== undefined) data.categoryId = String(body.categoryId);

    return this.prisma.coachingProgram.update({
      where: { id },
      data,
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRAINING')
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const existing = await this.prisma.coachingProgram.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Program not found');
    await this.prisma.coachingProgram.update({
      where: { id },
      data: { deletedAt: new Date(), isPublished: false, updatedById: req.user?.userId || null },
    });
    return { success: true, id };
  }

  @Get(':id')
  one(@Param('id') id: string) {
    return this.prisma.coachingProgram.findFirst({
      where: { deletedAt: null, OR: [{ id }, { slug: id }] },
      include: { category: true, subjects: true },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/enroll')
  async enroll(@Param('id') id: string, @Req() req: any) {
    const student = await this.prisma.student.findUnique({ where: { userId: req.user.userId } });
    if (!student) return { error: 'Student profile required' };
    const program = await this.prisma.coachingProgram.findFirst({
      where: { deletedAt: null, OR: [{ id }, { slug: id }] },
    });
    if (!program) return { error: 'Program not found' };
    return this.prisma.coachingEnrollment.upsert({
      where: { studentId_programId: { studentId: student.id, programId: program.id } },
      update: {},
      create: { studentId: student.id, programId: program.id },
    });
  }
}
