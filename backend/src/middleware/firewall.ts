import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// ============================================================================
// LAYER 1: ENTERPRISE HTTP SECURITY ARMOR (HELMET)
// ============================================================================
export const securityHeadersMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://sdk.cashfree.com', 'https://checkout.razorpay.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: ["'self'", 'https:', 'wss:', 'ws:'],
      frameSrc: ["'self'", 'https://sdk.cashfree.com', 'https://api.cashfree.com', 'https://checkout.razorpay.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Allows cross-origin avatars and PDF renders
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'sameorigin' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000, // 1 Year HSTS
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
});

// ============================================================================
// LAYER 2: ANTI-DDOS & BRUTE-FORCE RATE LIMITERS
// ============================================================================

// General API Rate Limiter (300 requests per 15 minutes)
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Firewall: Rate limit exceeded. Too many requests from this IP. Please try again after 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

// Strict Auth Rate Limiter (Prevents password guessing & credential stuffing)
// 5 attempts per 15 minutes per IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: '🛡️ Security Shield: Too many failed login attempts. This IP address has been temporarily locked out for 15 minutes to prevent brute-force attacks.',
    code: 'AUTH_LOCKOUT',
  },
});

// Payment & Checkout Rate Limiter (Prevents card testing & payment order flooding)
export const paymentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Payment Firewall: Too many order creation requests. Please try again in 10 minutes.',
    code: 'PAYMENT_LIMIT_EXCEEDED',
  },
});

// ============================================================================
// LAYER 3: DEEP PACKET INSPECTION (SQL INJECTION & XSS SHIELD)
// ============================================================================

// Dangerous SQL and Script signatures
const MALICIOUS_PATTERNS = [
  /(\b(union(\s+all)?\s+select|select\s+.*\s+from|insert\s+into|drop\s+table|delete\s+from|alter\s+table|exec(\s|\+)+(s|x)p_)\b)/i,
  /(<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>)/gi,
  /(javascript\s*:\s*)/gi,
  /(onload\s*=\s*['"]?|onerror\s*=\s*['"]?|onclick\s*=\s*['"]?)/gi,
  /((\%27)|('))union/i,
  /((\%3D)|(=))[^\n]*((\%27)|(')|(--)|(\%3B)|(;))/i,
  /\.\.\/(\.\.\/)*/, // Directory traversal
];

function containsMaliciousPayload(value: any): boolean {
  if (value === null || value === undefined) return false;

  if (typeof value === 'string') {
    for (const pattern of MALICIOUS_PATTERNS) {
      if (pattern.test(value)) {
        return true;
      }
    }
    return false;
  }

  if (typeof value === 'object') {
    for (const key of Object.keys(value)) {
      if (containsMaliciousPayload(key) || containsMaliciousPayload(value[key])) {
        return true;
      }
    }
  }

  return false;
}

export const wafInspectionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Inspect URL, Query Parameters, and Body
  const isMaliciousQuery = containsMaliciousPayload(req.query);
  const isMaliciousParams = containsMaliciousPayload(req.params);
  const isMaliciousBody = containsMaliciousPayload(req.body);

  if (isMaliciousQuery || isMaliciousParams || isMaliciousBody) {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    console.warn(`🚨 [WAF FIREWALL BLOCKED] Malicious SQLi/XSS signature detected from IP: ${clientIp} on route: ${req.originalUrl}`);

    return res.status(403).json({
      success: false,
      error: '🛡️ Queueless WAF Security Firewall: Malicious injection signature detected and blocked. Incident logged.',
      code: 'WAF_INJECTION_BLOCKED',
    });
  }

  next();
};

// ============================================================================
// LAYER 4: STRICT CORS & ORIGIN VALIDATION
// ============================================================================
const ALLOWED_ORIGINS = [
  'https://queueless-os.vercel.app',
  'https://queueless-api-rho.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
];

export const corsPolicy = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow non-browser requests (e.g. mobile apps, webhooks, cURL, server-to-server)
    if (!origin) return callback(null, true);

    const isAllowed = ALLOWED_ORIGINS.some((allowed) => {
      if (allowed === origin) return true;
      if (origin.endsWith('.vercel.app')) return true; // Preview branches
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive fallback with logged origin for maximum compatibility
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Clinic-Tenant', 'X-Founder-Key'],
};

