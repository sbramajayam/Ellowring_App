import { Body, Controller, Get, Post, Query, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma, WalletLedgerType } from '@prisma/client';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async get(@Req() req: any, @Query('limit') limit?: string) {
    const student = await this.prisma.student.findUnique({ where: { userId: req.user.userId } });
    if (!student) return { error: 'Student wallet not available for this role' };
    const take = Math.min(Number(limit) || 20, 100);
    let wallet = await this.prisma.wallet.findUnique({
      where: { studentId: student.id },
      include: { ledger: { orderBy: { createdAt: 'desc' }, take } },
    });
    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: { studentId: student.id, balance: 0, currency: 'INR' },
        include: { ledger: { orderBy: { createdAt: 'desc' }, take } },
      });
    }
    return wallet;
  }

  @Post('top-up')
  async topUp(@Req() req: any, @Body() body: { amount?: number; description?: string }) {
    const student = await this.prisma.student.findUnique({ where: { userId: req.user.userId } });
    if (!student) throw new BadRequestException('Student profile required');

    const amount = Math.round(Number(body.amount) || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('Amount must be a positive number');
    }
    if (amount > 100000) throw new BadRequestException('Max top-up is ₹1,00,000');

    let wallet = await this.prisma.wallet.findUnique({ where: { studentId: student.id } });
    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: { studentId: student.id, balance: 0, currency: 'INR' },
      });
    }

    const newBalance = new Prisma.Decimal(Number(wallet.balance) + amount);
    return this.prisma.wallet.update({
      where: { studentId: student.id },
      data: {
        balance: { increment: amount },
        ledger: {
          create: {
            amount,
            type: WalletLedgerType.CREDIT,
            description: body.description || 'Wallet Top-up',
            balanceAfter: newBalance,
            reference: `topup-${Date.now().toString(36)}`,
          },
        },
      },
      include: { ledger: { orderBy: { createdAt: 'desc' }, take: 20 } },
    });
  }

  @Post('redeem')
  async redeem(@Req() req: any, @Body() body: { code: string }) {
    const student = await this.prisma.student.findUnique({ where: { userId: req.user.userId } });
    if (!student) throw new BadRequestException('Student profile required');

    const wallet = await this.prisma.wallet.findUnique({ where: { studentId: student.id } });
    if (!wallet) throw new BadRequestException('Wallet not found');

    const coupon = await this.prisma.coupon.findUnique({ where: { code: body.code.toUpperCase() } });
    if (!coupon || !coupon.isActive) return { error: 'Invalid coupon' };
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return { error: 'Coupon expired' };
    if (coupon.usedCount >= coupon.maxUses) return { error: 'Coupon exhausted' };

    const existing = await this.prisma.couponRedemption.findUnique({
      where: { couponId_userId: { couponId: coupon.id, userId: req.user.userId } },
    });
    if (existing) return { error: 'Already redeemed' };

    const pct = coupon.discountPct ? Number(coupon.discountPct) : 0;
    const amt = coupon.discountAmt ? Number(coupon.discountAmt) : 0;
    const credit = amt > 0 ? Math.round(amt) : Math.round(pct * 10);
    if (credit <= 0) return { error: 'Coupon has no redeemable value' };

    const newBalance = new Prisma.Decimal(Number(wallet.balance) + credit);

    await this.prisma.$transaction([
      this.prisma.couponRedemption.create({
        data: { couponId: coupon.id, userId: req.user.userId },
      }),
      this.prisma.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      }),
      this.prisma.wallet.update({
        where: { studentId: student.id },
        data: {
          balance: { increment: credit },
          ledger: {
            create: {
              amount: credit,
              type: 'CREDIT',
              description: `Coupon ${coupon.code}`,
              balanceAfter: newBalance,
              reference: coupon.code,
            },
          },
        },
      }),
    ]);
    return { message: 'Coupon applied', credit };
  }
}
