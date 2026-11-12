export type PlanId = 'STARTER' | 'GROWTH_OPD' | 'ENTERPRISE';

export interface PlanTemplate {
  id: PlanId;
  name: string;
  badge?: string;
  tagline: string;
  doctorLimit: string;
  idealFor: string;
  hardwareIncluded: string;
  features: string[];
  highlight?: boolean;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  region: string;
  defaultFee: number;
  feeMin: number;
  feeMax: number;
  feeStep: number;
  standeeFee: number;
  rates: Record<PlanId, { monthly: number; annual: number }>;
}

export const WORLDWIDE_CURRENCIES: Record<string, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    region: 'Americas & Global',
    defaultFee: 50,
    feeMin: 15,
    feeMax: 300,
    feeStep: 5,
    standeeFee: 0,
    rates: {
      STARTER: { monthly: 49, annual: 490 },
      GROWTH_OPD: { monthly: 149, annual: 1490 },
      ENTERPRISE: { monthly: 399, annual: 3990 },
    },
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    flag: '🇮🇳',
    region: 'India & South Asia',
    defaultFee: 500,
    feeMin: 100,
    feeMax: 2000,
    feeStep: 50,
    standeeFee: 0,
    rates: {
      STARTER: { monthly: 3999, annual: 39990 },
      GROWTH_OPD: { monthly: 9999, annual: 99990 },
      ENTERPRISE: { monthly: 29999, annual: 299990 },
    },
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    flag: '🇬🇧',
    region: 'United Kingdom (NHS)',
    defaultFee: 40,
    feeMin: 10,
    feeMax: 200,
    feeStep: 5,
    standeeFee: 0,
    rates: {
      STARTER: { monthly: 39, annual: 390 },
      GROWTH_OPD: { monthly: 119, annual: 1190 },
      ENTERPRISE: { monthly: 319, annual: 3190 },
    },
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    flag: '🇪🇺',
    region: 'European Union (GDPR)',
    defaultFee: 45,
    feeMin: 15,
    feeMax: 250,
    feeStep: 5,
    standeeFee: 0,
    rates: {
      STARTER: { monthly: 45, annual: 450 },
      GROWTH_OPD: { monthly: 139, annual: 1390 },
      ENTERPRISE: { monthly: 369, annual: 3690 },
    },
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    flag: '🇦🇪',
    region: 'UAE & GCC (NABIDH)',
    defaultFee: 180,
    feeMin: 50,
    feeMax: 900,
    feeStep: 10,
    standeeFee: 0,
    rates: {
      STARTER: { monthly: 179, annual: 1790 },
      GROWTH_OPD: { monthly: 549, annual: 5490 },
      ENTERPRISE: { monthly: 1469, annual: 14690 },
    },
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    flag: '🇸🇬',
    region: 'Singapore & ASEAN',
    defaultFee: 65,
    feeMin: 20,
    feeMax: 350,
    feeStep: 5,
    standeeFee: 0,
    rates: {
      STARTER: { monthly: 65, annual: 650 },
      GROWTH_OPD: { monthly: 199, annual: 1990 },
      ENTERPRISE: { monthly: 539, annual: 5390 },
    },
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    flag: '🇦🇺',
    region: 'Australia & NZ',
    defaultFee: 75,
    feeMin: 25,
    feeMax: 400,
    feeStep: 5,
    standeeFee: 0,
    rates: {
      STARTER: { monthly: 75, annual: 750 },
      GROWTH_OPD: { monthly: 229, annual: 2290 },
      ENTERPRISE: { monthly: 599, annual: 5990 },
    },
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    flag: '🇨🇦',
    region: 'Canada',
    defaultFee: 65,
    feeMin: 20,
    feeMax: 350,
    feeStep: 5,
    standeeFee: 0,
    rates: {
      STARTER: { monthly: 65, annual: 650 },
      GROWTH_OPD: { monthly: 199, annual: 1990 },
      ENTERPRISE: { monthly: 539, annual: 5390 },
    },
  },
};

