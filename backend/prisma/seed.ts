import {
  EmploymentType,
  NotificationType,
  PrismaClient,
  Role,
  WorkMode,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/** Wipe seeded / dependent tables in leaf → root order so re-seeds stay idempotent. */
async function clearDatabase() {
  // Engagement / ledger leaves
  await prisma.projectEvaluation.deleteMany();
  await prisma.projectSubmission.deleteMany();
  await prisma.projectTeamMember.deleteMany();
  await prisma.projectTechnology.deleteMany();
  await prisma.internshipOffer.deleteMany();
  await prisma.internshipFeedback.deleteMany();
  await prisma.internshipProgress.deleteMany();
  await prisma.internshipApplication.deleteMany();
  await prisma.jobOffer.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.payrollItem.deleteMany();
  await prisma.payrollRun.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.mentor.deleteMany();
  await prisma.abroadDocument.deleteMany();
  await prisma.abroadApplication.deleteMany();
  await prisma.eligibilityRule.deleteMany();
  await prisma.visaRequirement.deleteMany();
  await prisma.collegeApplication.deleteMany();
  await prisma.collegeReview.deleteMany();
  await prisma.collegeRanking.deleteMany();
  await prisma.scholarship.deleteMany();
  await prisma.courseCertificate.deleteMany();
  await prisma.courseDownload.deleteMany();
  await prisma.courseEnrollment.deleteMany();
  await prisma.courseVideo.deleteMany();
  await prisma.courseLesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.coachingEnrollment.deleteMany();
  await prisma.studentAnswer.deleteMany();
  await prisma.mockResult.deleteMany();
  await prisma.leaderboardEntry.deleteMany();
  await prisma.questionOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.mockTest.deleteMany();
  await prisma.questionBank.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.trainingAssignment.deleteMany();
  await prisma.trainingBatch.deleteMany();
  await prisma.trainingProgram.deleteMany();
  await prisma.trainer.deleteMany();
  await prisma.trainingRevenue.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.commission.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.partnerLead.deleteMany();
  await prisma.partnerReport.deleteMany();
  await prisma.partnerWallet.deleteMany();
  await prisma.walletLedger.deleteMany();
  await prisma.couponRedemption.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.emailLog.deleteMany();
  await prisma.smsLog.deleteMany();
  await prisma.pushNotification.deleteMany();
  await prisma.whatsappLog.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.otpVerification.deleteMany();
  await prisma.passwordReset.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.userRbacRole.deleteMany();
  await prisma.rbacRolePermission.deleteMany();
  await prisma.careerRecommendation.deleteMany();
  await prisma.careerInterest.deleteMany();
  await prisma.studentSkill.deleteMany();
  await prisma.skillProgress.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.educationHistory.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.favorite.deleteMany();

  // Org / catalogue mid-tier
  await prisma.job.deleteMany();
  await prisma.internship.deleteMany();
  await prisma.project.deleteMany();
  await prisma.projectCategory.deleteMany();
  await prisma.hrUser.deleteMany();
  await prisma.abroadProgram.deleteMany();
  await prisma.abroadUniversity.deleteMany();
  await prisma.country.deleteMany();
  await prisma.collegeCourse.deleteMany();
  await prisma.department.deleteMany();
  await prisma.collegeProfile.deleteMany();
  await prisma.college.deleteMany();
  await prisma.university.deleteMany();
  await prisma.school.deleteMany();
  await prisma.course.deleteMany();
  await prisma.courseCategory.deleteMany();
  await prisma.coachingProgram.deleteMany();
  await prisma.coachingCategory.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.student.deleteMany();
  await prisma.company.deleteMany();
  await prisma.trainingCenter.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.premiumPlan.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.configuration.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.cmsPage.deleteMany();
  await prisma.report.deleteMany();
  await prisma.analyticsSnapshot.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.rbacRole.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  console.log('Seeding Ellowring Phase-4 database (SQLite)...');
  await clearDatabase();

  const passwordHash = await bcrypt.hash('password123', 10);

  // ── Platform settings & plans ──────────────────────────────────────────────
  await prisma.setting.createMany({
    data: [
      {
        key: 'app.name',
        value: 'Ellowring',
        description: 'Public product name',
      },
      {
        key: 'app.support_email',
        value: 'support@ellowring.com',
        description: 'Support inbox',
      },
      {
        key: 'feature.wallet_enabled',
        value: 'true',
        description: 'Student wallet feature flag',
      },
      {
        key: 'seed.version',
        value: 'phase4-demo-1',
        description: 'Seed marker',
      },
    ],
  });

  await prisma.premiumPlan.createMany({
    data: [
      {
        name: 'Free',
        slug: 'free',
        description: 'Core discovery features for students',
        price: 0,
        currency: 'INR',
        billingCycle: 'MONTHLY',
        features: ['career_interest', 'browse_jobs', 'browse_courses'],
        isActive: true,
      },
      {
        name: 'Pro',
        slug: 'pro',
        description: 'Priority applications, mocks, and wallet perks',
        price: 499,
        currency: 'INR',
        billingCycle: 'MONTHLY',
        features: ['priority_support', 'mock_tests', 'wallet_bonus'],
        isActive: true,
      },
    ],
  });

  await prisma.coupon.create({
    data: {
      code: 'WELCOME100',
      title: 'Welcome ₹100 off',
      discountAmt: 100,
      minOrderAmt: 499,
      maxUses: 1000,
      usedCount: 0,
      isActive: true,
      expiresAt: new Date('2027-12-31'),
    },
  });

  // ── Catalogue (no user FK) ─────────────────────────────────────────────────
  const coachingCat = await prisma.coachingCategory.create({
    data: {
      name: 'Entrance Exams',
      slug: 'entrance-exams',
      description: 'NEET / JEE and allied prep tracks',
      sortOrder: 1,
      isActive: true,
    },
  });

  await prisma.coachingProgram.createMany({
    data: [
      {
        categoryId: coachingCat.id,
        title: 'JEE Main + Advanced 2027',
        slug: 'jee-main-advanced-2027',
        examType: 'JEE',
        description: 'Concept-first PCM with weekly mocks.',
        price: 45000,
        duration: '12 months',
        batchSize: 40,
        isPublished: true,
      },
      {
        categoryId: coachingCat.id,
        title: 'NEET UG Crash Batch',
        slug: 'neet-ug-crash-batch',
        examType: 'NEET',
        description: 'High-yield biology with targeted PC drills.',
        price: 32000,
        duration: '6 months',
        batchSize: 50,
        isPublished: true,
      },
    ],
  });

  const courseCat = await prisma.courseCategory.create({
    data: {
      name: 'Technology',
      slug: 'technology',
      description: 'Software and data skills',
      sortOrder: 1,
      isActive: true,
    },
  });

  const country = await prisma.country.create({
    data: {
      name: 'United Kingdom',
      code: 'GB',
      currency: 'GBP',
      isActive: true,
    },
  });

  const abroadUni = await prisma.abroadUniversity.create({
    data: {
      countryId: country.id,
      name: 'University of Manchester',
      slug: 'university-of-manchester',
      city: 'Manchester',
      ranking: 32,
      website: 'https://www.manchester.ac.uk',
      description: 'Research-led UK university with strong STEM programs.',
      isActive: true,
    },
  });

  await prisma.abroadProgram.create({
    data: {
      universityId: abroadUni.id,
      name: 'MSc Computer Science',
      slug: 'manchester-msc-computer-science',
      degree: 'MSc',
      duration: '1 year',
      tuition: 28000,
      currency: 'GBP',
      intake: 'September',
      description: 'Advanced computing with industry project options.',
      isActive: true,
    },
  });

  const college = await prisma.college.create({
    data: {
      name: 'Symbiosis Institute of Technology',
      slug: 'symbiosis-institute-of-technology',
      code: 'SIT-PUNE',
      type: 'Private',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'IN',
      website: 'https://sit.siu.edu.in',
      description: 'Premier engineering institute with strong industry linkages.',
      isVerified: true,
    },
  });

  const collegeCourse = await prisma.collegeCourse.create({
    data: {
      collegeId: college.id,
      name: 'B.Tech Computer Science',
      slug: 'btech-computer-science',
      degree: 'B.Tech',
      duration: '4 years',
      fees: 185000,
      seats: 120,
      eligibility: 'JEE Main / SIT entrance',
      description: 'AI electives, industry projects and placement support.',
      isActive: true,
    },
  });

  await prisma.scholarship.create({
    data: {
      collegeId: college.id,
      courseId: collegeCourse.id,
      title: 'Merit Scholarship — CSE',
      amount: 50000,
      eligibility: 'Top 10% academic performance',
      deadline: new Date('2026-07-15'),
      isActive: true,
    },
  });

  // ── Users & role profiles ──────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ellowring.com',
      name: 'Ellowring Admin',
      passwordHash,
      role: Role.ADMIN,
      phone: '9000000001',
      isVerified: true,
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      email: 'student@ellowring.com',
      name: 'Aarav Sharma',
      passwordHash,
      role: Role.STUDENT,
      phone: '9876543210',
      isVerified: true,
      student: {
        create: {
          grade: '12th',
          stream: 'Science',
          city: 'Pune',
          state: 'Maharashtra',
          country: 'IN',
          bio: 'Aspiring software engineer exploring JEE and tech careers.',
          wallet: {
            create: {
              balance: 1500,
              currency: 'INR',
            },
          },
          careerInterests: {
            create: [
              {
                title: 'Software Engineering',
                category: 'Technology',
                priority: 1,
                notes: 'Full-stack and product engineering paths',
              },
              {
                title: 'Data Science',
                category: 'Technology',
                priority: 2,
              },
            ],
          },
        },
      },
      notifications: {
        create: [
          {
            title: 'Welcome Aarav',
            message:
              'Start with career interests, explore JEE coaching, and apply to internships.',
            type: NotificationType.SUCCESS,
          },
          {
            title: 'Wallet credited',
            message: 'Your demo wallet has ₹1500 to explore paid features.',
            type: NotificationType.INFO,
          },
        ],
      },
    },
    include: {
      student: {
        include: { careerInterests: true, wallet: true },
      },
    },
  });

  const primaryInterest = studentUser.student!.careerInterests[0];
  await prisma.careerRecommendation.create({
    data: {
      studentId: studentUser.student!.id,
      careerInterestId: primaryInterest.id,
      title: 'Product Engineering Track',
      summary:
        'Build DSA + full-stack projects, then target product companies via internships.',
      confidence: 0.82,
      source: 'seed',
      metadata: { tags: ['internship', 'portfolio'] },
    },
  });

  await prisma.user.create({
    data: {
      email: 'student2@ellowring.com',
      name: 'Diya Patel',
      passwordHash,
      role: Role.STUDENT,
      phone: '9876543211',
      isVerified: true,
      student: {
        create: {
          grade: 'College',
          stream: 'Computer Science',
          city: 'Ahmedabad',
          state: 'Gujarat',
          country: 'IN',
          wallet: {
            create: { balance: 0, currency: 'INR' },
          },
        },
      },
    },
  });

  const collegeUser = await prisma.user.create({
    data: {
      email: 'college@ellowring.com',
      name: 'Dr. Meera Iyer',
      passwordHash,
      role: Role.COLLEGE,
      phone: '9000000002',
      isVerified: true,
      collegeProfile: {
        create: {
          collegeId: college.id,
          name: 'Symbiosis Institute of Technology',
          code: 'SIT-PUNE',
          city: 'Pune',
          state: 'Maharashtra',
          type: 'Private',
          website: 'https://sit.siu.edu.in',
          description: 'College admissions portal login for SIT.',
          verified: true,
        },
      },
    },
  });

  const companyUser = await prisma.user.create({
    data: {
      email: 'company@ellowring.com',
      name: 'NovaTech Admin',
      passwordHash,
      role: Role.COMPANY,
      phone: '9000000003',
      isVerified: true,
      company: {
        create: {
          name: 'NovaTech Solutions',
          industry: 'Software',
          size: '201-500',
          city: 'Bengaluru',
          state: 'Karnataka',
          website: 'https://novatech.example',
          verified: true,
          description:
            'Product engineering company hiring fresh talent nationwide.',
        },
      },
    },
    include: { company: true },
  });

  const companyId = companyUser.company!.id;

  const hrUserAccount = await prisma.user.create({
    data: {
      email: 'hr@ellowring.com',
      name: 'Priya Nair',
      passwordHash,
      role: Role.COMPANY,
      phone: '9000000004',
      isVerified: true,
      hrUser: {
        create: {
          companyId,
          designation: 'Talent Acquisition Lead',
          department: 'Human Resources',
        },
      },
    },
    include: { hrUser: true },
  });

  const trainingUser = await prisma.user.create({
    data: {
      email: 'training@ellowring.com',
      name: 'Rahul Verma',
      passwordHash,
      role: Role.TRAINING,
      phone: '9000000005',
      isVerified: true,
      trainingCenter: {
        create: {
          name: 'PeakPrep Academy',
          specialty: 'JEE / NEET / Skills',
          city: 'Delhi',
          state: 'Delhi',
          website: 'https://peakprep.example',
          verified: true,
          description: 'National coaching and skill development partner.',
        },
      },
    },
    include: { trainingCenter: true },
  });

  const partnerUser = await prisma.user.create({
    data: {
      email: 'partner@ellowring.com',
      name: 'Sneha Kapoor',
      passwordHash,
      role: Role.PARTNER,
      phone: '9000000006',
      isVerified: true,
      partner: {
        create: {
          name: 'Kapoor Education Network',
          region: 'West India',
          referralCode: 'ELWWEST01',
          commissionPct: 12,
          isActive: true,
          wallet: {
            create: {
              balance: 250,
              currency: 'INR',
            },
          },
        },
      },
    },
    include: { partner: { include: { wallet: true } } },
  });

  // ── Courses (link optional training center) ────────────────────────────────
  const publishedCourse = await prisma.course.create({
    data: {
      categoryId: courseCat.id,
      trainingCenterId: trainingUser.trainingCenter!.id,
      title: 'Full Stack Web Development',
      slug: 'full-stack-web-development',
      level: 'Beginner',
      duration: '16 weeks',
      price: 9999,
      currency: 'INR',
      description: 'Build production apps with React, Node.js and PostgreSQL.',
      isPublished: true,
    },
  });

  await prisma.courseEnrollment.create({
    data: {
      studentId: studentUser.student!.id,
      courseId: publishedCourse.id,
      status: 'ACTIVE',
      progressPct: 10,
    },
  });

  // ── Company jobs / internships / project ───────────────────────────────────
  await prisma.job.createMany({
    data: [
      {
        companyId,
        hrUserId: hrUserAccount.hrUser!.id,
        title: 'Junior Software Engineer',
        slug: 'novatech-junior-software-engineer',
        location: 'Bengaluru',
        type: EmploymentType.FULL_TIME,
        mode: WorkMode.HYBRID,
        salaryMin: 600000,
        salaryMax: 900000,
        currency: 'INR',
        experience: '0-1 years',
        description: 'Ship features on our SaaS platform with mentorship.',
        skills: 'JavaScript, TypeScript, React, SQL',
        openings: 5,
        isActive: true,
      },
      {
        companyId,
        hrUserId: hrUserAccount.hrUser!.id,
        title: 'QA Automation Engineer',
        slug: 'novatech-qa-automation-engineer',
        location: 'Pune',
        type: EmploymentType.FULL_TIME,
        mode: WorkMode.ONSITE,
        salaryMin: 500000,
        salaryMax: 750000,
        currency: 'INR',
        experience: '0-2 years',
        description: 'Own end-to-end test automation for web products.',
        skills: 'Playwright, Jest, CI',
        openings: 2,
        isActive: true,
      },
    ],
  });

  await prisma.internship.create({
    data: {
      companyId,
      title: 'Product Engineering Intern',
      slug: 'novatech-product-engineering-intern',
      location: 'Bengaluru / Remote',
      mode: WorkMode.REMOTE,
      stipend: 25000,
      currency: 'INR',
      duration: '3 months',
      description: 'Work with full-stack pods on real customer features.',
      skills: 'React, Node.js, Git',
      openings: 8,
      isActive: true,
      startsAt: new Date('2026-09-01'),
      endsAt: new Date('2026-11-30'),
    },
  });

  await prisma.project.create({
    data: {
      companyId,
      title: 'Campus Recruiter Dashboard',
      slug: 'novatech-campus-recruiter-dashboard',
      domain: 'Web / Analytics',
      description:
        'Build an internal live project dashboard for campus hiring funnels.',
      duration: '6 weeks',
      stipend: 15000,
      currency: 'INR',
      teamSize: 4,
      isActive: true,
      deadline: new Date('2026-10-31'),
      technologies: {
        create: [
          { technology: 'Next.js' },
          { technology: 'Prisma' },
          { technology: 'SQLite' },
        ],
      },
    },
  });

  // Sample OTP row (schema: OtpVerification + OtpPurpose)
  await prisma.otpVerification.create({
    data: {
      userId: studentUser.id,
      email: studentUser.email,
      code: '123456',
      purpose: 'VERIFY_EMAIL',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      used: false,
    },
  });

  // Optional sample payment
  await prisma.payment.create({
    data: {
      userId: studentUser.id,
      amount: 499,
      currency: 'INR',
      status: 'SUCCESS',
      provider: 'RAZORPAY',
      reference: 'seed_pay_welcome_pro',
      purpose: 'premium_pro_trial',
    },
  });

  console.log('Seed complete.');
  console.log('Accounts (password: password123):');
  console.log(`  admin@ellowring.com      ADMIN      id=${admin.id}`);
  console.log(
    `  student@ellowring.com    STUDENT    wallet=${studentUser.student?.wallet?.balance ?? 1500}`,
  );
  console.log('  student2@ellowring.com   STUDENT');
  console.log(`  college@ellowring.com    COLLEGE    profile=${collegeUser.id}`);
  console.log(`  company@ellowring.com    COMPANY    companyId=${companyId}`);
  console.log(
    `  hr@ellowring.com         COMPANY    hrUserId=${hrUserAccount.hrUser!.id}`,
  );
  console.log(
    `  training@ellowring.com   TRAINING   centerId=${trainingUser.trainingCenter!.id}`,
  );
  console.log(
    `  partner@ellowring.com    PARTNER    code=${partnerUser.partner!.referralCode}`,
  );
  console.log(
    'Catalogue: CoachingProgram(JEE/NEET), Course, Jobs(2), Internship(1), Project(1), AbroadProgram, College+Course+Scholarship, Settings, PremiumPlan Free/Pro, Coupon WELCOME100, Notifications.',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
