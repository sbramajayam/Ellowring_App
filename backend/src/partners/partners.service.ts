import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  async resolvePartner(userId: string) {
    const partner = await this.prisma.partner.findUnique({ where: { userId } });
    if (!partner) throw new NotFoundException('Partner profile not found');
    return partner;
  }

  async dashboard(userId: string) {
    const partner = await this.resolvePartner(userId);
    const [leads, referrals, commissions, payouts, wallet] = await Promise.all([
      this.prisma.partnerLead.count({ where: { partnerId: partner.id } }),
      this.prisma.referral.count({ where: { partnerId: partner.id } }),
      this.prisma.commission.aggregate({
        where: { partnerId: partner.id },
        _sum: { amount: true },
      }),
      this.prisma.payout.count({ where: { partnerId: partner.id } }),
      this.prisma.partnerWallet.findUnique({ where: { partnerId: partner.id } }),
    ]);
    return {
      referralCode: partner.referralCode,
      commissionPct: partner.commissionPct,
      leads,
      referrals,
      commissionTotal: commissions._sum.amount ?? 0,
      payouts,
      walletBalance: wallet?.balance ?? 0,
    };
  }
}