export const PLAN_TEMPLATES: PlanTemplate[] = [
  {
    id: 'STARTER',
    name: 'Starter Clinic',
    tagline: 'Ideal for solo clinics & specialty practices getting rid of paper tokens.',
    doctorLimit: 'Up to 2 Consulting Doctors & Cabins',
    idealFor: 'Single-doctor practices, dental clinics, pediatric & eye clinics',
    hardwareIncluded: 'Instant Cloud Setup & Print-Ready Vector QR Kit',
    features: [
      '14-Day Free Trial • Instant 60-Second Setup',
      'Zero-app patient QR mobile check-in',
      '1,500 monthly digital patient tokens (~50 patients/day)',
      'Pay-as-you-grow token credit top-ups (₹0.20 / credit)',
      'Live queue token countdown on patient smartphone',
      'Reception queue admission & search desk',
      'Doctor 1-tap call next interface',
      'Instant SMS/WhatsApp token notifications',
      'Basic OPD throughput & wait time metrics',
      'Email & WhatsApp 24/7 technical support',
      'Encrypted patient records (HIPAA & ABDM)',
    ],
  },
  {
    id: 'GROWTH_OPD',
    name: 'Growth Super OPD',
    badge: '🔥 MOST POPULAR • WORLDWIDE CHOICE',
    highlight: true,
    tagline: 'The complete zero-wait operating system for busy multi-cabin polyclinics & urgent care.',
    doctorLimit: 'Up to 8 Consulting Doctors & Cabins',
    idealFor: 'Polyclinics, urgent care clinics, nursing homes & OPD wings',
    hardwareIncluded: 'Instant Cloud Setup & Multi-Screen TV Kiosk URL',
    features: [
      '14-Day Free Pilot • No Credit Card Required',
      '🚗 Virtual Waiting Room ("Wait in Your Car / Cafe" Check-in)',
      '🛡️ Real-Time USA Insurance Eligibility Verifier (EDI 270/271)',
      'Everything in Starter Clinic +',
      '10,000 monthly digital patient tokens (~350 patients/day)',
      'Discounted token refill rate (₹0.15 / credit)',
      'Multi-Cabin Lobby TV Display Kiosk with Audio Chimes',
      'Bilingual Text-to-Speech Hindi & English Announcements',
      'Dodo Payments & PayPal Digital Fee Collection (0% platform markup)',
      '15-Day Follow-Up Consultation Retention Engine',
      'Thermal 58mm/80mm receipt printer dispatch support',
      'Doctor cabin Alt+N global calling hotkey & presets',
      'Cash Counter drawer audit & receipt tax generator',
      'Patient Reviews & Sentiments live telemetry feed',
      'Multiple receptionist & cashier logins with PIN security',
      'Priority phone & dedicated clinical onboarding manager',
    ],
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise & White-Label',
    badge: '100% WHITE-LABEL • HOSPITAL CHAINS',
    tagline: 'Zero Queueless branding, custom hospital domain, Oracle/Epic EHR APIs, and dedicated SLA.',
    doctorLimit: 'Unlimited Doctors, Multi-Floors & Cabins',
    idealFor: 'Multi-specialty hospitals, hospital networks, urgent care franchises',
    hardwareIncluded: 'Dedicated Cloud Cluster, Custom Domain & HMS Webhooks',
    features: [
      '⭐ Dedicated SLA Deployment • Custom Hospital Integration',
      '⚪ 100% White-Label: Powered solely by Your Hospital Brand & Logo',
      '🌐 Custom Subdomain (e.g. opd.mayo-care.com / queue.fortis.in)',
      '🚗 Advanced Virtual Waiting Room with Valet & SMS Chime Calling',
      '🛡️ Automated Insurance Clearinghouse Integration (EDI 270/271/835)',
      '🏥 Oracle Health, Cerner & Epic Systems FHIR API Connectors',
      '50,000+ monthly digital tokens or unlimited hospital volume',
      'Multi-floor & multi-department automated patient routing',
      'Dedicated Customer Success & Clinical Training Manager',
      'Live video staff training & software rollout support',
      '99.99% Uptime SLA & 24/7 dedicated emergency medical hotline',
      'Custom BAA (Business Associate Agreement) for HIPAA & GDPR',
    ],
  },
];

