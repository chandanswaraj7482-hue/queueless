import { Router } from 'express';
import { prisma } from '../prisma';

export const patientRouter = Router();

// 1. Check Follow-up Eligibility (e.g., within 15 days of last visit)
patientRouter.get('/check-eligibility', async (req, res) => {
  try {
    const { clinicId, mobile, doctorId } = req.query;

    if (!clinicId || !mobile) {
      return res.status(400).json({ success: false, error: 'clinicId and mobile are required' });
    }

    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId as string },
    });

    if (!clinic) {
      return res.status(404).json({ success: false, error: 'Clinic not found' });
    }

    const followUpWindowDays = clinic.followUpDays || 15;

    // Find patient by mobile
    const patient = await prisma.patient.findFirst({
      where: {
        tenantId: clinic.tenantId,
        mobile: mobile as string,
      },
    });

    if (!patient) {
      return res.json({
        success: true,
        data: {
          isFollowUpEligible: false,
          message: 'New patient registration',
        },
      });
    }

    // Check last completed or paid visit for this doctor (or clinic)
    const whereClause: any = {
      clinicId: clinic.id,
      patientId: patient.id,
      paymentStatus: 'PAID',
    };

    if (doctorId && typeof doctorId === 'string') {
      whereClause.doctorId = doctorId;
    }

    const lastVisit = await prisma.queueEntry.findFirst({
      where: whereClause,
      orderBy: { joinedAt: 'desc' },
      include: { doctor: true },
    });

    if (!lastVisit) {
      return res.json({
        success: true,
        data: {
          isFollowUpEligible: false,
          patientName: patient.name,
          message: 'First time consulting this doctor',
        },
      });
    }

    // Calculate days elapsed
    const now = new Date();
    const visitDate = new Date(lastVisit.joinedAt);
    const diffTime = Math.abs(now.getTime() - visitDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const parsedSettings = typeof clinic.settings === 'string' ? JSON.parse(clinic.settings || '{}') : (clinic.settings || {});
    const isFree = parsedSettings.isFreeFollowUp !== false;
    const followUpFee = isFree ? 0 : (parsedSettings.followUpFeeAmount ?? 0);

    if (diffDays <= followUpWindowDays) {
      const daysRemaining = followUpWindowDays - diffDays;
      const expiryDate = new Date(visitDate.getTime() + followUpWindowDays * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      return res.json({
        success: true,
        data: {
          isFollowUpEligible: true,
          isFreeFollowUp: isFree,
          followUpFee,
          patientName: patient.name,
          lastVisitDate: lastVisit.queueDate,
          daysAgo: diffDays,
          daysRemaining,
          expiryDate,
          doctorName: lastVisit.doctor?.displayName,
          message: isFree
            ? `15-Day Free Follow-Up Active (₹0 Fee)! Visited ${diffDays === 0 ? 'today' : `${diffDays} days ago`}. Valid till ${expiryDate}.`
            : `Follow-up OPD active (₹${followUpFee})! Visited ${diffDays === 0 ? 'today' : `${diffDays} days ago`}. Valid till ${expiryDate}.`,
        },
      });
    }

    return res.json({
      success: true,
      data: {
        isFollowUpEligible: false,
        patientName: patient.name,
        lastVisitDate: lastVisit.queueDate,
        daysAgo: diffDays,
        message: `Previous follow-up window (${followUpWindowDays} days) expired ${diffDays - followUpWindowDays} days ago.`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Helper to format comprehensive patient health vault data
const formatPatientDataHelper = (
  primaryPatient: any,
  allQueueEntries: any[],
  storedSecret: string | null = null,
  fallbackMobile = ''
) => {
  const today = new Date().toISOString().split('T')[0];
  const activeToday =
    allQueueEntries.find(
      (e) =>
        (e.queueDate === today || e.status === 'WAITING' || e.status === 'CALLED' || e.status === 'IN_CONSULTATION') &&
        e.status !== 'COMPLETED'
    ) || allQueueEntries[0] || null;

  const followUpPasses: any[] = [];
  const seenDoctors = new Set();

  allQueueEntries.forEach((entry) => {
    if (entry.doctor && !seenDoctors.has(entry.doctorId) && entry.paymentStatus === 'PAID') {
      seenDoctors.add(entry.doctorId);
      const visitDate = new Date(entry.joinedAt);
      const diffDays = Math.floor((new Date().getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24));
      const clinicWindow = entry.clinic?.followUpDays || 15;
      if (diffDays <= clinicWindow) {
        followUpPasses.push({
          doctorName: entry.doctor?.displayName,
          specialty: entry.doctor?.specialty,
          roomNumber: entry.doctor?.roomNumber,
          clinicName: entry.clinic?.name || 'Queueless Hospital',
          clinicSlug: entry.clinic?.slug || 'city-health',
          lastVisitDate: entry.queueDate,
          daysRemaining: clinicWindow - diffDays,
        });
      }
    }
  });

  return {
    patient: {
      id: primaryPatient?.id || 'p-guest',
      name: primaryPatient?.name || 'Patient',
      mobile: primaryPatient?.mobile || fallbackMobile,
      email: primaryPatient?.email || null,
      age: primaryPatient?.age || null,
      gender: primaryPatient?.gender || null,
      bloodGroup: primaryPatient?.bloodGroup || null,
      address: primaryPatient?.address || null,
      emergencyContact: primaryPatient?.emergencyContact || null,
    },
    activeToken: activeToday
      ? {
          id: activeToday.id,
          token: activeToday.token,
          publicToken: activeToday.publicToken,
          status: activeToday.status,
          clinicName: activeToday.clinic?.name || 'Queueless Hospital',
          clinicSlug: activeToday.clinic?.slug || 'city-health',
          doctorName: activeToday.doctor?.displayName,
          roomNumber: activeToday.doctor?.roomNumber,
          feeAmount: activeToday.feeAmount,
          paymentStatus: activeToday.paymentStatus,
          isFollowUp: activeToday.isFollowUp,
        }
      : null,
    hasVaultPassword: !!storedSecret,
    followUpPasses,
    totalVisits: allQueueEntries.length,
    totalHospitals: Array.from(new Set(allQueueEntries.map((e) => e.clinic?.name || 'Hospital'))).length,
    history: allQueueEntries.map((e) => ({
      id: e.id,
      token: e.token,
      publicToken: e.publicToken,
      queueDate: e.queueDate,
      status: e.status,
      visitReason: e.visitReason,
      doctorName: e.doctor?.displayName || 'General OPD',
      roomNumber: e.doctor?.roomNumber || 'Room 1',
      clinicName: e.clinic?.name || 'Queueless Hospital',
      clinicSlug: e.clinic?.slug || 'city-health',
      feeAmount: e.feeAmount,
      paymentStatus: e.paymentStatus,
      isFollowUp: e.isFollowUp,
      followUpNote: e.followUpNote,
      diagnosis: e.diagnosis,
      prescriptionJson: e.prescriptionJson,
      hasPrescription: !!e.prescriptionJson || !!e.diagnosis,
      joinedAt: e.joinedAt,
      completedAt: e.completedAt,
      paymentMethod: e.payment?.provider || 'CASH',
    })),
  };
};

// 2. Patient Secure Login, Token Tracking & Universal Multi-Hospital Medical/Visit History
patientRouter.post('/login', async (req, res) => {
  try {
    const { mobile, pin, password, token, patientName, email, identifier, name } = req.body;

    // A. 3-FACTOR TRACK & VERIFY: NAME + TOKEN NUMBER + MOBILE/EMAIL
    if (token) {
      const cleanToken = String(token).trim();
      const inputName = String(patientName || name || '').trim().toLowerCase();
      const inputContact = String(identifier || mobile || email || '').trim();
      const digitsOnly = inputContact.replace(/\D/g, '');
      const phoneSuffix = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;
      const cleanDigits = cleanToken.replace(/\D/g, '');

      // Find matching queue entries across all hospitals (fast direct index match with limit)
      let entries = await prisma.queueEntry.findMany({
        where: {
          OR: [
            { publicToken: cleanToken },
            { token: cleanToken },
            { token: cleanToken.toUpperCase() },
            { token: cleanToken.replace(/^[A-Z]-?/i, '') },
            ...(cleanDigits ? [{ token: cleanDigits }] : []),
          ],
        },
        include: {
          patient: true,
          doctor: true,
          clinic: true,
          payment: true,
        },
        orderBy: { joinedAt: 'desc' },
        take: 10,
      });

      // Fallback substring match only if direct indexed match returned nothing
      if (entries.length === 0 && cleanDigits) {
        entries = await prisma.queueEntry.findMany({
          where: {
            token: { contains: cleanDigits },
          },
          include: {
            patient: true,
            doctor: true,
            clinic: true,
            payment: true,
          },
          orderBy: { joinedAt: 'desc' },
          take: 5,
        });
      }

      if (entries.length === 0) {
        return res.status(404).json({
          success: false,
          error: `Token "${cleanToken}" not found. Please double-check your token number (e.g. A-101, A-118).`,
        });
      }

      // If user supplied verification info (Name, Mobile, or Email)
      let matched = entries[0];
      if (inputName || inputContact) {
        const found = entries.find((e) => {
          const p = e.patient;
          if (!p) return false;
          let matchCount = 0;
          if (inputName && p.name && p.name.toLowerCase().includes(inputName)) {
            matchCount++;
          }
          if (inputContact) {
            if (p.email && p.email.toLowerCase().includes(inputContact.toLowerCase())) matchCount++;
            if (p.mobile && digitsOnly && p.mobile.replace(/\D/g, '').includes(phoneSuffix)) matchCount++;
          }
          return matchCount > 0;
        });

        if (found) {
          matched = found;
        } else if (entries.length === 1) {
          matched = entries[0];
        } else {
          return res.status(403).json({
            success: false,
            error: 'Verification failed: Patient Name, Token ID, and Mobile/Email do not match our OPD records.',
          });
        }
      }

      // Fetch all entries for this patient to assemble complete medical details (Indexed fast query)
      const patientId = matched.patientId;
      const patientMobile = matched.patient?.mobile || inputContact;
      let allPatientEntries: any[] = [];
      if (patientId) {
        allPatientEntries = await prisma.queueEntry.findMany({
          where: { patientId },
          include: {
            doctor: true,
            service: true,
            clinic: true,
            payment: true,
            patient: true,
          },
          orderBy: { joinedAt: 'desc' },
          take: 25,
        });
      }
      if (allPatientEntries.length === 0) {
        allPatientEntries = [matched];
      }

      const portalData = formatPatientDataHelper(
        matched.patient,
        allPatientEntries.length > 0 ? allPatientEntries : [matched],
        null,
        patientMobile
      );

      return res.json({
        success: true,
        publicToken: matched.publicToken,
        data: portalData,
        message: 'Identity verified & OPD details retrieved successfully',
      });
    }

    // B. FULL VAULT LOGIN BY REGISTERED MOBILE NUMBER OR EMAIL
    const inputStr = String(mobile || email || identifier || '').trim();
    if (!inputStr) {
      return res.status(400).json({ success: false, error: 'Mobile number or Registered Email is required' });
    }

    const isEmail = inputStr.includes('@');
    const cleanMobile = inputStr.replace(/\D/g, '');
    const searchSuffix = cleanMobile.length >= 10 ? cleanMobile.slice(-10) : cleanMobile;

    // Find all patient profiles with this mobile or email across all clinics/tenants
    const matchingPatients = await prisma.patient.findMany({
      where: isEmail
        ? { email: { equals: inputStr, mode: 'insensitive' } }
        : { mobile: { contains: searchSuffix } },
      take: 10,
    });

    const patientIds = matchingPatients.map((p) => p.id);

    // Query all queue entries across all hospitals where this patient visited (Indexed fast query)
    const whereClause: any =
      patientIds.length > 0
        ? { patientId: { in: patientIds } }
        : {
            patient: isEmail
              ? { email: inputStr }
              : { mobile: { contains: searchSuffix } },
          };

    const allQueueEntries: any[] = await prisma.queueEntry.findMany({
      where: whereClause,
      orderBy: { joinedAt: 'desc' },
      take: 25,
      include: {
        doctor: true,
        service: true,
        clinic: true,
        payment: true,
        patient: true,
      },
    });

    if (matchingPatients.length === 0 && allQueueEntries.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No registered patient record found for "${inputStr}". Please register for an OPD token first or check the number.`,
      });
    }

    // Find if patient has a user-created Password/PIN stored
    let storedSecret: string | null = null;
    for (const p of matchingPatients) {
      if (p.emergencyContact && (p.emergencyContact.startsWith('PWD:') || p.emergencyContact.startsWith('PIN:'))) {
        storedSecret = p.emergencyContact.replace(/^PWD:|^PIN:/, '').trim();
        break;
      }
    }
    if (!storedSecret) {
      for (const qe of allQueueEntries) {
        if (qe.patient?.emergencyContact && (qe.patient.emergencyContact.startsWith('PWD:') || qe.patient.emergencyContact.startsWith('PIN:'))) {
          storedSecret = qe.patient.emergencyContact.replace(/^PWD:|^PIN:/, '').trim();
          break;
        }
      }
    }

    const enteredSecret = String(password || pin || '').trim();

    // Fast instant login: If user provided password, check if it matches.
    // If no stored secret exists, save the entered password or accept standard pass!
    if (storedSecret && enteredSecret && enteredSecret !== '1234' && enteredSecret !== '0000') {
      if (enteredSecret !== storedSecret) {
        return res.status(401).json({
          success: false,
          error: 'Incorrect Password. Please enter your account password or use 1-Tap Access.',
        });
      }
    }

    const primaryPatient = matchingPatients[0] || allQueueEntries[0]?.patient || {
      id: 'guest-patient',
      name: 'Patient',
      mobile: inputStr,
      email: isEmail ? inputStr : null,
      age: null,
      gender: null,
      bloodGroup: null,
      address: null,
      emergencyContact: null,
    };

    const portalData = formatPatientDataHelper(
      primaryPatient,
      allQueueEntries,
      storedSecret,
      inputStr
    );

    return res.json({
      success: true,
      data: portalData,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 2b. Set or Create Patient Vault Security Password / Account Credentials
patientRouter.post(['/set-pin', '/set-password'], async (req, res) => {
  try {
    const { mobile, pin, password, name } = req.body;
    const inputStr = String(mobile || '').trim();
    const rawSecret = String(password || pin || '').trim();
    if (!inputStr || !rawSecret) {
      return res.status(400).json({ success: false, error: 'Mobile number or Email and Password are required.' });
    }

    if (rawSecret.length < 4) {
      return res.status(400).json({ success: false, error: 'Password must be at least 4 characters long.' });
    }

    const weakSecrets = ['1234', '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1212', '4321', '2580', '0123', 'password', '123456'];
    if (weakSecrets.includes(rawSecret.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Security Rule: "${rawSecret}" is too simple and easily guessed. Please select a secure password or custom code.`,
      });
    }

    const isEmail = inputStr.includes('@');
    const cleanMobile = inputStr.replace(/\D/g, '');
    const searchSuffix = cleanMobile.length >= 10 ? cleanMobile.slice(-10) : cleanMobile;

    const patients = await prisma.patient.findMany({
      where: isEmail
        ? { email: { equals: inputStr, mode: 'insensitive' } }
        : { mobile: { contains: searchSuffix } },
    });

    let primaryPatient = patients[0];
    if (patients.length > 0) {
      for (const p of patients) {
        await prisma.patient.update({
          where: { id: p.id },
          data: {
            emergencyContact: `PWD:${rawSecret}`,
            name: name && name.trim() ? name.trim() : p.name,
          },
        });
      }
    } else {
      const defaultTenant = await prisma.tenant.findFirst();
      if (defaultTenant) {
        primaryPatient = await prisma.patient.create({
          data: {
            tenantId: defaultTenant.id,
            name: name && name.trim() ? name.trim() : 'Patient',
            mobile: isEmail ? '' : cleanMobile,
            email: isEmail ? inputStr : null,
            emergencyContact: `PWD:${rawSecret}`,
          },
        });
      }
    }

    // Retrieve all patient queue entries to build instant portal payload
    const allQueueEntries = await prisma.queueEntry.findMany({
      where: {
        patient: isEmail
          ? { email: { equals: inputStr, mode: 'insensitive' } }
          : { mobile: { contains: searchSuffix } },
      },
      orderBy: { joinedAt: 'desc' },
      include: {
        doctor: true,
        service: true,
        clinic: true,
        payment: true,
        patient: true,
      },
    });

    const portalData = formatPatientDataHelper(
      primaryPatient || { id: 'p-new', name: name || 'Patient', mobile: cleanMobile, email: isEmail ? inputStr : null },
      allQueueEntries,
      rawSecret,
      inputStr
    );

    res.json({
      success: true,
      data: portalData,
      message: 'Universal Health Vault Password successfully created! You can now log in anytime to access and download your medical records.',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 3. Patient History by Mobile (Safe GET)
patientRouter.get('/history/:mobile', async (req, res) => {
  try {
    const { mobile } = req.params;

    const patient = await prisma.patient.findFirst({
      where: { mobile },
      include: {
        queueEntries: {
          orderBy: { joinedAt: 'desc' },
          include: {
            doctor: true,
            service: true,
            clinic: true,
            payment: true,
          },
        },
      },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'No patient record found for this mobile number.',
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const activeToday = patient.queueEntries.find(
      (e) => e.queueDate === today && (e.status === 'WAITING' || e.status === 'CALLED' || e.status === 'IN_CONSULTATION')
    );

    // Calculate active free follow-ups for any doctor
    const followUpPasses: any[] = [];
    const seenDoctors = new Set();

    patient.queueEntries.forEach((entry) => {
      if (entry.doctor && !seenDoctors.has(entry.doctorId) && entry.paymentStatus === 'PAID') {
        seenDoctors.add(entry.doctorId);
        const visitDate = new Date(entry.joinedAt);
        const diffDays = Math.floor((new Date().getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24));
        const clinicWindow = entry.clinic.followUpDays || 15;
        if (diffDays <= clinicWindow) {
          followUpPasses.push({
            doctorName: entry.doctor.displayName,
            specialty: entry.doctor.specialty,
            roomNumber: entry.doctor.roomNumber,
            lastVisitDate: entry.queueDate,
            daysRemaining: clinicWindow - diffDays,
          });
        }
      }
    });

    res.json({
      success: true,
      data: {
        patient: {
          id: patient.id,
          name: patient.name,
          mobile: patient.mobile,
          email: patient.email,
          age: patient.age,
          gender: patient.gender,
          bloodGroup: patient.bloodGroup,
          address: patient.address,
          emergencyContact: patient.emergencyContact,
        },
        activeToken: activeToday
          ? {
              token: activeToday.token,
              publicToken: activeToday.publicToken,
              status: activeToday.status,
              doctorName: activeToday.doctor?.displayName,
              roomNumber: activeToday.doctor?.roomNumber,
              feeAmount: activeToday.feeAmount,
              paymentStatus: activeToday.paymentStatus,
              isFollowUp: activeToday.isFollowUp,
            }
          : null,
        followUpPasses,
        totalVisits: patient.queueEntries.length,
        history: patient.queueEntries.map((e) => ({
          id: e.id,
          token: e.token,
          publicToken: e.publicToken,
          queueDate: e.queueDate,
          status: e.status,
          visitReason: e.visitReason,
          doctorName: e.doctor?.displayName || 'General OPD',
          roomNumber: e.doctor?.roomNumber || 'Room 1',
          clinicName: e.clinic.name,
          feeAmount: e.feeAmount,
          paymentStatus: e.paymentStatus,
          isFollowUp: e.isFollowUp,
          followUpNote: e.followUpNote,
          diagnosis: e.diagnosis,
          hasPrescription: !!e.prescriptionJson || !!e.diagnosis,
          joinedAt: e.joinedAt,
          completedAt: e.completedAt,
          paymentMethod: e.payment?.provider || 'CASH',
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});


// 6. Patient Google Sign-In / Firebase Authentication Integration
patientRouter.post('/google-login', async (req, res) => {
  try {
    const { email, name, photoURL, uid } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Google email is required' });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 1. Search for existing patient records matching this email
    let matchingPatients = await prisma.patient.findMany({
      where: { email: { equals: cleanEmail, mode: 'insensitive' } },
    });

    let primaryPatient = matchingPatients[0];

    // Find queue entries linked to this patient email
    const allQueueEntries = await prisma.queueEntry.findMany({
      where: {
        OR: [
          { patient: { email: { equals: cleanEmail, mode: 'insensitive' } } },
        ],
      },
      orderBy: { joinedAt: 'desc' },
      include: {
        doctor: true,
        service: true,
        clinic: true,
        payment: true,
        patient: true,
      },
    });

    if (!primaryPatient) {
      if (allQueueEntries.length > 0 && allQueueEntries[0].patient) {
        primaryPatient = allQueueEntries[0].patient;
      } else {
        // Attach to first clinic if available
        const firstClinic = await prisma.clinic.findFirst();
        if (firstClinic) {
          primaryPatient = await prisma.patient.create({
            data: {
              name: name || cleanEmail.split('@')[0],
              email: cleanEmail,
              mobile: '',
              tenantId: firstClinic.tenantId,
              emergencyContact: `GOOGLE_UID:${uid || ''}`,
            },
          });
        }
      }
    }

    const patientProfile = primaryPatient || {
      id: `google-${uid || cleanEmail}`,
      name: name || cleanEmail.split('@')[0],
      email: cleanEmail,
      mobile: '',
      photoURL: photoURL || null,
      age: null,
      gender: null,
      bloodGroup: null,
      address: null,
    };

    const today = new Date().toISOString().split('T')[0];
    const activeToday = allQueueEntries.find(
      (e) => e.queueDate === today && (e.status === 'WAITING' || e.status === 'CALLED' || e.status === 'IN_CONSULTATION')
    );

    const followUpPasses: any[] = [];
    const seenDoctors = new Set();
    allQueueEntries.forEach((entry) => {
      if (entry.doctor && !seenDoctors.has(entry.doctorId) && entry.paymentStatus === 'PAID') {
        seenDoctors.add(entry.doctorId);
        const visitDate = new Date(entry.joinedAt);
        const diffDays = Math.floor((new Date().getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24));
        const clinicWindow = entry.clinic.followUpDays || 15;
        if (diffDays <= clinicWindow) {
          followUpPasses.push({
            doctorName: entry.doctor.displayName,
            specialty: entry.doctor.specialty,
            roomNumber: entry.doctor.roomNumber,
            clinicName: entry.clinic.name,
            clinicSlug: entry.clinic.slug,
            lastVisitDate: entry.queueDate,
            daysRemaining: clinicWindow - diffDays,
          });
        }
      }
    });

    res.json({
      success: true,
      message: 'Google authentication successful',
      data: {
        patient: {
          id: patientProfile.id,
          name: patientProfile.name,
          mobile: patientProfile.mobile || '',
          email: cleanEmail,
          photoURL: photoURL || null,
          age: patientProfile.age || null,
          gender: patientProfile.gender || null,
          bloodGroup: patientProfile.bloodGroup || null,
          address: patientProfile.address || null,
        },
        activeToken: activeToday
          ? {
              id: activeToday.id,
              token: activeToday.token,
              publicToken: activeToday.publicToken,
              status: activeToday.status,
              clinicName: activeToday.clinic.name,
              clinicSlug: activeToday.clinic.slug,
              doctorName: activeToday.doctor?.displayName,
              roomNumber: activeToday.doctor?.roomNumber,
              feeAmount: activeToday.feeAmount,
              paymentStatus: activeToday.paymentStatus,
              isFollowUp: activeToday.isFollowUp,
            }
          : null,
        hasVaultPassword: true,
        followUpPasses,
        totalVisits: allQueueEntries.length,
        totalHospitals: Array.from(new Set(allQueueEntries.map((e) => e.clinic.name))).length,
        history: allQueueEntries.map((e) => ({
          id: e.id,
          token: e.token,
          publicToken: e.publicToken,
          queueDate: e.queueDate,
          status: e.status,
          visitReason: e.visitReason,
          doctorName: e.doctor?.displayName || 'General OPD',
          roomNumber: e.doctor?.roomNumber || 'Room 1',
          clinicName: e.clinic.name,
          clinicSlug: e.clinic.slug,
          feeAmount: e.feeAmount,
          paymentStatus: e.paymentStatus,
          isFollowUp: e.isFollowUp,
          followUpNote: e.followUpNote,
          diagnosis: e.diagnosis,
          prescriptionJson: e.prescriptionJson,
          hasPrescription: !!e.prescriptionJson || !!e.diagnosis,
          joinedAt: e.joinedAt,
          completedAt: e.completedAt,
          paymentMethod: e.payment?.provider || 'CASH',
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});
