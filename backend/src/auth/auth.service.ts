import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { LoginDto, RegisterDto, VerifyOtpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

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
        wallet: { create: { balance: role === 'STUDENT' ? 500 : 0 } },
        ...(role === 'STUDENT' && {
          student: {
            create: {
              grade: dto.grade,
              stream: dto.stream,
              city: dto.city,
              careerInterest: dto.careerInterest,
            },
          },
        }),
        ...(role === 'COLLEGE' && {
          college: { create: { name: dto.orgName || dto.name, city: dto.city } },
        }),
        ...(role === 'COMPANY' && {
          company: { create: { name: dto.orgName || dto.name, city: dto.city, industry: dto.industry } },
        }),
        ...(role === 'TRAINING' && {
          training: { create: { name: dto.orgName || dto.name, city: dto.city, specialty: dto.specialty } },
        }),
        ...(role === 'PARTNER' && {
          partner: {
            create: {
              name: dto.orgName || dto.name,
              region: dto.city,
              referralCode: `ELW${Date.now().toString(36).toUpperCase()}`,
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

    return this.issueToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.issueToken(user);
  }

  async requestOtp(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) throw new BadRequestException('User not found');
    const code = process.env.OTP_STATIC || '123456';
    await this.prisma.otp.create({
      data: {
        code,
        purpose: 'LOGIN',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        userId: user.id,
        email: user.email,
      },
    });
    return { message: 'OTP sent', demoOtp: code };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const otp = await this.prisma.otp.findFirst({
      where: {
        email: dto.email.toLowerCase(),
        code: dto.code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (!otp) throw new UnauthorizedException('Invalid or expired OTP');
    await this.prisma.otp.update({ where: { id: otp.id }, data: { used: true } });
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user) throw new UnauthorizedException('User not found');
    return this.issueToken(user);
  }

  private issueToken(user: { id: string; email: string; name: string; role: Role }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwt.sign(payload),
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
        student: true,
        college: true,
        company: true,
        training: true,
        partner: true,
        wallet: true,
      },
    });
  }
}
