import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('predictive')
@UseGuards(JwtAuthGuard)
export class PredictiveController {
  @Get('placement')
  placement(@Req() req: any) {
    return {
      studentId: req.user.userId,
      probability: 0.72,
      confidence: 0.81,
      salaryRange: { min: 350000, max: 650000, currency: 'INR' },
      interventions: [
        'Complete 1 live project in your target domain',
        'Raise mock DSA score above 65th percentile',
        'Finish Full Stack course and earn certificate',
      ],
      model: 'placement-v3-preview',
      phase: 3,
    };
  }

  @Get('dropout-risk')
  dropout(@Req() req: any) {
    return {
      studentId: req.user.userId,
      riskScore: 0.28,
      band: 'LOW',
      triggers: ['Missed 2 live classes', 'No login in 5 days (resolved)'],
      recommendedAction: 'Send engagement nudge + schedule mentor check-in',
      model: 'dropout-v3-preview',
    };
  }

  @Get('admin/demand')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  demand() {
    return {
      horizonMonths: 9,
      skills: [
        { skill: 'Full Stack (React/Node)', demandIndex: 92, trend: 'up' },
        { skill: 'Data Analytics', demandIndex: 86, trend: 'up' },
        { skill: 'Cloud/DevOps', demandIndex: 78, trend: 'stable' },
        { skill: 'Digital Marketing', demandIndex: 64, trend: 'down' },
      ],
      note: 'Phase-3 predictive demand stub — replace with warehouse-trained models.',
    };
  }
}
