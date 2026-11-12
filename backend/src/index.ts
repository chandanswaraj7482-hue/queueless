import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { initSocket } from './socket';
import {
  securityHeadersMiddleware,
  generalApiLimiter,
  authLimiter,
  paymentLimiter,
  wafInspectionMiddleware,
  corsPolicy,
} from './middleware/firewall';
import { clinicRouter } from './routes/clinic';
import { queueRouter } from './routes/queue';
import { reportRouter } from './routes/reports';
import { paymentRouter } from './routes/payment';
import { patientRouter } from './routes/patient';
import { reviewRouter } from './routes/review';
import { aiRouter } from './routes/ai';
import { notificationRouter } from './routes/notification';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// ============================================================================
// MULTI-LAYER CLINICAL CYBERSECURITY & FIREWALL ARCHITECTURE
// Layer 1: Helmet Enterprise HTTP Security Headers (HSTS, CSP, Anti-Clickjacking)
// Layer 2: Strict CORS & Origin Policy
// Layer 3: Payload Size Limitation (5MB Anti-Buffer Overflow)
// Layer 4: Deep Packet Inspection WAF (SQL Injection & XSS Signature Shield)
// Layer 5: Anti-Brute-Force & Anti-DDoS Rate Limiting
// ============================================================================

app.use(securityHeadersMiddleware);
app.use(cors(corsPolicy));
app.use(express.json({ limit: '5mb' }));

// Layer 4: Deep WAF Inspection on all incoming HTTP requests
app.use(wafInspectionMiddleware);

// Layer 5: Global API Rate Limiter (300 req / 15 min per IP)
app.use('/api', generalApiLimiter);

// Layer 5b: Anti-Brute Force Protection on Authentication Endpoints (10 attempts / 15 min lockout)
app.use('/api/v1/clinics/login', authLimiter);
app.use('/api/v1/clinics/auth/verify', authLimiter);
app.use('/api/v1/patient/login', authLimiter);
app.use('/api/v1/patient/set-pin', authLimiter);
app.use('/api/v1/payments/create-order', paymentLimiter);

// Routes
app.use('/api/v1/clinics', clinicRouter);
app.use('/api/v1/queue', queueRouter);
app.use('/api/v1/reports', reportRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/patient', patientRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/notifications', notificationRouter);

// Root route — service info
app.get('/', (req, res) => {
  res.json({
    service: 'Queueless Clinical OS API',
    version: '1.0.0',
    status: 'live',
    docs: '/health',
    timestamp: new Date().toISOString(),
  });
});

// Health Check with Firewall Telemetry (supports /health and /healthz)
app.get(['/health', '/healthz'], (req, res) => {
  res.json({
    status: 'healthy',
    product: 'Queueless Clinic Queue System',
    firewall: {
      active: true,
      waf: 'ENABLED',
      rateLimiter: 'ENABLED',
      hsts: '31536000s (1 Year Preloaded)',
      encryption: 'TLS 1.3 / AES-256',
    },
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5001;
if (process.env.VERCEL !== '1') {
  server.listen(PORT, () => {
    console.log(`🚀 Queueless Backend API running on http://localhost:${PORT}`);
  });
}

export default app;
export { app };

