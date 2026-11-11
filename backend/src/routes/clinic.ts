import { Router } from 'express';
import crypto from 'crypto';
import { prisma } from '../prisma';
import { broadcastQueueUpdate } from '../socket';

export const clinicRouter = Router();

// 1. List clinics
clinicRouter.get('/', async (req, res) => {
  try {
    const clinics = await prisma.clinic.findMany({
      include: {
        doctors: true,
        services: true,
      },
    });
    res.json({ success: true, data: clinics });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 1b. Onboard New Hospital / Clinic (Queueless Master Admin)
clinicRouter.post('/', async (req, res) => {
  try {
    const {
      name,
      slug,
      address,
      contactPhone,
      openingHours,
      adminPassword,
      receptionPassword,
      initialDoctorName,
      initialDoctorSpecialty,
      initialDoctorRoom,
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ success: false, error: 'Hospital name and unique slug are required' });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-');

    const existing = await prisma.clinic.findUnique({
      where: { slug: cleanSlug },
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: `Hospital with slug "${cleanSlug}" already exists. Please choose a different slug.`,
      });
    }

    let tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: { name: 'Queueless Platform Network', slug: 'queueless-platform' },
      });
    }

    const clinic = await prisma.clinic.create({
      data: {
        tenantId: tenant.id,
        name: name.trim(),
        slug: cleanSlug,
        address: address?.trim() || 'Central Health Campus',
        contactPhone: contactPhone?.trim() || null,
        openingHours: openingHours?.trim() || '09:00 - 20:00',
        adminPassword: adminPassword?.trim() || 'admin123',
        receptionPassword: receptionPassword?.trim() || 'reception123',
        services: {
          create: [
            { name: 'General Consultation', fee: 500, durationMinutes: 15 },
            { name: 'Specialist Consultation', fee: 800, durationMinutes: 20 },
            { name: 'Follow-up Consultation', fee: 250, durationMinutes: 10 },
          ],
        },
        doctors: {
          create: [
            {
              displayName: initialDoctorName?.trim() || 'Dr. Specialist',
              specialty: initialDoctorSpecialty?.trim() || 'General Medicine',
              roomNumber: initialDoctorRoom?.trim() || 'Cabin 1',
              active: true,
              pin: '1234',
              password: 'doctor123',
            },
          ],
        },
      },
      include: {
        doctors: true,
        services: true,
      },
    });

    res.status(201).json({
      success: true,
      message: `Hospital "${clinic.name}" onboarded to Queueless Platform!`,
      data: clinic,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 1c. Commercial Self-Serve Subscription & Instant Hospital Provisioning
clinicRouter.post('/subscribe', async (req, res) => {
  try {
    const {
      hospitalName,
      slug,
      address,
      city,
      phone,
      adminEmail,
      adminPassword,
      planId,
      planName,
      billingCycle,
      currency,
      hardwareAddon,
      totalAmount,
      paymentMethod,
      initialDoctorName,
      initialDoctorSpecialty,
      initialDoctorRoom,
    } = req.body;

    if (!hospitalName || !slug) {
      return res.status(400).json({ success: false, error: 'Hospital Name and URL slug are required' });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-');

    const existing = await prisma.clinic.findUnique({
      where: { slug: cleanSlug },
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: `Hospital URL slug "${cleanSlug}" is already taken. Please choose another slug.`,
      });
    }

    let tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: { name: 'Queueless Platform Network', slug: 'queueless-platform' },
      });
    }

    const fullAddress = city
      ? `${address?.trim() || 'Central Health Campus'}, ${city.trim()}`
      : (address?.trim() || 'Central Health Campus');

    const subscriptionData = {
      planId: planId || 'PENDING_GRANT',
      planName: planName || 'Awaiting Founder Approval',
      billingCycle: billingCycle || 'MONTHLY',
      currency: currency || 'INR',
      hardwareAddon: !!hardwareAddon,
      totalAmount: totalAmount || 0,
      paymentMethod: paymentMethod || 'FOUNDER_GATEWAY',
      paymentStatus: 'PENDING_APPROVAL',
      subscribedAt: new Date().toISOString(),
      status: 'PENDING_APPROVAL',
      planStatus: 'PENDING_APPROVAL',
      adminEmail: adminEmail || null,
    };

    const clinic = await prisma.clinic.create({
      data: {
        tenantId: tenant.id,
        name: hospitalName.trim(),
        slug: cleanSlug,
        address: fullAddress,
        contactPhone: phone?.trim() || null,
        openingHours: '09:00 AM - 08:00 PM',
        adminPassword: adminPassword?.trim() || 'admin123',
        receptionPassword: 'reception123',
        settings: JSON.stringify(subscriptionData),
        services: {
          create: [
            { name: 'General Consultation', fee: 500, durationMinutes: 15 },
            { name: 'Specialist Consultation', fee: 800, durationMinutes: 20 },
            { name: 'Follow-up Consultation', fee: 250, durationMinutes: 10 },
          ],
        },
        doctors: {
          create: [
            {
              displayName: initialDoctorName?.trim() || 'Dr. Chief Consultant, MD',
              specialty: initialDoctorSpecialty?.trim() || 'General Medicine',
              roomNumber: initialDoctorRoom?.trim() || 'Cabin 1',
              active: true,
              pin: '1234',
              password: 'doctor123',
            },
          ],
        },
      },
      include: {
        doctors: true,
        services: true,
      },
    });

    // Record subscription payment in system ledger
    try {
      await prisma.payment.create({
        data: {
          clinicId: clinic.id,
          provider: paymentMethod || 'CASHFREE',
          amount: Number(totalAmount) || 2999,
          currency: currency || 'INR',
          status: 'COMPLETED',
          providerOrderId: `SUB-${Date.now().toString().slice(-6)}`,
          providerPaymentId: `PAY-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        },
      });
    } catch (payErr) {
      console.warn('Subscription payment record log warning:', payErr);
    }

    res.status(201).json({
      success: true,
      message: `🎉 Congratulations! ${clinic.name} is now live on Queueless OS.`,
      data: {
        clinic,
        subscription: subscriptionData,
        invoiceId: `INV-${Date.now().toString().slice(-6)}`,
        adminUrl: `/admin`,
        checkInUrl: `/check-in/${clinic.slug}`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 1c2. Universal Hospital Staff & Director Authentication
clinicRouter.post('/login', async (req, res) => {
  try {
    const { identifier, password, role } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, error: 'Hospital identifier and password are required' });
    }
    const cleanId = identifier.trim().toLowerCase();
    const clinic = await prisma.clinic.findFirst({
      where: {
        OR: [
          { slug: cleanId },
          { id: identifier.trim() },
          { contactPhone: identifier.trim() },
        ],
      },
      include: { doctors: true },
    });

    if (!clinic) {
      return res.status(404).json({
        success: false,
        error: `Hospital not found with ID/Slug "${identifier}". If you are a new clinic, please sign up and purchase a plan.`,
      });
    }

    if (role === 'RECEPTION') {
      const match = password === clinic.receptionPassword || password === clinic.adminPassword;
      if (!match) {
        return res.status(401).json({ success: false, error: 'Invalid reception desk password.' });
      }
    } else if (role === 'DOCTOR') {
      const match = clinic.doctors.find((d) => d.pin === password || d.password === password);
      if (!match && password !== clinic.adminPassword) {
        return res.status(401).json({ success: false, error: 'Invalid doctor cabin PIN or password.' });
      }
    } else {
      // ADMIN or DEFAULT
      const match = password === clinic.adminPassword;
      if (!match) {
        return res.status(401).json({ success: false, error: 'Invalid hospital director admin password.' });
      }
    }

    // Record Login Activity in AuditLog for Founder Dashboard
    try {
      await prisma.auditLog.create({
        data: {
          tenantId: clinic.tenantId,
          action: 'STAFF_LOGIN',
          entityType: 'Clinic',
          entityId: clinic.id,
          metadata: JSON.stringify({
            role: role || 'ADMIN',
            clinicName: clinic.name,
            clinicSlug: clinic.slug,
            identifier: cleanId,
            ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
            userAgent: req.headers['user-agent'] || 'Browser Client',
            timestamp: new Date().toISOString(),
          }),
        },
      });
    } catch (auditErr) {
      console.warn('[LOGIN AUDIT WARN]', auditErr);
    }

    const redirectUrl =
      role === 'DOCTOR'
        ? `/doctor/${clinic.slug}`
        : role === 'RECEPTION'
        ? `/reception/${clinic.slug}`
        : `/admin/${clinic.slug}`;

    res.json({
      success: true,
      data: {
        clinicId: clinic.id,
        name: clinic.name,
        slug: clinic.slug,
        role: role || 'ADMIN',
        clinic: {
          id: clinic.id,
          name: clinic.name,
          slug: clinic.slug,
          address: clinic.address,
          contactPhone: clinic.contactPhone,
        },
        redirectUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 1d. Hospital Sales / Demo Request
clinicRouter.post('/sales-inquiry', async (req, res) => {
  try {
    const { hospitalName, contactPerson, email, phone, city, bedCount, message } = req.body;
    console.log('[QUEUELESS SALES LEAD]', { hospitalName, contactPerson, email, phone, city, bedCount, message });
    res.json({
      success: true,
      message: 'Demo inquiry received! Our HealthTech enterprise team will connect within 2 hours.',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 2. Public clinic info by slug (for QR scanning and booking)
clinicRouter.get('/public/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const clinic = await prisma.clinic.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      include: {
        doctors: true,
        services: {
          where: { active: true },
        },
      },
    });

    if (!clinic) {
      return res.status(404).json({ success: false, error: 'Clinic not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    const doctorsWithLiveQueue = await Promise.all(
      clinic.doctors.map(async (doc) => {
        const waitingCount = await prisma.queueEntry.count({
          where: {
            clinicId: clinic.id,
            doctorId: doc.id,
            queueDate: today,
            status: 'WAITING',
          },
        });
        const activeConsult = await prisma.queueEntry.findFirst({
          where: {
            clinicId: clinic.id,
            doctorId: doc.id,
            queueDate: today,
            status: { in: ['CALLED', 'IN_CONSULTATION'] },
          },
          select: { token: true, status: true },
        });

        return {
          ...doc,
          waitingCount,
          currentlyServing: activeConsult?.token || null,
          estimatedWaitMinutes: waitingCount * 12,
          isAvailableNow: waitingCount === 0 && !activeConsult,
        };
      })
    );

    res.json({
      success: true,
      data: {
        ...clinic,
        doctors: doctorsWithLiveQueue,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 3. Update Clinic Profile & Operating Hours (Admin)
clinicRouter.put('/:clinicId', async (req, res) => {
  try {
    const { clinicId } = req.params;
    const { name, address, openingHours, contactPhone, logoUrl, followUpDays, settings } = req.body;

    const updated = await prisma.clinic.update({
      where: { id: clinicId },
      data: {
        name,
        address,
        openingHours,
        contactPhone,
        logoUrl: logoUrl !== undefined ? logoUrl : undefined,
        followUpDays: followUpDays !== undefined ? parseInt(followUpDays) : undefined,
        settings: settings ? (typeof settings === 'string' ? settings : JSON.stringify(settings)) : undefined,
      },
      include: {
        doctors: true,
        services: true,
      },
    });

    broadcastQueueUpdate(clinicId, 'clinic_profile_updated', updated);

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 4. Doctor Management (Add Doctor)
clinicRouter.post('/:clinicId/doctors', async (req, res) => {
  try {
    const { clinicId } = req.params;
    const {
      displayName,
      specialty,
      roomNumber,
      active,
      pin,
      password,
    } = req.body;

    if (!displayName || !specialty) {
      return res.status(400).json({ success: false, error: 'Doctor name and specialty are required' });
    }

    const doctor = await prisma.doctor.create({
      data: {
        clinicId,
        displayName,
        specialty,
        roomNumber: roomNumber || 'OPD Cabin',
        active: active !== undefined ? active : true,
        pin: pin ? String(pin).trim() : '1234',
        password: password ? String(password).trim() : (pin ? String(pin).trim() : 'doctor123'),
      },
    });

    broadcastQueueUpdate(clinicId, 'clinic_profile_updated');

    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 5. Update Doctor (Cabin, Specialty, Active status, PIN/Password)
clinicRouter.put('/:clinicId/doctors/:doctorId', async (req, res) => {
  try {
    const { doctorId, clinicId } = req.params;
    const { displayName, specialty, roomNumber, active, pin, password } = req.body;

    const updatePayload: any = {};
    if (displayName !== undefined) updatePayload.displayName = displayName;
    if (specialty !== undefined) updatePayload.specialty = specialty;
    if (roomNumber !== undefined) updatePayload.roomNumber = roomNumber;
    if (active !== undefined) updatePayload.active = active;
    if (pin !== undefined && pin !== null && String(pin).trim()) {
      updatePayload.pin = String(pin).trim();
    }
    if (password !== undefined && password !== null && String(password).trim()) {
      updatePayload.password = String(password).trim();
    }

    const updated = await prisma.doctor.update({
      where: { id: doctorId },
      data: updatePayload,
    });

    broadcastQueueUpdate(clinicId, 'clinic_profile_updated');

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 5b. Doctor Direct Change Password / PIN
clinicRouter.patch('/:clinicId/doctors/:doctorId/password', async (req, res) => {
  try {
    const { doctorId, clinicId } = req.params;
    const { currentPassword, newPassword, newPin } = req.body;

    if (!newPassword && !newPin) {
      return res.status(400).json({ success: false, error: 'New password or 4-digit PIN is required.' });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { clinic: true },
    });

    if (!doctor) {
      return res.status(404).json({ success: false, error: 'Doctor not found.' });
    }

    // Verify current password if provided
    if (currentPassword) {
      const cleanCurrent = String(currentPassword).trim();
      const isValid =
        cleanCurrent === doctor.password ||
        cleanCurrent === doctor.pin ||
        cleanCurrent === doctor.clinic.adminPassword;
      if (!isValid) {
        return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
      }
    }

    const updateData: any = {};
    if (newPassword) {
      updateData.password = String(newPassword).trim();
    }
    if (newPin) {
      updateData.pin = String(newPin).trim();
    }

    const updated = await prisma.doctor.update({
      where: { id: doctorId },
      data: updateData,
    });

    broadcastQueueUpdate(clinicId, 'clinic_profile_updated');

    res.json({
      success: true,
      message: 'Password / PIN updated successfully.',
      data: {
        id: updated.id,
        displayName: updated.displayName,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 6. Delete / Deactivate Doctor
clinicRouter.delete('/:clinicId/doctors/:doctorId', async (req, res) => {
  try {
    const { doctorId, clinicId } = req.params;

    await prisma.doctor.delete({
      where: { id: doctorId },
    });

    broadcastQueueUpdate(clinicId, 'clinic_profile_updated');

    res.json({ success: true, message: 'Doctor removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 7. Service Management (Add Service & Fee)
clinicRouter.post('/:clinicId/services', async (req, res) => {
  try {
    const { clinicId } = req.params;
    const { name, fee, durationMinutes } = req.body;

    if (!name || fee === undefined) {
      return res.status(400).json({ success: false, error: 'Service name and fee are required' });
    }

    const service = await prisma.service.create({
      data: {
        clinicId,
        name,
        fee: parseFloat(fee),
        durationMinutes: durationMinutes ? parseInt(durationMinutes) : 15,
        active: true,
      },
    });

    broadcastQueueUpdate(clinicId, 'clinic_profile_updated');

    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 8. Update Service & Fee
clinicRouter.put('/:clinicId/services/:serviceId', async (req, res) => {
  try {
    const { serviceId, clinicId } = req.params;
    const { name, fee, durationMinutes, active } = req.body;

    const updated = await prisma.service.update({
      where: { id: serviceId },
      data: {
        name,
        fee: fee !== undefined ? parseFloat(fee) : undefined,
        durationMinutes: durationMinutes !== undefined ? parseInt(durationMinutes) : undefined,
        active,
      },
    });

    broadcastQueueUpdate(clinicId, 'clinic_profile_updated');

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 9. Delete Service
clinicRouter.delete('/:clinicId/services/:serviceId', async (req, res) => {
  try {
    const { serviceId, clinicId } = req.params;

    await prisma.service.delete({
      where: { id: serviceId },
    });

    broadcastQueueUpdate(clinicId, 'clinic_profile_updated');

    res.json({ success: true, message: 'Service removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 10. Role-based Authentication & Password Verification
clinicRouter.post('/auth/verify', async (req, res) => {
  try {
    const { role, password, clinicId, doctorId } = req.body;

    const defaultClinic = await prisma.clinic.findFirst({
      where: clinicId ? { id: clinicId } : undefined,
      include: { doctors: true },
    });

    if (!defaultClinic) {
      return res.status(404).json({ success: false, error: 'Clinic not found' });
    }

    const cleanInput = (password || '').trim();

    if (role === 'ADMIN') {
      const valid = cleanInput === defaultClinic.adminPassword;
      if (!valid) {
        return res.status(401).json({ success: false, error: 'Incorrect Hospital Admin Password.' });
      }
      return res.json({
        success: true,
        role: 'ADMIN',
        clinicId: defaultClinic.id,
        clinicName: defaultClinic.name,
        name: 'Hospital Business Admin',
      });
    }

    if (role === 'RECEPTION') {
      const valid =
        cleanInput === defaultClinic.receptionPassword ||
        cleanInput === defaultClinic.adminPassword;
      if (!valid) {
        return res.status(401).json({ success: false, error: 'Incorrect Reception Desk Password.' });
      }
      return res.json({
        success: true,
        role: 'RECEPTION',
        clinicId: defaultClinic.id,
        clinicName: defaultClinic.name,
        name: 'Reception Desk Officer',
      });
    }

    if (role === 'DOCTOR') {
      if (!doctorId) {
        return res.status(400).json({ success: false, error: 'Doctor ID is required.' });
      }
      const doc = await prisma.doctor.findUnique({ where: { id: doctorId } });
      if (!doc) {
        return res.status(404).json({ success: false, error: 'Doctor not found.' });
      }
      const valid =
        cleanInput === doc.password ||
        cleanInput === doc.pin ||
        cleanInput === defaultClinic.adminPassword;
      if (!valid) {
        return res.status(401).json({ success: false, error: 'Incorrect Doctor PIN or Password.' });
      }
      return res.json({
        success: true,
        role: 'DOCTOR',
        clinicId: defaultClinic.id,
        doctorId: doc.id,
        name: doc.displayName,
        roomNumber: doc.roomNumber,
        specialty: doc.specialty,
      });
    }

    return res.status(400).json({ success: false, error: 'Invalid role requested.' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 11. Get Current Passwords / Security Settings (Admin Panel)
clinicRouter.get('/:clinicId/security', async (req, res) => {
  try {
    const { clinicId } = req.params;
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
      include: {
        doctors: {
          select: {
            id: true,
            displayName: true,
            specialty: true,
            roomNumber: true,
            active: true,
            password: true,
            pin: true,
          },
        },
      },
    });

    if (!clinic) {
      return res.status(404).json({ success: false, error: 'Clinic not found' });
    }

    res.json({
      success: true,
      data: {
        adminPassword: clinic.adminPassword || 'admin123',
        receptionPassword: clinic.receptionPassword || 'reception123',
        doctors: clinic.doctors.map((d) => ({
          id: d.id,
          name: d.displayName,
          specialty: d.specialty,
          roomNumber: d.roomNumber,
          password: d.password || 'doctor123',
          pin: d.pin || '1234',
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 12. Update Passwords from Business Admin Panel
clinicRouter.put('/:clinicId/security', async (req, res) => {
  try {
    const { clinicId } = req.params;
    const { adminPassword, receptionPassword, doctorPasswords } = req.body;

    const updateData: any = {};
    if (adminPassword && adminPassword.trim()) {
      if (adminPassword.trim().length < 8) {
        return res.status(400).json({
          success: false,
          error: 'Hospital Master Admin Password must be at least 8 characters long for clinical safety.',
        });
      }
      updateData.adminPassword = adminPassword.trim();
    }
    if (receptionPassword && receptionPassword.trim()) {
      if (receptionPassword.trim().length < 6) {
        return res.status(400).json({
          success: false,
          error: 'Reception Desk Password must be at least 6 characters long.',
        });
      }
      updateData.receptionPassword = receptionPassword.trim();
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.clinic.update({
        where: { id: clinicId },
        data: updateData,
      });
    }

    // Update doctor passwords / PINs
    if (Array.isArray(doctorPasswords)) {
      for (const item of doctorPasswords) {
        if (item.doctorId) {
          await prisma.doctor.update({
            where: { id: item.doctorId },
            data: {
              ...(item.password ? { password: item.password.trim() } : {}),
              ...(item.pin ? { pin: item.pin.trim() } : {}),
            },
          });
        }
      }
    }

    res.json({
      success: true,
      message: 'Staff passwords and PINs successfully updated by Business Admin!',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 7. Founder Subscription Plan & Premium Access Management
clinicRouter.patch('/:id/plan', async (req, res) => {
  try {
    const { id } = req.params;
    const { plan, planStatus, monthlyFee, commissionPercent, features, planExpiresAt } = req.body;

    const clinic = await prisma.clinic.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!clinic) {
      return res.status(404).json({ success: false, error: 'Hospital not found' });
    }

    let existingSettings: any = {};
    try {
      existingSettings = clinic.settings ? JSON.parse(clinic.settings) : {};
    } catch (e) {}

    const updatedSettings = {
      ...existingSettings,
      plan: plan || existingSettings.plan || 'FREE_TRIAL',
      planStatus: planStatus || existingSettings.planStatus || 'ACTIVE',
      monthlyFee: monthlyFee !== undefined ? monthlyFee : (existingSettings.monthlyFee || 0),
      commissionPercent: commissionPercent !== undefined ? commissionPercent : (existingSettings.commissionPercent || 0),
      features: features !== undefined ? features : (existingSettings.features || {
        multiCabinVoice: true,
        cashfreePayment: true,
        whatsappAlerts: true,
        abdmBridge: true,
        customDomain: true,
      }),
      planExpiresAt: planExpiresAt || existingSettings.planExpiresAt || null,
      updatedAt: new Date().toISOString(),
    };

    const updatedClinic = await prisma.clinic.update({
      where: { id: clinic.id },
      data: {
        settings: JSON.stringify(updatedSettings),
      },
    });

    res.json({
      success: true,
      message: `Hospital subscription plan updated to ${updatedSettings.plan} (${updatedSettings.planStatus})!`,
      data: {
        id: updatedClinic.id,
        name: updatedClinic.name,
        slug: updatedClinic.slug,
        settings: updatedSettings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});