export const COUNTRY_DIAL_CODES = [
  { flag: '🇺🇸', name: 'USA / Canada', code: '+1' },
  { flag: '🇮🇳', name: 'India', code: '+91' },
  { flag: '🇬🇧', name: 'United Kingdom', code: '+44' },
  { flag: '🇦🇪', name: 'UAE', code: '+971' },
  { flag: '🇸🇬', name: 'Singapore', code: '+65' },
  { flag: '🇦🇺', name: 'Australia', code: '+61' },
  { flag: '🇩🇪', name: 'Germany', code: '+49' },
  { flag: '🇫🇷', name: 'France', code: '+33' },
  { flag: '🇸🇦', name: 'Saudi Arabia', code: '+966' },
  { flag: '🇶🇦', name: 'Qatar', code: '+974' },
  { flag: '🇿🇦', name: 'South Africa', code: '+27' },
  { flag: '🇲🇾', name: 'Malaysia', code: '+60' },
  { flag: '🇳🇿', name: 'New Zealand', code: '+64' },
  { flag: '🇯🇵', name: 'Japan', code: '+81' },
];

export const GLOBAL_COMPLIANCE = [
  {
    flag: '🇺🇸',
    name: 'HIPAA Compliant',
    region: 'United States',
    desc: 'AES-256 encrypted PHI, strict BAA agreements, RBAC access controls & SOC-2 Type II audit logging.',
  },
  {
    flag: '🇪🇺',
    name: 'GDPR & ISO-27001',
    region: 'European Union',
    desc: 'Strict patient data sovereignty, zero invasive advertising cookies, Right to Erasure & GDPR Article 9 ready.',
  },
  {
    flag: '🇬🇧',
    name: 'NHS Architecture Ready',
    region: 'United Kingdom',
    desc: 'Open standard HL7 FHIR queue telemetry, NHS number patient lookup interoperability & clinical governance ready.',
  },
  {
    flag: '🇮🇳',
    name: 'ABDM Certified',
    region: 'India',
    desc: 'Ayushman Bharat Digital Mission M1/M2 ready, instant ABHA health ID verification & encrypted OPD records.',
  },
  {
    flag: '🇦🇪',
    name: 'NABIDH & Malaffi',
    region: 'UAE & Middle East',
    desc: 'Dubai Health Authority (DHA) & DoH Abu Dhabi Health Information Exchange compatibility architecture.',
  },
  {
    flag: '🌐',
    name: 'Global Edge Cloud (<35ms)',
    region: '120+ Countries',
    desc: 'Distributed across 285+ AWS & Cloudflare edge pop centers for sub-35ms real-time token sync worldwide.',
  },
];

export type FaqCategory = 'ALL' | 'DIRECTORS' | 'DOCTORS' | 'RECEPTION' | 'PAYMENTS_COMPLIANCE';

export interface FaqItem {
  category: FaqCategory;
  categoryLabel: string;
  q: string;
  a: string;
}

