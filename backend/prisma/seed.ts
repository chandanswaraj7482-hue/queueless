import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial Queueless demo clinic data...');

  // Clean existing
  await prisma.auditLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.checkInToken.deleteMany();
  await prisma.queueEntry.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.service.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();
  await prisma.clinic.deleteMany();
  await prisma.tenant.deleteMany();

  // 1. Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Something Labs Health',
      slug: 'something-labs',
      status: 'ACTIVE',
    },
  });

  // 2. Clinic
  const clinic = await prisma.clinic.create({
    data: {
      tenantId: tenant.id,
      name: 'City Health Clinic',
      slug: 'city-health',
      address: 'Suite 402, Metro Towers, MG Road, Bengaluru, Karnataka 560001',
      timezone: 'Asia/Kolkata',
      openingHours: '09:00 AM - 08:00 PM',
      contactPhone: '+91 98765 43210',
      settings: JSON.stringify({
        allowWalkIns: true,
        allowPreBooking: true,
        chimeSoundEnabled: true,
        callMode: 'SINGLE_ACTIVE',
        currency: 'INR',
      }),
    },
  });

  // 3. Users (Owner, Reception, Doctors)
  const receptionUser = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: 'Anita Roy (Front Desk)',
      email: 'reception@cityhealth.com',
      mobile: '+91 98000 00001',
    },
  });

  await prisma.userRole.create({
    data: {
      userId: receptionUser.id,
      clinicId: clinic.id,
      role: 'RECEPTION',
    },
  });

  const doctor1User = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: 'Dr. Rohan Sharma',
      email: 'dr.sharma@cityhealth.com',
      mobile: '+91 98000 00002',
    },
  });

  const doctor2User = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      name: 'Dr. Priya Patel',
      email: 'dr.patel@cityhealth.com',
      mobile: '+91 98000 00003',
    },
  });

  // 4. Doctors
  const doctor1 = await prisma.doctor.create({
    data: {
      clinicId: clinic.id,
      userId: doctor1User.id,
      displayName: 'Dr. Rohan Sharma, MD',
      specialty: 'General Physician',
      roomNumber: 'Cabin 1',
      active: true,
    },
  });

  const doctor2 = await prisma.doctor.create({
    data: {
      clinicId: clinic.id,
      userId: doctor2User.id,
      displayName: 'Dr. Priya Patel, DNB',
      specialty: 'Pediatrician',
      roomNumber: 'Cabin 2',
      active: true,
    },
  });

  // 5. Services
  const genService = await prisma.service.create({
    data: {
      clinicId: clinic.id,
      name: 'General Consultation',
      durationMinutes: 15,
      fee: 500,
      active: true,
    },
  });

  const pedService = await prisma.service.create({
    data: {
      clinicId: clinic.id,
      name: 'Pediatric Care & Vaccination',
      durationMinutes: 20,
      fee: 650,
      active: true,
    },
  });

  // 6. Patients & Queue Entries
  const today = new Date().toISOString().split('T')[0];

  const p1 = await prisma.patient.create({
    data: {
      tenantId: tenant.id,
      name: 'Amit Verma',
      mobile: '+91 98765 11111',
      age: 32,
      gender: 'Male',
    },
  });

  const p2 = await prisma.patient.create({
    data: {
      tenantId: tenant.id,
      name: 'Sunita Rao',
      mobile: '+91 98765 22222',
      age: 28,
      gender: 'Female',
    },
  });

  const p3 = await prisma.patient.create({
    data: {
      tenantId: tenant.id,
      name: 'Rahul Deshmukh',
      mobile: '+91 98765 33333',
      age: 45,
      gender: 'Male',
    },
  });

  await prisma.queueEntry.create({
    data: {
      clinicId: clinic.id,
      patientId: p1.id,
      doctorId: doctor1.id,
      serviceId: genService.id,
      token: 'A-101',
      publicToken: 'ptk_' + crypto.randomBytes(8).toString('hex'),
      queueDate: today,
      priority: 0,
      visitReason: 'Fever, sore throat, and mild cough since 2 days',
      status: 'WAITING',
    },
  });

  await prisma.queueEntry.create({
    data: {
      clinicId: clinic.id,
      patientId: p2.id,
      doctorId: doctor1.id,
      serviceId: genService.id,
      token: 'A-102',
      publicToken: 'ptk_' + crypto.randomBytes(8).toString('hex'),
      queueDate: today,
      priority: 0,
      visitReason: 'Routine BP & seasonal allergy checkup',
      status: 'WAITING',
    },
  });

  await prisma.queueEntry.create({
    data: {
      clinicId: clinic.id,
      patientId: p3.id,
      doctorId: doctor1.id,
      serviceId: genService.id,
      token: 'A-103',
      publicToken: 'ptk_' + crypto.randomBytes(8).toString('hex'),
      queueDate: today,
      priority: 0,
      visitReason: 'Stomach pain and acidity',
      status: 'CHECKED_IN',
    },
  });

  console.log(`Seeding complete! Clinic ID: ${clinic.id}, Slug: ${clinic.slug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

