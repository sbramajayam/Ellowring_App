import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { CoachingModule } from './coaching/coaching.module';
import { JobsModule } from './jobs/jobs.module';
import { InternshipsModule } from './internships/internships.module';
import { ProjectsModule } from './projects/projects.module';
import { CareerModule } from './career/career.module';
import { AdmissionsModule } from './admissions/admissions.module';
import { StudyAbroadModule } from './study-abroad/study-abroad.module';
import { WalletModule } from './wallet/wallet.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ApplicationsModule } from './applications/applications.module';
import { AdminModule } from './admin/admin.module';
import { PayrollModule } from './payroll/payroll.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { AdsModule } from './ads/ads.module';
import { PredictiveModule } from './predictive/predictive.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    // feature modules below
    // AuthModule exports RolesGuard for RBAC
    UsersModule,
    CoursesModule,
    CoachingModule,
    JobsModule,
    InternshipsModule,
    ProjectsModule,
    CareerModule,
    AdmissionsModule,
    StudyAbroadModule,
    WalletModule,
    NotificationsModule,
    DashboardModule,
    ApplicationsModule,
    AdminModule,
    PayrollModule,
    EnterpriseModule,
    AdsModule,
    PredictiveModule,
  ],
})
export class AppModule {}
