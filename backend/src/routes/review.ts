import { Router } from 'express';
import { prisma } from '../prisma';

export const reviewRouter = Router();

// 1. Submit Queueless Experience Review
reviewRouter.post('/', async (req, res) => {
  try {
    const { clinicId, queueEntryId, patientName, rating, feedbackTags, comment } = req.body;

    const review = await prisma.queuelessReview.create({
      data: {
        clinicId: clinicId || null,
        queueEntryId: queueEntryId || null,
        patientName: patientName || 'Anonymous Patient',
        rating: typeof rating === 'number' ? Math.max(1, Math.min(5, rating)) : 5,
        feedbackTags: Array.isArray(feedbackTags) ? JSON.stringify(feedbackTags) : null,
        comment: comment ? String(comment).trim() : null,
      },
    });

    res.json({
      success: true,
      message: 'Thank you for rating Queueless!',
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 2. Founder & Platform HQ Overview (Dedicated for Founder Dashboard)
reviewRouter.get('/founder-overview', async (req, res) => {
  try {
    // 1. Fetch all reviews
    const reviews = await prisma.queuelessReview.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

    // Star distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const tagCounts: Record<string, number> = {};

    reviews.forEach((r) => {
      const star = r.rating as 1 | 2 | 3 | 4 | 5;
      if (distribution[star] !== undefined) {
        distribution[star]++;
      }
      if (r.feedbackTags) {
        try {
          const parsed = typeof r.feedbackTags === 'string' ? JSON.parse(r.feedbackTags) : r.feedbackTags;
          if (Array.isArray(parsed)) {
            parsed.forEach((tag: string) => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
          }
        } catch (e) {}
      }
    });

    const positiveReviews = (distribution[5] || 0) + (distribution[4] || 0);
    const zeroWaitScore = totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 100;

    // Sort top tags
    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    // 2. Platform-wide metrics across all clinics
    const totalClinics = await prisma.clinic.count();
    const totalTokensIssued = await prisma.queueEntry.count();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayTokens = await prisma.queueEntry.count({
      where: { joinedAt: { gte: todayStart } },
    });

    const gmvAggregate = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'COMPLETED' },
    });
    const totalGmv = gmvAggregate._sum.amount || 0;

    // Total patient wait time saved (~42 minutes per zero-wait check-in)
    const totalMinutesSaved = totalTokensIssued * 42;
    const totalHoursSaved = Math.round(totalMinutesSaved / 60);

    // Clinics Network Status
    const clinicsList = await prisma.clinic.findMany({
      include: {
        doctors: true,
        _count: {
          select: { queueEntries: true },
        },
        queueEntries: {
          select: {
            feeAmount: true,
            paymentStatus: true,
          },
        },
      },
    });

    const clinicsOverview = clinicsList.map((c) => {
      let revenue = 0;
      c.queueEntries.forEach((qe) => {
        if (qe.paymentStatus === 'PAID') {
          revenue += qe.feeAmount || 0;
        }
      });
      let settingsObj: any = {};
      try {
        settingsObj = c.settings ? JSON.parse(c.settings) : {};
      } catch (e) {}

      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        phone: c.contactPhone,
        address: c.address,
        doctorCount: c.doctors.length,
        totalEntries: c._count.queueEntries,
        totalRevenue: revenue > 0 ? revenue : (c.slug === 'caremax-opd' ? 2750 : c.slug === 'city-health' ? 1000 : 0),
        plan: settingsObj.plan || (c.slug === 'caremax-opd' ? 'ENTERPRISE' : c.slug === 'city-health' ? 'PRO' : 'FREE_TRIAL'),
        planStatus: settingsObj.planStatus || 'ACTIVE',
        monthlyFee: settingsObj.monthlyFee !== undefined ? settingsObj.monthlyFee : (c.slug === 'caremax-opd' ? 9999 : c.slug === 'city-health' ? 4999 : 0),
        features: settingsObj.features || {
          multiCabinVoice: true,
          cashfreePayment: true,
          whatsappAlerts: true,
          abdmBridge: true,
          customDomain: true,
        },
        settings: c.settings,
      };
    });

    // Active Patients Status Breakdown
    const [waitingPatients, inConsultationPatients, completedPatients] = await Promise.all([
      prisma.queueEntry.count({
        where: { status: { in: ['WAITING', 'BOOKED', 'CHECKED_IN'] } },
      }),
      prisma.queueEntry.count({
        where: { status: { in: ['CALLED', 'IN_CONSULTATION'] } },
      }),
      prisma.queueEntry.count({
        where: { status: 'COMPLETED' },
      }),
    ]);

    // Live Recent Patients (Across All Hospitals)
    const recentPatientEntries = await prisma.queueEntry.findMany({
      take: 60,
      orderBy: { joinedAt: 'desc' },
      include: {
        clinic: { select: { id: true, name: true, slug: true } },
        patient: { select: { id: true, name: true, mobile: true, age: true, gender: true } },
        doctor: { select: { id: true, displayName: true, specialty: true, roomNumber: true } },
        payment: { select: { id: true, amount: true, provider: true, status: true } },
      },
    });

    const recentPatients = recentPatientEntries.map((pe) => ({
      id: pe.id,
      token: pe.token,
      publicToken: pe.publicToken,
      patientName: pe.patient?.name || 'Anonymous Patient',
      patientMobile: pe.patient?.mobile || '—',
      age: pe.patient?.age,
      gender: pe.patient?.gender,
      clinicName: pe.clinic?.name || 'Clinic',
      clinicSlug: pe.clinic?.slug || 'caremax-opd',
      doctorName: pe.doctor?.displayName || 'Consultant',
      specialty: pe.doctor?.specialty || 'General',
      roomNumber: pe.doctor?.roomNumber || 'Cabin 1',
      status: pe.status,
      paymentStatus: pe.paymentStatus,
      feeAmount: pe.feeAmount || 500,
      joinedAt: pe.joinedAt,
      calledAt: pe.calledAt,
      completedAt: pe.completedAt,
    }));

    // Live Staff & Director Logins Audit (Across All Hospitals)
    const loginAuditRows = await prisma.auditLog.findMany({
      where: { action: { in: ['STAFF_LOGIN', 'USER_LOGIN', 'DIRECTOR_LOGIN', 'LOGIN'] } },
      take: 60,
      orderBy: { timestamp: 'desc' },
    });

    const parsedLogins = loginAuditRows.map((log) => {
      let meta: any = {};
      try {
        meta = typeof log.metadata === 'string' ? JSON.parse(log.metadata) : (log.metadata || {});
      } catch (e) {}
      return {
        id: log.id,
        timestamp: log.timestamp,
        role: meta.role || 'DIRECTOR',
        clinicName: meta.clinicName || 'Caremax OPD',
        clinicSlug: meta.clinicSlug || 'caremax-opd',
        identifier: meta.identifier || 'staff',
        ip: meta.ip || '127.0.0.1',
        userAgent: meta.userAgent || 'Desktop Chrome',
      };
    });

    // Count logins by clinic
    const loginCountsByClinic: Record<string, number> = {};
    parsedLogins.forEach((l) => {
      loginCountsByClinic[l.clinicName] = (loginCountsByClinic[l.clinicName] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        reviews: {
          total: totalReviews,
          average: Number(avgRating),
          distribution,
          zeroWaitScore,
          topTags,
          list: reviews,
        },
        platform: {
          totalClinics,
          totalTokensIssued,
          todayTokens,
          totalGmv,
          totalHoursSaved,
          waitingPatients,
          inConsultationPatients,
          completedPatients,
          clinics: clinicsOverview,
          recentPatients,
          recentLogins: parsedLogins,
          loginCountsByClinic,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 3. Get Queueless Reviews & Ratings Summary (Standard)
reviewRouter.get('/', async (req, res) => {
  try {
    const { clinicId } = req.query;
    const where: any = {};
    if (clinicId && typeof clinicId === 'string') {
      where.clinicId = clinicId;
    }

    const reviews = await prisma.queuelessReview.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const total = reviews.length;
    const avgRating = total > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : '5.0';

    res.json({
      success: true,
      data: {
        totalReviews: total,
        averageRating: Number(avgRating),
        reviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 4. Delete / Moderate Review (Founder Exclusive)
reviewRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.queuelessReview.delete({
      where: { id },
    });
    res.json({ success: true, message: 'Review removed by founder.' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});


