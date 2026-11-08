import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Star,
  ShieldCheck,
  Building2,
  Users,
  Clock,
  Award,
  Tv,
  Stethoscope,
  QrCode,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Download,
  Printer,
  Lock,
  RefreshCw,
  X,
  Sliders,
  Play,
  TrendingUp,
  HelpCircle,
  Check,
  CreditCard,
  Flame,
  Radio,
  FileText,
  UserCheck,
  Globe,
  Shield,
  ChevronDown,
  Activity,
  HeartPulse,
  Briefcase,
  Calendar,
  Share2,
  Smartphone,
  AlertTriangle,
  TrendingDown,
  Volume2,
  VolumeX,
  ShieldAlert,
  MessageCircle,
  Search,
  ChevronLeft,
  Filter,
  BarChart3,
  ThumbsUp,
  Timer,
  Rocket,
  BriefcaseMedical,
  Hospital,
} from 'lucide-react';
import { playClinicChime, playClinicVoiceAnnouncement } from '../utils/audio';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';
import {
  WORLDWIDE_CURRENCIES,
  PLAN_TEMPLATES,
  type PlanId,
  type PlanTemplate,
  type CurrencyConfig,
} from '../data/commercialData';
import { API_BASE_URL } from '../config/api';



const COUNTRY_DIAL_CODES = [
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

const GLOBAL_COMPLIANCE = [
  {
    flag: '🇺🇸',
    name: 'HIPAA Compliant',
    region: 'United States',
    desc: '256-bit AES cryptographic encryption, zero unauthorized medical record disclosure, BAA agreements on request.',
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

export type FaqCategory = 'ALL' | 'DIRECTORS' | 'DOCTORS' | 'RECEPTION' | 'COMPLIANCE';

export interface FaqItem {
  category: FaqCategory;
  categoryLabel: string;
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    category: 'DIRECTORS',
    categoryLabel: 'For Hospital Directors',
    q: 'How quickly can our hospital go live with Queueless?',
    a: 'Under 3 minutes! As soon as you complete checkout, your hospital portal, unique check-in slug, and print-ready vector QR kit are provisioned instantly. You can print the kit and begin admitting patients today without any IT servers.',
  },
  {
    category: 'RECEPTION',
    categoryLabel: 'For Reception & Patients',
    q: 'Do patients need to download any mobile app?',
    a: 'No app download required! Patients simply scan the vector QR badge using their standard smartphone camera, and the fast web pass opens instantly in any browser. This ensures 98%+ patient adoption without registration friction.',
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
    a: 'Doctors access a clean, PIN-protected tablet or PC interface. Before the patient knocks on the door, the doctor sees pre-filled symptoms, chief complaints, and past consults. 1-click clinical presets (Viral Fever, URTI, GERD) allow instant prescription generation, saving 4 minutes per consultation.',
  },
  {
    category: 'DIRECTORS',
    categoryLabel: 'For Hospital Directors',
    q: 'Can we collect consultation fees online and in cash?',
    a: 'Yes. Queueless supports direct online card and UPI payments credited straight to your hospital bank account, as well as Cash Counter verification where the cashier approves the token upon physical fee collection.',
  },
  {
    category: 'DIRECTORS',
    categoryLabel: 'For Hospital Directors',
    q: 'What is the 15-Day Follow-Up Retention feature?',
    a: 'When a returning patient enters their phone number within your 15-day window, Queueless automatically verifies their prior visit, applies your discounted follow-up fee (e.g. ₹250), and routes them to the same doctor — increasing return retention by 2.4x.',
  },
  {
    category: 'COMPLIANCE',
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
];

const PARTNER_HOSPITALS = [
  { name: 'APOLLO CLINICS', logo: '/assets/logos/apollo.svg', sub: 'Multi-Specialty OPD', badge: 'NABH Gold' },
  { name: 'FORTIS HEALTHCARE', logo: '/assets/logos/fortis.svg', sub: 'Super-Specialty Hospital', badge: 'JCI Accredited' },
  { name: 'MAX HEALTHCARE', logo: '/assets/logos/max.svg', sub: 'Tertiary Care Center', badge: 'ABDM M2 Live' },
  { name: 'MANIPAL HOSPITALS', logo: '/assets/logos/manipal.svg', sub: 'Clinical Excellence', badge: 'Multi-Cabin Hub' },
  { name: 'MEDANTA MEDICITY', logo: '/assets/logos/medanta.svg', sub: 'Smart OPD Hub', badge: 'AI Presets' },
  { name: 'NARAYANA HEALTH', logo: '/assets/logos/narayana.svg', sub: 'Cardiac & Multi-OPD', badge: 'Pan-India' },
  { name: 'NHS UK TRUSTS', logo: '/assets/logos/nhs.svg', sub: 'Direct Token Pilot', badge: 'NHS Digital' },
  { name: 'DUBAI HEALTH DHA', logo: '/assets/logos/dha.svg', sub: 'UAE Medical Network', badge: 'NABIDH Aligned' },
];

const SOCIAL_PROOF_EVENTS = [
  { hospital: 'Fortis OPD (Mohali)', text: 'Deployed Growth Plan with 6 Cabins', time: '3 mins ago', badge: 'Active OPD' },
  { hospital: 'CareMax Multispecialty (New Delhi)', text: 'Saved 28 walkout patients today', time: '9 mins ago', badge: 'ROI Verified' },
  { hospital: 'Rainbow Child Clinic (Bengaluru)', text: 'Activated 15-Day Follow-Up Protocol', time: '16 mins ago', badge: 'Pediatric Center' },
  { hospital: 'Apex Surgical & Daycare (Mumbai)', text: 'Waiting Hall Smart TV Kiosk & QR Check-In Live', time: '24 mins ago', badge: 'Zero-Wait Live' },
  { hospital: 'Dr. Verma Heart Care (Gurugram)', text: 'Upgraded to Annual Enterprise Tier', time: '38 mins ago', badge: 'Enterprise Plan' },
];

const VIDEO_TESTIMONIALS = [
  {
    id: 'caremax',
    title: 'How CareMax Cut Lobby Crowding by 78% in Under 14 Days',
    doctor: 'Dr. Arvind Singhania',
    role: 'Medical Superintendent',
    hospital: 'CareMax Superspecialty Hospital',
    location: '14 Cabins • New Delhi',
    duration: '2:14 min',
    thumbnail: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
    badge: 'NABH Certified Hospital',
    impact: '-78% Crowding • ₹1.8L Saved',
    quote: 'Queueless permanently ended counter shouting in our OPD lobby. Patients now relax in our cafeteria and walk into cabins when notified on their phones.',
    takeaways: [
      'Eliminated morning reception counter lines completely',
      'Walkout rate dropped from 14% to 0% in Week 1',
      'Doctor consultations start promptly with zero lobby confusion',
    ],
  },
  {
    id: 'rainbow',
    title: 'Why Rainbow Pediatrics Replaced Thermal Kiosks with Cloud QR Check-In',
    doctor: 'Dr. Priya S. Kulkarni',
    role: 'Head of Pediatric OPD',
    hospital: 'Rainbow Child Care & Clinic',
    location: '8 Cabins • Bengaluru',
    duration: '1:48 min',
    thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1594824813637-2309f4851221?w=200&auto=format&fit=crop&q=80',
    badge: 'Premier Child Health',
    impact: '2.6x Follow-Up Retention',
    quote: 'Mothers holding feverish infants no longer have to stand in suffocating queues. The 15-day automated follow-up engine doubled our scheduled rebookings.',
    takeaways: [
      'Feverish pediatric patients wait comfortably in outdoor lounge',
      'WhatsApp token notifications alert parents 2 tokens before turn',
      'Automated 15-day recovery check-ins boosted retention by 260%',
    ],
  },
  {
    id: 'apex',
    title: 'Eliminating Hardware Paper Jams & Saving ₹3.2 Lakhs in AMC',
    doctor: 'Col. R. K. Nair',
    role: 'Chief Operating Officer',
    hospital: 'Apex Surgical & Daycare Center',
    location: '6 Cabins • Mumbai',
    duration: '3:02 min',
    thumbnail: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
    badge: 'Daycare Surgical Center',
    impact: 'Zero Hardware Capex',
    quote: 'We discarded broken touchscreen kiosks that jammed daily. The Queueless vector QR kit never fails and runs on our existing Sony TVs.',
    takeaways: [
      'Saved ₹3,20,000 in expensive annual touchscreen maintenance contracts',
      'Setup took 18 minutes using existing hospital smart TVs',
      '100% operational uptime without IT support staff needed',
    ],
  },
];

const VERIFIED_REVIEWS = [
  {
    author: 'Dr. Arvind Singhania',
    role: 'Medical Superintendent',
    org: 'CareMax Superspecialty • New Delhi',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
    badge: 'NABH Accredited',
    category: 'DOCTORS',
    rating: 5,
    highlight: '-78% Lobby Crowding',
    text: 'Queueless permanently ended counter shouting in our OPD lobby. Patients now relax in our cafeteria and walk into doctor cabins right when notified on their phones. Our walkouts dropped to zero in week one.',
  },
  {
    author: 'Dr. Priya S. Kulkarni',
    role: 'Head of Pediatric OPD',
    org: 'Rainbow Children Clinic • Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1594824813637-2309f4851221?w=200&auto=format&fit=crop&q=80',
    badge: 'Child Care Specialist',
    category: 'DOCTORS',
    rating: 5,
    highlight: '2.6x Follow-Up Retention',
    text: 'Parents love the live token pass. Mothers don’t have to hold crying feverish infants in congested counter lines. The 15-day automated follow-up engine doubled our scheduled rebookings effortlessly.',
  },
  {
    author: 'Col. R. K. Nair',
    role: 'Chief Operating Officer',
    org: 'Apex Daycare & Surgical • Mumbai',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
    badge: 'Hospital Operations',
    category: 'DOCTORS',
    rating: 5,
    highlight: '₹3.2 Lakhs Saved',
    text: 'We discarded broken thermal touchscreens that jammed every second day. The digital QR check-in portal runs 24/7 on our existing Sony Android TVs, and saved us ₹3.2 lakhs in expensive kiosk maintenance contracts.',
  },
  {
    author: 'Dr. Rajesh Verma',
    role: 'Chief Cardiologist',
    org: 'Apollo Heart Institute • Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80',
    badge: 'Senior Consultant',
    category: 'DOCTORS',
    rating: 5,
    highlight: '1-Click Cabin Call',
    text: 'Doctor cabin interface is so simple. 1-click calls next token, prescription history is right there, and patients arrive on time without knocking repeatedly on my door.',
  },
  {
    author: 'Dr. Ananya Sen, MD',
    role: 'Director of Outpatient Services',
    org: 'Fortis Healthcare OPD • Kolkata',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
    badge: 'Clinical Director',
    category: 'DOCTORS',
    rating: 5,
    highlight: '92% Less Desk Queries',
    text: 'WhatsApp live queue updates reduced reception desk inquiries by 92%. Our desk staff can now focus on patient care instead of answering "Doctor kab aayenge?" 500 times a day.',
  },
  {
    author: 'Sunita Mehra',
    role: 'Family Caregiver',
    org: 'Patient at City Health OPD',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    badge: 'Verified Google Review',
    category: 'PATIENTS',
    rating: 5,
    highlight: 'Zero Counter Waiting',
    text: 'Took my 74-year-old mother for a cardiology checkup. Instead of standing in a suffocating counter line, we sat in the garden cafe. Her phone buzzed when token 42 was called! Incredible experience.',
  },
  {
    author: 'Rahul Malhotra',
    role: 'Orthopedic Patient',
    org: 'Patient at CareMax New Delhi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    badge: 'Verified Practo Review',
    category: 'PATIENTS',
    rating: 5,
    highlight: '20-Sec QR Scan',
    text: 'I had a sprained ankle and standing in line was painful. Scanned the digital QR at the entry door with my phone, sat on a sofa, and watched the big TV screen. Doctor called my number in 12 minutes.',
  },
  {
    author: 'Meenakshi Iyer',
    role: 'Working Mother',
    org: 'Patient at Rainbow Pediatrics',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    badge: 'Verified Google Review',
    category: 'PATIENTS',
    rating: 5,
    highlight: 'WhatsApp Alert 2 Tokens Ahead',
    text: 'The best hospital technology in India. WhatsApp told me "You are 2 tokens away, please move toward Cabin 2". No chaos, no screaming, just pure calm.',
  },
];

interface ClinicalReel {
  id: number;
  title: string;
  subtitle: string;
  doctor: string;
  hospital: string;
  badge: string;
  badgeColor: string;
  videoSrc: string;
}

const CLINICAL_REELS: ClinicalReel[] = [
  {
    id: 1,
    title: 'Doctor Cabin 1-Click Call',
    subtitle: 'Token A-116 called directly from iPad with 1 click',
    doctor: 'Dr. Rohan Sharma, MD',
    hospital: 'CareMax Superspecialty • Cabin 204',
    badge: 'Cabin Console',
    badgeColor: 'bg-blue-600',
    videoSrc: '/assets/videos/reel_doctor_cabin.mp4',
  },
  {
    id: 2,
    title: '20-Sec Entrance QR Admission',
    subtitle: 'Scanned QR at hospital gate, got live wait pass on phone',
    doctor: 'Dr. Priya S. Kulkarni',
    hospital: 'Rainbow Children Clinic • OPD Gate',
    badge: 'Mobile QR Pass',
    badgeColor: 'bg-emerald-600',
    videoSrc: '/assets/videos/reel_patient_checkin.mp4',
  },
  {
    id: 3,
    title: 'Silent Lobby & 55" TV Chime',
    subtitle: 'Waiting hall TV chimes in Hindi & English automatically',
    doctor: 'OPD Central Coordinator',
    hospital: 'Medanta Medicity • Central Hub',
    badge: '55" OLED TV Kiosk',
    badgeColor: 'bg-indigo-600',
    videoSrc: '/assets/videos/reel_hospital_lounge.mp4',
  },
  {
    id: 4,
    title: 'Zero-Wait Daycare Surgery',
    subtitle: 'Eliminated counter paper jams & cut crowding by 78%',
    doctor: 'Col. R. K. Nair',
    hospital: 'Apex Surgical Daycare • Procedural Hub',
    badge: 'Surgical Daycare',
    badgeColor: 'bg-purple-600',
    videoSrc: '/assets/videos/reel_daycare_surgery.mp4',
  },
];

export const QueuelessWebsite: React.FC = () => {
  // Global Currency State
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('USD');
  const selectedCurrency = WORLDWIDE_CURRENCIES[selectedCurrencyCode] || WORLDWIDE_CURRENCIES.USD;

  // Billing Cycle State
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('ANNUAL');
  const [selectedPlanTemplate, setSelectedPlanTemplate] = useState<PlanTemplate>(PLAN_TEMPLATES[1]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [hardwareAddon, setHardwareAddon] = useState(true);

  // Phone Dial Code
  const [dialCode, setDialCode] = useState('+1');

  // ROI Calculator State
  const [roiDoctors, setRoiDoctors] = useState(4);
  const [roiPatients, setRoiPatients] = useState(120);
  const [roiFee, setRoiFee] = useState(50); // initialized to USD 50

  // Form State for Instant Checkout / Buy
  const [hospitalName, setHospitalName] = useState('');
  const [slug, setSlug] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [doctorName, setDoctorName] = useState('');
  const [doctorSpecialty, setDoctorSpecialty] = useState('');
  const [doctorRoom, setDoctorRoom] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('CARD');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribedResult, setSubscribedResult] = useState<any | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showQuickSimulationPrompt, setShowQuickSimulationPrompt] = useState(false);

  // Video Testimonial & Reel State
  const [unmutedReelId, setUnmutedReelId] = useState<number | null>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  const toggleMute = (id: number) => {
    if (unmutedReelId === id) {
      setUnmutedReelId(null);
      if (videoRefs.current[id]) {
        videoRefs.current[id]!.muted = true;
      }
    } else {
      if (unmutedReelId !== null && videoRefs.current[unmutedReelId]) {
        videoRefs.current[unmutedReelId]!.muted = true;
      }
      setUnmutedReelId(id);
      if (videoRefs.current[id]) {
        videoRefs.current[id]!.muted = false;
        videoRefs.current[id]!.play().catch(() => {});
      }
    }
  };

  // Enterprise Executive Demo Modal State
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoName, setDemoName] = useState('');
  const [demoHospital, setDemoHospital] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoPhone, setDemoPhone] = useState('');
  const [demoCabins, setDemoCabins] = useState('6-15 Doctors');
  const [demoDate, setDemoDate] = useState('');
  const [demoConfirmed, setDemoConfirmed] = useState(false);

  // Executive Procurement One-Pager Modal State
  const [showPitchDeckModal, setShowPitchDeckModal] = useState(false);

  // Hospital Portals & Setup Links Modal State
  const [showClientPortalModal, setShowClientPortalModal] = useState(false);
  const [customPortalSlug, setCustomPortalSlug] = useState('city-health');

  // 5-Pillar Interactive Product Suite Tab State
  const [productTab, setProductTab] = useState<'MOBILE_QR' | 'TV_KIOSK' | 'DOCTOR_CABIN' | 'RECEPTION_POS' | 'EXECUTIVE_ANALYTICS'>('MOBILE_QR');

  // Sales Lead Form State
  const [leadName, setLeadName] = useState('');
  const [leadHospital, setLeadHospital] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Interactive Live Mockup Queue State
  const [demoCalledToken, setDemoCalledToken] = useState('A-108');
  const [demoDoctorCabin, setDemoDoctorCabin] = useState('Cabin 1');
  const [simulatedCallFlash, setSimulatedCallFlash] = useState(false);

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [faqCategory, setFaqCategory] = useState<FaqCategory>('ALL');

  // Hero Multi-Step Active State
  const [heroStep, setHeroStep] = useState<number>(3);

  // Live Activity Social Proof Toast State
  const [currentToastIdx, setCurrentToastIdx] = useState(0);
  const [showSocialToast, setShowSocialToast] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentToastIdx((prev) => (prev + 1) % SOCIAL_PROOF_EVENTS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  // Instant 60-Second OPD Congestion Audit Modal State
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditHospital, setAuditHospital] = useState('');
  const [auditDailyPatients, setAuditDailyPatients] = useState(120);
  const [auditFee, setAuditFee] = useState(500);
  const [auditDoctors, setAuditDoctors] = useState(4);

  // Category Strip Horizontal Scroll Controller (Dribbble Navigation)
  const categoryScrollRef = React.useRef<HTMLDivElement>(null);
  const scrollCategory = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmt = direction === 'left' ? -280 : 280;
      categoryScrollRef.current.scrollBy({ left: scrollAmt, behavior: 'smooth' });
    }
  };

  const handleSelectCurrency = (code: string) => {
    setSelectedCurrencyCode(code);
    const curr = WORLDWIDE_CURRENCIES[code];
    if (curr) {
      setRoiFee(curr.defaultFee);
      if (code === 'INR') {
        setDialCode('+91');
        setPaymentMethod('UPI');
      } else if (code === 'GBP') {
        setDialCode('+44');
        setPaymentMethod('CARD');
      } else if (code === 'AED') {
        setDialCode('+971');
        setPaymentMethod('CARD');
      } else if (code === 'SGD') {
        setDialCode('+65');
        setPaymentMethod('CARD');
      } else if (code === 'AUD') {
        setDialCode('+61');
        setPaymentMethod('CARD');
      } else if (code === 'EUR') {
        setDialCode('+49');
        setPaymentMethod('CARD');
      } else {
        setDialCode('+1');
        setPaymentMethod('CARD');
      }
    }
  };

  // ROI Calculations
  const monthlyPatients = roiPatients * 26; // 26 working days
  const walkoutRateOld = 0.12; // 12% walkout in chaotic OPDs
  const walkoutRateQueueless = 0.02; // Reduced to 2%
  const patientsSavedMonthly = Math.round(monthlyPatients * (walkoutRateOld - walkoutRateQueueless));
  const revenueRetainedMonthly = patientsSavedMonthly * roiFee;
  const staffHoursSavedMonthly = Math.round((monthlyPatients * 2.5) / 60);
  const estimatedAnnualGain = revenueRetainedMonthly * 12;

  const currentPlanRates = selectedCurrency.rates[selectedPlanTemplate.id];
  const currentPlanMonthlyRate =
    billingCycle === 'ANNUAL'
      ? Math.round(currentPlanRates.annual / 12)
      : currentPlanRates.monthly;

  const standeeEffectiveCost = 0;

  const totalDueToday =
    billingCycle === 'ANNUAL'
      ? currentPlanRates.annual
      : currentPlanRates.monthly;

  const handleOpenBuyModal = (template: PlanTemplate) => {
    setSelectedPlanTemplate(template);
    setShowCheckoutModal(true);
    setCheckoutError(null);
  };

  const handleInitiateQuickSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalName.trim() || !slug.trim()) {
      setCheckoutError('Please enter Hospital Name and URL Slug.');
      return;
    }
    setCheckoutError(null);
    setShowQuickSimulationPrompt(true);
  };

  const handleApproveQuickSubscribe = async () => {
    setShowQuickSimulationPrompt(false);
    setSubscribing(true);
    setCheckoutError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/clinics/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalName: hospitalName.trim(),
          slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          city: city.trim(),
          address: address.trim(),
          phone: `${dialCode} ${phone.trim()}`,
          adminEmail: adminEmail.trim(),
          adminPassword: adminPassword.trim() || 'admin123',
          planId: selectedPlanTemplate.id,
          planName: selectedPlanTemplate.name,
          billingCycle,
          currency: selectedCurrency.code,
          hardwareAddon,
          totalAmount: totalDueToday,
          paymentMethod: `${paymentMethod}_SIMULATED`,
          initialDoctorName: doctorName.trim() || 'Dr. Consultant Specialist, MD',
          initialDoctorSpecialty: doctorSpecialty.trim() || 'General Medicine',
          initialDoctorRoom: doctorRoom.trim() || 'Cabin 1',
        }),
      });

      const resData = await res.json();
      if (resData.success && resData.data) {
        playClinicChime();
        setSubscribedResult(resData.data);
      } else {
        setCheckoutError(resData.error || 'Failed to complete subscription');
      }
    } catch (err) {
      setCheckoutError('Could not connect to payment gateway. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const handleDeclineQuickSubscribe = () => {
    setShowQuickSimulationPrompt(false);
    setSubscribing(false);
    setCheckoutError('Payment cancelled or declined by user. No card was charged. You can retry anytime.');
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE_URL}/api/v1/clinics/sales-inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalName: leadHospital,
          contactPerson: leadName,
          phone: leadPhone,
        }),
      });
      setLeadSubmitted(true);
      playClinicChime();
    } catch (err) {
      setLeadSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-x-clip transition-colors duration-200">
      {/* Modern High-End Dot Matrix Blueprint Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-dot-matrix opacity-70"></div>

      {/* Ambient Clinical Luxury Radial Flares */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-blue-400/15 via-indigo-300/10 to-transparent blur-[160px] rounded-full"></div>
        <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-teal-300/10 blur-[170px] rounded-full"></div>
        <div className="absolute top-2/3 -right-40 w-[650px] h-[650px] bg-indigo-300/10 blur-[170px] rounded-full"></div>
      </div>

      {/* Clean Commercial Navigation (No hospital portals modal publicly exposed) */}
      <CommercialNavbar
        currentCurrencyCode={selectedCurrencyCode}
        onCurrencyChange={(code) => handleSelectCurrency(code)}
        onOpenAuditModal={() => setShowAuditModal(true)}
      />

      {/* ============================================================== */}
      {/* 2. WORLD-CLASS ENTERPRISE HEALTHCARE SAAS HERO                */}
      {/* ============================================================== */}
      <section className="relative pt-12 sm:pt-20 pb-12 sm:pb-20 px-4 sm:px-6 z-10 overflow-hidden text-center">
        {/* Soft Radial Ambient Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(56,189,248,0.18),rgba(99,102,241,0.08),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(14,165,233,0.18),rgba(99,102,241,0.08),rgba(0,0,0,0))] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Eyebrow Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-xs font-bold text-blue-700 dark:text-blue-300 shadow-sm backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>ABDM M1/M2 Certified Clinical Operating System</span>
            <span className="text-blue-300 dark:text-blue-700">•</span>
            <span className="font-semibold text-slate-600 dark:text-slate-400">{selectedCurrency.flag} 450+ Hospitals</span>
          </motion.div>

          {/* Master Headline: Clean 2-line structure without awkward hyphenation */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.1]"
          >
            Autonomous Zero-Wait <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
              Clinical Operating System
            </span>
          </motion.h1>

          {/* Subtitle with generous line height and optimal reading measure */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="text-sm sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 font-normal max-w-3xl mx-auto leading-relaxed"
          >
            Transform crowded reception counters into quiet, serene executive lounges. Patients scan a vector QR pass, receive live queue updates on their phone in 20 seconds, and walk directly into consulting cabins.
          </motion.p>

          {/* Doctor Social Proof Avatar Stack */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.28, ease: 'easeOut' }}
            className="pt-1 flex items-center justify-center gap-3"
          >
            <div className="flex -space-x-2 overflow-hidden">
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover shadow-sm"
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80"
                alt="Doctor 1"
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover shadow-sm"
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&auto=format&fit=crop&q=80"
                alt="Doctor 2"
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover shadow-sm"
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80"
                alt="Doctor 3"
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover shadow-sm"
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&auto=format&fit=crop&q=80"
                alt="Doctor 4"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-semibold">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span><strong>4.9/5 CSAT</strong> • 450+ Hospital Networks</span>
            </div>
          </motion.div>

          {/* Primary & Secondary Action CTAs with Spring Physics */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="w-full sm:w-auto"
            >
              <Link
                to="/signup"
                className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white shrink-0" />
                <span>Activate Queueless OS ({selectedCurrency.symbol}{currentPlanMonthlyRate}/mo) ➔</span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="w-full sm:w-auto"
            >
              <a
                href="#interactive-demo"
                className="w-full sm:w-auto px-6 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-sm rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-blue-600 dark:text-blue-400 fill-blue-600 dark:fill-blue-400 shrink-0" />
                <span>Experience Live OPD Simulator ➔</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Regulatory Trust Micro-Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium"
          >
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>14-Day Free Pilot • No Card Required</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
              <span>ABDM M1/M2 & NABH Aligned</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>AWS Mumbai 256-Bit SSL</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Tv className="w-4 h-4 text-purple-500 shrink-0" />
              <span>Zero Hardware Capex • Works on Any TV</span>
            </span>
          </motion.div>

          {/* ============================================================== */}
        {/* INTERACTIVE DUAL-DEVICE HARDWARE MOCKUP (PHONE + LOBBY TV)     */}
        {/* ============================================================== */}
        <motion.div
          id="interactive-demo"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.48, ease: 'easeOut' }}
          className="mt-10 sm:mt-12 max-w-5xl mx-auto"
        >
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-6 sm:p-9 rounded-[36px] border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative ring-1 ring-slate-900/[0.04]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Interactive Live OPD Synchronizer
                    </h3>
                    <span className="text-[10px] bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-800/80 font-mono">
                      0.2s Latency
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    See how doctor cabin calls update patient phones & lobby TV simultaneously in real-time.
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={() => {
                  const nextNum = Math.floor(100 + Math.random() * 20);
                  const cabins = ['Cabin 1 (Cardiology)', 'Cabin 2 (Pediatrics)', 'Cabin 204 (Orthopedic)'];
                  const nextCabin = cabins[Math.floor(Math.random() * cabins.length)];
                  const tokenStr = `A-${nextNum}`;
                  setDemoCalledToken(tokenStr);
                  setDemoDoctorCabin(nextCabin);
                  setSimulatedCallFlash(true);
                  setTimeout(() => setSimulatedCallFlash(false), 3500);
                  playClinicVoiceAnnouncement(tokenStr, nextCabin, 'Dr. Rohan Sharma', true);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto ring-2 ring-emerald-500/20"
              >
                <Volume2 className="w-3.5 h-3.5 fill-white" />
                <span>Simulate Doctor "Call Next" (Chime & Dual Voice 📢)</span>
              </motion.button>
            </div>

            {/* 4-Step Interactive Workflow Indicator (Responsive 2x2 Grid on Mobile, Flex on Desktop) */}
            <div className="pt-4 pb-2 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => {
                  setHeroStep(1);
                  setDemoCalledToken('A-101');
                }}
                className={`px-2.5 sm:px-3.5 py-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 ${
                  heroStep === 1
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/25 font-black'
                    : 'bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">1. Patient Scans QR</span>
                <span className="sm:hidden">1. Scan QR</span>
                <span className={`text-[10px] font-mono hidden sm:inline ${heroStep === 1 ? 'text-blue-200' : 'text-slate-400'}`}>➔</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setHeroStep(2);
                  setDemoCalledToken('A-108');
                }}
                className={`px-2.5 sm:px-3.5 py-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 ${
                  heroStep === 2
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/25 font-black'
                    : 'bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">2. 20-Sec Live Token Pass</span>
                <span className="sm:hidden">2. Live Token</span>
                <span className={`text-[10px] font-mono hidden sm:inline ${heroStep === 2 ? 'text-blue-200' : 'text-slate-400'}`}>➔</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setHeroStep(3);
                  const nextNum = Math.floor(100 + Math.random() * 20);
                  const cabins = ['Cabin 1 (Cardiology)', 'Cabin 2 (Pediatrics)', 'Cabin 204 (Orthopedic)'];
                  const nextCabin = cabins[Math.floor(Math.random() * cabins.length)];
                  const tokenStr = `A-${nextNum}`;
                  setDemoCalledToken(tokenStr);
                  setDemoDoctorCabin(nextCabin);
                  setSimulatedCallFlash(true);
                  setTimeout(() => setSimulatedCallFlash(false), 3500);
                  playClinicVoiceAnnouncement(tokenStr, nextCabin, 'Dr. Rohan Sharma', true);
                }}
                className={`px-2.5 sm:px-3.5 py-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 ${
                  heroStep === 3
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/25 font-black'
                    : 'bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                <Tv className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">3. 55" TV Chime & Voice</span>
                <span className="sm:hidden">3. TV Chime</span>
                <span className={`text-[10px] font-mono hidden sm:inline ${heroStep === 3 ? 'text-emerald-200' : 'text-slate-400'}`}>➔</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setHeroStep(4);
                  setDemoDoctorCabin('Cabin 1 (Dr. Sharma)');
                }}
                className={`px-2.5 sm:px-3.5 py-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 ${
                  heroStep === 4
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/25 font-black'
                    : 'bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">4. 15-Day Follow-Up Sync</span>
                <span className="sm:hidden">4. Follow-Up</span>
              </button>
            </div>

            {/* Side-by-Side Realistic Devices: Height-Balanced Apple & OLED Signage Layout */}
            <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left: Patient Smartphone View (iPhone 16 Pro Style) */}
              <div className="lg:col-span-5 flex justify-center items-center">
                <div className="w-[285px] sm:w-[310px] bg-slate-950 rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-700/90 ring-1 ring-slate-900/20 relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]">
                  {/* Subtle Titanium Side Reflection */}
                  <div className="absolute inset-y-0 left-0 w-0.5 bg-white/20"></div>

                  {/* Realistic iOS Dynamic Island Notch (Fluidly Expands on Call without Overlap) */}
                  <div
                    className={`absolute top-3.5 left-1/2 -translate-x-1/2 transition-all duration-300 z-30 ${
                      simulatedCallFlash
                        ? 'w-[92%] bg-black text-white rounded-[22px] p-2.5 px-3 border border-emerald-500/60 shadow-[0_8px_24px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400/40'
                        : 'w-24 h-5 bg-black rounded-full flex items-center justify-between px-2.5 border border-white/10 shadow-md'
                    }`}
                  >
                    {simulatedCallFlash ? (
                      <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </div>
                          <div className="text-left min-w-0 truncate">
                            <div className="text-[10px] font-black text-white truncate">
                              Proceed to {demoDoctorCabin}
                            </div>
                            <div className="text-[8px] font-mono text-emerald-400 font-bold truncate">
                              Ref: #QL-84920 • Token #{demoCalledToken}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-black text-amber-300 bg-amber-400/20 border border-amber-400/40 px-1.5 py-0.5 rounded shrink-0 animate-pulse">
                          {demoCalledToken}
                        </span>
                      </div>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse"></span>
                      </>
                    )}
                  </div>

                  {/* Screen Content */}
                  <div className="bg-[#F8FAFC] text-slate-900 rounded-[38px] pt-7 p-4 border border-slate-200 space-y-3 relative">
                    {/* iOS Top Status Row */}
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 px-1 pt-1 pb-1">
                      <span>9:41</span>
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                          <span className="w-0.5 h-1.5 bg-slate-800 rounded-xs"></span>
                          <span className="w-0.5 h-2 bg-slate-800 rounded-xs"></span>
                          <span className="w-0.5 h-2.5 bg-slate-800 rounded-xs"></span>
                          <span className="w-0.5 h-3 bg-slate-800 rounded-xs"></span>
                        </div>
                        <span className="text-[9px] font-bold">5G</span>
                        <div className="w-4 h-2 border border-slate-800 rounded-xs p-0.5 flex items-center">
                          <div className="w-full h-full bg-slate-800 rounded-2xs"></div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-0.5">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">
                        Live Patient Web Pass
                      </span>
                      <strong className="text-xs font-black text-slate-900">City Health Multispecialty</strong>
                    </div>

                    {/* Token Big Card with Reference Number */}
                    <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-50/80 via-indigo-50/40 to-white border border-blue-200 text-center space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Your Assigned Token</span>
                        <span className="text-[9px] font-mono font-black text-blue-700 bg-blue-100/90 border border-blue-200 px-1.5 py-0.5 rounded-md">
                          Ref: #QL-84920
                        </span>
                      </div>
                      <div className="text-4xl font-black text-slate-900 tracking-wider font-mono">
                        {demoCalledToken}
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>NOW CALLING</span>
                      </div>
                    </div>

                    {/* Boarding Pass Ticket Notch Cutouts */}
                    <div className="relative flex items-center justify-center -my-2 z-10">
                      <div className="w-4 h-4 rounded-full bg-[#F8FAFC] border border-slate-300 -ml-2 shadow-inner"></div>
                      <div className="flex-1 border-b border-dashed border-slate-300 mx-1.5"></div>
                      <div className="w-4 h-4 rounded-full bg-[#F8FAFC] border border-slate-300 -mr-2 shadow-inner"></div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-1 text-xs">
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Hospital Ref No:</span>
                        <strong className="text-slate-900 font-mono font-black">REF-QL84920</strong>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Assigned Room:</span>
                        <strong className="text-blue-700 font-black">{demoDoctorCabin}</strong>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Consulting:</span>
                        <span className="text-slate-800 font-bold">Dr. Rohan Sharma, MD</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Estimated Wait:</span>
                        <span className="text-emerald-700 font-black">0 mins (Proceed Inside)</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-center text-slate-500 leading-tight font-medium">
                      Please proceed directly to {demoDoctorCabin}. No counter lines!
                    </p>

                    {/* iOS Bottom Home Indicator Bar */}
                    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-1"></div>
                  </div>
                </div>
              </div>

              {/* Right: Smart TV Lobby OLED Board (55" Wall Kiosk Style - Perfectly Height Balanced) */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div className="bg-slate-950 rounded-3xl p-5 sm:p-6 border-4 border-slate-800 shadow-[0_25px_60px_-15px_rgba(16,185,129,0.2)] text-white relative overflow-hidden flex flex-col justify-between h-full space-y-4">
                  {/* Subtle Top Screen Glare */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>

                  {/* TV Header Bar with Live Clock & Latency Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Tv className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <span className="text-xs font-black text-white uppercase tracking-wider block">
                          OPD Lobby 55" TV Display Kiosk
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          City Health Multi-Specialty • Central Rotation
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        10:42 AM
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-end gap-0.5 h-3.5 px-1">
                          <span className={`w-0.5 bg-emerald-400 rounded-full transition-all ${simulatedCallFlash ? 'animate-eq-1' : 'h-1.5'}`}></span>
                          <span className={`w-0.5 bg-emerald-400 rounded-full transition-all ${simulatedCallFlash ? 'animate-eq-2' : 'h-3'}`}></span>
                          <span className={`w-0.5 bg-emerald-400 rounded-full transition-all ${simulatedCallFlash ? 'animate-eq-3' : 'h-2'}`}></span>
                          <span className={`w-0.5 bg-emerald-400 rounded-full transition-all ${simulatedCallFlash ? 'animate-eq-4' : 'h-3.5'}`}></span>
                          <span className={`w-0.5 bg-emerald-400 rounded-full transition-all ${simulatedCallFlash ? 'animate-eq-5' : 'h-1.5'}`}></span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-wider">
                          AUDIO ACTIVE
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Active Call Spotlight (Sonar Pulse + High Contrast Beacon) */}
                  <div className="p-4 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/40 rounded-2xl border-2 border-emerald-500/60 flex items-center justify-between shadow-lg shadow-emerald-500/10 relative overflow-hidden transition-all duration-300">
                    {/* Radar Sonar Ping Wave */}
                    {simulatedCallFlash && (
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-emerald-400/40 animate-sonar pointer-events-none"></div>
                    )}

                    <div className="relative z-10 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider">
                          NOW CALLING • {demoDoctorCabin}
                        </span>
                      </div>
                      <strong className="text-sm sm:text-base font-black text-white block">
                        Dr. Rohan Sharma, MD (Orthopedic & Joint Care)
                      </strong>
                      <div className="flex items-center gap-2 text-[10px] text-slate-300 font-mono">
                        <span className="text-emerald-400 font-bold">Ground Floor • Room 204</span>
                        <span>•</span>
                        <span className="text-slate-400">Ref: #QL-84920</span>
                      </div>
                    </div>
                    <div className="text-right relative z-10 shrink-0 pl-3">
                      <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-wider animate-pulse">
                        {demoCalledToken}
                      </div>
                      <span className="text-[9px] font-mono font-bold text-emerald-300 uppercase bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-500/40">
                        Room Entry ➔
                      </span>
                    </div>
                  </div>

                  {/* Non-Truncated Voice Broadcast Bar with Dual-Voice Indicator */}
                  <div className={`p-3 bg-slate-900/95 rounded-xl border text-[11px] flex items-center gap-3 text-slate-200 transition-all duration-300 ${
                    simulatedCallFlash
                      ? 'border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-slate-900 ring-1 ring-emerald-500/30'
                      : 'border-slate-800'
                  }`}>
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Volume2 className={`w-4 h-4 ${simulatedCallFlash ? 'animate-bounce text-emerald-300' : 'animate-pulse text-emerald-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-emerald-400 font-black uppercase tracking-wider text-[9px] block">
                        Dual Voice Announcement (Hindi + English):
                      </span>
                      <p className="text-[11px] leading-tight text-white font-medium mt-0.5">
                        "Attention please. Token <strong className="text-emerald-300 font-mono font-black">{demoCalledToken}</strong>, please proceed to <strong className="text-white font-bold">{demoDoctorCabin}</strong> for Dr. Rohan Sharma."
                      </p>
                    </div>
                    {simulatedCallFlash && (
                      <div className="flex items-end gap-0.5 h-4 shrink-0 pl-2">
                        <span className="w-1 bg-emerald-400 rounded-full animate-eq-1"></span>
                        <span className="w-1 bg-emerald-400 rounded-full animate-eq-3"></span>
                        <span className="w-1 bg-emerald-400 rounded-full animate-eq-5"></span>
                        <span className="w-1 bg-emerald-400 rounded-full animate-eq-2"></span>
                      </div>
                    )}
                  </div>

                  {/* 4 Active Doctor Cabins / Multi-Specialty Queue Roster (Fills TV Kiosk Height Perfectly) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Cabin 101 */}
                    <div className="p-2.5 bg-slate-900/70 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                          Cabin 101 • Cardiology
                        </span>
                        <strong className="text-xs font-bold text-slate-200 block truncate">Dr. Rajiv Mehra</strong>
                        <span className="text-[9px] text-blue-400 font-medium">In Consultation</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-slate-300 font-mono block">A-115</span>
                      </div>
                    </div>

                    {/* Cabin 104 */}
                    <div className="p-2.5 bg-slate-900/70 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                          Cabin 104 • Pediatrics
                        </span>
                        <strong className="text-xs font-bold text-slate-200 block truncate">Dr. Priya Patel</strong>
                        <span className="text-[9px] text-amber-400 font-medium">Waiting Outside</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-slate-300 font-mono block">B-204</span>
                      </div>
                    </div>

                    {/* Cabin 108 */}
                    <div className="p-2.5 bg-slate-900/70 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                          Cabin 108 • General Med
                        </span>
                        <strong className="text-xs font-bold text-slate-200 block truncate">Dr. Amit Roy</strong>
                        <span className="text-[9px] text-emerald-400 font-medium">Next in Line</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-slate-300 font-mono block">C-112</span>
                      </div>
                    </div>

                    {/* Cabin 202 */}
                    <div className="p-2.5 bg-slate-900/70 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                          Cabin 202 • ENT & Dental
                        </span>
                        <strong className="text-xs font-bold text-slate-200 block truncate">Dr. Sunita Rao</strong>
                        <span className="text-[9px] text-blue-400 font-medium">In Consultation</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-slate-300 font-mono block">D-089</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom TV Kiosk Marquee & Compliance Bar */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                      <span className="font-mono text-emerald-400 font-bold shrink-0">CLOUD OPD SYNC ACTIVE:</span>
                      <span className="truncate">Average Wait: 6.4 Mins • 15-Day Free Follow-Up Direct Bypass Active</span>
                    </div>
                    <span className="font-mono text-slate-500 shrink-0 hidden sm:inline pl-2">
                      Queueless Kiosk OS v2.4
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          </motion.div>
        </div>
{/* ============================================================== */}
        {/* CLINICAL TRUST, GOVERNMENT ACCREDITATION & HOSPITAL PARTNERS   */}
        {/* ============================================================== */}
        <div className="mt-14 max-w-6xl mx-auto space-y-10 text-center">
          
          {/* Trust Header with Live Badges */}
          <div className="space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Government Certified & Clinical Enterprise Trust</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Trusted by 450+ Hospitals & Clinical Superintendents
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
              Engineered specifically for Indian healthcare realities. Ayushman Bharat (ABDM) certified, NABH audit-ready, with zero patient app downloads and bank-grade data privacy.
            </p>
          </div>

          {/* Infinite Smooth Scrolling Hospital Logos Marquee */}
          <div className="relative overflow-hidden w-full py-2">
            <div className="absolute left-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-r from-[#FAFBFC] dark:from-slate-950 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute right-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-l from-[#FAFBFC] dark:from-slate-950 to-transparent z-20 pointer-events-none"></div>

            <div className="animate-marquee flex items-center gap-4 sm:gap-6 py-2">
              {[...PARTNER_HOSPITALS, ...PARTNER_HOSPITALS].map((hosp, idx) => (
                <div
                  key={`${hosp.name}-${idx}`}
                  className="px-5 py-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 flex items-center gap-4 text-xs tracking-tight shadow-sm hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all shrink-0 cursor-default group"
                >
                  <div className="h-9 px-3 py-1 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-center shrink-0">
                    <img
                      src={hosp.logo}
                      alt={hosp.name}
                      className="h-6 w-auto max-w-[125px] object-contain transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="text-left border-l border-slate-200 dark:border-slate-800 pl-3">
                    <span className="block font-black text-slate-900 dark:text-white text-xs leading-tight">
                      {hosp.sub}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {hosp.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================== */}
          {/* USER REFERENCE BANNER: Real Impact for Growing Hospitals       */}
          {/* ============================================================== */}
          <motion.div
            whileHover={{ scale: 1.008 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-2xl sm:rounded-3xl lg:rounded-full bg-gradient-to-r from-[#011438] via-[#022e70] to-[#01173d] border-2 border-sky-400/40 p-4 sm:p-5 lg:px-9 lg:py-6 shadow-[0_20px_50px_rgba(2,132,199,0.35)] text-white overflow-hidden"
          >
            {/* Ambient Cyan & Sapphire Radial Glows */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-400/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-cyan-400/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6 text-left">
              
              {/* Left Header with Glowing Squircle Chart Icon */}
              <div className="flex items-center gap-3.5 sm:gap-4 shrink-0 w-full lg:w-auto">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#022557] border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_24px_rgba(6,182,212,0.45)] shrink-0">
                  <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-300 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
                    Real Impact for Growing Hospitals
                  </h3>
                  <p className="text-xs sm:text-[13px] text-cyan-100/90 font-medium leading-relaxed max-w-xs sm:max-w-md mt-0.5">
                    Hospitals using Queueless have seen faster service, happier patients, and smoother operations.
                  </p>
                </div>
              </div>

              {/* 4 Impact Metric Columns in a Single Fluid Bar with Vertical Dividers */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-2 lg:gap-0 w-full lg:w-auto items-center justify-between">
                
                {/* Metric 1: 72% Reduction in Waiting Time */}
                <div className="flex flex-col items-center justify-center text-center px-3 sm:px-5 lg:px-7 lg:border-l border-white/20">
                  <div className="flex items-center justify-center gap-2">
                    <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 stroke-[2.3]" />
                    <span className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
                      72%
                    </span>
                  </div>
                  <div className="text-[11px] sm:text-xs text-cyan-100 font-bold leading-tight mt-1.5">
                    <span>Reduction in</span>
                    <span className="block">Waiting Time</span>
                  </div>
                </div>

                {/* Metric 2: 2.4x More Patients Served */}
                <div className="flex flex-col items-center justify-center text-center px-3 sm:px-5 lg:px-7 lg:border-l border-white/20">
                  <div className="flex items-center justify-center gap-2">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 stroke-[2.3]" />
                    <span className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
                      2.4x
                    </span>
                  </div>
                  <div className="text-[11px] sm:text-xs text-cyan-100 font-bold leading-tight mt-1.5">
                    <span>More Patients</span>
                    <span className="block">Served</span>
                  </div>
                </div>

                {/* Metric 3: 98% Patient Satisfaction */}
                <div className="flex flex-col items-center justify-center text-center px-3 sm:px-5 lg:px-7 lg:border-l border-white/20">
                  <div className="flex items-center justify-center gap-2">
                    <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 stroke-[2.3]" />
                    <span className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
                      98%
                    </span>
                  </div>
                  <div className="text-[11px] sm:text-xs text-cyan-100 font-bold leading-tight mt-1.5">
                    <span>Patient</span>
                    <span className="block">Satisfaction</span>
                  </div>
                </div>

                {/* Metric 4: 50+ Hospitals Onboarded */}
                <div className="flex flex-col items-center justify-center text-center px-3 sm:px-5 lg:px-7 lg:border-l border-white/20">
                  <div className="flex items-center justify-center gap-2">
                    <BriefcaseMedical className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 stroke-[2.3]" />
                    <span className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight">
                      50+
                    </span>
                  </div>
                  <div className="text-[11px] sm:text-xs text-cyan-100 font-bold leading-tight mt-1.5">
                    <span>Hospitals</span>
                    <span className="block">Onboarded</span>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>

        {/* ============================================================== */}
        {/* SET UP IN 3 SIMPLE STEPS                                       */}
        {/* ============================================================== */}
        <div className="mt-20 max-w-5xl mx-auto space-y-9 text-center">
          <div className="space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-full text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              <span>Instant Cloud Provisioning</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              Set Up in 3 Simple Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal">
              Get your entire hospital or clinic up and running in minutes — zero IT overhead.
            </p>
          </div>

          {/* 3 Step Cards Connected by Soft Arrows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-6 relative items-stretch">
            
            {/* Step 1: Create Your Hospital */}
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative p-7 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 shadow-md hover:border-teal-500/50 hover:shadow-xl transition-all text-center flex flex-col items-center justify-between group cursor-default"
            >
              {/* Step Badge (Top-Left) */}
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-black text-xs flex items-center justify-center absolute top-4 left-4 shadow-sm ring-2 ring-white dark:ring-slate-900">
                1
              </div>

              {/* Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200/80 dark:border-teal-700/60 shadow-sm flex items-center justify-center text-teal-600 dark:text-teal-300 mb-4 group-hover:scale-105 transition-transform mt-2">
                <BriefcaseMedical className="w-7 h-7 stroke-[2]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Create Your Hospital
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Add basic hospital details, clinical departments, and consulting doctors with room numbers.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-teal-700 dark:text-teal-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Takes ~60 seconds</span>
              </div>
            </motion.div>

            {/* Connecting Arrow 1 (Desktop) */}
            <div className="hidden md:flex absolute left-1/3 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 pointer-events-none items-center justify-center">
              <ArrowRight className="w-6 h-6 text-indigo-400 dark:text-indigo-400 stroke-[2.5] animate-pulse" />
            </div>

            {/* Step 2: Configure OPD Flow */}
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative p-7 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 shadow-md hover:border-blue-500/50 hover:shadow-xl transition-all text-center flex flex-col items-center justify-between group cursor-default"
            >
              {/* Step Badge (Top-Left) */}
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center absolute top-4 left-4 shadow-sm ring-2 ring-white dark:ring-slate-900">
                2
              </div>

              {/* Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200/80 dark:border-blue-700/60 shadow-sm flex items-center justify-center text-blue-600 dark:text-blue-300 mb-4 group-hover:scale-105 transition-transform mt-2">
                <Users className="w-7 h-7 stroke-[2]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Configure OPD Flow
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Set counter admission rules, token prefixes, 15-day follow-up policies, and consultation fees.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-blue-700 dark:text-blue-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Custom token policies</span>
              </div>
            </motion.div>

            {/* Connecting Arrow 2 (Desktop) */}
            <div className="hidden md:flex absolute left-2/3 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 pointer-events-none items-center justify-center">
              <ArrowRight className="w-6 h-6 text-indigo-400 dark:text-indigo-400 stroke-[2.5] animate-pulse" />
            </div>

            {/* Step 3: Go Live */}
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative p-7 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 shadow-md hover:border-purple-500/50 hover:shadow-xl transition-all text-center flex flex-col items-center justify-between group cursor-default"
            >
              {/* Step Badge (Top-Left) */}
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center absolute top-4 left-4 shadow-sm ring-2 ring-white dark:ring-slate-900">
                3
              </div>

              {/* Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200/80 dark:border-purple-700/60 shadow-sm flex items-center justify-center text-purple-600 dark:text-purple-300 mb-4 group-hover:scale-105 transition-transform mt-2">
                <Rocket className="w-7 h-7 stroke-[2]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Go Live Instantly
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Print entrance QR standees, open lobby TV kiosk on any smart TV, and start calling patients.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-purple-700 dark:text-purple-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero hardware shipping</span>
              </div>
            </motion.div>

          </div>
        </div>

{/* Section Heading: Why Hospitals Choose Queueless */}
          <div className="text-center pt-4 space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              Why Hospitals Choose <span className="text-blue-600 dark:text-blue-400">Queueless</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              Designed for clinical superintendents, doctors, and hospital administrators to operate zero-wait OPDs with bank-grade security and zero hardware capex.
            </p>
          </div>

          {/* 4 Pillars of Clinical Credibility & Regulatory Compliance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left pt-2">
            
            {/* Pillar 1: ABDM & NABH */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-blue-400/50 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-2xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    NHA & NABH Aligned
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Ayushman Bharat (ABDM) & NABH Audit-Ready
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Pre-configured for India's digital health mission. Features seamless ABHA verification, ABDM M1/M2 milestone reporting, and automated waiting-time documentation for periodic NABH accreditation audits.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Automated Patient Wait-Time Logs for Hospital Quality Audits</span>
              </div>
            </div>

            {/* Pillar 2: Patient Privacy & Phone Masking */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-indigo-400/50 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-2xs">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    256-Bit Cryptography
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  100% Patient Phone Privacy & Zero App Download
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Patients scan a QR pass and receive an instant browser token — zero app downloads, zero spam notifications. Public TV kiosks automatically mask mobile numbers (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs">98****3210</code>) with data hosted in AWS Mumbai.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Patient Data Reselling • 100% Hospital Ownership</span>
              </div>
            </div>

            {/* Pillar 3: 15-Day Free Follow-Up Engine */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-rose-400/50 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-2xs">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    Indian Healthcare Standard
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Hospital Admin 15-Day Free Follow-Up Rule Engine
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Configured specifically for Indian clinical consultation policies. Patients revisiting within 15 days for the same ailment are flagged as "Free Follow-Up" directly in the hospital admin console, eliminating counter arguments and billing chaos.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Customizable Follow-Up Duration per Doctor or Specialty</span>
              </div>
            </div>

            {/* Pillar 4: Zero Capex & No Lock-In Guarantee */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-teal-400/50 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-2xs">
                    <Tv className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    Zero Proprietary Hardware
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Runs on Existing Screens + 14-Day Free Pilot
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Turn your existing Sony, Samsung, LG TVs into 55" waiting hall kiosks in 3 minutes. Zero annual maintenance contracts (AMCs). Test risk-free for 14 days with full patient queue history exportable in 1 click.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Data Export Guarantee • Zero Vendor Lock-In</span>
              </div>
            </div>

          </div>

          {/* Quick Reassurance Action Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-teal-50/80 dark:from-slate-900/90 dark:via-blue-950/40 dark:to-slate-900/90 border border-blue-200/80 dark:border-blue-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  Want to verify compliance before deploying?
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Download our official ABDM & NABH Architecture Whitepaper or request a dedicated 1-on-1 hospital review.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowDemoModal(true)}
                className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Schedule Hospital Review ➔
              </button>
            </div>
          </div>
        </div>

      </section>




      {/* ============================================================== */}
      {/* 3. PROBLEM VS SOLUTION: THE HOSPITAL PERFORMANCE AUDIT         */}
      {/* ============================================================== */}
      <section className="py-24 px-4 sm:px-6 bg-slate-50/70 dark:bg-slate-950/70 border-y border-slate-200/80 dark:border-slate-800 relative z-10 transition-colors duration-200">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-full text-xs font-black uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>OPD Performance & Revenue Leak Audit</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              The True Cost of Legacy Reception Queues vs. Zero-Wait Precision
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
              Every minute patients spend trapped in desk lines burns frontdesk morale, increases viral cross-infection risks, and bleeds 18% of your consultation revenue to neighborhood clinics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* The Old Chaotic Way: The Cost of Legacy Counter Queues */}
            <div className="p-7 sm:p-9 rounded-[32px] bg-rose-50/40 dark:bg-slate-950 border border-rose-200 dark:border-rose-500/30 text-slate-900 dark:text-white shadow-xl space-y-6 relative overflow-hidden flex flex-col justify-between transition-colors">
              <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 dark:bg-rose-950/80 border border-rose-300/80 dark:border-rose-500/40 text-rose-800 dark:text-rose-300 rounded-full text-[11px] font-black uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                    <span>Critical Revenue Leak Audit</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">Status Quo</span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    The Legacy Counter Queue Bottleneck
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Broken mechanical ticket dispensers, overcrowded corridors, and zero digital audit trails.
                  </p>
                </div>

                {/* Photographic Evidence: Legacy Overcrowding */}
                <div className="relative rounded-2xl overflow-hidden h-36 sm:h-44 border border-rose-300/70 dark:border-rose-500/30 shadow-lg group">
                  <img
                    src="/assets/hospital-before-chaotic.jpg"
                    alt="Chaotic Overcrowded Hospital Reception Lines"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-md flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Legacy Reception Chaos
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/70 text-rose-300 backdrop-blur-md border border-rose-500/30">
                      48m Avg Delay
                    </span>
                  </div>
                </div>

                {/* Impact Metrics Banner (Dynamic Currency & Mobile Font Scaling) */}
                <div className="grid grid-cols-3 gap-1 sm:gap-2.5 p-2.5 sm:p-3.5 rounded-2xl bg-white/90 dark:bg-white/5 border border-rose-200 dark:border-white/10 text-center shadow-xs">
                  <div className="px-1">
                    <span className="text-xs sm:text-base md:text-xl font-black text-rose-600 dark:text-rose-400 block font-mono truncate">
                      -{selectedCurrency.symbol === '₹' ? '₹2.4L' : `${selectedCurrency.symbol}${(2800 * (selectedCurrency.defaultFee / 500)).toFixed(0)}`}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium block truncate">Monthly Leak</span>
                  </div>
                  <div className="border-x border-rose-200 dark:border-white/10 px-1">
                    <span className="text-xs sm:text-base md:text-xl font-black text-rose-600 dark:text-rose-400 block font-mono">48 Mins</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium block truncate">Standing Queue</span>
                  </div>
                  <div className="px-1">
                    <span className="text-xs sm:text-base md:text-xl font-black text-rose-600 dark:text-rose-400 block font-mono">21%</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium block truncate">Walkout Rate</span>
                  </div>
                </div>

                <ul className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black">
                      ✕
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-bold">Lobby Congestion & Viral Hazard:</strong>
                      <span className="text-slate-600 dark:text-slate-400">
                        Patients cough and stand shoulder-to-shoulder in 50-person lines, triggering airborne infection risks and angry 1-star Google complaints.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black">
                      ✕
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-bold">Frontdesk Verbal Friction & Burnout:</strong>
                      <span className="text-slate-600 dark:text-slate-400">
                        Receptionists answer "When is my turn?" 200+ times per shift, leaving zero bandwidth for billing, emergency triage, or patient empathy.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black">
                      ✕
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-bold">18-21% Walkout Revenue Bleed:</strong>
                      <span className="text-slate-600 dark:text-slate-400">
                        High-value cash and private insurance patients see the crowded lobby and leave for rival clinics, bleeding consultation & pharmacy revenue.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black">
                      ✕
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-bold">Lost Slips & Zero Follow-Up Sync:</strong>
                      <span className="text-slate-600 dark:text-slate-400">
                        Misplaced paper tokens, cabin shouting, manual paper registers, and zero tracking for the 15-day follow-up retention policy.
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-rose-200 dark:border-white/10 text-[11px] text-rose-700 dark:text-rose-300/80 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
                <span>Result: ₹25L+ yearly revenue loss and frustrated clinical staff.</span>
              </div>
            </div>

            {/* The Queueless Zero-Wait Way: Autonomous Hospital OS */}
            <div className="p-7 sm:p-9 rounded-[32px] bg-gradient-to-b from-white via-blue-50/25 to-white dark:from-slate-900 dark:via-blue-950/30 dark:to-slate-900 border-2 border-blue-600 dark:border-blue-500 shadow-[0_20px_50px_rgba(37,99,235,0.12)] ring-4 ring-blue-500/15 space-y-6 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Queueless Clinical Benchmark</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                    ABDM & HIPAA Ready
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Autonomous Zero-Wait Healthcare OS
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Contactless QR admission, synchronized Smart TV chimes, and instant doctor cabin workflow.
                  </p>
                </div>

                {/* Photographic Evidence: Modern Silent Executive Lounge */}
                <div className="relative rounded-2xl overflow-hidden h-36 sm:h-44 border border-blue-500/30 shadow-lg group">
                  <img
                    src="/assets/hospital-after-serene.jpg"
                    alt="Silent Serene Hospital Executive Lounge"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-md flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Silent Digital Lounge
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/70 text-emerald-300 backdrop-blur-md border border-emerald-500/30">
                      0 Waiting Hall Line
                    </span>
                  </div>
                </div>

                {/* Positive Impact Metrics Banner (Dynamic Currency & Mobile Font Scaling) */}
                <div className="grid grid-cols-3 gap-1 sm:gap-2.5 p-2.5 sm:p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                  <div className="px-1">
                    <span className="text-xs sm:text-base md:text-xl font-black text-emerald-700 dark:text-emerald-300 block font-mono truncate">
                      +{selectedCurrency.symbol === '₹' ? '₹2.1L' : `${selectedCurrency.symbol}${(2500 * (selectedCurrency.defaultFee / 500)).toFixed(0)}`}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-emerald-800 dark:text-emerald-400 font-bold block truncate">Revenue Saved</span>
                  </div>
                  <div className="border-x border-emerald-200 dark:border-emerald-800 px-1">
                    <span className="text-xs sm:text-base md:text-xl font-black text-emerald-700 dark:text-emerald-300 block font-mono">20 Sec</span>
                    <span className="text-[9px] sm:text-[10px] text-emerald-800 dark:text-emerald-400 font-bold block truncate">Contactless Pass</span>
                  </div>
                  <div className="px-1">
                    <span className="text-xs sm:text-base md:text-xl font-black text-emerald-700 dark:text-emerald-300 block font-mono">2.4x</span>
                    <span className="text-[9px] sm:text-[10px] text-emerald-800 dark:text-emerald-400 font-bold block truncate">Follow-Up Rate</span>
                  </div>
                </div>

                <ul className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">
                      ✓
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-bold">20-Second QR Admission:</strong>
                      <span className="text-slate-600 dark:text-slate-400">
                        Patients scan the entrance vector QR pass, pick doctor, and get a live mobile pass with real-time countdown. Zero app downloads.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">
                      ✓
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-bold">Silent Lounge & Cafeteria Freedom:</strong>
                      <span className="text-slate-600 dark:text-slate-400">
                        Patients relax comfortably in cafeteria, garden, or car. 55" OLED TV display chimes and calls them in Hindi & English when their turn arrives.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">
                      ✓
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-bold">Zero Walkouts & 2.4x Retention Engine:</strong>
                      <span className="text-slate-600 dark:text-slate-400">
                        Automated phone lookup validates 15-day follow-ups, waives fees per hospital rules, and triples patient lifetime loyalty.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">
                      ✓
                    </div>
                    <div>
                      <strong className="text-slate-900 dark:text-white block font-bold">Doctor 1-Tap Cabin Console:</strong>
                      <span className="text-slate-600 dark:text-slate-400">
                        Pre-consult symptoms, vitals, and 1-click clinical presets loaded before the patient enters the cabin. Saves 4 minutes per consultation.
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Result: 4.9-star Google ratings and guaranteed 4-day payback ROI.</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ============================================================== */}
      {/* 3.6 ENTERPRISE 5-PILLAR HOSPITAL OPERATING SUITE               */}
      {/* ============================================================== */}
      <section id="product-suite" className="py-24 px-4 sm:px-6 bg-slate-50/70 dark:bg-slate-950/70 border-b border-slate-200/80 dark:border-slate-800 relative z-10 transition-colors duration-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-full text-xs font-black uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Full-Stack Hospital Operating System</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              One Unified OS Powering Every OPD Touchpoint
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
              From entrance QR admission to doctor cabin consultation, pharmacy billing, and boardroom analytics — all synchronized in under 0.2 seconds.
            </p>

            {/* Segmented 5-Pillar Tabs with Smooth Horizontal Scroll on Mobile */}
            <div className="pt-4 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto sm:flex-wrap pb-2 sm:pb-0 scrollbar-none">
              {[
                { id: 'MOBILE_QR', icon: Smartphone, label: 'Patient Mobile Pass', sub: '20s Contactless Entry' },
                { id: 'TV_KIOSK', icon: Tv, label: 'Smart TV Wall Kiosk', sub: '55" OLED & Voice Chime' },
                { id: 'DOCTOR_CABIN', icon: Stethoscope, label: 'Doctor Cabin Console', sub: '1-Click Call & Presets' },
                { id: 'RECEPTION_POS', icon: Printer, label: 'Reception Cashier POS', sub: '58/80mm Thermal Slips' },
                { id: 'EXECUTIVE_ANALYTICS', icon: TrendingUp, label: 'Boardroom Analytics', sub: 'Real-Time Telemetry' },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = productTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setProductTab(tab.id as any)}
                    className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer border flex items-center gap-2 sm:gap-2.5 shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white border-blue-600 shadow-lg shadow-blue-600/25 ring-2 ring-blue-500/20'
                        : 'bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    <div className="text-left">
                      <span className="block leading-tight whitespace-nowrap">{tab.label}</span>
                      <span className={`text-[10px] hidden sm:block font-medium mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                        {tab.sub}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Dynamic Tab Showcase */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-[36px] border border-slate-200/90 dark:border-slate-800 shadow-xl relative overflow-hidden transition-colors duration-200">
            {/* PILLAR 1: MOBILE QR PASS */}
            {productTab === 'MOBILE_QR' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fade-in-up">
                <div className="md:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-800">
                    <Smartphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Pillar 1 • Patient Self-Service</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Zero-Install Smartphone Live OPD Pass
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    Patients scan the entrance vector QR pass and get admitted into the doctor queue in 20 seconds. No app download or account creation required.
                  </p>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Real-time live queue position & estimated wait minutes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Instant UPI / Card payment or Pay Cash at reception desk</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Dynamic Island alerts and audible chime when turn is up</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Automatic 15-day follow-up policy tracking by phone number</span>
                    </li>
                  </ul>
                  <div className="pt-3">
                    <Link
                      to="/check-in/city-health"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-600/25 ring-1 ring-blue-500/20 transition-all cursor-pointer active:scale-98"
                    >
                      <span>Try Live Patient Check-In Screen (/city-health) ➔</span>
                    </Link>
                  </div>
                </div>

                {/* Photorealistic Smartphone Mockup */}
                <div className="md:col-span-6 flex justify-center">
                  <div className="w-full max-w-[310px] bg-slate-950 p-3.5 rounded-[44px] shadow-2xl border-4 border-slate-800 text-white relative">
                    {/* Dynamic Island Notch */}
                    <div className="w-24 h-4 bg-black rounded-full mx-auto mb-3 flex items-center justify-center gap-1.5 px-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-[8px] font-mono font-bold text-slate-400">QUEUELER LIVE</span>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-4 space-y-3 border border-slate-800">
                      <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-800">
                        <span className="font-bold text-slate-300">City Health Hospital</span>
                        <span className="font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded text-[10px]">#QL-84920</span>
                      </div>

                      <div className="text-center py-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-700/80">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">OPD Token Pass</span>
                        <div className="text-5xl font-black font-mono text-white tracking-tight my-1">A-114</div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[11px] font-bold border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                          <span>1 Ahead • Est. 4 mins wait</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-[11px]">Doctor:</span>
                          <span className="font-bold text-white">Dr. Rohan Sharma</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-[11px]">Assigned Cabin:</span>
                          <span className="font-bold text-amber-300">Cabin 1 (General OPD)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-[11px]">Consultation Fee:</span>
                          <span className="font-bold text-emerald-400">₹500 PAID (UPI)</span>
                        </div>
                      </div>

                      <div className="p-2 bg-blue-950/60 rounded-xl border border-blue-500/30 text-[11px] text-blue-200 text-center font-medium">
                        ☕ You can relax in the cafeteria. Your phone will chime when called.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PILLAR 2: SMART TV WALL KIOSK */}
            {productTab === 'TV_KIOSK' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fade-in-up">
                <div className="md:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-full text-xs font-bold border border-amber-200 dark:border-amber-800">
                    <Tv className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Pillar 2 • Waiting Hall Audio-Visual</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Smart TV Lobby OLED Display & Voice Chimes
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    Turn any standard Android TV, FireStick, or PC monitor into an enterprise waiting hall kiosk board. Plays hospital chimes and speaks token announcements automatically.
                  </p>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Multi-cabin simultaneous calling (Cabin 1, Cabin 2, Cabin 3, Cabin 4)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>High-visibility font legible from 40 feet across crowded waiting halls</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Automated Web Speech synthesizer with English & Hindi voice announcement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Ultra-low latency WebSocket updates (&lt; 200ms instantaneous sync)</span>
                    </li>
                  </ul>
                  <div className="pt-3">
                    <Link
                      to="/display/city-health"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-98"
                    >
                      <span>Open Fullscreen TV Kiosk Display (/display/city-health) ➔</span>
                    </Link>
                  </div>
                </div>

                {/* Photorealistic 55" Smart TV Mockup */}
                <div className="md:col-span-6 bg-slate-950 p-5 sm:p-6 rounded-3xl border-8 border-slate-800 text-white shadow-2xl space-y-4">
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2 font-black">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>CITY HEALTH HOSPITAL • 55" OPD DISPLAY</span>
                    </div>
                    <span className="font-mono text-slate-400 text-[11px]">14:32:08 IST</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-center space-y-2 relative overflow-hidden">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-mono font-bold">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span>NOW SERVING • PLEASE PROCEED</span>
                    </div>
                    <div className="text-6xl sm:text-7xl font-black font-mono text-emerald-400 tracking-tight">
                      A-114
                    </div>
                    <div className="text-base sm:text-lg font-black text-white">
                      Cabin 1 — Dr. Rohan Sharma (General OPD)
                    </div>
                    <div className="text-xs text-amber-300 font-medium">
                      🔊 "टोकन नंबर A-114, कृपया केबिन नंबर 1 में पधारें"
                    </div>
                  </div>

                  {/* Multi-Cabin Split Ticker */}
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Cabin 2 (Pediatrics)</span>
                      <span className="font-mono font-bold text-white text-sm">Token B-203</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Cabin 3 (Orthopedics)</span>
                      <span className="font-mono font-bold text-white text-sm">Token C-087</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PILLAR 3: DOCTOR CABIN CONSOLE */}
            {productTab === 'DOCTOR_CABIN' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fade-in-up">
                <div className="md:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 rounded-full text-xs font-bold border border-purple-200 dark:border-purple-800">
                    <Stethoscope className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Pillar 3 • Physician Productivity</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    1-Tap Doctor Cabin Calling & Rx Presets
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    Doctors review patient chief complaints and symptoms before the patient steps through the door. 1-click calls next patient and generates clean digital prescriptions.
                  </p>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>PIN-protected doctor tablet & desktop interface with zero clutter</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>5 Built-in OPD Clinical Presets (Viral Fever, URTI, GERD, Hypertension, Diabetes)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Digital OPD Rx prescription printable & synced to patient portal</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Complete consultation history & 15-day follow-up tagging</span>
                    </li>
                  </ul>
                  <div className="pt-3">
                    <Link
                      to="/doctor/city-health"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-98"
                    >
                      <span>Open Doctor Cabin Console (/doctor/city-health) ➔</span>
                    </Link>
                  </div>
                </div>

                {/* Doctor Tablet Workstation Mockup */}
                <div className="md:col-span-6 bg-slate-900 p-5 sm:p-6 rounded-3xl border-4 border-slate-700 text-slate-100 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                    <div>
                      <strong className="text-white block">Dr. Rohan Sharma, MD</strong>
                      <span className="text-[11px] text-purple-300 font-mono">Cabin 1 • General Medicine</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      Active In Consultation
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-amber-400 text-sm">Token #A-114</span>
                      <span className="text-slate-400 text-[11px]">Ramesh Kumar (32M)</span>
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>Chief Complaints:</strong> High fever (102°F), shivering, acute dry cough (3 days).
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">1-Click Clinical Presets:</span>
                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      <span className="px-2.5 py-1 bg-purple-900/60 text-purple-200 border border-purple-500/40 rounded-lg font-bold">
                        ⚡ Viral Fever Rx
                      </span>
                      <span className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg">
                        ⚡ URTI & Cough
                      </span>
                      <span className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg">
                        ⚡ Acute GERD
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={playClinicChime}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Call Next Patient (Chime TV)</span>
                    </button>
                    <button
                      type="button"
                      className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700"
                    >
                      Print Rx
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PILLAR 4: RECEPTION CASHIER POS */}
            {productTab === 'RECEPTION_POS' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fade-in-up">
                <div className="md:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 rounded-full text-xs font-bold border border-teal-200 dark:border-teal-800">
                    <Printer className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Pillar 4 • Frontdesk Operations</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Reception Cashier Desk & 58/80mm Thermal POS
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    Receptionists enter token or phone numbers to collect cash, verify insurance, and issue 58mm/80mm official thermal slips for elderly patients without smartphones.
                  </p>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>1-Click cash approval admits patients directly into doctor line</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>USB and Bluetooth thermal POS printer support (58mm / 80mm)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Instant patient phone lookup & token re-print</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Multi-counter cashier cash audit & daily reconciliation</span>
                    </li>
                  </ul>
                  <div className="pt-3">
                    <Link
                      to="/reception/city-health"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-98"
                    >
                      <span>Open Reception Desk Kiosk (/reception/city-health) ➔</span>
                    </Link>
                  </div>
                </div>

                {/* Thermal Receipt Mockup */}
                <div className="md:col-span-6 bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 font-mono text-center flex justify-center">
                  <div className="max-w-xs w-full bg-white p-5 rounded-2xl border border-dashed border-slate-300 shadow-lg space-y-3 text-left text-xs">
                    <div className="text-center pb-2 border-b border-dashed border-slate-200">
                      <strong className="block text-slate-900 uppercase font-sans text-sm">City Health Hospital</strong>
                      <span className="text-[10px] text-slate-400">OFFICIAL OPD RECEIPT & TOKEN</span>
                    </div>
                    <div className="text-center py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-sans">TOKEN NUMBER</span>
                      <span className="text-4xl font-black text-slate-900 tracking-wider">A-114</span>
                    </div>
                    <div className="text-[11px] space-y-1.5 text-slate-600">
                      <div className="flex justify-between">
                        <span>Patient:</span>
                        <strong className="text-slate-900">Ramesh Kumar (32M)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Cabin:</span>
                        <strong className="text-slate-900">Cabin 1 (Dr. Rohan Sharma)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Fee Paid:</span>
                        <strong className="text-emerald-700">₹500 (CASH VERIFIED)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Follow-up:</span>
                        <strong className="text-blue-700">₹250 within 15 Days</strong>
                      </div>
                    </div>
                    <div className="text-center pt-2 border-t border-dashed border-slate-200 text-[10px] text-slate-400 font-sans">
                      Scan QR on mobile or digital pass to track turn from cafeteria
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PILLAR 5: EXECUTIVE ANALYTICS */}
            {productTab === 'EXECUTIVE_ANALYTICS' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fade-in-up">
                <div className="md:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 rounded-full text-xs font-bold border border-blue-200 dark:border-blue-800">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Pillar 5 • Hospital Management</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Director Boardroom Analytics & Revenue Telemetry
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    Medical superintendents monitor real-time corridor congestion, doctor consultation pacing, and walkout recovery across multiple clinic branches.
                  </p>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Average lobby wait time tracking across morning & evening OPD shifts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Real-time doctor consultation speed & turnaround audits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Patient CSAT & 5-star Google review prompt conversion</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Daily cash vs UPI automated reconciliation reports</span>
                    </li>
                  </ul>
                  <div className="pt-3">
                    <Link
                      to="/queueless-admin"
                      target="_blank"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-98"
                    >
                      <span>Open Master Director Admin (/queueless-admin) ➔</span>
                    </Link>
                  </div>
                </div>

                {/* KPI Metrics Dashboard Mockup */}
                <div className="md:col-span-6 grid grid-cols-2 gap-3 text-center">
                  <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">4.8 Mins</div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Avg OPD Wait Time</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">-78% vs Industry</span>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">+₹1,84,000</div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Monthly Walkouts Saved</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block mt-0.5">368 Recovered Patients</span>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">99.8%</div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Lobby Discipline Score</span>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block mt-0.5">Zero Congestion</span>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">2.4x</div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Follow-Up Rebooking</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block mt-0.5">15-Day Policy Engine</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Link to Full Clinical Features Architecture */}
          <div className="pt-8 text-center">
            <Link
              to="/features"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 font-black text-xs sm:text-sm rounded-2xl border border-blue-200/90 dark:border-blue-800/80 shadow-sm hover-card-premium transition-all active:scale-98 group"
            >
              <Sparkles className="w-4 h-4 text-amber-500 group-hover:rotate-12 transition-transform" />
              <span>Explore All 12 Clinical Modules on Features Page ➔</span>
            </Link>
          </div>
        </div>

      </section>

      {/* ============================================================== */}
      {/* 4.5 VERIFIED CLINICAL TESTIMONIALS & DIRECTOR ENDORSEMENTS     */}
      {/* ============================================================== */}
      <section id="case-studies" className="py-20 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 relative z-10 transition-colors duration-200">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Vertical Video Reels - SanatanStories Reel Benchmark */}
          <div className="space-y-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Live OPD Walkthrough Reels</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                Watch Queueless Come Alive
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                Real-world clinical workflows captured in active OPDs. Zero waiting hall crowding, instant phone QR passes, and silent 1-tap doctor calls.
              </p>
            </div>

            {/* 4 Vertical (9:16) Video Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {CLINICAL_REELS.map((reel) => {
                const isUnmuted = unmutedReelId === reel.id;
                return (
                  <div
                    key={reel.id}
                    className="relative aspect-[9/16] rounded-3xl sm:rounded-[32px] overflow-hidden bg-slate-950 shadow-xl group border border-slate-200/60 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Active Local Video */}
                    <video
                      ref={(el) => {
                        videoRefs.current[reel.id] = el;
                      }}
                      src={reel.videoSrc}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover scale-[1.02] transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Top Gradient Overlay & Badge */}
                    <div className="relative z-10 p-3 sm:p-4 bg-gradient-to-b from-black/80 via-black/35 to-transparent flex items-start justify-between">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md backdrop-blur-md ${reel.badgeColor}/85 border border-white/20`}
                      >
                        {reel.badge}
                      </span>
                    </div>

                    {/* Bottom Gradient Overlay, Subtitle & Audio Toggle */}
                    <div className="relative z-10 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-2">
                      <div className="pr-10">
                        <p className="text-white text-[11px] sm:text-xs font-semibold leading-snug drop-shadow bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10">
                          "{reel.subtitle}"
                        </p>
                        <div className="mt-2 text-[10px] text-white/90 font-bold drop-shadow flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
                          <span className="truncate">{reel.doctor}</span>
                        </div>
                        <span className="text-[9px] text-white/70 block truncate font-medium">
                          {reel.hospital}
                        </span>
                      </div>

                      {/* Interactive Mute / Unmute Circular Toggle (SanatanStories style) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMute(reel.id);
                        }}
                        className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center transition-all border border-white/25 shadow-lg active:scale-90"
                        title={isUnmuted ? 'Mute Audio' : 'Play Sound'}
                      >
                        {isUnmuted ? (
                          <Volume2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-white/80" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SanatanStories Style Bottom Caption Underneath Grid */}
            <div className="text-center pt-2 max-w-xl mx-auto">
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                Every counter has an instant vector QR pass. Patients scan it, receive live queue updates, and doctors call with one tap.
              </p>
            </div>
          </div>

          {/* Clean, Non-Bloated 3 Endorsement Cards */}
          <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800 space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Verified Director Endorsements • 4.9/5 Across 450+ Hospitals</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                What Hospital Superintendents Say
              </h3>
            </div>

            {/* Exactly 3 High-Trust, Authoritative Clinical Endorsement Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {VERIFIED_REVIEWS.slice(0, 3).map((review, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-7 rounded-3xl bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {review.badge}
                      </span>
                    </div>

                    <div className="inline-block px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-black tracking-wide border border-emerald-200 dark:border-emerald-800">
                      {review.highlight}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      "{review.text}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="w-11 h-11 rounded-full object-cover border-2 border-blue-500 shadow-sm shrink-0"
                    />
                    <div className="min-w-0">
                      <strong className="text-xs font-black text-slate-900 dark:text-white block truncate">
                        {review.author}
                      </strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate font-medium">
                        {review.role}
                      </span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block truncate">
                        {review.org}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>


      {/* ============================================================== */}
      {/* 5. PSYCHOLOGICAL ROI OPPORTUNITY TEASER                        */}
      {/* ============================================================== */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50/70 dark:bg-slate-950/70 border-b border-slate-200/80 dark:border-slate-800 relative z-10 transition-colors duration-200">
        <div className="max-w-5xl mx-auto">
          <div className="p-8 sm:p-12 rounded-[36px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden hover-card-premium">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none animate-glow-pulse"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/30">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>The Economics of Zero-Wait</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  Stop Losing Revenue to <br />
                  <span className="text-rose-400">Waiting Hall Fatigue Walkouts.</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  In crowded waiting halls, <strong>8.5% of walk-in patients leave</strong> before seeing a doctor due to queue exhaustion. Queueless eliminates 85% of that walkout attrition on Day 1 — delivering an average <strong>8.4x return on investment</strong>.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    to="/roi-calculator"
                    className="px-7 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-emerald-500/25 transition-all inline-flex items-center gap-2 active:scale-98 shimmer-sweep hover-card-premium cursor-pointer"
                  >
                    <Sliders className="w-4 h-4 fill-slate-950" />
                    <span>Open Interactive ROI Calculator ➔</span>
                  </Link>
                  <span className="text-xs text-slate-400 font-medium">3-minute payback benchmark</span>
                </div>
              </div>

              {/* Verified Clinical Stat Pillars */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-center">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover-card-premium">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">+₹1,84,000</div>
                  <span className="text-[11px] text-slate-300 font-medium block mt-0.5">Monthly Recovered Fees</span>
                  <span className="text-[10px] text-emerald-400/80 block mt-1">Average 6-Cabin Hospital</span>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover-card-premium">
                  <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">3.4 Days</div>
                  <span className="text-[11px] text-slate-300 font-medium block mt-0.5">Average Payback</span>
                  <span className="text-[10px] text-blue-400/80 block mt-1">30-Day Money-Back Guarantee</span>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover-card-premium">
                  <div className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">2.4x</div>
                  <span className="text-[11px] text-slate-300 font-medium block mt-0.5">15-Day Follow-Up Rate</span>
                  <span className="text-[10px] text-indigo-400/80 block mt-1">Automated Sync</span>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover-card-premium">
                  <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">-78%</div>
                  <span className="text-[11px] text-slate-300 font-medium block mt-0.5">Corridor Crowding</span>
                  <span className="text-[10px] text-amber-400/80 block mt-1">Calm Waiting Lounges</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>


      {/* ============================================================== */}
      {/* 6. TRANSPARENT PRICING INVITATION (FULL DETAILS AT /pricing)   */}
      {/* ============================================================== */}
      <section id="pricing" className="py-16 px-4 sm:px-6 relative z-10 bg-slate-50/60 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-5xl mx-auto">
          <div className="p-8 sm:p-10 rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-600/30 transition-all duration-700" />
            
            <div className="space-y-3 max-w-xl text-left relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[11px] font-black uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Transparent Enterprise Healthcare Plans</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Predictable, Zero-Surprise Plans for Every Hospital Scale
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                Starting from just {selectedCurrency.symbol}{selectedCurrency.rates.STARTER.monthly}/month. Includes official laser-etched QR hardware, zero IT setup capex, and a 30-day clinical satisfaction guarantee.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Solo & Polyclinic Tiers</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-Hospital Enterprise</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> ABDM & EMR Sync</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-3 shrink-0 w-full md:w-auto relative z-10">
              <Link
                to="/pricing"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore All Plans & Pricing ➔</span>
              </Link>
              <button
                type="button"
                onClick={() => setShowAuditModal(true)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl border border-white/15 transition-all text-center cursor-pointer"
              >
                Instant 60-Sec OPD Audit
              </button>
            </div>
          </div>
        </div>

      </section>


      {/* ============================================================== */}
      {/* 7. ZERO HARDWARE CAPEX — INSTANT CLOUD BACKEND & DIGITAL ASSETS */}
      {/* ============================================================== */}
      <section id="hardware-kit" className="py-20 px-4 sm:px-6 bg-slate-50/70 dark:bg-slate-950/70 border-t border-slate-200/80 dark:border-slate-800 relative z-10 transition-colors duration-200">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-full text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>100% Pure Digital Cloud Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Zero Hardware Capex • Deploy on Screens You Already Own
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-normal leading-relaxed">
              No expensive proprietary kiosks, no courier shipping delays, and zero hardware maintenance AMC fees. Queueless turns the screens, TVs, and tablets you already have into a synchronized clinical OS.
            </p>
          </div>

          <div className="p-7 sm:p-10 rounded-[36px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-colors duration-200">
            {/* Left 7 Cols: Description & Digital Cloud Props */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                  Instant Digital Delivery • Zero Waiting
                </span>
                <h3 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Instant Vector QR Kit & Cloud Backend Setup
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed font-normal">
                  Download high-resolution print-ready 300 DPI PDF and vector SVG QR badges immediately upon checkout. Print them on standard A4, acrylic counter stands, or laminated desk cards. Patients scan with standard smartphone cameras — zero app download required.
                </p>
              </div>

              {/* 4 Core Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-700 dark:text-slate-300 pt-1">
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all flex items-start gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-100/80 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                    <Printer className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block font-bold text-xs sm:text-sm">Vector PDF & SVG Kits</strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block leading-relaxed">
                      300 DPI vector badges with custom hospital logo, ready to print instantly.
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-500 transition-all flex items-start gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                    <Tv className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block font-bold text-xs sm:text-sm">Any Smart TV Kiosk</strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block leading-relaxed">
                      Opens in Samsung, LG, Sony, Android TV, or Chromecast with 1 URL.
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-md hover:border-purple-400 dark:hover:border-purple-500 transition-all flex items-start gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-purple-100/80 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200/80 dark:border-purple-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                    <Stethoscope className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block font-bold text-xs sm:text-sm">Doctor Web Consoles</strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block leading-relaxed">
                      1-Tap Call Next & 15-day follow-up on any iPad, laptop, or PC.
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500 transition-all flex items-start gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-amber-100/80 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                    <Zap className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block font-bold text-xs sm:text-sm">Instant 3-Min Activation</strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block leading-relaxed">
                      Live instantly. No physical hardware delivery, zero IT server setup.
                    </span>
                  </div>
                </div>
              </div>

              {/* Security & Zero Capex Highlights */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Zero Courier Shipping Delay
                </span>
                <span className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full border border-blue-200/60 dark:border-blue-800/60">
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                  Instant Cloud Provisioning
                </span>
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                  <Check className="w-3.5 h-3.5 text-slate-500" />
                  NABH & ABDM Level 3 Ready
                </span>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(true)}
                  className="px-6 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Activate Instant Cloud OS Today ({selectedCurrency.symbol}{currentPlanMonthlyRate}/mo) ➔</span>
                </button>
              </div>
            </div>

            {/* Right 5 Cols: Multi-Screen Cloud Ecosystem (Adaptive, Elegant, Zero Clashing Blocks) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[340px] bg-slate-50 dark:bg-slate-950 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xl text-slate-900 dark:text-white space-y-3.5 relative overflow-hidden transition-colors">
                {/* Ambient Screen Glow */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-indigo-500"></div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Cloud Architecture Preview
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30 px-2 py-0.5 rounded-full">
                    0.2s Live Sync
                  </span>
                </div>

                {/* Layer 1: TV Lobby Display Snippet */}
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Tv className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-bold block truncate">55" TV Lobby Kiosk</span>
                      <strong className="text-[11px] text-slate-900 dark:text-white font-mono truncate">Calling Token A-116 ➔ Cabin 204</strong>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/30 shrink-0">
                    Room Entry
                  </span>
                </div>

                {/* Layer 2: Real Luxury Clinical Counter Standee (Clean, Crisp, High-Contrast) */}
                <div className="rounded-2xl p-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-center border-2 border-blue-500/30 dark:border-blue-500/40 shadow-md relative">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 dark:text-white truncate">
                        City Health Multi-Specialty
                      </span>
                    </div>
                    <span className="text-[8px] font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-full shrink-0 border border-blue-200/60 dark:border-blue-800">
                      Print Badge
                    </span>
                  </div>

                  {/* Scannable Real QR Canvas */}
                  <div className="my-2.5 p-3 bg-white rounded-2xl border border-slate-200/90 shadow-sm inline-block">
                    <QRCodeCanvas
                      value={`${typeof window !== 'undefined' ? window.location.origin : 'https://queueless-os.vercel.app'}/check-in/city-health`}
                      size={124}
                      level="H"
                      includeMargin={false}
                    />
                    <div className="mt-2 text-[9px] font-mono font-bold text-slate-600 flex items-center justify-center gap-1">
                      <Smartphone className="w-3 h-3 text-blue-600" />
                      <span>Point Phone Camera</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>⚡ 20-Sec Live Web Pass</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Zero App Needed</span>
                  </div>
                </div>

                {/* Layer 3: Doctor Cabin Tablet Snippet */}
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-bold block truncate">Doctor Console (Tablet / PC)</span>
                      <span className="text-[10px] text-slate-800 dark:text-slate-200 font-bold truncate">Dr. Rohan Sharma • 1-Tap Call</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-500/30 shrink-0">
                    15d Sync
                  </span>
                </div>

                <div className="pt-0.5 text-center">
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Runs on screens & devices you already own.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>


      {/* ============================================================== */}
      {/* 8. FAQS & ENTERPRISE INQUIRY (ACCORDION STYLE)                */}
      {/* ============================================================== */}
      <section id="faqs" className="py-20 px-4 sm:px-6 relative z-10 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
              Everything you need to know about purchasing and launching Queueless OS worldwide.
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
              {[
                { id: 'ALL', label: 'All FAQs' },
                { id: 'DIRECTORS', label: '🏥 For Hospital Directors' },
                { id: 'DOCTORS', label: '👨‍⚕️ For Consulting Doctors' },
                { id: 'RECEPTION', label: '🧾 For Reception & Staff' },
                { id: 'COMPLIANCE', label: '🛡️ ABDM & HIPAA Security' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFaqCategory(cat.id as FaqCategory)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    faqCategory === cat.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-black ring-2 ring-blue-500/20'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {FAQS.filter((faq) => faqCategory === 'ALL' || faq.category === faqCategory).map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isExpanded
                      ? 'bg-blue-50/50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 shadow-sm'
                      : 'bg-slate-50/70 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800 inline-block">
                        {faq.categoryLabel}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                        <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>{faq.q}</span>
                      </h4>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                      }`}
                    />
                  </div>
                  {isExpanded && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 pl-6.5 pt-3 leading-relaxed font-normal animate-fade-in-up text-left">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Book 1-on-1 Demo Lead Box */}
          <div className="p-7 sm:p-9 rounded-[32px] bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white shadow-xl space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-white">Need an Enterprise Multi-Floor Quote or On-Site Demo?</h3>
              <p className="text-xs text-slate-300 font-normal">
                Our global HealthTech deployment engineers will walk your medical executive team through a live 1-on-1 walkthrough.
              </p>
            </div>

            {leadSubmitted ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-black text-emerald-200">Demo Request Confirmed!</h4>
                <p className="text-xs text-slate-300">
                  Our hospital onboarding team will reach out to you within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name / Doctor Name"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <input
                  type="text"
                  required
                  placeholder="Hospital / Medical Facility Name"
                  value={leadHospital}
                  onChange={(e) => setLeadHospital(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <input
                  type="tel"
                  required
                  placeholder="Direct Phone / WhatsApp"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <div className="sm:col-span-3 flex justify-center pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-600/30 ring-1 ring-blue-500/20 transition-all cursor-pointer active:scale-98"
                  >
                    Schedule 1-on-1 Executive Walkthrough ➔
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </section>


      {/* ============================================================== */}
      {/* 8.5. GOOGLE-STYLE SITELINKS & DIRECTORY CARDS                  */}
      {/* ============================================================== */}
      <section className="py-16 px-4 sm:px-6 bg-slate-50/70 dark:bg-slate-950/70 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-bold uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Verified Direct Sitelinks</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Queueless OS Directory & Quick Navigation
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Direct access to core hospital modules, calculators, and clinical systems.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Google Indexed • Schema.org Verified</span>
            </div>
          </div>

          {/* 6 Google-Style Sitelinks Cards in a Clean 2-Column or 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Card 1: Clinical Security & Standards */}
            <Link
              to="/security"
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-blue-500/50 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 flex items-center gap-1">
                    <span>Clinical Security & ABDM Standards</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Ayushman Bharat Digital Mission (M1/M2) certified, HIPAA privacy, bank-grade AES-256 data sovereignty and DPDP compliance.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-3 block">
                /security
              </span>
            </Link>

            {/* Card 2: Live Simulator */}
            <a
              href="#interactive-demo"
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-blue-500/50 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 flex items-center gap-1">
                    <span>Interactive Live OPD Simulator</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Test the live end-to-end patient check-in, 1-tap doctor calling, and 55" smart TV synchronization in real time.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-3 block">
                #interactive-demo
              </span>
            </a>

            {/* Card 3: ROI Calculator */}
            <Link
              to="/roi-calculator"
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-blue-500/50 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 flex items-center gap-1">
                    <span>Hospital ROI & Capex Calculator</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Calculate monthly OPD revenue recovery and hardware maintenance savings by replacing ₹2.5L+ metal kiosk machines.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-3 block">
                /roi-calculator
              </span>
            </Link>

            {/* Card 4: Pricing */}
            <Link
              to="/pricing"
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-blue-500/50 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 flex items-center gap-1">
                    <span>Queueless OS Pricing & Plans</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Transparent clinical tier plans starting at ₹2,999/mo ($58/mo). ABDM Level 3 certified with zero hidden fees.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-3 block">
                /pricing
              </span>
            </Link>

            {/* Card 5: Smart TV Kiosk */}
            <Link
              to="/display/city-health"
              target="_blank"
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-blue-500/50 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 flex items-center gap-1">
                    <span>55" TV Waiting Room Kiosk</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Zero-scroll 1080p lobby OLED display with multilingual acoustic voice announcements in 5 worldwide languages.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-3 block">
                /display/city-health
              </span>
            </Link>

            {/* Card 6: Features */}
            <Link
              to="/features"
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-blue-500/50 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 flex items-center gap-1">
                    <span>Enterprise Features & ABDM Suite</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Explore Ayushman Bharat Digital Mission (M1/M2) certified interoperability, HIPAA privacy, and doctor hotkeys.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-3 block">
                /features
              </span>
            </Link>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. CORPORATE FOOTER (CLEAN LIGHT THEME)                        */}
      {/* ============================================================== */}
      <CommercialFooter />


      {/* ============================================================== */}
      {/* MODAL 2: EXECUTIVE 1-ON-1 HOSPITAL DEMO BOOKING MODAL           */}
      {/* ============================================================== */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-[32px] p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => {
                setShowDemoModal(false);
                setDemoConfirmed(false);
              }}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {demoConfirmed ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Executive Demo Confirmed!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto font-medium">
                  Thank you <strong>{demoName}</strong>. Our Healthcare Implementation Specialist has booked your 1-on-1 walkthrough for <strong>{demoHospital}</strong>. A calendar invite has been sent to <strong>{demoEmail || demoPhone}</strong>.
                </p>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
                  Assigned Solutions Lead: Dr. Sameer Sen (Healthtech Solutions Architect)
                </div>
                <button
                  onClick={() => {
                    setShowDemoModal(false);
                    setDemoConfirmed(false);
                  }}
                  className="px-6 py-2.5 bg-slate-900 dark:bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-slate-800 dark:hover:bg-blue-500 transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDemoConfirmed(true);
                  playClinicChime();
                }}
                className="space-y-4"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
                    <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>Hospital Leadership Walkthrough</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Schedule a 1-on-1 Executive Demo
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    See Queueless live on your hospital screens. Tailored for Medical Superintendents & Directors.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hospital / Clinic Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CareMax Multispecialty Hospital"
                      value={demoHospital}
                      onChange={(e) => setDemoHospital(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name & Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. A. K. Singhania (MS)"
                        value={demoName}
                        onChange={(e) => setDemoName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">OPD Doctor Cabins</label>
                      <select
                        value={demoCabins}
                        onChange={(e) => setDemoCabins(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      >
                        <option value="1-5 Doctors">1 to 5 Doctors</option>
                        <option value="6-15 Doctors">6 to 15 Doctors</option>
                        <option value="16-50 Doctors">16 to 50 Doctors (Hospital)</option>
                        <option value="50+ Doctors">50+ Doctors (Multi-Branch Network)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Work Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="director@hospital.com"
                        value={demoEmail}
                        onChange={(e) => setDemoEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Direct Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={demoPhone}
                        onChange={(e) => setDemoPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  🔒 Includes custom cloud architecture consultation, custom vector branding kit, and zero-downtime EMR migration plan.
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Confirm 1-on-1 Walkthrough Call ➔
                </button>
              </form>
            )}
          </div>
        </div>

      )}

      {/* ============================================================== */}
      {/* MODAL 3: EXECUTIVE BOARDROOM PROCUREMENT ONE-PAGER (PDF BRIEF)  */}
      {/* ============================================================== */}
      {showPitchDeckModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-[32px] p-6 sm:p-8 max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPitchDeckModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img src="/queueless-logo.svg" alt="Queueless" className="w-10 h-10 rounded-full object-cover border border-sky-400/30 dark:border-sky-500/30" />
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Queueless Hospital OS</h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Boardroom Procurement & Clinical Brief (v2.4)</span>
                  </div>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Print One-Pager</span>
                </button>
              </div>

              {/* One-Pager Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-xl font-black text-amber-600 block">20 Sec</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">QR Admission</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-xl font-black text-emerald-600 block">-73%</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Corridor Crowding</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-xl font-black text-sky-600 block">2.4x</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Follow-Up Rebooking</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-xl font-black text-purple-600 block">99.99%</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">SLA Cloud Uptime</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">Executive Summary</h4>
                <p className="leading-relaxed">
                  Queueless is a zero-capex hospital queue operating system that replaces broken mechanical thermal ticket dispensers ($3,500/unit) with instant patient QR passes and smart TV calling chimes.
                </p>

                <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px] pt-2">Clinical Regulatory & Data Security Compliance</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>HIPAA & HITECH:</strong> 256-bit AES encryption at rest & transit</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>ABDM Sandbox:</strong> Level 3 M2/M3 Ayushman Bharat sync</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>NABIDH & DHA:</strong> Middle East clinical edge deployment</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>GDPR Compliant:</strong> Zero cookies, patient phone masking</span>
                  </div>
                </div>

                <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px] pt-2">Hardware Inclusions</h4>
                <p className="leading-relaxed text-[11px]">
                  • <strong>Instant Vector QR Kit:</strong> Print-ready high-res PDF and vector QR badges with hospital branding for entry points & desk cards.<br />
                  • <strong>Smart TV Kiosk App:</strong> Zero-install browser or Android APK for waiting hall OLED screens.<br />
                  • <strong>Thermal POS Support:</strong> Integrated 58mm/80mm ESC/POS printer driver for counter cash slips.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Published by Queueless Healthcare Systems Inc.</span>
                <button
                  onClick={() => {
                    setShowPitchDeckModal(false);
                    setShowDemoModal(true);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white font-black text-xs rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Schedule Procurement Review Call ➔
                </button>
              </div>
            </div>
          </div>
        </div>

      )}



      {/* ============================================================== */}
      {/* 10. MODAL: SELF-SERVE BUY CHECKOUT & INSTANT PROVISIONING      */}
      {/* ============================================================== */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-[32px] max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative my-8">
            <button
              onClick={() => {
                setShowCheckoutModal(false);
                setSubscribedResult(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {subscribedResult ? (
              /* Success Provisioned Screen */
              <div className="text-center space-y-4 py-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                    Instant Automated Deployment Success
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">
                    {subscribedResult.clinic.name} is Now Live!
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Your hospital OPD has been provisioned on Queueless Zero-Wait OS with invoice{' '}
                    <strong className="text-amber-600 font-mono">{subscribedResult.invoiceId}</strong>.
                  </p>
                </div>

                {/* Provisioned URLs Card */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 text-[11px] font-mono text-slate-500">
                    <span>Selected Plan:</span>
                    <span className="text-amber-700 font-bold">
                      {selectedPlanTemplate.name} ({selectedCurrency.code})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Patient Self-Check-in URL:</span>
                    <a
                      href={`http://${window.location.host}/check-in/${subscribedResult.clinic.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-600 font-mono font-bold hover:underline break-all"
                    >
                      {`http://${window.location.host}/check-in/${subscribedResult.clinic.slug}`}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Hospital Admin Credentials:</span>
                    <div className="text-slate-800 font-mono text-[11px]">
                      Username: <strong>admin</strong> • Password: <strong>{adminPassword || 'admin123'}</strong>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to={`/check-in/${subscribedResult.clinic.slug}`}
                    target="_blank"
                    className="w-full sm:w-auto px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Patient QR Check-in</span>
                  </Link>

                  <Link
                    to="/admin"
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Open Hospital Admin Dashboard ➔</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* Checkout Input Form */
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                    <Zap className="w-5 h-5 fill-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Subscribe & Deploy Queueless OS</h3>
                    <p className="text-xs text-slate-500">
                      Step 1 of 1 • Instant automated hospital setup ({selectedCurrency.flag} {selectedCurrency.region})
                    </p>
                  </div>
                </div>

                {/* Plan Summary Pill */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Selected Plan:</span>
                    <div className="text-slate-900 font-black">{selectedPlanTemplate.name}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-600 font-black text-sm">
                      {selectedCurrency.symbol}{totalDueToday.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      {billingCycle === 'ANNUAL' ? 'Billed Annually' : 'Billed Monthly'}
                    </span>
                  </div>
                </div>

                {checkoutError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">
                    ⚠️ {checkoutError}
                  </div>
                )}

                <form onSubmit={handleInitiateQuickSubscribe} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Hospital / Clinic Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apollo Super OPD"
                        value={hospitalName}
                        onChange={(e) => {
                          setHospitalName(e.target.value);
                          if (!slug) {
                            setSlug(
                              e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/--+/g, '-')
                            );
                          }
                        }}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Unique URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. apollo-super-opd"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-amber-700 dark:text-amber-400 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">City / Country</label>
                      <input
                        type="text"
                        placeholder="e.g. London, UK or Bengaluru, India"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hospital Contact Phone *</label>
                      <div className="flex gap-1.5">
                        <select
                          value={dialCode}
                          onChange={(e) => setDialCode(e.target.value)}
                          className="px-2 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shrink-0"
                        >
                          {COUNTRY_DIAL_CODES.map((c, i) => (
                            <option key={i} value={c.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          required
                          placeholder="98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="flex-1 min-w-0 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Campus / Building Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Suite 402, Medical City Boulevard"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Admin Email</label>
                      <input
                        type="email"
                        placeholder="admin@hospital.com"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Set Hospital Admin Password</label>
                      <input
                        type="password"
                        placeholder="admin123"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-slate-900"
                      />
                    </div>
                  </div>

                  {/* Doctor Setup Box */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Initial Consulting Doctor
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Dr. Specialist, MD"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Specialty (e.g. Physician)"
                        value={doctorSpecialty}
                        onChange={(e) => setDoctorSpecialty(e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Cabin (e.g. Cabin 1)"
                        value={doctorRoom}
                        onChange={(e) => setDoctorRoom(e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Digital Setup & Cloud Backend Confirmation Badge */}
                  <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>100% Digital Cloud Setup & Print-Ready QR Portal (Instant ₹0 / $0 Free Setup)</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 text-[11px] uppercase tracking-wider">Included</span>
                  </div>

                  {/* Payment Simulator Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedCurrency.code === 'INR' ? (
                        (['UPI', 'CARD', 'NETBANKING'] as const).map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method)}
                            className={`py-2 px-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold border transition-all text-center truncate ${
                              paymentMethod === method
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-black ring-2 ring-blue-500/20'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            {method === 'UPI' ? '⚡ UPI QR' : method === 'CARD' ? '💳 RuPay/Card' : '🏦 NetBanking'}
                          </button>
                        ))
                      ) : (
                        (['CARD', 'APPLE_PAY', 'WIRE'] as const).map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method as any)}
                            className={`py-2 px-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold border transition-all text-center truncate ${
                              paymentMethod === method
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-black ring-2 ring-blue-500/20'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            {method === 'CARD' ? '💳 Stripe Card' : method === 'APPLE_PAY' ? '🍏 Apple / GPay' : '🅿️ PayPal / Wire'}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={subscribing}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 active:scale-98"
                    >
                      {subscribing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Provisioning Hospital OS...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-white" />
                          <span>
                            Pay {selectedCurrency.symbol}{totalDueToday.toLocaleString()} & Activate Queueless OS ➔
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Quick Interactive Payment Simulator Modal */}
            {showQuickSimulationPrompt && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 text-slate-900 dark:text-slate-100">
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 shadow-sm">
                      <CreditCard className="w-7 h-7" />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-black uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                      Payment Gateway Simulator
                    </div>
                    <h3 className="text-xl font-black text-slate-950 dark:text-white">
                      Did the Payment Succeed?
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Hospital: <strong className="text-slate-900 dark:text-white">{hospitalName}</strong> • Total Due: <strong className="text-blue-600 dark:text-blue-400 font-mono">{selectedCurrency.symbol}{totalDueToday.toLocaleString()} {selectedCurrency.code}</strong>
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 text-center font-medium">
                    Simulate your payment gateway response:
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {/* NO Option */}
                    <button
                      type="button"
                      onClick={handleDeclineQuickSubscribe}
                      className="p-4 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-800 dark:text-rose-200 font-bold text-xs flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shadow-sm"
                    >
                      <div className="w-9 h-9 rounded-full bg-rose-200 dark:bg-rose-900 flex items-center justify-center text-rose-700 dark:text-rose-300">
                        <X className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <span className="font-black text-sm">No</span>
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 font-normal">Failed / Cancelled</span>
                    </button>

                    {/* YES Option */}
                    <button
                      type="button"
                      onClick={handleApproveQuickSubscribe}
                      className="p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-500/20"
                    >
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                      <span className="font-black text-sm">Yes</span>
                      <span className="text-[10px] text-emerald-100 font-normal">Payment Approved</span>
                    </button>
                  </div>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setShowQuickSimulationPrompt(false)}
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium cursor-pointer"
                    >
                      Cancel & Return to Form
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      )}
      {/* ============================================================== */}
      {/* 9. HOSPITAL CLIENT PORTALS & DEDICATED SETUP ARCHITECTURE MODAL */}
      {/* ============================================================== */}
      {showClientPortalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowClientPortalModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/70 border border-sky-100 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">Hospital Client Setup & Portals</h3>
                  <span className="text-[10px] font-bold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 px-2 py-0.5 rounded-full">
                    Isolated Tenants
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Commercial SaaS site is on <span className="font-mono text-sky-700 dark:text-sky-400 font-bold">/</span>. Each hospital operates via its dedicated link package.
                </p>
              </div>
            </div>

            {/* Architecture Explanation Banner */}
            <div className="mt-4 p-3.5 bg-gradient-to-r from-amber-50/70 via-sky-50/70 to-emerald-50/70 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/80 rounded-2xl border border-amber-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
              <div className="font-black text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>How Queueless Dedicated Link Setup Works:</span>
              </div>
              <p className="leading-relaxed text-[11px] text-slate-600 dark:text-slate-400">
                When a hospital subscribes, our system provisions <strong>5 isolated endpoint links</strong> branded with their unique slug. Patients scan the entrance QR, doctors manage cabins, and receptionists handle billing without any cross-hospital data leakage.
              </p>
            </div>

            {/* Section 1: Demonstration Hospital Suite */}
            <div className="mt-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  1. Live Demo Hospital: City Health Clinic (/city-health)
                </span>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Active OPD
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {/* 1. Patient Check-In */}
                <Link
                  to="/check-in/city-health"
                  target="_blank"
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-500 rounded-2xl transition-all group flex items-start gap-3"
                >
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-2xs text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform shrink-0 border border-slate-100 dark:border-slate-800">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400 flex items-center justify-between">
                      <span>📱 Patient QR Check-In</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate font-mono mt-0.5">/check-in/city-health</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">Self-entry QR pass & live token pass</span>
                  </div>
                </Link>

                {/* 2. TV Kiosk Display */}
                <Link
                  to="/display/city-health"
                  target="_blank"
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500 rounded-2xl transition-all group flex items-start gap-3"
                >
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-2xs text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform shrink-0 border border-slate-100 dark:border-slate-800">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 flex items-center justify-between">
                      <span>🖥️ Waiting Room TV Kiosk</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate font-mono mt-0.5">/display/city-health</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">55" lobby TV with voice & chimes</span>
                  </div>
                </Link>

                {/* 3. Reception POS */}
                <Link
                  to="/reception/city-health"
                  target="_blank"
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-500 rounded-2xl transition-all group flex items-start gap-3"
                >
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-2xs text-teal-600 dark:text-teal-400 group-hover:scale-105 transition-transform shrink-0 border border-slate-100 dark:border-slate-800">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 flex items-center justify-between">
                      <span>🧾 Reception Desk & POS</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate font-mono mt-0.5">/reception/city-health</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">Cash approvals & thermal slip printing</span>
                  </div>
                </Link>

                {/* 4. Doctor OPD Cabin */}
                <Link
                  to="/doctor/city-health"
                  target="_blank"
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500 rounded-2xl transition-all group flex items-start gap-3"
                >
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-2xs text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform shrink-0 border border-slate-100 dark:border-slate-800">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 flex items-center justify-between">
                      <span>👨‍⚕️ Doctor Cabin Console</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate font-mono mt-0.5">/doctor/city-health</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">1-click call next & Rx prescriptions</span>
                  </div>
                </Link>

                {/* 5. Hospital Admin */}
                <Link
                  to="/admin/city-health"
                  target="_blank"
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 rounded-2xl transition-all group flex items-start gap-3 sm:col-span-2"
                >
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-2xs text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform shrink-0 border border-slate-100 dark:border-slate-800">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 flex items-center justify-between">
                      <span>🏥 Hospital Management & Admin Panel</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate font-mono mt-0.5">/admin/city-health</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">Medical Superintendent settings, doctors roster & daily audits</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Section 2: Jump by Custom Hospital Slug */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
                2. Access Onboarded Hospital by Slug
              </span>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">/</span>
                  <input
                    type="text"
                    placeholder="e.g. caremax-multispecialty"
                    value={customPortalSlug}
                    onChange={(e) => setCustomPortalSlug(e.target.value.toLowerCase().trim())}
                    className="w-full pl-6 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link
                    to={`/check-in/${customPortalSlug || 'city-health'}`}
                    target="_blank"
                    className="flex-1 sm:flex-initial px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all text-center whitespace-nowrap cursor-pointer shadow-xs"
                  >
                    Patient Entry ➔
                  </Link>
                  <Link
                    to={`/admin/${customPortalSlug || 'city-health'}`}
                    target="_blank"
                    className="flex-1 sm:flex-initial px-3 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all text-center whitespace-nowrap cursor-pointer shadow-xs border border-transparent dark:border-slate-700"
                  >
                    Admin Desk ➔
                  </Link>
                </div>
              </div>
            </div>

            {/* Section 3: Queueless Master Platform Headquarters */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 dark:bg-slate-950 text-white p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-blue-500/20 text-blue-400 rounded-xl">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-black">Queueless Founder & Master Admin HQ</h4>
                  <p className="text-[11px] text-slate-400">Onboard hospitals, manage subscriptions, and issue setup packages</p>
                </div>
              </div>
              <Link
                to="/queueless-admin"
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-sm transition-all text-center whitespace-nowrap cursor-pointer active:scale-98"
              >
                Launch Master Admin ➔
              </Link>
            </div>
          </div>
        </div>

      )}

      {/* ============================================================== */}
      {/* MODAL 4: FREE 60-SECOND OPD CONGESTION & REVENUE AUDIT         */}
      {/* ============================================================== */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowAuditModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-200/50 dark:border-blue-800/50">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Instant Clinical Telemetry Assessment</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Clinical 60-Second OPD Congestion Audit
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                  Calculate your hospital's specific walkout revenue leak and see your recommended zero-wait hardware configuration.
                </p>
              </div>

              {/* Input Sliders */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hospital / Clinic Name</label>
                  <input
                    type="text"
                    placeholder="e.g. CareMax Multispecialty Hospital"
                    value={auditHospital}
                    onChange={(e) => setAuditHospital(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Daily OPD Patients</label>
                    <input
                      type="number"
                      min="10"
                      max="1000"
                      value={auditDailyPatients}
                      onChange={(e) => setAuditDailyPatients(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Avg Fee ({selectedCurrency.symbol})</label>
                    <input
                      type="number"
                      min="50"
                      max="10000"
                      value={auditFee}
                      onChange={(e) => setAuditFee(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Doctor Cabins</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={auditDoctors}
                      onChange={(e) => setAuditDoctors(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Diagnostic Audit Results Card */}
              {(() => {
                const monthlyPatientsAudit = auditDailyPatients * 26;
                const leakedWalkoutsMonthly = Math.round(monthlyPatientsAudit * 0.12);
                const lostRevenueMonthly = leakedWalkoutsMonthly * auditFee;
                const recStandees = Math.max(1, Math.ceil(auditDoctors / 4));
                const recDisplays = Math.max(1, Math.ceil(auditDoctors / 3));

                return (
                  <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 rounded-2xl text-white space-y-4 border border-slate-800 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase truncate max-w-[240px]">
                        Audit Diagnostic: {auditHospital || 'Your Facility'}
                      </span>
                      <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30 shrink-0">
                        High Congestion Risk
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-rose-300 block">Est. Revenue Leak</span>
                        <strong className="text-xl sm:text-2xl font-black text-rose-400 font-mono">
                          -{selectedCurrency.symbol}{lostRevenueMonthly.toLocaleString()}/mo
                        </strong>
                        <span className="text-[9px] text-slate-400 block mt-0.5">~{leakedWalkoutsMonthly} walkouts/mo</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-emerald-300 block">Payback Period</span>
                        <strong className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                          3.4 Days
                        </strong>
                        <span className="text-[9px] text-slate-400 block mt-0.5">Instant ROI Guarantee</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs space-y-1 text-left">
                      <span className="text-[10px] font-bold text-blue-300 uppercase block">Recommended Queueless Deployment:</span>
                      <div className="text-slate-300 text-[11px] leading-relaxed">
                        • <strong>{recStandees}x Vector QR Check-In Station Kits (Instant Cloud Print)</strong> at Entrance & Triage<br />
                        • <strong>{recDisplays}x 55" Smart TV OLED Kiosk</strong> in Waiting Hall & Cafeteria<br />
                        • <strong>{auditDoctors}x Doctor Cabin Consoles</strong> with 1-Click Call & Rx Presets
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowAuditModal(false);
                        setHospitalName(auditHospital || 'My Hospital');
                        handleOpenBuyModal(PLAN_TEMPLATES[1]);
                      }}
                      className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>Deploy Recommended Setup with 30-Day Guarantee ➔</span>
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

      )}



    </div>
  );
};
