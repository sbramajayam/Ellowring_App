import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollegesService {
  constructor(private prisma: PrismaService) {}

  async resolveProfile(userId: string) {
    const profile = await this.prisma.collegeProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('College profile not found');
    return profile;
  }

  async requireCollegeId(userId: string) {
    const profile = await this.resolveProfile(userId);
    if (!profile.collegeId) throw new ForbiddenException('College record not linked');
    return { profile, collegeId: profile.collegeId };
  }
}
