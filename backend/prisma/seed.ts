import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Ellowring database...');
  await prisma.walletTransaction.deleteMany();
  await prisma.couponRedemption.deleteMany();
  await prisma.application.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.coachingEnrollment.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.otp.deleteMany();
  await prisma.job.deleteMany();
  await prisma.internship.deleteMany();
  await prisma.liveProject.deleteMany();
  await prisma.admission.deleteMany();
  await prisma.course.deleteMany();
  await prisma.coachingModule.deleteMany();
  await prisma.careerGuidance.deleteMany();
  await prisma.studyAbroad.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.student.deleteMany();
  await prisma.college.deleteMany();
  await prisma.company.deleteMany();
  await prisma.trainingPartner.deleteMany();
  await prisma.channelPartner.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@ellowring.com',
      name: 'Ellowring Admin',
      passwordHash,
      role: Role.ADMIN,
      isVerified: true,
      wallet: { create: { balance: 0 } },
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
      wallet: { create: { balance: 1500 } },
      student: {
        create: {
          grade: '12th',
          stream: 'Science',
          city: 'Pune',
          state: 'Maharashtra',
          careerInterest: 'Technology',
          schoolName: 'Delhi Public School',
        },
      },
      notifications: {
        create: [
          {
            title: 'Welcome Aarav',
            message: 'Start with career guidance and explore JEE coaching tracks.',
            type: 'SUCCESS',
          },
          {
            title: 'New internship matches',
            message: '3 new internships match your interest in Technology.',
            type: 'INFO',
          },
        ],
      },
    },
    include: { student: true },
  });

  const collegeUser = await prisma.user.create({
    data: {
      email: 'college@ellowring.com',
      name: 'Dr. Meera Iyer',
      passwordHash,
      role: Role.COLLEGE,
      isVerified: true,
      wallet: { create: { balance: 0 } },
      college: {
        create: {
          name: 'Symbiosis Institute of Technology',
          code: 'SIT-PUNE',
          city: 'Pune',
          state: 'Maharashtra',
          type: 'Private',
          verified: true,
          description: 'Premier engineering institute with strong industry linkages.',
        },
      },
    },
    include: { college: true },
  });

  const companyUser = await prisma.user.create({
    data: {
      email: 'hr@ellowring.com',
      name: 'Priya Nair',
      passwordHash,
      role: Role.COMPANY,
      isVerified: true,
      wallet: { create: { balance: 0 } },
      company: {
        create: {
          name: 'NovaTech Solutions',
          industry: 'Software',
          size: '201-500',
          city: 'Bengaluru',
          verified: true,
          description: 'Product engineering company hiring fresh talent nationwide.',
        },
      },
    },
    include: { company: true },
  });

  const trainingUser = await prisma.user.create({
    data: {
      email: 'training@ellowring.com',
      name: 'Rahul Verma',
      passwordHash,
      role: Role.TRAINING,
      isVerified: true,
      wallet: { create: { balance: 0 } },
      training: {
        create: {
          name: 'PeakPrep Academy',
          specialty: 'JEE / NEET / Skills',
          city: 'Delhi',
          verified: true,
          description: 'National coaching and skill development partner.',
        },
      },
    },
    include: { training: true },
  });

  await prisma.user.create({
    data: {
      email: 'partner@ellowring.com',
      name: 'Sneha Kapoor',
      passwordHash,
      role: Role.PARTNER,
      isVerified: true,
      wallet: { create: { balance: 250 } },
      partner: {
        create: {
          name: 'Kapoor Education Network',
          region: 'West India',
          referralCode: 'ELWWEST01',
          commissionPct: 12,
        },
      },
    },
  });

  const partnerId = trainingUser.training!.id;
  const companyId = companyUser.company!.id;
  const collegeId = collegeUser.college!.id;

  await prisma.course.createMany({
    data: [
      {
        title: 'Full Stack Web Development',
        slug: 'full-stack-web-development',
        category: 'Technology',
        level: 'Beginner',
        duration: '16 weeks',
        price: 9999,
        description: 'Build production apps with React, Node.js and PostgreSQL.',
        partnerId,
      },
      {
        title: 'Data Analytics with Python',
        slug: 'data-analytics-python',
        category: 'Technology',
        level: 'Intermediate',
        duration: '12 weeks',
        price: 7999,
        description: 'Learn pandas, SQL, visualization and business storytelling.',
        partnerId,
      },
      {
        title: 'Digital Marketing Mastery',
        slug: 'digital-marketing-mastery',
        category: 'Business',
        level: 'Beginner',
        duration: '8 weeks',
        price: 4999,
        description: 'SEO, ads, content and analytics for modern brands.',
        partnerId,
      },
      {
        title: 'UI/UX Design Foundations',
        slug: 'ui-ux-design-foundations',
        category: 'Design',
        level: 'Beginner',
        duration: '10 weeks',
        price: 5999,
        description: 'Research, wireframes, Figma systems and usability testing.',
        partnerId,
      },
    ],
  });

  await prisma.coachingModule.createMany({
    data: [
      {
        title: 'JEE Main + Advanced 2027',
        examType: 'JEE',
        description: 'Concept-first physics, chemistry and maths with weekly mocks.',
        price: 45000,
        duration: '12 months',
        batchSize: 40,
        partnerId,
      },
      {
        title: 'NEET UG Crash Batch',
        examType: 'NEET',
        description: 'High-yield biology + targeted chemistry and physics drills.',
        price: 32000,
        duration: '6 months',
        batchSize: 50,
        partnerId,
      },
      {
        title: 'UPSC Prelims Foundation',
        examType: 'UPSC',
        description: 'GS core + current affairs + CSAT practice track.',
        price: 28000,
        duration: '9 months',
        batchSize: 60,
        partnerId,
      },
    ],
  });

  await prisma.careerGuidance.createMany({
    data: [
      {
        title: 'After 12th Science — Choosing Your Path',
        category: 'School',
        targetGrade: '12th',
        summary: 'Engineering, medicine, design or pure sciences — map fit and outcomes.',
        content: 'A structured framework for interest, aptitude, market demand and family context.',
      },
      {
        title: 'Campus to First Job Playbook',
        category: 'Career',
        targetGrade: 'College',
        summary: 'Internships, projects, resume and interview loops that convert.',
        content: '90-day plan from skill inventory to offer letter.',
      },
      {
        title: 'Study Abroad Decision Matrix',
        category: 'Abroad',
        targetGrade: 'College',
        summary: 'Country, cost, ROI and visa timelines compared.',
        content: 'Use Ellowring abroad inventory to shortlist programs realistically.',
      },
    ],
  });

  await prisma.admission.createMany({
    data: [
      {
        collegeId,
        program: 'B.Tech Computer Science',
        stream: 'Engineering',
        seats: 120,
        fees: 185000,
        description: 'AI electives, industry projects and placement support.',
        deadline: new Date('2026-07-31'),
      },
      {
        collegeId,
        program: 'B.Tech Electronics',
        stream: 'Engineering',
        seats: 90,
        fees: 175000,
        description: 'Embedded systems and IoT focused curriculum.',
        deadline: new Date('2026-07-31'),
      },
    ],
  });

  await prisma.studyAbroad.createMany({
    data: [
      {
        country: 'Germany',
        university: 'TU Munich Partner Pathway',
        program: 'M.Sc. Informatics',
        tuition: 0,
        duration: '2 years',
        requirements: 'IELTS 6.5, strong STEM GPA',
        description: 'Low tuition technical masters with internship opportunities.',
      },
      {
        country: 'Canada',
        university: 'University of Waterloo Affiliate',
        program: 'Co-op Computer Science',
        tuition: 28000,
        duration: '4 years',
        requirements: 'IELTS 6.5, math strength',
        description: 'Famous co-op hiring culture for global tech roles.',
      },
      {
        country: 'UK',
        university: 'University of Manchester Pathway',
        program: 'M.Sc. Data Science',
        tuition: 22000,
        duration: '1 year',
        requirements: 'IELTS 6.5, portfolio preferred',
        description: 'One-year intensive masters with industry projects.',
      },
    ],
  });

  await prisma.job.createMany({
    data: [
      {
        companyId,
        title: 'Junior Software Engineer',
        location: 'Bengaluru',
        type: 'FULL_TIME',
        salaryMin: 600000,
        salaryMax: 900000,
        experience: '0-1 years',
        skills: 'JavaScript, React, Node.js',
        description: 'Ship features on customer-facing product squads with mentorship.',
      },
      {
        companyId,
        title: 'QA Automation Engineer',
        location: 'Hyderabad',
        type: 'FULL_TIME',
        salaryMin: 500000,
        salaryMax: 800000,
        experience: '0-2 years',
        skills: 'Playwright, API Testing',
        description: 'Own quality gates for rapid product releases.',
      },
    ],
  });

  await prisma.internship.createMany({
    data: [
      {
        companyId,
        title: 'Frontend Intern',
        location: 'Remote',
        mode: 'REMOTE',
        stipend: 15000,
        duration: '3 months',
        skills: 'React, Tailwind',
        description: 'Build polished UI for Ellowring partner portals.',
      },
      {
        companyId,
        title: 'Data Intern',
        location: 'Pune',
        mode: 'HYBRID',
        stipend: 12000,
        duration: '2 months',
        skills: 'Python, SQL',
        description: 'Support analytics for hiring and learning funnels.',
      },
    ],
  });

  await prisma.liveProject.createMany({
    data: [
      {
        companyId,
        title: 'Campus Hiring Dashboard',
        domain: 'Full Stack',
        description: 'Design and build a dashboard for college placement cells.',
        duration: '6 weeks',
        stipend: 20000,
      },
      {
        companyId,
        title: 'Resume Parser MVP',
        domain: 'AI / NLP',
        description: 'Prototype keyword and skill extraction from student resumes.',
        duration: '4 weeks',
        stipend: 18000,
      },
    ],
  });

  await prisma.coupon.createMany({
    data: [
      { code: 'ELLO500', discountPct: 50, maxUses: 500 },
      { code: 'FIRSTJOB', discountPct: 25, maxUses: 200 },
      { code: 'PARTNER12', discountPct: 12, maxUses: 1000 },
    ],
  });

  await prisma.setting.createMany({
    data: [
      { key: 'product_name', value: 'Ellowring' },
      { key: 'tagline', value: 'Learn. Prepare. Build. Get Hired.' },
      { key: 'support_email', value: 'hello@ellowring.com' },
    ],
  });

  if (studentUser.student) {
    const course = await prisma.course.findFirst();
    if (course) {
      await prisma.enrollment.create({
        data: { studentId: studentUser.student.id, courseId: course.id, progress: 35 },
      });
    }
    await prisma.certificate.create({
      data: {
        studentId: studentUser.student.id,
        title: 'Career Foundations',
        issuer: 'Ellowring',
        credential: 'ELW-CF-001',
      },
    });
  }

  console.log('Seed complete.');
  console.log('Demo logins (password: password123):');
  console.log('- student@ellowring.com');
  console.log('- college@ellowring.com');
  console.log('- hr@ellowring.com');
  console.log('- training@ellowring.com');
  console.log('- partner@ellowring.com');
  console.log('- admin@ellowring.com');
  console.log(`Admin id: ${admin.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
