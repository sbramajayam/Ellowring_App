import { Controller, Get, Param, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('career')
export class CareerController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query('category') category?: string) {
    return this.prisma.careerGuidance.findMany({
      where: { isPublished: true, ...(category ? { category } : {}) },
      orderBy: { createdAt: 'desc' },
    });
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
  one(@Param('id') id: string) {
    return this.prisma.careerGuidance.findUnique({ where: { id } });
  }
}
