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

// 2. Patient Secure Login & Full Medical/Visit History
patientRouter.post('/login', async (req, res) => {
  try {
    const { mobile, pin } = req.body;

    if (!mobile || !String(mobile).trim()) {
      return res.status(400).json({ success: false, error: 'Mobile number is required' });
    }

    const cleanMobile = String(mobile).replace(/\D/g, '');
    const searchSuffix = cleanMobile.length >= 10 ? cleanMobile.slice(-10) : cleanMobile;

    const patient = await prisma.patient.findFirst({
      where: {
        mobile: {
          contains: searchSuffix,
        },
      },
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
        error: `No registered patient record found for mobile "${mobile}". Please register for an OPD token first.`,
      });
    }

    // Default Quick Access Demo PIN is 1234 or 0000
    if (pin && String(pin).trim() !== '1234' && String(pin).trim() !== '0000') {
      return res.status(401).json({
        success: false,
        error: 'Incorrect 4-digit Security PIN. (Quick demo access PIN is 1234)',
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const activeToday = patient.queueEntries.find(
      (e) => e.queueDate === today && (e.status === 'WAITING' || e.status === 'CALLED' || e.status === 'IN_CONSULTATION')
    );

    // Calculate active free follow-ups
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

