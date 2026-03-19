import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import {
  APPLICATION_STATES,
  KYC_DOCS,
  MARITAL_STATUSES,
  NATURE_OF_RES_OPTIONS,
} from '~/models/application.validations';
import { UserType } from '~/models/auth.validations';

const prisma = new PrismaClient();

async function seed() {
  const HASHED_PASSWORD = await bcrypt.hash('jarnbjorn@8901', 10);

  await prisma.employmentPreference.deleteMany();
  await prisma.employmentType.deleteMany();
  await prisma.decision.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.kycDoc.deleteMany();
  await prisma.priorLoan.deleteMany();
  await prisma.application.deleteMany();
  await prisma.lender.deleteMany();
  await prisma.user.deleteMany();

  const typesToAdd = [
    'SSB Employees',
    'Entrepreneurs',
    'HeadHunters',
    'Inscor Workers',
  ];
  const employmentTypeIds = await Promise.all(
    typesToAdd.map(async (employmentType) => {
      const { id } = await prisma.employmentType.create({
        data: { employmentType },
        select: { id: true },
      });
      return id;
    }),
  );

  for (let i = 0; i < 5; i++) {
    await prisma.user.create({
      data: {
        emailAddress: faker.internet.email().toLowerCase().trim(),
        hashedPassword: HASHED_PASSWORD,
        fullName: faker.person.fullName(),
        kind: UserType.Admin,
      },
    });
  }
  const applicantIds: number[] = [];
  for (let i = 0; i < 5; i++) {
    const { id } = await prisma.user.create({
      data: {
        emailAddress: faker.internet.email().toLowerCase().trim(),
        hashedPassword: HASHED_PASSWORD,
        fullName: faker.person.fullName(),
        kind: UserType.Applicant,
      },
      select: { id: true },
    });
    applicantIds.push(id);
  }

  interface Lender {
    name: string;
    employmentTypeId: number;
    minTenure: number;
    maxTenure: number;
    minAmount: number;
    maxAmount: number;
    monthlyInterest: number;
    adminFee: number;
    applicationFee: number;
  }
  const lenders: Lender[] = [
    {
      name: 'Virl Financial Services',
      employmentTypeId: employmentTypeIds[0],
      minTenure: 3,
      maxTenure: 12,
      minAmount: 450,
      maxAmount: 20000,
      monthlyInterest: 6,
      adminFee: 3,
      applicationFee: 0,
    },
    {
      name: 'Raysun Capital',
      employmentTypeId: employmentTypeIds[1],
      minTenure: 3,
      maxTenure: 12,
      minAmount: 500,
      maxAmount: 10000,
      monthlyInterest: 10,
      adminFee: 3,
      applicationFee: 0,
    },
    {
      name: 'Easeworld Financial services',
      employmentTypeId: employmentTypeIds[0],
      minTenure: 3,
      maxTenure: 12,
      minAmount: 500,
      maxAmount: 18000,
      monthlyInterest: 4.26,
      adminFee: 3,
      applicationFee: 0,
    },
    {
      name: 'Old Mutual Financial Services',
      employmentTypeId: employmentTypeIds[2],
      minTenure: 3,
      maxTenure: 12,
      minAmount: 500,
      maxAmount: 20000,
      monthlyInterest: 5,
      adminFee: 3,
      applicationFee: 0,
    },
    {
      name: "Zimbabwe Women's Microfinance Bank",
      employmentTypeId: employmentTypeIds[1],
      minTenure: 3,
      maxTenure: 12,
      minAmount: 500,
      maxAmount: 20000,
      monthlyInterest: 5,
      adminFee: 3,
      applicationFee: 0,
    },
    {
      name: 'InnBucks MicroBank',
      employmentTypeId: employmentTypeIds[3],
      minTenure: 3,
      maxTenure: 12,
      minAmount: 600,
      maxAmount: 25000,
      monthlyInterest: 8,
      adminFee: 3,
      applicationFee: 0,
    },
    {
      name: 'GetBucks Microfinance Bank',
      employmentTypeId: employmentTypeIds[2],
      minTenure: 3,
      maxTenure: 12,
      minAmount: 400,
      maxAmount: 20000,
      monthlyInterest: 3,
      adminFee: 3,
      applicationFee: 0,
    },
    {
      name: 'African Century Limited',
      employmentTypeId: employmentTypeIds[3],
      minTenure: 3,
      maxTenure: 12,
      minAmount: 400,
      maxAmount: 18000,
      monthlyInterest: 4,
      adminFee: 3,
      applicationFee: 0,
    },
    {
      name: 'Success Microfinance Bank',
      employmentTypeId: employmentTypeIds[1],
      minTenure: 3,
      maxTenure: 12,
      minAmount: 500,
      maxAmount: 30000,
      monthlyInterest: 10,
      adminFee: 3,
      applicationFee: 0,
    },
    {
      name: 'Empower Bank',
      employmentTypeId: employmentTypeIds[1],
      minTenure: 3,
      maxTenure: 12,
      minAmount: 600,
      maxAmount: 18000,
      monthlyInterest: 8,
      adminFee: 3,
      applicationFee: 0,
    },
    {
      name: 'Lion Microfinance Bank',
      employmentTypeId: employmentTypeIds[0],
      minTenure: 3,
      maxTenure: 12,
      minAmount: 700,
      maxAmount: 25000,
      monthlyInterest: 5,
      adminFee: 3,
      applicationFee: 0,
    },
    {
      name: 'Zimnat Microfinance',
      employmentTypeId: employmentTypeIds[2],
      minTenure: 3,
      maxTenure: 12,
      minAmount: 500,
      maxAmount: 20000,
      monthlyInterest: 4.5,
      adminFee: 3,
      applicationFee: 0,
    },
    {
      name: 'Zibuko Capital',
      employmentTypeId: employmentTypeIds[2],
      minTenure: 3,
      maxTenure: 12,
      minAmount: 500,
      maxAmount: 20000,
      monthlyInterest: 3,
      adminFee: 3,
      applicationFee: 0,
    },
  ];

  console.log('Creating lenders....');
  const lenderIds: number[] = [];
  for (const lender of lenders) {
    const { id } = await prisma.lender.create({
      data: {
        user: {
          create: {
            emailAddress: faker.internet.email().toLowerCase().trim(),
            hashedPassword: HASHED_PASSWORD,
            fullName: lender.name,
            kind: UserType.Lender,
          },
        },
        employmentPreferences: {
          create: { employmentTypeId: lender.employmentTypeId },
        },
        logo: '',
        logoPublicId: 'h2bkwgii1e28hltu7f99',
        logoWidth: 200,
        logoHeight: 200,
        minTenure: lender.minTenure,
        maxTenure: lender.maxTenure,
        minAmount: lender.minAmount,
        maxAmount: lender.maxAmount,
        monthlyInterest: lender.monthlyInterest,
        adminFee: lender.adminFee,
        applicationFee: lender.applicationFee,
        paid: false,
      },
    });
    lenderIds.push(id);
  }
  console.log('Done creating lenders');

  // const lenderIds: number[] = [];
  // for (const employmentTypeId of employmentTypeIds) {
  //   for (let i = 0; i < 5; i++) {
  //     const { id } = await prisma.lender.create({
  //       data: {
  //         user: {
  //           create: {
  //             emailAddress: faker.internet.email().toLowerCase().trim(),
  //             hashedPassword: HASHED_PASSWORD,
  //             fullName: faker.company.name(),
  //             kind: UserType.Lender,
  //           },
  //         },
  //         employmentPreferences: { create: { employmentTypeId } },
  //         logo: '',
  //         logoPublicId: 'h2bkwgii1e28hltu7f99',
  //         logoWidth: 200,
  //         logoHeight: 200,
  //         minTenure: faker.number.int({ min: 1, max: 3 }),
  //         maxTenure: faker.number.int({ min: 4, max: 12 }),
  //         minAmount: faker.number.float({ max: 200, precision: 0.01 }),
  //         maxAmount: faker.number.float({ max: 10_000, precision: 0.01 }),
  //         monthlyInterest: faker.number.float({
  //           min: 1,
  //           max: 50,
  //           precision: 0.01,
  //         }),
  //         adminFee: faker.number.float({ min: 1, max: 20, precision: 0.01 }),
  //         applicationFee: faker.number.float({
  //           min: 1,
  //           max: 20,
  //           precision: 0.01,
  //         }),
  //         paid: false,
  //       },
  //     });
  //     lenderIds.push(id);
  //   }
  // }

  function generatePhone() {
    return faker.helpers.fromRegExp('+26377#{7}');
  }

  for (const state of APPLICATION_STATES) {
    for (const natureOfRes of NATURE_OF_RES_OPTIONS) {
      for (const maritalStatus of MARITAL_STATUSES) {
        for (const applicantId of applicantIds) {
          for (const lenderId of lenderIds) {
            await prisma.application.create({
              data: {
                applicantId,
                state,
                moreDetail: faker.lorem.paragraph(2),

                bank: faker.company.name(),
                bankBranch: faker.location.streetAddress(),
                accNumber: faker.finance.accountNumber(),
                accName: faker.finance.accountName(),

                loanPurpose: faker.word.noun(20),
                amtRequired: faker.finance.amount({ min: 100, max: 100_000 }),
                repaymentPeriod: faker.number.int({ min: 3, max: 12 }),

                title: faker.person.prefix(),
                fullName: faker.person.fullName(),
                DOB: faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
                nationalID: faker.helpers.fromRegExp('#{2}-#{6}-A-Z]#{2}'),
                phoneNumber: generatePhone(),
                resAddress: faker.location.streetAddress(),
                natureOfRes,

                fullMaidenNames: '',
                fullNameOfSpouse: faker.person.fullName(),
                maritalStatus,

                profession: faker.person.jobTitle(),
                employer: faker.company.name(),
                employedSince: faker.date.recent(),
                grossIncome: faker.finance.amount({ min: 4_000, max: 10_000 }),
                netIncome: faker.finance.amount({ max: 4_000 }),

                firstNokFullName: faker.person.fullName(),
                firstNokRelationship: 'Relative',
                firstNokEmployer: faker.company.name(),
                firstNokResAddress: faker.location.streetAddress(),
                firstNokPhoneNumber: generatePhone(),

                secondNokFullName: faker.person.fullName(),
                secondNokRelationship: 'Relative',
                secondNokEmployer: faker.company.name(),
                secondNokResAddress: faker.location.streetAddress(),
                secondNokPhoneNumber: generatePhone(),

                priorLoans: {
                  createMany: {
                    data: [...Array(3).keys()].map((_) => ({
                      lender: faker.company.name(),
                      expiryDate: faker.date.recent(),
                      amount: faker.finance.amount({ min: 1_000 }),
                      monthlyRepayment: faker.finance.amount({ max: 500 }),
                      balance: faker.finance.amount({ min: 500, max: 1_000 }),
                    })),
                  },
                },

                kycDocs: {
                  createMany: {
                    data: KYC_DOCS.map((label) => ({
                      label,
                      publicId: 'h2bkwgii1e28hltu7f99',
                      width: 3200,
                      height: 2400,
                    })),
                  },
                },

                channels: {
                  create: {
                    lenderId,
                    decisions: {
                      create: {
                        decision: state,
                        comment: faker.lorem.paragraph(2),
                      },
                    },
                  },
                },
              },
            });
          }
        }
      }
    }
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
