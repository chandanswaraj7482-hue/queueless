import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { initSocket } from './socket';
import { clinicRouter } from './routes/clinic';
import { queueRouter } from './routes/queue';
import { reportRouter } from './routes/reports';
import { paymentRouter } from './routes/payment';
import { patientRouter } from './routes/patient';
import { reviewRouter } from './routes/review';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/v1/clinics', clinicRouter);
app.use('/api/v1/queue', queueRouter);
app.use('/api/v1/reports', reportRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/patient', patientRouter);
app.use('/api/v1/reviews', reviewRouter);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    product: 'Queueless Clinic Queue System',
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

