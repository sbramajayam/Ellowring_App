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

const CAREER_FALLBACK = [
  {
    id: 'fallback-tech',
    title: 'Software Engineering Pathways',
    summary: 'Roles spanning full-stack, cloud, and product engineering for tech-focused students.',
    source: 'fallback',
    category: 'technology',
    growth: 'High',
  },
  {
    id: 'fallback-medicine',
    title: 'Healthcare & Allied Tracks',
    summary: 'MBBS, nursing, pharmacy, and allied health careers with entrance prep guidance.',
    source: 'fallback',
    category: 'medicine',
    growth: 'Stable',
  },
  {
    id: 'fallback-commerce',
    title: 'Business & Finance Careers',
    summary: 'CA, analytics, marketing, and finance analyst journeys for commerce students.',
    source: 'fallback',
    category: 'commerce',
    growth: 'High',
  },
  {
    id: 'fallback-arts',
    title: 'Creative & Civil Services',
    summary: 'Design, media, psychology, and competitive exam pathways.',
    source: 'fallback',
    category: 'arts',
    growth: 'Medium',
  },
  {
    id: 'fallback-data',
    title: 'Data Scientist',
    summary: 'Analytics, ML and decision science roles across product and enterprise teams.',
    source: 'fallback',
    category: 'technology',
    growth: 'Very High',
  },
];

@Controller('career')
export class CareerController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list(@Query('category') category?: string) {
    const recommendations = await this.prisma.careerRecommendation.findMany({
      where: {
        deletedAt: null,
        ...(category
          ? {
              OR: [
                { title: { contains: category } },
                { careerInterest: { category: { contains: category } } },
              ],
            }
          : {}),
      },
      take: 40,
      orderBy: { createdAt: 'desc' },
      include: { careerInterest: { select: { title: true, category: true } } },
    });

    if (recommendations.length > 0) return recommendations;

    return CAREER_FALLBACK.filter((item) =>
      category ? item.category.toLowerCase().includes(category.toLowerCase()) : true,
    );
  }

  @Get('assistant/suggest')
  suggest(@Query('interest') interest = 'technology') {
    const map: Record<string, string[]> = {
      technology: ['Full Stack Developer', 'Data Analyst', 'Cloud Engineer', 'UI/UX Designer'],
      medicine: ['MBBS Track', 'Nursing Pathway', 'Allied Health', 'Pharmacy'],
      commerce: ['CA Foundation', 'Business Analyst', 'Digital Marketing', 'Finance Analyst'],
      arts: ['Mass Communication', 'Design', 'Psychology', 'Civil Services Prep'],
    };
    const key = Object.keys(map).find((k) => interest.toLowerCase().includes(k)) || 'technology';
    return {
      interest,
      recommendations: map[key],
      message: 'AI Career Assistant suggestions based on your interest (V1 heuristic).',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRAINING')
  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const title = String(body.title || '').trim();
    if (!title) throw new BadRequestException('Title is required');
    const student = await this.prisma.student.findUnique({ where: { userId: req.user.userId } });
    if (!student) throw new BadRequestException('Student profile required');
    return this.prisma.careerRecommendation.create({
      data: {
        studentId: student.id,
        title,
        summary: body.summary || body.description || null,
        source: body.source || 'student',
        metadata: {
          category: body.category || 'general',
          growth: body.growth || 'Medium',
        },
      },
      include: { careerInterest: { select: { title: true, category: true } } },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRAINING')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    if (id.startsWith('fallback-')) throw new BadRequestException('Fallback pathways cannot be edited');
    const existing = await this.prisma.careerRecommendation.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Pathway not found');
    const student = await this.prisma.student.findUnique({ where: { userId: req.user.userId } });
    if (req.user.role === 'STUDENT' && student && existing.studentId !== student.id) {
      throw new BadRequestException('Not allowed');
    }
    const metadata = {
      ...((existing.metadata as Record<string, unknown>) || {}),
      ...(body.category !== undefined ? { category: body.category } : {}),
      ...(body.growth !== undefined ? { growth: body.growth } : {}),
    };
    return this.prisma.careerRecommendation.update({
      where: { id },
      data: {
        ...(body.title !== undefined ? { title: String(body.title).trim() } : {}),
        ...(body.summary !== undefined || body.description !== undefined
          ? { summary: body.summary ?? body.description }
          : {}),
        metadata,
      },
      include: { careerInterest: { select: { title: true, category: true } } },
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'TRAINING')
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    if (id.startsWith('fallback-')) throw new BadRequestException('Fallback pathways cannot be deleted');
    const existing = await this.prisma.careerRecommendation.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Pathway not found');
    const student = await this.prisma.student.findUnique({ where: { userId: req.user.userId } });
    if (req.user.role === 'STUDENT' && student && existing.studentId !== student.id) {
      throw new BadRequestException('Not allowed');
    }
    await this.prisma.careerRecommendation.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { success: true, id };
  }

  @Get(':id')
  async one(@Param('id') id: string) {
    const recommendation = await this.prisma.careerRecommendation.findUnique({ where: { id } });
    if (recommendation) return recommendation;
    return CAREER_FALLBACK.find((item) => item.id === id) || null;
  }
}
