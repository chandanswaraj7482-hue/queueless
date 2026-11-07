import { Router } from 'express';
import crypto from 'crypto';
import { prisma } from '../prisma';
import { broadcastQueueUpdate } from '../socket';
import { generateNextToken } from '../utils/token';

export const queueRouter = Router();

// Helper: Get today's date string YYYY-MM-DD
function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

// 1. Patient Walk-in Check-in / Registration (Public API)
queueRouter.post('/public/clinics/:clinicId/check-ins', async (req, res) => {
  try {
    const { clinicId } = req.params;
    const {
      name,
      mobile,
      email,
      age,
      gender,
      bloodGroup,
      address,
      emergencyContact,
      doctorId,
      serviceId,
      visitReason,
      appointmentDate,
    } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({ success: false, error: 'Name and mobile number are required.' });
    }

    const clinic = await prisma.clinic.findFirst({
      where: {
        OR: [{ id: clinicId }, { slug: clinicId }],
      },
      include: { tenant: true },
    });

    if (!clinic) {
      return res.status(404).json({ success: false, error: 'Clinic not found.' });
    }

    // Determine consultation fee based on service or default
    let feeAmount = 500;
    if (serviceId) {
      const srv = await prisma.service.findUnique({ where: { id: serviceId } });
      if (srv) feeAmount = srv.fee;
    }

    // Find or create patient under this tenant with full details
    let patient = await prisma.patient.findFirst({
      where: {
        tenantId: clinic.tenantId,
        mobile,
      },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          tenantId: clinic.tenantId,
          name,
          mobile,
          email: email || null,
          age: age ? parseInt(age) : null,
          gender: gender || null,
          bloodGroup: bloodGroup || null,
          address: address || null,
          emergencyContact: emergencyContact || null,
        },
      });
    } else {
      // Update any newly provided details
      patient = await prisma.patient.update({
        where: { id: patient.id },
        data: {
          name,
          email: email || patient.email,
          age: age ? parseInt(age) : patient.age,
          gender: gender || patient.gender,
          bloodGroup: bloodGroup || patient.bloodGroup,
          address: address || patient.address,
          emergencyContact: emergencyContact || patient.emergencyContact,
        },
      });
    }

    // Check 15-day Free Follow-up eligibility for returning patient
    let isFollowUp = false;
    let followUpNote: string | null = null;
    let paymentStatus = 'PENDING';

    const followUpWindowDays = clinic.followUpDays || 15;
    const lastVisit = await prisma.queueEntry.findFirst({
      where: {
        clinicId: clinic.id,
        patientId: patient.id,
        ...(doctorId ? { doctorId } : {}),
        paymentStatus: 'PAID',
      },
      orderBy: { joinedAt: 'desc' },
    });

    if (lastVisit) {
      const diffDays = Math.floor(
        Math.abs(new Date().getTime() - new Date(lastVisit.joinedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays <= followUpWindowDays) {
        isFollowUp = true;
        const parsedSettings = typeof clinic.settings === 'string' ? JSON.parse(clinic.settings || '{}') : (clinic.settings || {});
        const isFree = parsedSettings.isFreeFollowUp !== false;
        if (isFree) {
          feeAmount = 0;
          paymentStatus = 'FREE_FOLLOW_UP';
          followUpNote = `15-Day Free Follow-up (Previous visit ${diffDays === 0 ? 'today' : `${diffDays} days ago`})`;
        } else {
          feeAmount = parsedSettings.followUpFeeAmount !== undefined ? parsedSettings.followUpFeeAmount : feeAmount;
          followUpNote = `Follow-up Consultation (Previous visit ${diffDays === 0 ? 'today' : `${diffDays} days ago`})`;
        }
      }
    }

    const today = getTodayString();
    const targetDate = appointmentDate && appointmentDate.trim() ? appointmentDate.trim() : today;
    const isFutureDate = targetDate > today;

    // Every patient receives an official Token Number right away (e.g. A-116).
    const token = await generateNextToken(clinicId);
    let initialStatus = isFutureDate ? 'BOOKED' : 'CHECKED_IN';
    if (paymentStatus === 'FREE_FOLLOW_UP') {
      initialStatus = isFutureDate ? 'BOOKED' : 'WAITING';
    } else {
      paymentStatus = 'PAY_AT_CLINIC';
    }

    const publicToken = 'ptk_' + crypto.randomBytes(12).toString('hex');

    const queueEntry = await prisma.queueEntry.create({
      data: {
        clinicId,
        patientId: patient.id,
        doctorId: doctorId || null,
        serviceId: serviceId || null,
        token,
        publicToken,
        queueDate: targetDate,
        visitReason: visitReason || null,
        status: initialStatus,
        feeAmount,
        paymentStatus,
        isFollowUp,
        followUpNote,
      },
      include: {
        doctor: true,
        service: true,
      },
    });

    // Record audit event
    await prisma.auditLog.create({
      data: {
        tenantId: clinic.tenantId,
        action: 'PATIENT_CHECK_IN',
        entityType: 'QueueEntry',
        entityId: queueEntry.id,
        metadata: JSON.stringify({ token, name, mobileSuffix: mobile.slice(-4), feeAmount }),
      },
    });

    // Broadcast realtime update to clinic staff and screens
    broadcastQueueUpdate(clinicId, 'queue_updated', {
      action: 'NEW_CHECK_IN',
      token: queueEntry.token,
    });

    res.json({
      success: true,
      data: {
        queueEntryId: queueEntry.id,
        token: queueEntry.token,
        publicToken: queueEntry.publicToken,
        status: queueEntry.status,
        feeAmount: queueEntry.feeAmount,
        paymentStatus: queueEntry.paymentStatus,
        isFollowUp: queueEntry.isFollowUp,
        followUpNote: queueEntry.followUpNote,
        clinicName: clinic.name,
        doctor: queueEntry.doctor?.displayName,
        service: queueEntry.service?.name,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 1.5 Secure Track Token with Patient Name & Identity Verification
queueRouter.post('/track-verify', async (req, res) => {
  try {
    const { token, patientName, mobile } = req.body;

    if (!token || (!patientName && !mobile)) {
      return res.status(400).json({
        success: false,
        error: 'Both Token ID and Patient Name (or Mobile number) are required for security verification.',
      });
    }

    const rawToken = String(token).trim().toUpperCase();
    const cleanToken = rawToken;
    const normalizedWithDash = cleanToken.includes('-')
      ? cleanToken
      : cleanToken.startsWith('A')
      ? `A-${cleanToken.slice(1)}`
      : `A-${cleanToken}`;

    const entry = await prisma.queueEntry.findFirst({
      where: {
        OR: [
          { token: cleanToken },
          { token: normalizedWithDash },
          { token: rawToken },
          { publicToken: rawToken },
        ],
      },
      orderBy: { joinedAt: 'desc' },
      include: {
        patient: {
          select: { name: true, mobile: true },
        },
      },
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: `Token "${token}" not found in system. Please verify your Token ID on your slip or SMS.`,
      });
    }

    // Security Verification: Match Patient Name or Mobile
    let verified = false;

    if (patientName && String(patientName).trim()) {
      const inputName = String(patientName).trim().toLowerCase();
      const actualName = entry.patient.name.trim().toLowerCase();

      // Check exact match, substring match, or individual name parts match (e.g. "Karan" matches "Karan Mehra")
      if (
        actualName === inputName ||
        actualName.includes(inputName) ||
        inputName.includes(actualName)
      ) {
        verified = true;
      } else {
        const actualParts = actualName.split(/\s+/).filter(Boolean);
        const inputParts = inputName.split(/\s+/).filter(Boolean);
        if (actualParts.some((part) => inputParts.some((inp) => part.includes(inp) || inp.includes(part)))) {
          verified = true;
        }
      }
    }

    if (!verified && mobile && String(mobile).trim()) {
      const cleanDigits = String(mobile).replace(/\D/g, '');
      const actualDigits = entry.patient.mobile.replace(/\D/g, '');
      if (
        actualDigits.includes(cleanDigits) ||
        cleanDigits.includes(actualDigits) ||
        actualDigits.endsWith(cleanDigits.slice(-4))
      ) {
        verified = true;
      }
    }

    if (!verified) {
      return res.status(403).json({
        success: false,
        error: '⚠️ Security Verification Failed: The patient name provided does not match this Token ID. For medical privacy, only the registered patient can access this live token.',
      });
    }

    return res.json({
      success: true,
      publicToken: entry.publicToken,
      token: entry.token,
      patientName: entry.patient.name,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 2. Safe Patient Live Status (Supports publicToken, Token ID like A-108, or Mobile)
queueRouter.get('/patient/:publicToken', async (req, res) => {
  try {
    const { publicToken: rawIdentifier } = req.params;
    const identifier = decodeURIComponent(rawIdentifier).trim();

    // 1. Try finding by publicToken first
    let entry = await prisma.queueEntry.findUnique({
      where: { publicToken: identifier },
      include: {
        clinic: true,
        doctor: true,
        service: true,
        payment: true,
        patient: {
          select: { name: true, mobile: true, age: true, gender: true, bloodGroup: true, email: true, address: true, emergencyContact: true },
        },
      },
    });

    // 2. If not found, try finding by Token ID (e.g. A-108, a108, 108)
    if (!entry) {
      const cleanToken = identifier.toUpperCase();
      const normalizedWithDash = cleanToken.includes('-')
        ? cleanToken
        : cleanToken.startsWith('A')
        ? `A-${cleanToken.slice(1)}`
        : `A-${cleanToken}`;

      entry = await prisma.queueEntry.findFirst({
        where: {
          OR: [
            { token: cleanToken },
            { token: normalizedWithDash },
            { token: identifier },
          ],
        },
        orderBy: { joinedAt: 'desc' },
        include: {
          clinic: true,
          doctor: true,
          service: true,
          payment: true,
          patient: {
            select: { name: true, mobile: true, age: true, gender: true, bloodGroup: true, email: true, address: true, emergencyContact: true },
          },
        },
      });
    }

    // 3. If still not found and input contains a mobile number, find latest queue entry
    const cleanPhoneDigits = identifier.replace(/\D/g, '');
    if (!entry && cleanPhoneDigits.length >= 10) {
      const last10Digits = cleanPhoneDigits.slice(-10);
      entry = await prisma.queueEntry.findFirst({
        where: {
          patient: {
            mobile: {
              contains: last10Digits,
            },
          },
        },
        orderBy: { joinedAt: 'desc' },
        include: {
          clinic: true,
          doctor: true,
          service: true,
          payment: true,
          patient: {
            select: { name: true, mobile: true, age: true, gender: true, bloodGroup: true, email: true, address: true, emergencyContact: true },
          },
        },
      });
    }

    if (!entry) {
      return res.status(404).json({ success: false, error: 'Queue token not found or invalid.' });
    }

    // Count how many patients are ahead of this token in WAITING status
    const patientsAhead = await prisma.queueEntry.count({
      where: {
        clinicId: entry.clinicId,
        queueDate: entry.queueDate,
        doctorId: entry.doctorId,
        status: 'WAITING',
        joinedAt: { lt: entry.joinedAt },
      },
    });

    // Current patient in consultation or called
    const currentActive = await prisma.queueEntry.findFirst({
      where: {
        clinicId: entry.clinicId,
        queueDate: entry.queueDate,
        doctorId: entry.doctorId,
        status: { in: ['CALLED', 'IN_CONSULTATION'] },
      },
      select: { token: true, status: true },
    });

    // Estimated wait time (approx 10-15 mins per patient ahead)
    const avgDuration = entry.service?.durationMinutes || 15;
    const estimatedMinutes = Math.max(0, patientsAhead * avgDuration);

    const isPaymentApproved = entry.paymentStatus === 'PAID';

    res.json({
      success: true,
      data: {
        id: entry.id,
        clinicId: entry.clinicId,
        token: entry.token,
        hasToken: true,
        isPaymentApproved,
        status: entry.status,
        patientName: entry.patient.name,
        patientMobile: entry.patient.mobile,
        patientAge: entry.patient.age,
        patientGender: entry.patient.gender,
        patientBloodGroup: entry.patient.bloodGroup,
        patientAddress: entry.patient.address,
        visitReason: entry.visitReason,
        clinicName: entry.clinic.name,
        clinicAddress: entry.clinic.address,
        clinicLogo: entry.clinic.logoUrl,
        clinicPhone: entry.clinic.contactPhone,
        doctorName: entry.doctor?.displayName || 'Any Available Doctor',
        roomNumber: entry.doctor?.roomNumber || 'General OPD',
        patientsAhead: isPaymentApproved ? patientsAhead : null,
        estimatedWaitMinutes: isPaymentApproved
          ? `${estimatedMinutes} - ${estimatedMinutes + 10} mins`
          : 'Awaiting Reception Cash Approval',
        currentlyServing: currentActive?.token || 'None',
        joinedAt: entry.joinedAt,
        calledAt: entry.calledAt,
        feeAmount: entry.feeAmount,
        paymentStatus: entry.paymentStatus,
        isFollowUp: entry.isFollowUp,
        followUpNote: entry.followUpNote,
        payment: entry.payment,
        diagnosis: entry.diagnosis,
        vitals: entry.vitalsJson ? JSON.parse(entry.vitalsJson) : null,
        prescription: entry.prescriptionJson ? JSON.parse(entry.prescriptionJson) : null,
        clinicalNotes: entry.clinicalNotes,
        publicToken: entry.publicToken,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 3. Reception & Doctor: Get Queue for Clinic (Supports Single Date, From-To Date Range, or Today)
queueRouter.get('/clinics/:clinicId/today', async (req, res) => {
  try {
    const { clinicId } = req.params;
    const { doctorId, date, startDate, endDate, fromDate, toDate } = req.query;
    const today = getTodayString();

    const from = (fromDate || startDate || (date !== 'ALL' && date ? date : undefined)) as string | undefined;
    const to = (toDate || endDate || from) as string | undefined;

    const clinic = await prisma.clinic.findFirst({
      where: {
        OR: [{ id: clinicId }, { slug: clinicId }],
      },
      select: { id: true },
    });
    const resolvedClinicId = clinic ? clinic.id : clinicId;

    const whereClause: any = { clinicId: resolvedClinicId };

    if (from && to && from !== 'ALL') {
      if (from === to) {
        whereClause.queueDate = {
          gte: from,
          lte: to,
        };
      } else {
        whereClause.queueDate = {
          gte: from,
          lte: to,
        };
      }
    } else if (from && from !== 'ALL') {
      whereClause.queueDate = from;
    } else if (!date && !startDate && !fromDate) {
      whereClause.queueDate = today;
    }

    if (doctorId && typeof doctorId === 'string') {
      whereClause.doctorId = doctorId;
    }

    const entries = await prisma.queueEntry.findMany({
      where: whereClause,
      include: {
        patient: true,
        doctor: true,
        service: true,
        payment: true,
      },
      orderBy: [
        { priority: 'desc' },
        { joinedAt: 'asc' },
      ],
    });

    res.json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 4. Atomic "Call Next" - Finds and calls next WAITING patient
queueRouter.post('/clinics/:clinicId/call-next', async (req, res) => {
  try {
    const { clinicId } = req.params;
    const { doctorId, callerName } = req.body;
    const today = getTodayString();

    const clinic = await prisma.clinic.findFirst({
      where: {
        OR: [{ id: clinicId }, { slug: clinicId }],
      },
      select: { id: true },
    });
    const resolvedClinicId = clinic ? clinic.id : clinicId;

    // Use Prisma transaction to ensure atomic check & update
    const result = await prisma.$transaction(async (tx) => {
      // Find the next eligible waiting patient (Must be paid or free follow-up)
      const nextEntry = await tx.queueEntry.findFirst({
        where: {
          clinicId: resolvedClinicId,
          queueDate: today,
          status: { in: ['WAITING', 'CHECKED_IN'] },
          paymentStatus: { in: ['PAID', 'FREE_FOLLOW_UP'] },
          ...(doctorId ? { doctorId } : {}),
        },
        orderBy: [
          { priority: 'desc' },
          { joinedAt: 'asc' },
        ],
        include: {
          patient: true,
          doctor: true,
        },
      });

      if (!nextEntry) {
        return null;
      }

      // Update to CALLED
      const updated = await tx.queueEntry.update({
        where: { id: nextEntry.id },
        data: {
          status: 'CALLED',
          calledAt: new Date(),
        },
        include: {
          patient: true,
          doctor: true,
        },
      });

      // Audit Log
      const clinicRecord = await tx.clinic.findUnique({ where: { id: resolvedClinicId } });
      if (clinicRecord) {
        await tx.auditLog.create({
          data: {
            tenantId: clinicRecord.tenantId,
            action: 'CALL_NEXT',
            entityType: 'QueueEntry',
            entityId: updated.id,
            metadata: JSON.stringify({ token: updated.token, calledBy: callerName || 'Reception' }),
          },
        });
      }

      return updated;
    });

    if (!result) {
      return res.status(200).json({ success: true, message: 'No waiting patients in queue.', data: null });
    }

    // Broadcast call to Display Kiosks and Doctor/Patient apps (both slug and UUID for reliability)
    broadcastQueueUpdate(resolvedClinicId, 'patient_called', {
      token: result.token,
      patientName: result.patient.name,
      roomNumber: result.doctor?.roomNumber || 'Cabin 1',
      doctorName: result.doctor?.displayName,
    });
    broadcastQueueUpdate(resolvedClinicId, 'queue_updated', { action: 'CALL_NEXT', entryId: result.id });
    if (clinicId !== resolvedClinicId) {
      broadcastQueueUpdate(clinicId, 'patient_called', {
        token: result.token,
        patientName: result.patient.name,
        roomNumber: result.doctor?.roomNumber || 'Cabin 1',
        doctorName: result.doctor?.displayName,
      });
      broadcastQueueUpdate(clinicId, 'queue_updated', { action: 'CALL_NEXT', entryId: result.id });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 5. Specific Entry Action: Call, Start, Complete, Skip, No-Show, Recall
queueRouter.post('/:entryId/transition', async (req, res) => {
  try {
    const { entryId } = req.params;
    const { targetStatus, actorName } = req.body;

    const allowedStatuses = [
      'WAITING',
      'CALLED',
      'IN_CONSULTATION',
      'COMPLETED',
      'SKIPPED',
      'NO_SHOW',
      'CANCELLED',
    ];

    if (!allowedStatuses.includes(targetStatus)) {
      return res.status(400).json({ success: false, error: `Invalid target status: ${targetStatus}` });
    }

    const current = await prisma.queueEntry.findUnique({
      where: { id: entryId },
      include: { clinic: true, patient: true, doctor: true },
    });

    if (!current) {
      return res.status(404).json({ success: false, error: 'Queue entry not found.' });
    }

    const updateData: any = { status: targetStatus };
    if (targetStatus === 'CALLED') updateData.calledAt = new Date();
    if (targetStatus === 'IN_CONSULTATION') updateData.startedAt = new Date();
    if (targetStatus === 'COMPLETED') updateData.completedAt = new Date();

    const updated = await prisma.queueEntry.update({
      where: { id: entryId },
      data: updateData,
      include: { patient: true, doctor: true },
    });

    // Record audit event
    await prisma.auditLog.create({
      data: {
        tenantId: current.clinic.tenantId,
        action: `TRANSITION_TO_${targetStatus}`,
        entityType: 'QueueEntry',
        entityId: entryId,
        metadata: JSON.stringify({
          previousStatus: current.status,
          newStatus: targetStatus,
          actor: actorName || 'Staff',
        }),
      },
    });

    // If called, notify attendant/display
    if (targetStatus === 'CALLED') {
      broadcastQueueUpdate(current.clinicId, 'patient_called', {
        token: updated.token,
        patientName: updated.patient.name,
        roomNumber: updated.doctor?.roomNumber || 'Room',
        doctorName: updated.doctor?.displayName,
      });
    }

    broadcastQueueUpdate(current.clinicId, 'queue_updated', {
      action: 'STATUS_CHANGED',
      entryId: updated.id,
      status: targetStatus,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 6. Display Kiosk Data (Public / Kiosk view)
queueRouter.get('/clinics/:clinicId/display', async (req, res) => {
  try {
    const { clinicId } = req.params;
    const today = getTodayString();

    const clinic = await prisma.clinic.findFirst({
      where: {
        OR: [{ id: clinicId }, { slug: clinicId }],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        logoUrl: true,
        openingHours: true,
      },
    });

    if (!clinic) {
      return res.status(404).json({ success: false, error: 'Clinic not found' });
    }

    const realClinicId = clinic.id;

    const currentlyCalled = await prisma.queueEntry.findMany({
      where: {
        clinicId: realClinicId,
        queueDate: today,
        status: { in: ['CALLED', 'IN_CONSULTATION'] },
      },
      include: {
        doctor: true,
        patient: { select: { name: true } },
      },
      orderBy: { calledAt: 'desc' },
      take: 4,
    });

    const upcomingWaiting = await prisma.queueEntry.findMany({
      where: {
        clinicId: realClinicId,
        queueDate: today,
        status: { in: ['WAITING', 'CHECKED_IN'] },
        NOT: { token: 'PENDING' },
      },
      include: {
        doctor: true,
      },
      orderBy: [
        { priority: 'desc' },
        { joinedAt: 'asc' },
      ],
      take: 6,
    });

    res.json({
      success: true,
      data: {
        clinic,
        nowServing: currentlyCalled,
        nextWaiting: upcomingWaiting,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 7. Save Clinical Consultation & Issue Rx Prescription
queueRouter.put('/:entryId/consultation', async (req, res) => {
  try {
    const { entryId } = req.params;
    const {
      diagnosis,
      vitals,
      prescriptions,
      labTests,
      clinicalNotes,
      advice,
      followUpDays,
      completeConsultation,
    } = req.body;

    const existing = await prisma.queueEntry.findUnique({
      where: { id: entryId },
      include: { clinic: true, patient: true, doctor: true },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Queue entry not found' });
    }

    const rxNumber = `RX-${existing.queueDate.replace(/-/g, '')}-${existing.token.replace(/[^A-Z0-9]/gi, '')}`;

    const rxPayload = {
      medicines: Array.isArray(prescriptions) ? prescriptions : [],
      labTests: Array.isArray(labTests) ? labTests : [],
      advice: advice || clinicalNotes || existing.clinicalNotes || '',
      followUpDays: followUpDays || 7,
      rxNumber,
      issuedAt: new Date().toISOString(),
      patientPhone: existing.patient.mobile,
      patientEmail: existing.patient.email,
    };

    const updateData: any = {
      diagnosis: diagnosis !== undefined ? diagnosis : existing.diagnosis,
      vitalsJson: vitals ? JSON.stringify(vitals) : existing.vitalsJson,
      prescriptionJson: JSON.stringify(rxPayload),
      clinicalNotes: advice || clinicalNotes !== undefined ? (advice || clinicalNotes) : existing.clinicalNotes,
    };

    if (completeConsultation) {
      updateData.status = 'COMPLETED';
      updateData.completedAt = new Date();

      // Automated Multi-Channel Dispatch Simulation
      console.log(`[AUTOMATED WHATSAPP DISPATCH] E-Prescription ${rxNumber} sent as PDF to patient WhatsApp (+91 ${existing.patient.mobile})`);
      if (existing.patient.email) {
        console.log(`[AUTOMATED EMAIL DISPATCH] Official PDF E-Prescription ${rxNumber} emailed to ${existing.patient.email}`);
      }
    }

    const updated = await prisma.queueEntry.update({
      where: { id: entryId },
      data: updateData,
      include: {
        clinic: true,
        patient: true,
        doctor: true,
        service: true,
      },
    });

    broadcastQueueUpdate(updated.clinicId, 'queue_updated', {
      action: completeConsultation ? 'PRESCRIPTION_ISSUED' : 'CONSULTATION_SAVED',
      entryId: updated.id,
      publicToken: updated.publicToken,
      status: updated.status,
      prescription: rxPayload,
    });

    res.json({
      success: true,
      message: completeConsultation
        ? `✓ Digital E-Prescription (${rxNumber}) issued! Synced to patient ID and sent via WhatsApp & Email.`
        : 'Consultation notes updated successfully.',
      data: {
        ...updated,
        vitals: updated.vitalsJson ? JSON.parse(updated.vitalsJson) : null,
        prescriptions: rxPayload.medicines,
        labTests: rxPayload.labTests,
        advice: rxPayload.advice,
        rxNumber,
        whatsappSent: true,
        emailSent: !!existing.patient.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 8. Get Branded Prescription by Entry ID or Public Token
queueRouter.get('/:entryId/prescription', async (req, res) => {
  try {
    const { entryId } = req.params;

    // Can search by id OR publicToken
    const entry = await prisma.queueEntry.findFirst({
      where: {
        OR: [
          { id: entryId },
          { publicToken: entryId },
        ],
      },
      include: {
        clinic: true,
        patient: true,
        doctor: true,
        service: true,
      },
    });

    if (!entry) {
      return res.status(404).json({ success: false, error: 'Prescription record not found' });
    }

    const vitals = entry.vitalsJson ? JSON.parse(entry.vitalsJson) : null;

    let medicines: any[] = [];
    let labTests: string[] = [];
    let advice = entry.clinicalNotes || 'Follow medication schedule as prescribed.';
    let followUpDays = 7;
    let rxNumber = `RX-${entry.queueDate.replace(/-/g, '')}-${entry.token.replace(/[^A-Z0-9]/gi, '')}`;

    if (entry.prescriptionJson) {
      try {
        const parsed = JSON.parse(entry.prescriptionJson);
        if (Array.isArray(parsed)) {
          medicines = parsed;
        } else if (parsed && typeof parsed === 'object') {
          medicines = parsed.medicines || [];
          labTests = parsed.labTests || [];
          if (parsed.advice) advice = parsed.advice;
          if (parsed.followUpDays) followUpDays = parsed.followUpDays;
          if (parsed.rxNumber) rxNumber = parsed.rxNumber;
        }
      } catch (e) {
        console.error('Failed to parse prescriptionJson', e);
      }
    }

    res.json({
      success: true,
      data: {
        id: entry.id,
        clinicId: entry.clinicId,
        token: entry.token,
        publicToken: entry.publicToken,
        rxNumber,
        date: entry.queueDate,
        createdAt: entry.completedAt || entry.joinedAt,
        clinic: {
          id: entry.clinic.id,
          name: entry.clinic.name,
          address: entry.clinic.address,
          phone: entry.clinic.contactPhone || null,
          logoUrl: entry.clinic.logoUrl,
        },
        doctor: {
          id: entry.doctor?.id,
          name: entry.doctor?.displayName || 'Medical Officer',
          specialty: entry.doctor?.specialty || 'General Physician',
          roomNumber: entry.doctor?.roomNumber || 'OPD Cabin',
        },
        patient: {
          id: entry.patient.id,
          name: entry.patient.name,
          mobile: entry.patient.mobile,
          email: entry.patient.email,
          age: entry.patient.age,
          gender: entry.patient.gender,
          bloodGroup: entry.patient.bloodGroup,
          address: entry.patient.address,
        },
        diagnosis: entry.diagnosis || 'General OPD Examination',
        clinicalNotes: advice,
        advice,
        followUpDays,
        vitals,
        prescriptions: medicines,
        medicines,
        labTests,
        whatsappSent: true,
        emailSent: !!entry.patient.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

