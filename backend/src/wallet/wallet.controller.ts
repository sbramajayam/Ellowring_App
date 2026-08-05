import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async get(@Req() req: any) {
    return this.prisma.wallet.findUnique({
      where: { userId: req.user.userId },
      include: { transactions: { orderBy: { createdAt: 'desc' }, take: 20 } },
    });
  }

  @Post('redeem')
  async redeem(@Req() req: any, @Body() body: { code: string }) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code: body.code.toUpperCase() } });
    if (!coupon || !coupon.isActive) return { error: 'Invalid coupon' };
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return { error: 'Coupon expired' };
    if (coupon.usedCount >= coupon.maxUses) return { error: 'Coupon exhausted' };

    const existing = await this.prisma.couponRedemption.findUnique({
      where: { couponId_userId: { couponId: coupon.id, userId: req.user.userId } },
    });
    if (existing) return { error: 'Already redeemed' };

    const credit = Math.round(coupon.discountPct * 10);
    await this.prisma.$transaction([
      this.prisma.couponRedemption.create({ data: { couponId: coupon.id, userId: req.user.userId } }),
      this.prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } }),
      this.prisma.wallet.update({
        where: { userId: req.user.userId },
        data: {
          balance: { increment: credit },
          transactions: {
            create: { amount: credit, type: 'CREDIT', description: `Coupon ${coupon.code}` },
          },
        },
      }),
    ]);
    return { message: 'Coupon applied', credit };
  }
}
