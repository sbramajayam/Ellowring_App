import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health.controller';
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
import { StudentsModule } from './students/students.module';
import { CollegesModule } from './colleges/colleges.module';
import { PartnersModule } from './partners/partners.module';
import { PaymentsModule } from './payments/payments.module';
import { FilesModule } from './files/files.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StudentsModule,
    CollegesModule,
    PartnersModule,
    PaymentsModule,
    FilesModule,
    AnalyticsModule,
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
  controllers: [HealthController],
})
export class AppModule {}
