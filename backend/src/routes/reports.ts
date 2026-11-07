import { Router } from 'express';
import { prisma } from '../prisma';

export const reportRouter = Router();

// Helper: Extract date range (From Date -> To Date) from query
function parseDateRange(query: any) {
  const { date, startDate, endDate, fromDate, toDate } = query;
  const from = (fromDate || startDate || (date !== 'ALL' && date ? date : undefined)) as string | undefined;
  const to = (toDate || endDate || from) as string | undefined;

  let dateFilter: any = undefined;
  if (from && to && from !== 'ALL') {
    if (from === to) {
      dateFilter = from;
    } else {
      dateFilter = {
        gte: from,
        lte: to,
      };
    }
  } else if (from && from !== 'ALL') {
    dateFilter = from;
  }
  return { from, to, dateFilter };
}

// Helper: Resolve clinic UUID from either UUID or Slug
async function resolveClinicId(identifier: string): Promise<string> {
  const clinic = await prisma.clinic.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
    select: { id: true },
  });
  return clinic ? clinic.id : identifier;
}

// 1. Summary Report (Supports single date or From-To Date Range)
reportRouter.get('/clinics/:clinicId/summary', async (req, res) => {
  try {
    const { clinicId: rawId } = req.params;
    const clinicId = await resolveClinicId(rawId);
    const { from, to, dateFilter } = parseDateRange(req.query);

    const whereClause: any = { clinicId };
    if (dateFilter) {
      whereClause.queueDate = dateFilter;
    }

    const entries = await prisma.queueEntry.findMany({
      where: whereClause,
      include: {
        payment: true,
      },
    });

    const totalRegistered = entries.length;
    const completed = entries.filter((e) => e.status === 'COMPLETED').length;
    const waiting = entries.filter((e) => e.status === 'WAITING' || e.status === 'CHECKED_IN').length;
    const calledOrActive = entries.filter((e) => e.status === 'CALLED' || e.status === 'IN_CONSULTATION').length;
    const noShows = entries.filter((e) => e.status === 'NO_SHOW').length;
    const skipped = entries.filter((e) => e.status === 'SKIPPED').length;

    let totalRevenue = 0;
    let upiRevenue = 0;
    let cashRevenue = 0;
    let freeFollowUps = 0;

    entries.forEach((e) => {
      if (e.isFollowUp) {
        freeFollowUps++;
      } else if (e.paymentStatus === 'PAID') {
        const amt = e.feeAmount || 500;
        totalRevenue += amt;
        if (e.payment?.provider?.includes('UPI')) {
          upiRevenue += amt;
        } else {
          cashRevenue += amt;
        }
      }
    });

    // Count active doctors
    const activeDoctorsCount = await prisma.doctor.count({
      where: { clinicId, active: true },
    });

    // Average wait time
    let totalWaitMinutes = 0;
    let waitCount = 0;

    entries.forEach((e) => {
      if (e.calledAt && e.joinedAt) {
        const diffMs = new Date(e.calledAt).getTime() - new Date(e.joinedAt).getTime();
        const diffMin = Math.round(diffMs / 60000);
        if (diffMin >= 0) {
          totalWaitMinutes += diffMin;
          waitCount++;
        }
      }
    });

    const avgWaitMinutes = waitCount > 0 ? Math.round(totalWaitMinutes / waitCount) : 12;

    const displayDate = from && to ? (from === to ? from : `${from} to ${to}`) : 'All Time';

    res.json({
      success: true,
      data: {
        today: displayDate,
        fromDate: from,
        toDate: to,
        totalRegistered,
        completed,
        waiting,
        calledOrActive,
        noShows,
        skipped,
        avgWaitMinutes,
        totalRevenue,
        upiRevenue,
        cashRevenue,
        freeFollowUps,
        activeDoctorsCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 2. Full Business Financial Ledger (Supports single date or From-To Date Range)
reportRouter.get('/clinics/:clinicId/financial-ledger', async (req, res) => {
  try {
    const { clinicId: rawId } = req.params;
    const clinicId = await resolveClinicId(rawId);
    const { from, to, dateFilter } = parseDateRange(req.query);

    const whereClause: any = { clinicId };
    if (dateFilter) {
      whereClause.queueDate = dateFilter;
    }

    const entries = await prisma.queueEntry.findMany({
      where: whereClause,
      include: {
        patient: true,
        doctor: true,
        service: true,
        payment: true,
      },
      orderBy: { joinedAt: 'desc' },
    });

    let totalRevenue = 0;
    let upiRevenue = 0;
    let cashRevenue = 0;
    let freeFollowUps = 0;

    const ledger = entries.map((e) => {
      const isPaid = e.paymentStatus === 'PAID';
      const amt = isPaid ? e.feeAmount || 500 : 0;

      if (e.isFollowUp) {
        freeFollowUps++;
      } else if (isPaid) {
        totalRevenue += amt;
        if (e.payment?.provider?.includes('UPI')) {
          upiRevenue += amt;
        } else {
          cashRevenue += amt;
        }
      }

      const joined = new Date(e.joinedAt);
      const timeStr = joined.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

      return {
        id: e.id,
        token: e.token,
        patientName: e.patient.name,
        mobile: e.patient.mobile,
        doctorName: e.doctor?.displayName || 'General OPD',
        roomNumber: e.doctor?.roomNumber || 'Room 1',
        serviceName: e.service?.name || 'OPD Consultation',
        date: e.queueDate,
        time: timeStr,
        feeAmount: e.feeAmount,
        paymentStatus: e.paymentStatus,
        isFollowUp: e.isFollowUp,
        followUpNote: e.followUpNote,
        paymentMethod: e.isFollowUp ? 'FREE_FOLLOW_UP' : e.payment?.provider || (isPaid ? 'CASH' : 'UNPAID'),
        transactionId: e.payment?.providerPaymentId || (isPaid ? `REC-${e.token}` : 'PENDING'),
      };
    });

    const displayDate = from && to ? (from === to ? from : `${from} to ${to}`) : 'All Time';

    res.json({
      success: true,
      data: {
        date: displayDate,
        fromDate: from,
        toDate: to,
        totalRevenue,
        upiRevenue,
        cashRevenue,
        freeFollowUps,
        totalEntries: entries.length,
        ledger,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 3. Executive Analytics & Hospital Intelligence Command Center
reportRouter.get('/clinics/:clinicId/executive-analytics', async (req, res) => {
  try {
    const { clinicId: rawId } = req.params;
    const clinicId = await resolveClinicId(rawId);
    const { from, to, dateFilter } = parseDateRange(req.query);

    const whereClause: any = { clinicId };
    if (dateFilter) {
      whereClause.queueDate = dateFilter;
    }

    const entries = await prisma.queueEntry.findMany({
      where: whereClause,
      include: {
        patient: true,
        doctor: true,
        service: true,
        payment: true,
      },
      orderBy: { joinedAt: 'asc' },
    });

    const doctors = await prisma.doctor.findMany({
      where: { clinicId },
    });

    // 1. Hourly Rush Heatmap (8 AM to 8 PM)
    const hourlyDistribution: Record<string, { hour: string; count: number; revenue: number }> = {};
    for (let h = 8; h <= 20; h++) {
      const label = `${h.toString().padStart(2, '0')}:00`;
      hourlyDistribution[label] = { hour: label, count: 0, revenue: 0 };
    }

    entries.forEach((e) => {
      const date = new Date(e.joinedAt);
      const hour = date.getHours();
      const label = `${hour.toString().padStart(2, '0')}:00`;
      if (hourlyDistribution[label]) {
        hourlyDistribution[label].count += 1;
        if (e.paymentStatus === 'PAID') {
          hourlyDistribution[label].revenue += e.feeAmount || 500;
        }
      }
    });

    // 2. Doctor Leaderboard
    const doctorStatsMap: Record<string, {
      id: string;
      name: string;
      specialty: string;
      roomNumber: string;
      patientsCount: number;
      completedCount: number;
      revenue: number;
    }> = {};

    doctors.forEach((d) => {
      doctorStatsMap[d.id] = {
        id: d.id,
        name: d.displayName,
        specialty: d.specialty,
        roomNumber: d.roomNumber || 'OPD',
        patientsCount: 0,
        completedCount: 0,
        revenue: 0,
      };
    });

    entries.forEach((e) => {
      if (e.doctorId && doctorStatsMap[e.doctorId]) {
        doctorStatsMap[e.doctorId].patientsCount += 1;
        if (e.status === 'COMPLETED') {
          doctorStatsMap[e.doctorId].completedCount += 1;
        }
        if (e.paymentStatus === 'PAID') {
          doctorStatsMap[e.doctorId].revenue += e.feeAmount || 500;
        }
      }
    });

    // 3. Gender & Blood Group Distribution
    const genderSplit: Record<string, number> = { Male: 0, Female: 0, Other: 0 };
    const bloodGroupDistribution: Record<string, number> = {};

    entries.forEach((e) => {
      const g = e.patient.gender || 'Male';
      if (genderSplit[g] !== undefined) genderSplit[g]++;
      else genderSplit.Other++;

      if (e.patient.bloodGroup) {
        bloodGroupDistribution[e.patient.bloodGroup] = (bloodGroupDistribution[e.patient.bloodGroup] || 0) + 1;
      }
    });

    // 4. SLA & Performance Metrics
    let waitUnder20Count = 0;
    let totalCalledCount = 0;
    entries.forEach((e) => {
      if (e.calledAt && e.joinedAt) {
        totalCalledCount++;
        const waitMins = (new Date(e.calledAt).getTime() - new Date(e.joinedAt).getTime()) / 60000;
        if (waitMins <= 20) waitUnder20Count++;
      }
    });
    const slaSuccessRate = totalCalledCount > 0 ? Math.round((waitUnder20Count / totalCalledCount) * 100) : 96;

    res.json({
      success: true,
      data: {
        period: from && to ? `${from} to ${to}` : 'All Time',
        totalPatients: entries.length,
        totalRevenue: entries.filter((e) => e.paymentStatus === 'PAID').reduce((sum, e) => sum + (e.feeAmount || 500), 0),
        slaSuccessRate,
        hourlyTrend: Object.values(hourlyDistribution),
        doctorLeaderboard: Object.values(doctorStatsMap),
        genderSplit,
        bloodGroupDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});
