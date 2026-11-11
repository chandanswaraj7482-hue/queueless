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

// 2. Patient Secure Login & Universal Multi-Hospital Medical/Visit History
patientRouter.post('/login', async (req, res) => {
  try {
    const { mobile, pin } = req.body;

    if (!mobile || !String(mobile).trim()) {
      return res.status(400).json({ success: false, error: 'Mobile number is required' });
    }

    const cleanMobile = String(mobile).replace(/\D/g, '');
    const searchSuffix = cleanMobile.length >= 10 ? cleanMobile.slice(-10) : cleanMobile;

    // Find all patient profiles with this mobile number across all clinics/tenants
    const matchingPatients = await prisma.patient.findMany({
      where: {
        mobile: {
          contains: searchSuffix,
        },
      },
    });

    // Query all queue entries across all hospitals where this patient visited
    const allQueueEntries = await prisma.queueEntry.findMany({
      where: {
        patient: {
          mobile: {
            contains: searchSuffix,
          },
        },
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

    if (matchingPatients.length === 0 && allQueueEntries.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No registered patient record found for mobile "${mobile}". Please register for an OPD token first.`,
      });
    }

    // Find if patient has a user-created PIN stored
    let storedPin: string | null = null;
    for (const p of matchingPatients) {
      if (p.emergencyContact && p.emergencyContact.startsWith('PIN:')) {
        storedPin = p.emergencyContact.replace('PIN:', '').trim();
        break;
      }
    }
    if (!storedPin) {
      for (const qe of allQueueEntries) {
        if (qe.patient?.emergencyContact && qe.patient.emergencyContact.startsWith('PIN:')) {
          storedPin = qe.patient.emergencyContact.replace('PIN:', '').trim();
          break;
        }
      }
    }

    const enteredPin = String(pin || '').trim();

    if (storedPin) {
      // User has created a custom PIN! Verify strictly against user's custom PIN
      if (enteredPin !== storedPin) {
        return res.status(401).json({
          success: false,
          error: 'Incorrect 4-digit Security PIN. Please enter the PIN you created.',
        });
      }
    } else {
      // No custom PIN set yet: allow initial default 1234 or 0000, or invite user to set their PIN
      if (enteredPin !== '1234' && enteredPin !== '0000') {
        return res.status(401).json({
          success: false,
          error: 'Incorrect Security PIN. If this is your first time, click "Create PIN" above to set your custom 4-digit password.',
        });
      }
    }

    const primaryPatient = matchingPatients[0] || allQueueEntries[0]?.patient || {
      id: 'guest-patient',
      name: 'Patient',
      mobile: mobile,
      email: null,
      age: null,
      gender: null,
      bloodGroup: null,
      address: null,
      emergencyContact: null,
    };

    const today = new Date().toISOString().split('T')[0];
    const activeToday = allQueueEntries.find(
      (e) => e.queueDate === today && (e.status === 'WAITING' || e.status === 'CALLED' || e.status === 'IN_CONSULTATION')
    );

    // Calculate active free follow-ups across all clinics
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
      data: {
        patient: {
          id: primaryPatient.id,
          name: primaryPatient.name,
          mobile: primaryPatient.mobile || mobile,
          email: primaryPatient.email,
          age: primaryPatient.age,
          gender: primaryPatient.gender,
          bloodGroup: primaryPatient.bloodGroup,
          address: primaryPatient.address,
          emergencyContact: primaryPatient.emergencyContact,
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

// 2b. Set or Create Patient Vault Security PIN / Account Password
patientRouter.post('/set-pin', async (req, res) => {
  try {
    const { mobile, pin, name } = req.body;
    if (!mobile || !pin) {
      return res.status(400).json({ success: false, error: 'Mobile number and Security PIN are required.' });
    }

    const cleanMobile = String(mobile).replace(/\D/g, '');
    const cleanPin = String(pin).trim();

    if (!/^\d{4}$/.test(cleanPin)) {
      return res.status(400).json({ success: false, error: 'Security PIN must be exactly 4 numeric digits.' });
    }

    const weakPins = ['1234', '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1212', '4321', '2580', '0123'];
    if (weakPins.includes(cleanPin)) {
      return res.status(400).json({
        success: false,
        error: `Security Rule: "${cleanPin}" is too simple and easily guessed. Please select a secure 4-digit PIN (e.g. 7482, 9153).`,
      });
    }

    const searchSuffix = cleanMobile.length >= 10 ? cleanMobile.slice(-10) : cleanMobile;

    const patients = await prisma.patient.findMany({
      where: {
        mobile: {
          contains: searchSuffix,
        },
      },
    });

    if (patients.length > 0) {
      for (const p of patients) {
        await prisma.patient.update({
          where: { id: p.id },
          data: {
            emergencyContact: `PIN:${cleanPin}`,
            name: name && name.trim() ? name.trim() : p.name,
          },
        });
      }
    } else {
      const defaultTenant = await prisma.tenant.findFirst();
      if (defaultTenant) {
        await prisma.patient.create({
          data: {
            tenantId: defaultTenant.id,
            name: name && name.trim() ? name.trim() : 'Patient',
            mobile: cleanMobile,
            emergencyContact: `PIN:${cleanPin}`,
          },
        });
      }
    }

    res.json({
      success: true,
      message: 'Universal Health Vault PIN successfully created! You can now log in anytime to access your medical records.',
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

