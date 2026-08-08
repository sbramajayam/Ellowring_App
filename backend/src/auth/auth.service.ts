import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { OtpPurpose, Role } from '@prisma/client';
import {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  UpdateProfileDto,
  VerifyOtpDto,
} from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private randomToken(bytes = 32) {
    return randomBytes(bytes).toString('hex');
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const role = (dto.role || 'STUDENT') as Role;

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        name: dto.name,
        passwordHash,
        role,
        isVerified: true,
        ...(role === 'STUDENT' && {
          student: {
            create: {
              grade: dto.grade,
              stream: dto.stream,
              city: dto.city,
              wallet: { create: { balance: 500 } },
              ...(dto.careerInterest
                ? {
                    careerInterests: {
                      create: { title: dto.careerInterest },
                    },
                  }
                : {}),
            },
          },
        }),
        ...(role === 'COLLEGE' && {
          collegeProfile: { create: { name: dto.orgName || dto.name, city: dto.city } },
        }),
        ...(role === 'COMPANY' && {
          company: {
            create: { name: dto.orgName || dto.name, city: dto.city, industry: dto.industry },
          },
        }),
        ...(role === 'TRAINING' && {
          trainingCenter: {
            create: { name: dto.orgName || dto.name, city: dto.city, specialty: dto.specialty },
          },
        }),
        ...(role === 'PARTNER' && {
          partner: {
            create: {
              name: dto.orgName || dto.name,
              region: dto.city,
              referralCode: `ELW${Date.now().toString(36).toUpperCase()}`,
              wallet: { create: { balance: 0 } },
            },
          },
        }),
      },
      select: { id: true, email: true, name: true, role: true },
    });

    await this.prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to Ellowring',
        message: 'Your journey from learning to hiring starts here. Explore your dashboard.',
        type: 'SUCCESS',
      },
    });

    return this.issueTokenPair(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    return this.issueTokenPair(user);
  }

  async requestOtp(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) throw new BadRequestException('User not found');
    const code = process.env.OTP_STATIC || '123456';
    await this.prisma.otpVerification.create({
      data: {
        code,
        purpose: OtpPurpose.LOGIN,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        userId: user.id,
        email: user.email,
      },
    });
    return { message: 'OTP sent', demoOtp: code };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const otp = await this.prisma.otpVerification.findFirst({
      where: {
        email: dto.email.toLowerCase(),
        code: dto.code,
        used: false,
        expiresAt: { gt: new Date() },
        purpose: OtpPurpose.LOGIN,
      },
      orderBy: { createdAt: 'desc' },
    });
    if (!otp) throw new UnauthorizedException('Invalid or expired OTP');
    await this.prisma.otpVerification.update({
      where: { id: otp.id },
      data: { used: true, usedAt: new Date() },
    });
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user) throw new UnauthorizedException('User not found');
    return this.issueTokenPair(user);
  }

  async refresh(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({ where: { token: tokenHash } });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });
    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user || !user.isActive) throw new UnauthorizedException('User not found');
    return this.issueTokenPair(user);
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const tokenHash = this.hashToken(refreshToken);
      await this.prisma.refreshToken.updateMany({
        where: { userId, token: tokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } else {
      await this.prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    return { message: 'Logged out' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    // Always return the same message to avoid email enumeration
    const message = 'If the account exists, reset instructions were sent';
    if (!user) return { message };

    const rawToken = this.randomToken();
    const tokenHash = this.hashToken(rawToken);
    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: tokenHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    // Demo/dev: expose token so local flows work without email delivery
    return { message, demoResetToken: rawToken };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.hashToken(dto.token);
    const reset = await this.prisma.passwordReset.findUnique({ where: { token: tokenHash } });
    if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: reset.userId }, data: { passwordHash } }),
      this.prisma.passwordReset.update({
        where: { id: reset.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId: reset.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
    return { message: 'Password updated' };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    const ok = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!ok) throw new BadRequestException('Current password is incorrect');
    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });
    return { message: 'Password changed' };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
        ...(dto.avatarUrl !== undefined ? { avatarUrl: dto.avatarUrl } : {}),
      },
      select: { id: true, name: true, phone: true, avatarUrl: true, email: true, role: true },
    });
  }

  private async issueTokenPair(user: { id: string; email: string; name: string; role: Role }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwt.sign(payload);
    const refreshToken = this.randomToken(48);
    const tokenHash = this.hashToken(refreshToken);
    const refreshDays = Number(process.env.REFRESH_TOKEN_DAYS || 30);
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokenHash,
        expiresAt: new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000),
      },
    });
    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        avatarUrl: true,
        isVerified: true,
        student: { include: { wallet: true } },
        collegeProfile: true,
        company: true,
        trainingCenter: true,
        partner: { include: { wallet: true } },
        hrUser: true,
      },
    });
  }
}
