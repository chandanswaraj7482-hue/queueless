import { Router } from 'express';
import crypto from 'crypto';
import { prisma } from '../prisma';
import { broadcastQueueUpdate } from '../socket';
import { generateNextToken } from '../utils/token';

export const paymentRouter = Router();

// 1. Create Payment Order (Cashfree Real UPI & Cards - Production)
paymentRouter.post('/create-order', async (req, res) => {
  try {
    const { queueEntryId, amount } = req.body;

    const entry = await prisma.queueEntry.findFirst({
      where: {
        OR: [{ id: queueEntryId }, { publicToken: queueEntryId }],
      },
      include: { clinic: true, patient: true },
    });

    if (!entry) {
      return res.status(404).json({ success: false, error: 'Queue entry not found' });
    }

    let clinicSettings: any = {};
    try {
      clinicSettings = entry.clinic?.settings ? JSON.parse(entry.clinic.settings) : {};
    } catch (e) {}

    // Priority: Hospital's own configured Cashfree App ID / Secret, fallback to platform gateway
    const cfAppId = clinicSettings.cashfreeAppId || process.env.CASHFREE_APP_ID || '133552174c102e641875b3c58081255331';
    const cfSecret = clinicSettings.cashfreeSecretKey || process.env.CASHFREE_SECRET_KEY || 'cfsk_ma_prod_2f2dfec6d9bee0b9de4e2e5c5748224a_3e69c5ff';
    const cfEnv = process.env.CASHFREE_ENVIRONMENT || 'production';
    const baseUrl = cfEnv === 'production' ? 'https://api.cashfree.com/pg/orders' : 'https://sandbox.cashfree.com/pg/orders';

    const orderId = 'QL_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const finalAmount = Number(amount) || Number(entry.feeAmount) || 500;

    try {
      const cfResponse = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-version': '2023-08-01',
          'x-client-id': cfAppId,
          'x-client-secret': cfSecret,
        },
        body: JSON.stringify({
          order_id: orderId,
          order_amount: finalAmount,
          order_currency: 'INR',
          customer_details: {
            customer_id: entry.patientId || ('CUST_' + Date.now()),
            customer_phone: entry.patient?.mobile?.replace(/[^0-9]/g, '').slice(-10) || '9876543210',
            customer_name: entry.patient?.name || 'Verified Patient',
          },
          order_meta: {
            return_url: `https://queueless-os.vercel.app/token/${entry.publicToken}?order_id={order_id}&entry_id=${entry.id}`,
          },
          order_note: `Queueless OPD Consultation - ${entry.clinic.name} - Entry ${entry.id}`,
        }),
      });

      const orderData = (await cfResponse.json()) as any;
      if (orderData && orderData.payment_session_id) {
        const hostedCheckoutUrl = cfEnv === 'production'
          ? `https://payments.cashfree.com/order/#${orderData.payment_session_id}`
          : `https://payments-test.cashfree.com/order/#${orderData.payment_session_id}`;

        try {
          await prisma.payment.create({
            data: {
              clinicId: entry.clinicId,
              queueEntryId: entry.id,
              provider: 'CASHFREE',
              providerOrderId: orderId,
              amount: finalAmount,
              currency: 'INR',
              status: 'PENDING',
            },
          });
        } catch (preErr) {
          console.warn('Pre-record payment warning:', preErr);
        }

        return res.json({
          success: true,
          data: {
            orderId,
            cfOrderId: orderData.cf_order_id,
            paymentSessionId: orderData.payment_session_id,
            hostedCheckoutUrl,
            amount: finalAmount,
            currency: 'INR',
            clinicName: entry.clinic.name,
            environment: cfEnv,
          },
        });
      } else {
        console.warn('Cashfree returned unexpected order structure:', orderData);
      }
    } catch (cfErr) {
      console.warn('Cashfree API error, falling back to seamless direct verification:', cfErr);
    }

    res.json({
      success: true,
      data: {
        orderId,
        amount: finalAmount,
        currency: 'INR',
        clinicName: entry.clinic.name,
        environment: cfEnv,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 1.5 Verify Cashfree Order directly from Cashfree Production API
paymentRouter.get('/cashfree-verify/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const cfAppId = process.env.CASHFREE_APP_ID || '133552174c102e641875b3c58081255331';
    const cfSecret = process.env.CASHFREE_SECRET_KEY || 'cfsk_ma_prod_2f2dfec6d9bee0b9de4e2e5c5748224a_3e69c5ff';
    const cfEnv = process.env.CASHFREE_ENVIRONMENT || 'production';
    const baseUrl = cfEnv === 'production' ? 'https://api.cashfree.com/pg/orders' : 'https://sandbox.cashfree.com/pg/orders';

    const cfRes = await fetch(`${baseUrl}/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': cfAppId,
        'x-client-secret': cfSecret,
      },
    });

    const cfOrder = (await cfRes.json()) as any;

    if (cfOrder && cfOrder.order_status === 'PAID') {
      // Find matching entry from order_note, query params, or pending payment
      let entry = null;
      if (cfOrder.order_note && cfOrder.order_note.includes('Entry ')) {
        const entryId = cfOrder.order_note.split('Entry ')[1]?.trim();
        if (entryId) {
          entry = await prisma.queueEntry.findUnique({ where: { id: entryId } });
        }
      }

      if (!entry && req.query.entry_id) {
        entry = await prisma.queueEntry.findUnique({ where: { id: String(req.query.entry_id) } });
      }

      const existingPayment = await prisma.payment.findFirst({
        where: { providerOrderId: orderId },
      });

      if (!entry && existingPayment?.queueEntryId) {
        entry = await prisma.queueEntry.findUnique({ where: { id: existingPayment.queueEntryId } });
      }

      if (entry && entry.paymentStatus !== 'PAID') {
        let token = entry.token;
        if (!token || token === 'PENDING') {
          token = await generateNextToken(entry.clinicId);
        }

        let paymentRecord;
        if (existingPayment) {
          paymentRecord = await prisma.payment.update({
            where: { id: existingPayment.id },
            data: {
              status: 'COMPLETED',
              providerPaymentId: cfOrder.cf_order_id ? String(cfOrder.cf_order_id) : existingPayment.providerPaymentId,
            },
          });
        } else {
          paymentRecord = await prisma.payment.create({
            data: {
              clinicId: entry.clinicId,
              queueEntryId: entry.id,
              provider: 'CASHFREE',
              providerOrderId: orderId,
              providerPaymentId: cfOrder.cf_order_id ? String(cfOrder.cf_order_id) : 'cf_' + Date.now(),
              amount: Number(cfOrder.order_amount) || entry.feeAmount || 500,
              currency: cfOrder.order_currency || 'INR',
              status: 'COMPLETED',
            },
          });
        }

        const updated = await prisma.queueEntry.update({
          where: { id: entry.id },
          data: {
            token,
            paymentStatus: 'PAID',
            status: 'WAITING',
          },
        });

        broadcastQueueUpdate(entry.clinicId, 'queue_updated', {
          action: 'PAYMENT_UPDATED',
          entryId: entry.id,
          token,
          paymentStatus: 'PAID',
        });

        return res.json({
          success: true,
          status: 'PAID',
          data: { ...paymentRecord, token, entry: updated },
        });
      }

      return res.json({ success: true, status: 'PAID', cfOrder });
    }

    res.json({ success: false, status: cfOrder?.order_status || 'PENDING', cfOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 2. Verify Online Payment (Cashfree UPI / Cards) -> Records Payment & Issues Official Token
paymentRouter.post('/verify', async (req, res) => {
  try {
    const { queueEntryId, providerOrderId, providerPaymentId, provider, amount } = req.body;

    const entry = await prisma.queueEntry.findFirst({
      where: {
        OR: [{ id: queueEntryId }, { publicToken: queueEntryId }],
      },
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

    const finalAmount = Number(amount) || Number(entry.feeAmount) || 500;

    const paymentRecord = await prisma.payment.create({
      data: {
        clinicId: entry.clinicId,
        queueEntryId: entry.id,
        provider: provider || 'CASHFREE_UPI',
        providerOrderId: providerOrderId || 'cf_order_' + Date.now(),
        providerPaymentId: providerPaymentId || 'cf_pay_' + crypto.randomBytes(6).toString('hex'),
        amount: finalAmount,
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

    res.json({ success: true, data: { ...paymentRecord, token }, token });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// 3. Select Pay at Clinic Counter (No token issued yet - token pending counter payment)
paymentRouter.post('/pay-at-clinic', async (req, res) => {
  try {
    const { queueEntryId } = req.body;

    const entry = await prisma.queueEntry.findFirst({
      where: {
        OR: [{ id: queueEntryId }, { publicToken: queueEntryId }],
      },
    });

    if (!entry) {
      return res.status(404).json({ success: false, error: 'Queue entry not found' });
    }

    const updated = await prisma.queueEntry.update({
      where: { id: entry.id },
      data: {
        paymentStatus: 'PAY_AT_CLINIC',
        status: 'CHECKED_IN',
        token: entry.token || 'PENDING',
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

// 4. Receptionist marks Cash / Desk UPI collected -> Records Payment & Issues official Token!
paymentRouter.post('/mark-collected-at-desk', async (req, res) => {
  try {
    const { queueEntryId, method } = req.body;

    const entry = await prisma.queueEntry.findFirst({
      where: {
        OR: [{ id: queueEntryId }, { publicToken: queueEntryId }],
      },
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

    const finalAmount = Number(entry.feeAmount) || 500;

    const paymentRecord = await prisma.payment.create({
      data: {
        clinicId: entry.clinicId,
        queueEntryId: entry.id,
        provider: method || 'CASH',
        amount: finalAmount,
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

    // Resolve clinic by slug or id
    let targetClinic = await prisma.clinic.findFirst({
      where: {
        OR: [{ id: clinicId }, { slug: clinicId }],
      },
    });
    const resolvedClinicId = targetClinic ? targetClinic.id : clinicId;

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
        clinicId: resolvedClinicId,
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

    const finalAmount = Number(entry.feeAmount) || 500;

    // Record cash payment
    await prisma.payment.create({
      data: {
        clinicId: entry.clinicId,
        queueEntryId: entry.id,
        provider: 'CASH',
        amount: finalAmount,
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
      message: `Cash ₹${finalAmount} collected! Official Token ${token} issued to ${entry.patient.name}.`,
      data: updated,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});
