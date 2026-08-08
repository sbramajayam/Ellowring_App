import { Controller, Get, Param, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const CAREER_FALLBACK = [
  {
    id: 'fallback-tech',
    title: 'Software Engineering Pathways',
    summary: 'Roles spanning full-stack, cloud, and product engineering for tech-focused students.',
    source: 'fallback',
    category: 'technology',
  },
  {
    id: 'fallback-medicine',
    title: 'Healthcare & Allied Tracks',
    summary: 'MBBS, nursing, pharmacy, and allied health careers with entrance prep guidance.',
    source: 'fallback',
    category: 'medicine',
  },
  {
    id: 'fallback-commerce',
    title: 'Business & Finance Careers',
    summary: 'CA, analytics, marketing, and finance analyst journeys for commerce students.',
    source: 'fallback',
    category: 'commerce',
  },
  {
    id: 'fallback-arts',
    title: 'Creative & Civil Services',
    summary: 'Design, media, psychology, and competitive exam pathways.',
    source: 'fallback',
    category: 'arts',
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
      take: 20,
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

  @Get(':id')
  async one(@Param('id') id: string) {
    const recommendation = await this.prisma.careerRecommendation.findUnique({ where: { id } });
    if (recommendation) return recommendation;
    return CAREER_FALLBACK.find((item) => item.id === id) || null;
  }
}
