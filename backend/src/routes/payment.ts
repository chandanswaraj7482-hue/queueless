import { Router } from 'express';
import crypto from 'crypto';
import { prisma } from '../prisma';
import { broadcastQueueUpdate } from '../socket';
import { generateNextToken } from '../utils/token';

export const paymentRouter = Router();

// 1. Create Payment Order (Razorpay / UPI simulation)
paymentRouter.post('/create-order', async (req, res) => {
  try {
    const { queueEntryId, amount } = req.body;

    const entry = await prisma.queueEntry.findUnique({
      where: { id: queueEntryId },
      include: { clinic: true },
    });

    if (!entry) {
      return res.status(404).json({ success: false, error: 'Queue entry not found' });
    }

    const orderId = 'order_' + crypto.randomBytes(8).toString('hex');

    res.json({
      success: true,
      data: {
        orderId,
        amount: amount || entry.feeAmount,
        currency: 'INR',
        clinicName: entry.clinic.name,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 2. Verify Online Payment (UPI / Card) -> Issues Official Token upon payment
paymentRouter.post('/verify', async (req, res) => {
  try {
    const { queueEntryId, providerOrderId, providerPaymentId, provider, amount } = req.body;

    const entry = await prisma.queueEntry.findUnique({
      where: { id: queueEntryId },
      include: { clinic: true, patient: true },
    });

    if (!entry) {
      return res.status(404).json({ success: false, error: 'Queue entry not found' });
    }

    // Generate official token if not yet assigned
    let token = entry.token;
    if (!token || token === 'PENDING') {
      token = await generateNextToken(entry.clinicId);
    }

    const paymentRecord = await prisma.payment.create({
      data: {
        clinicId: entry.clinicId,
        queueEntryId: entry.id,
        provider: provider || 'UPI_GATEWAY',
        providerOrderId: providerOrderId || 'order_mock_' + Date.now(),
        providerPaymentId: providerPaymentId || 'pay_' + crypto.randomBytes(6).toString('hex'),
        amount: amount || entry.feeAmount,
        currency: 'INR',
        status: 'COMPLETED',
      },
    });

    const updated = await prisma.queueEntry.update({
      where: { id: queueEntryId },
      data: {
        token,
        paymentStatus: 'PAID',
        status: 'WAITING', // Admitted into the doctor queue!
      },
      include: { patient: true, doctor: true },
    });

    // Record audit event
    await prisma.auditLog.create({
      data: {
        tenantId: entry.clinic.tenantId,
        action: 'PAYMENT_RECEIVED',
        entityType: 'Payment',
        entityId: paymentRecord.id,
        metadata: JSON.stringify({
          token,
          amount: paymentRecord.amount,
          method: paymentRecord.provider,
        }),
      },
    });

    broadcastQueueUpdate(entry.clinicId, 'queue_updated', {
      action: 'PAYMENT_UPDATED',
      entryId: entry.id,
      token,
      paymentStatus: 'PAID',
    });

    res.json({ success: true, data: { ...paymentRecord, token } });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 3. Select Pay at Clinic Counter (No token issued yet - token pending counter payment)
paymentRouter.post('/pay-at-clinic', async (req, res) => {
  try {
    const { queueEntryId } = req.body;

    const entry = await prisma.queueEntry.findUnique({
      where: { id: queueEntryId },
    });

    if (!entry) {
      return res.status(404).json({ success: false, error: 'Queue entry not found' });
    }

    const updated = await prisma.queueEntry.update({
      where: { id: queueEntryId },
      data: {
        paymentStatus: 'PAY_AT_CLINIC',
        status: 'CHECKED_IN',
        token: 'PENDING', // Token not issued yet!
      },
    });

    broadcastQueueUpdate(entry.clinicId, 'queue_updated', {
      action: 'PAYMENT_UPDATED',
      entryId: entry.id,
      paymentStatus: 'PAY_AT_CLINIC',
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 4. Receptionist marks Cash / Desk UPI collected -> Generates & Issues official Token!
paymentRouter.post('/mark-collected-at-desk', async (req, res) => {
  try {
    const { queueEntryId, method } = req.body;

    const entry = await prisma.queueEntry.findUnique({
      where: { id: queueEntryId },
      include: { clinic: true, patient: true },
    });

    if (!entry) {
      return res.status(404).json({ success: false, error: 'Queue entry not found' });
    }

    // Generate next official token for clinic
    let token = entry.token;
    if (!token || token === 'PENDING') {
      token = await generateNextToken(entry.clinicId);
    }

    await prisma.payment.create({
      data: {
        clinicId: entry.clinicId,
        queueEntryId: entry.id,
        provider: method || 'CASH',
        amount: entry.feeAmount,
        currency: 'INR',
        status: 'COMPLETED',
      },
    });

    const updated = await prisma.queueEntry.update({
      where: { id: queueEntryId },
      data: {
        token,
        paymentStatus: 'PAID',
        status: 'WAITING', // Admitted into the doctor queue!
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    broadcastQueueUpdate(entry.clinicId, 'queue_updated', {
      action: 'PAYMENT_COLLECTED_AT_DESK',
      entryId: entry.id,
      token,
    });

    res.json({ success: true, data: updated, token });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 5. Receptionist enters Token ID or Mobile number to collect cash and issue token
paymentRouter.post('/verify-cash-by-token', async (req, res) => {
  try {
    const { clinicId, token: inputIdentifier } = req.body;
    if (!inputIdentifier) {
      return res.status(400).json({ success: false, error: 'Token ID or Mobile is required' });
    }

    const clean = inputIdentifier.trim();
    const today = new Date().toISOString().split('T')[0];
    const phoneDigits = clean.replace(/\D/g, '');
    const cleanUpper = clean.toUpperCase();

    // Support flexible token input: 'A-116', '116', 'A116'
    const tokenVariants = [
      cleanUpper,
      cleanUpper.startsWith('A-') ? cleanUpper : `A-${cleanUpper}`,
      cleanUpper.startsWith('A') && !cleanUpper.includes('-') ? `A-${cleanUpper.slice(1)}` : cleanUpper,
    ];

    const entry = await prisma.queueEntry.findFirst({
      where: {
        clinicId,
        queueDate: today,
        OR: [
          ...tokenVariants.map((t) => ({ token: t })),
          { publicToken: clean },
          ...(phoneDigits.length >= 10 ? [{ patient: { mobile: { contains: phoneDigits.slice(-10) } } }] : []),
        ],
      },
      include: {
        patient: true,
        doctor: true,
        service: true,
        clinic: true,
      },
    });

    if (!entry) {
      return res.status(404).json({ success: false, error: `No registration found for "${clean}" today` });
    }

    if (entry.paymentStatus === 'PAID') {
      return res.status(400).json({ success: false, error: `Patient ${entry.patient.name} (Token ${entry.token}) is already paid & admitted!` });
    }

    // Generate official token if pending
    let token = entry.token;
    if (!token || token === 'PENDING') {
      token = await generateNextToken(entry.clinicId);
    }

    // Record cash payment
    await prisma.payment.create({
      data: {
        clinicId: entry.clinicId,
        queueEntryId: entry.id,
        provider: 'CASH',
        amount: entry.feeAmount,
        currency: 'INR',
        status: 'COMPLETED',
      },
    });

    const updated = await prisma.queueEntry.update({
      where: { id: entry.id },
      data: {
        token,
        paymentStatus: 'PAID',
        status: 'WAITING', // Admitted into the doctor queue!
      },
      include: { patient: true, doctor: true },
    });

    broadcastQueueUpdate(entry.clinicId, 'queue_updated', {
      action: 'PAYMENT_COLLECTED_AT_DESK',
      entryId: entry.id,
      token,
    });

    res.json({
      success: true,
      message: `Cash ₹${entry.feeAmount} collected! Official Token ${token} issued to ${entry.patient.name}.`,
      data: updated,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