export const FAQS: FaqItem[] = [
  {
    category: 'DIRECTORS',
    categoryLabel: 'For Hospital Directors',
    q: 'How quickly can our hospital go live with Queueless?',
    a: 'Under 3 minutes! As soon as you complete checkout via Dodo Payments or PayPal, your hospital workspace, unique check-in slug, and printable QR standee are provisioned instantly. You can print the standee and begin admitting patients today without any IT servers.',
  },
  {
    category: 'PAYMENTS_COMPLIANCE',
    categoryLabel: 'Payments & Checkout',
    q: 'Which payment methods do you support for subscription and OPD consultation fees?',
    a: 'For platform subscription, we accept all major cards and local payment methods via Dodo Payments and PayPal with instant automatic activation. For your clinic consultation fees, patients can pay directly via card, UPI, Apple Pay, or cash at your frontdesk.',
  },
  {
    category: 'RECEPTION',
    categoryLabel: 'For Reception & Patients',
    q: 'Do patients need to download any mobile app?',
    a: 'No app download required! Patients simply scan the QR standee using their standard smartphone camera, and the fast web pass opens instantly in any browser. This ensures 98%+ patient adoption without registration friction.',
  },
  {
    category: 'RECEPTION',
    categoryLabel: 'For Reception & Patients',
    q: 'What if elderly or rural patients arrive without smartphones?',
    a: 'Your frontdesk cashier desk has a 1-click thermal receipt generator. The receptionist enters the patient name or phone number, collects cash, and prints an official 58mm or 80mm thermal paper slip in 4 seconds. The patient is automatically queued on the 55" waiting hall TV display.',
  },
  {
    category: 'DIRECTORS',
    categoryLabel: 'For Hospital Directors',
    q: 'How does the Lobby TV Display Kiosk work?',
    a: 'Any standard Smart TV, Android TV, FireStick, or PC monitor with an internet browser opens your unique display URL (e.g., /display/your-hospital). It automatically broadcasts called tokens with synchronized audio chimes and bilingual Hindi/English announcements across all consulting cabins.',
  },
  {
    category: 'DOCTORS',
    categoryLabel: 'For Consulting Doctors',
    q: 'How does Queueless streamline doctor workflow inside cabins?',
    a: 'Doctors access a clean, PIN-protected tablet or PC interface. Before the patient knocks on the door, the doctor sees pre-filled symptoms, chief complaints, and past consults. 1-click clinical presets allow instant prescription generation, and pressing Alt+N calls the next patient instantly.',
  },
  {
    category: 'DIRECTORS',
    categoryLabel: 'For Hospital Directors',
    q: 'What is the 15-Day Follow-Up Retention feature?',
    a: 'When a returning patient enters their phone number within your 15-day window, Queueless automatically verifies their prior visit, applies your discounted follow-up rate, and routes them to the same doctor — increasing return retention by 2.4x.',
  },
  {
    category: 'PAYMENTS_COMPLIANCE',
    categoryLabel: 'Regulatory & Security',
    q: 'Is patient data HIPAA and Ayushman Bharat (ABDM) compliant?',
    a: 'Yes. Queueless uses 256-bit AES encryption at rest and in transit, patient phone number masking, and ABDM M1/M2 sandbox interoperability with zero third-party tracking or cookie telemetry.',
  },
  {
    category: 'DIRECTORS',
    categoryLabel: 'For Hospital Directors',
    q: 'Does Queueless support international clinics outside India?',
    a: 'Yes! Queueless OS is deployed across 120+ countries supporting USD, GBP, EUR, AED, SGD, AUD, and CAD with local phone formats, multi-currency accounting, and HIPAA/GDPR regulatory compliance.',
  },
  {
    category: 'PAYMENTS_COMPLIANCE',
    categoryLabel: 'Credits & Token Limits',
    q: 'How do monthly patient token credits work, and what if we exceed them?',
    a: 'Each plan comes with a generous monthly patient token allowance designed for your clinic size (1,500 tokens for Starter, 10,000 tokens for Growth OPD, and 50,000+ for Enterprise). If your OPD experiences seasonal surges or patient spikes, you can instantly top up extra token credit packs starting at just ₹0.15–₹0.20 ($0.002–$0.003) per patient token directly in your admin console with zero service disruption.',
  },
];

