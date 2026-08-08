import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { PartnersService } from './partners.service';

@Controller('partners')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PARTNER', 'ADMIN')
export class PartnersController {
  constructor(
    private partners: PartnersService,
    private prisma: PrismaService,
  ) {}

  @Get('me/dashboard')
  dashboard(@Req() req: any) {
    return this.partners.dashboard(req.user.userId);
  }

  @Get('me/leads')
  async leads(@Req() req: any) {
    const partner = await this.partners.resolvePartner(req.user.userId);
    return this.prisma.partnerLead.findMany({
      where: { partnerId: partner.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post('me/leads')
  async createLead(
    @Req() req: any,
    @Body()
    body: { name: string; email?: string; phone?: string; source?: string; notes?: string },
  ) {
    const partner = await this.partners.resolvePartner(req.user.userId);
    return this.prisma.partnerLead.create({
      data: {
        partnerId: partner.id,
        name: body.name,
        email: body.email,
        phone: body.phone,
        source: body.source,
        notes: body.notes,
      },
    });
  }

  @Get('me/referrals')
  async referrals(@Req() req: any) {
    const partner = await this.partners.resolvePartner(req.user.userId);
    return this.prisma.referral.findMany({
      where: { partnerId: partner.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('me/wallet')
  async wallet(@Req() req: any) {
    const partner = await this.partners.resolvePartner(req.user.userId);
    return this.prisma.partnerWallet.findUnique({ where: { partnerId: partner.id } });
  }

  @Get('me/commissions')
  async commissions(@Req() req: any) {
    const partner = await this.partners.resolvePartner(req.user.userId);
    return this.prisma.commission.findMany({
      where: { partnerId: partner.id },
      orderBy: { earnedAt: 'desc' },
    });
  }

  @Get('me/payouts')
  async payouts(@Req() req: any) {
    const partner = await this.partners.resolvePartner(req.user.userId);
    return this.prisma.payout.findMany({
      where: { partnerId: partner.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post('me/payouts')
  async createPayout(
    @Req() req: any,
    @Body() body: { amount: number; currency?: string; commissionId?: string; reference?: string },
  ) {
    const partner = await this.partners.resolvePartner(req.user.userId);
    return this.prisma.payout.create({
      data: {
        partnerId: partner.id,
        amount: body.amount,
        currency: body.currency || 'INR',
        commissionId: body.commissionId,
        reference: body.reference,
        status: 'PENDING',
      },
    });
  }
}
