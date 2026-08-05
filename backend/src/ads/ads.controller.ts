import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('ads')
export class AdsController {
  @Get('placements')
  placements() {
    return [
      {
        id: 'ad-college-1',
        type: 'COLLEGE',
        title: 'Greenfield Institute of Technology',
        label: 'Sponsored',
        labelled: true,
        cta: 'Explore admissions',
        href: '/dashboard/student/colleges',
      },
      {
        id: 'ad-course-1',
        type: 'COURSE',
        title: 'Full Stack Web Development — Partner offer',
        label: 'Sponsored',
        labelled: true,
        cta: 'View course',
        href: '/dashboard/student/courses',
      },
      {
        id: 'ad-job-1',
        type: 'JOB',
        title: 'Graduate Analyst roles — hiring week',
        label: 'Sponsored',
        labelled: true,
        cta: 'View jobs',
        href: '/dashboard/student/jobs',
      },
    ];
  }

  @Get('campaigns')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  campaigns() {
    return [
      { id: 'c1', name: 'NEET 2026 College Push', budgetInr: 250000, status: 'ACTIVE', impressions: 120400 },
      { id: 'c2', name: 'Campus Drive Sponsors', budgetInr: 180000, status: 'PAUSED', impressions: 45200 },
      { id: 'c3', name: 'Study Abroad Soft Launch', budgetInr: 90000, status: 'DRAFT', impressions: 0 },
    ];
  }
}
