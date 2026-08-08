import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private prisma: PrismaService) {}

  @Post('orders')
  createOrder(
    @Req() req: any,
    @Body() body: { amount: number; currency?: string; purpose?: string; metadata?: object },
  ) {
    if (!body.amount || body.amount <= 0) throw new BadRequestException('amount required');
    const reference = `order_${randomBytes(8).toString('hex')}`;
    return this.prisma.payment.create({
      data: {
        userId: req.user.userId,
        amount: body.amount,
        currency: body.currency || 'INR',
        status: 'PENDING',
        provider: 'RAZORPAY',
        reference,
        purpose: body.purpose,
        metadata: body.metadata as any,
      },
    });
  }

  @Post('verify')
  async verify(
    @Req() req: any,
    @Body()
    body: {
      paymentId: string;
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    },
  ) {
    const payment = await this.prisma.payment.findFirst({
      where: { id: body.paymentId, userId: req.user.userId },
    });
    if (!payment) throw new NotFoundException('Payment not found');

    const isProd = process.env.NODE_ENV === 'production';
    if (isProd && !body.razorpay_signature) {
      throw new BadRequestException('razorpay_signature required');
    }

    const updated = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'SUCCESS',
        metadata: {
          ...((payment.metadata as object) || {}),
          razorpay_order_id: body.razorpay_order_id,
          razorpay_payment_id: body.razorpay_payment_id,
          razorpay_signature: body.razorpay_signature || 'demo-bypass',
        },
      },
    });

    await this.prisma.transaction.create({
      data: {
        paymentId: payment.id,
        type: 'CREDIT',
        amount: payment.amount,
        currency: payment.currency,
        status: 'SUCCESS',
        providerRef: body.razorpay_payment_id || payment.reference,
      },
    });

    return updated;
  }

  @Get('transactions')
  transactions(@Req() req: any) {
    return this.prisma.payment.findMany({
      where: { userId: req.user.userId },
      include: { transactions: true, refunds: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  async one(@Req() req: any, @Param('id') id: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, userId: req.user.userId },
      include: { transactions: true, refunds: true, invoices: true },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  @Post(':id/refunds')
  async refund(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { amount?: number; reason?: string },
  ) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, userId: req.user.userId },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status !== 'SUCCESS') {
      throw new BadRequestException('Only successful payments can be refunded');
    }
    const amount = body.amount ?? Number(payment.amount);
    const refund = await this.prisma.refund.create({
      data: {
        paymentId: payment.id,
        amount,
        currency: payment.currency,
        reason: body.reason,
        status: 'PENDING',
      },
    });
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'REFUNDED' },
    });
    return refund;
  }
}

@Controller('premium-plans')
export class PremiumPlansController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.premiumPlan.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { price: 'asc' },
    });
  }
}

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  create(@Req() req: any, @Body() body: { planId: string }) {
    if (!body.planId) throw new BadRequestException('planId required');
    return this.prisma.subscription.create({
      data: {
        userId: req.user.userId,
        planId: body.planId,
        status: 'ACTIVE',
        startDate: new Date(),
      },
      include: { plan: true },
    });
  }

  @Get('me')
  me(@Req() req: any) {
    return this.prisma.subscription.findMany({
      where: { userId: req.user.userId },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private prisma: PrismaService) {}

  @Get(':id')
  async one(@Req() req: any, @Param('id') id: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    if (invoice.userId && invoice.userId !== req.user.userId && req.user.role !== 'ADMIN') {
      throw new NotFoundException('Invoice not found');
    }
    return invoice;
  }
}
