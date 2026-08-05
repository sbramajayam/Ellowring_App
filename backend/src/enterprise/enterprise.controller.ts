import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiKeyGuard } from './api-key.guard';

/**
 * Phase 3 / V3 — Public Partner (Enterprise) API skeleton.
 * Auth: X-API-Key header. Future: OAuth client credentials + scopes + webhooks.
 */
@Controller('enterprise')
@UseGuards(ApiKeyGuard)
export class EnterpriseController {
  constructor(private prisma: PrismaService) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      product: 'Ellowring Enterprise API',
      version: 'v3.0-preview',
      phase: 3,
    };
  }

  @Get('students/:id/profile')
  async studentProfile(@Param('id') id: string) {
    const student = await this.prisma.student.findFirst({
      where: { OR: [{ id }, { userId: id }] },
      include: { user: { select: { name: true } } },
    });
    if (!student) {
      return { found: false, consentRequired: true };
    }
    return {
      found: true,
      consentNote: 'Partner access requires explicit student consent in production.',
      profile: {
        id: student.id,
        name: student.user.name,
        city: student.city,
        stream: student.stream,
        careerInterest: student.careerInterest,
      },
    };
  }

  @Get('verify/certificate/:code')
  async verifyCertificate(@Param('code') code: string) {
    const cert = await this.prisma.certificate.findFirst({
      where: {
        OR: [{ id: code }, { credential: code }],
      },
      include: { student: { include: { user: { select: { name: true } } } } },
    });

    if (!cert) {
      return {
        valid: false,
        code,
        message: 'Certificate not found',
        issuer: 'Ellowring Software Solutions',
      };
    }

    return {
      valid: true,
      code: cert.credential || cert.id,
      holderName: cert.student.user.name,
      issuedAt: cert.issuedAt,
      issuer: cert.issuer || 'Ellowring Software Solutions',
      title: cert.title,
    };
  }

  @Get('jobs')
  jobs() {
    return this.prisma.job.findMany({
      where: { isActive: true },
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { company: { select: { name: true, industry: true, verified: true } } },
    });
  }

  @Post('webhooks/test')
  webhookTest(@Body() body: Record<string, unknown>) {
    return {
      received: true,
      at: new Date().toISOString(),
      echo: body,
    };
  }
}
