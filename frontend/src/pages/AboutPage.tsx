import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Users,
  Stethoscope,
  Tv,
  QrCode,
  ArrowRight,
  Sparkles,
  HeartPulse,
  TrendingDown,
  Award,
  Globe,
  Lock,
  Clock,
  CheckCircle2,
  Zap,
  Mail,
  FlaskConical,
  Activity,
  Layers,
  Cpu,
  Smartphone,
  ChevronDown,
  HelpCircle,
  FileCheck2,
  Flame,
  Check,
  X as CloseIcon,
  PhoneCall,
  Calendar,
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';
import { SeoHead } from '../components/SeoHead';
import { WORLDWIDE_CURRENCIES, CurrencyConfig } from '../data/commercialData';

export const AboutPage: React.FC = () => {
  const [currencyCode, setCurrencyCode] = useState<string>(() => {
    return localStorage.getItem('queueless_currency') || 'USD';
  });

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleCurrencyChange = (newCode: string) => {
    setCurrencyCode(newCode);
    localStorage.setItem('queueless_currency', newCode);
  };

  const selectedCurrency: CurrencyConfig =
    WORLDWIDE_CURRENCIES[currencyCode] || WORLDWIDE_CURRENCIES.USD;

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'Can Queueless integrate with our existing Hospital Information System (HIS / HMIS)?',
      a: 'Yes, absolutely. Queueless is built with an open HL7 FHIR REST API and bidirectional webhooks. It works seamlessly as an autonomous front-end queue layer on top of legacy HMIS systems (such as KareXpert, Practo Ray, Medstar, or custom Oracle/PostgreSQL hospital databases) without requiring costly database migrations.',
    },
    {
      q: 'How do elderly or non-smartphone patients receive and track their token?',
      a: 'Queueless is designed with complete clinical inclusivity. If a patient does not carry a smartphone or cannot scan a QR code, the reception desk receptionist generates an instant counter token in 2 seconds. The patient’s number and cabin assignment are audibly announced through the Lobby TV Kiosk speaker in regional languages (Hindi, English, Bengali, Tamil, etc.), accompanied by large high-contrast visual numbers on the TV screen.',
    },
    {
      q: 'What hardware do we need to purchase to go live across all OPD counters?',
      a: 'Zero hardware capex. You do not need to purchase ₹2.5 Lakh proprietary metal kiosks, thermal paper dispensers, or specialized touchscreens. Queueless runs entirely in the cloud: reception staff use their existing PC/laptop browsers, doctors use their cabin computers or iPads, and waiting room kiosks run on any existing Smart TV, Google TV, or Fire TV stick via a lightweight web URL.',
    },
    {
      q: 'Is patient health and personal data compliant with the Digital Personal Data Protection (DPDP) Act 2023 & HIPAA?',
      a: 'Yes. Queueless enforces strict AES-256 end-to-end encryption for all patient identifiers at rest and TLS 1.3 in transit. Patient phone numbers are cryptographically masked in public display streams, and consultation records strictly respect ABDM consent manager protocols. We never sell, monetize, or train external models on clinical health records.',
    },
    {
      q: 'How does the automated 15-Day Free OPD Follow-up Engine work?',
      a: 'When a patient returns within the hospital’s mandated follow-up window (e.g., 7, 10, or 15 days), the Queueless check-in engine automatically matches the patient’s verified reference ID. It verifies that their prior consultation occurred with the same doctor, marks the consultation fee as ₹0 (Free Follow-Up), logs the entry for NABH audit compliance, and issues an instant queue token without billing counter delays.',
    },
    {
      q: 'What happens if the hospital’s internet connection experiences temporary downtime?',
      a: 'Queueless operates with a robust Progressive Web Architecture (PWA) equipped with local browser caching and service worker session queues. In the event of brief connectivity interruptions, token numbers already allocated continue to be serviced locally on doctor consoles, and queue states automatically reconcile the microsecond cloud connectivity is re-established.',
    },
    {
      q: 'How long does deployment take for a multi-specialty hospital with 20+ doctors?',
      a: 'A standard 200-bed hospital or multi-department polyclinic can be fully configured and live within 90 minutes. Our team generates high-resolution branded QR check-in badges for your entrance lobby, maps doctor consultation cabins, configures waiting room TV displays, and conducts a 15-minute hands-on walkthrough for receptionists and nursing staff.',
    },
    {
      q: 'Can we customize the TV display with hospital health awareness reels and doctor profiles?',
      a: 'Yes! The Queueless 1080p Fullscreen TV Kiosk features an intelligent split-screen mode: 65% of the display showcases live token status, doctor cabin numbers, and real-time ETAs, while 35% can stream institutional health awareness bulletins, visiting specialist schedules, preventive health packages, or NABH accreditation announcements.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-x-clip flex flex-col transition-colors duration-200">
      <SeoHead
        title="About Queueless | Our Clinical Philosophy, Architecture & Mission"
        description="We don't chase trends. We build what's next. Queueless was founded to permanently eradicate hospital waiting room congestion with elegant zero-capex software, restoring absolute dignity to healthcare."
        keywords="about queueless, healthcare innovation, hospital OPD philosophy, clinical workflow engineers, zero capex queue system, ABDM M1 M2 queue, NABH wait time reduction"
        canonical="https://queueless-os.vercel.app/about"
      />

      {/* Universal Commercial Navbar */}
      <CommercialNavbar
        currentCurrencyCode={currencyCode}
        onCurrencyChange={handleCurrencyChange}
      />

      <main className="flex-1">
        {/* ============================================================== */}
        {/* 1. HERO SECTION                                                */}
        {/* ============================================================== */}
        <section className="pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 relative z-10 text-center overflow-hidden">
          {/* Subtle Dynamic Ambient Lighting */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-teal-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-teal-50 dark:from-blue-950/70 dark:via-indigo-950/70 dark:to-teal-950/70 border border-blue-200/90 dark:border-blue-800/80 rounded-full text-xs font-black uppercase tracking-wider text-blue-950 dark:text-cyan-300 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>The Zen & Omni Healthcare Philosophy</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.06]">
              We don't chase trends. <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 dark:from-blue-400 dark:via-indigo-400 dark:to-teal-300 bg-clip-text text-transparent">
                We build what's next.
              </span>
            </h1>

            <p className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-100 max-w-3xl mx-auto tracking-tight leading-snug">
              Eliminating the agony of hospital waiting rooms. Pure clinical flow, zero hardware, zero standing queues.
            </p>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
              Every day, millions of sick patients, pregnant mothers, and elderly citizens wait 2 to 4 hours in suffocating hospital corridors for a 6-minute doctor consultation. While legacy healthtech corporations push clunky ₹2.5 Lakh metal touchscreens and paper dispensers that jam every 20 minutes, <strong>Queueless</strong> re-engineers outpatient care from first principles: an autonomous, zero-hardware cloud clinical queue operating system that restores absolute dignity and peace to medicine.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
                <span className="text-2xl sm:text-4xl font-black text-blue-600 dark:text-cyan-400 block font-mono">450+</span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Hospitals Deployed</span>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
                <span className="text-2xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 block font-mono">-78%</span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">OPD Corridor Crowding</span>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
                <span className="text-2xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 block font-mono">1.8M+</span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Patients Protected</span>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
                <span className="text-2xl sm:text-4xl font-black text-teal-600 dark:text-teal-400 block font-mono">100%</span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">ABDM & NABH Ready</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. THE GENESIS: WHY WE REFUSED TO ACCEPT WAITING ROOMS         */}
        {/* ============================================================== */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-50/70 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
                <Award className="w-3.5 h-3.5" />
                <span>The Story Behind Queueless</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-snug">
                Why Should Healing Begin with a Two-Hour Standing Queue?
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                In most hospitals across the world, the outpatient experience is fundamentally broken. Mechanical token machines run out of thermal paper rolls, reception staff are overwhelmed by aggressive crowds, and sick patients must sit shoulder-to-shoulder in poorly ventilated corridors, risking nosocomial and respiratory cross-infections.
              </p>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                We observed elderly diabetic patients standing on swollen feet for hours, anxious parents trying to soothe crying feverish infants, and exhausted physicians constantly interrupted by frustrated visitors knocking on cabin doors asking, <em>"Doctor sahab, hamara number kab aayega?"</em>
              </p>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Queueless was born out of profound impatience with that status quo. We asked a simple question: <strong>If every patient carries a smartphone and every waiting lobby already has a television, why are hospitals still paying Lakhs for clunky kiosks and paper tickets?</strong>
              </p>

              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/60">
                <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-200 font-semibold italic">
                  "Healing is sacred. It should never be preceded by humiliation in a waiting line. When you give patients clarity on their exact arrival time, you don't just optimize queue math; you return human dignity to healthcare."
                </p>
                <span className="block mt-2 text-[11px] font-bold text-blue-700 dark:text-cyan-300 tracking-wide">
                  — The Queueless Clinical Architecture Charter
                </span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                  <span>The Queueless 5-Point Guarantee</span>
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      01
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Zero Patient App Downloads</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        No 80MB Play Store downloads or complex OTP registrations. A lightweight web pass opens natively in any phone browser in 2 seconds via simple camera QR scan.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      02
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Zero Hardware Capex & Zero AMC</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Operates flawlessly on existing hospital Samsung, LG, Sony or Android TVs. No annual maintenance contracts, no hardware repair visits, no consumable thermal paper costs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      03
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Sub-Second WebSocket Synchronization</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        When a doctor clicks "Call Next", the patient's smartphone vibrates, the hallway TV chimes in regional audio, and the reception dashboard updates instantly in under 300ms.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      04
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Full ABDM & NABH Audit Sovereignty</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Pre-configured for Ayushman Bharat (ABDM) Milestone 1 and Milestone 2 compliance with ABHA Scan-and-Share integration and automated NABH wait-time KPI reporting.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      05
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Automated 15-Day Follow-Up & Revenue Safeguard</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Detects returning patients by phone ref ID to apply hospital zero-fee rebooking rules automatically, while preventing 8.5% of walk-in patients from walking away to competitors.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. THE 6 ARCHITECTURAL PILLARS OF QUEUELESS                    */}
        {/* ============================================================== */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto space-y-14 text-center">
            <div className="space-y-3 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-cyan-300 text-xs font-black uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                <span>Next-Generation Clinical Architecture</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight">
                Engineered for High-Pressure Hospitals
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                Every component of Queueless is designed to function smoothly whether handling 50 patients in a single doctor's clinic or 4,000 daily walk-ins in a government medical college hospital.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {/* Pillar 1 */}
              <div className="p-8 rounded-3xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-xl transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  01. Zero-App PWA Web Pass
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Patients scan a lobby QR code with any smartphone camera. An ultra-responsive web pass immediately opens in Safari or Chrome showing their live token, active doctor name, cabin location, and real-time ETA.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="p-8 rounded-3xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-xl transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Tv className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  02. Zero-Capex 1080p TV Kiosk
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Connect any TV in your waiting hall to our fullscreen kiosk URL. Features high-contrast typography readable from 40 feet away, emergency doctor notices, and an institutional health awareness broadcast banner.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="p-8 rounded-3xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/40 hover:shadow-xl transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Zap className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  03. Sub-Second WebSocket Mesh
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Powered by an event-driven distributed WebSocket mesh with automatic reconnect resilience. State transitions replicate across reception, doctor consoles, and patient phones in under 300 milliseconds.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="p-8 rounded-3xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/40 hover:shadow-xl transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Activity className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  04. Multi-Lingual Audio Chimes
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Natural human voice synthesis calls out token numbers and cabin designations in Hindi, English, Bengali, Tamil, Telugu, Kannada, and Marathi so illiterate and visually impaired patients never miss their turn.
                </p>
              </div>

              {/* Pillar 5 */}
              <div className="p-8 rounded-3xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/40 hover:shadow-xl transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <HeartPulse className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  05. Universal Patient Health Vault
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Patients log in using Google or Phone OTP to access their digital prescriptions, lab orders, doctor notes, and 15-day free OPD follow-up eligibility without paper loss or WhatsApp scrambling.
                </p>
              </div>

              {/* Pillar 6 */}
              <div className="p-8 rounded-3xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/40 hover:shadow-xl transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Lock className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  06. ABDM, FHIR & DPDP 2023 Shield
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Bank-grade AES-256 data protection with full compliance under India's Digital Personal Data Protection Act 2023, Ayushman Bharat Digital Mission (ABDM), and automated NABH audit-ready wait-time tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. COMPARISON MATRIX: LEGACY HARDWARE VS QUEUELESS OS         */}
        {/* ============================================================== */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-50/80 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Clinical Operational Analysis</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
                Legacy Metal Hardware vs. Queueless OS
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Compare the total cost of ownership and operational friction between legacy hardware vendors and Queueless.
              </p>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/80">
                    <th className="py-4 px-4 sm:px-6 font-black text-slate-900 dark:text-white">Operational Metric</th>
                    <th className="py-4 px-4 sm:px-6 font-bold text-rose-600 dark:text-rose-400">Legacy Hardware Kiosks</th>
                    <th className="py-4 px-4 sm:px-6 font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30">
                      Queueless Healthcare OS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900 dark:text-white">Upfront Hardware Capex</td>
                    <td className="py-4 px-4 sm:px-6 text-slate-600 dark:text-slate-400">
                      ₹1,50,000 – ₹2,50,000 per metal kiosk
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20">
                      ₹0 (Zero Capex — Runs on existing TVs & phones)
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900 dark:text-white">Annual Maintenance (AMC)</td>
                    <td className="py-4 px-4 sm:px-6 text-slate-600 dark:text-slate-400">
                      ₹35,000 – ₹60,000/year per station
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20">
                      ₹0 (Zero hardware repairs; pure cloud software)
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900 dark:text-white">Patient Check-in Speed</td>
                    <td className="py-4 px-4 sm:px-6 text-slate-600 dark:text-slate-400">
                      4 to 8 minutes standing in line
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20">
                      15 seconds via instant camera QR scan
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900 dark:text-white">Waiting Lobby Experience</td>
                    <td className="py-4 px-4 sm:px-6 text-slate-600 dark:text-slate-400">
                      Overcrowded hallway seats, high infection risk
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20">
                      Patients wait in gardens, cafeterias or cars with live ETA
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900 dark:text-white">Consumable Thermal Paper</td>
                    <td className="py-4 px-4 sm:px-6 text-slate-600 dark:text-slate-400">
                      15,000+ paper slips/mo prone to jams
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20">
                      100% digital SMS, WhatsApp, & email passes
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900 dark:text-white">NABH Wait-Time KPI Audits</td>
                    <td className="py-4 px-4 sm:px-6 text-slate-600 dark:text-slate-400">
                      Manual ledger logs prone to inspection failure
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20">
                      1-click automated NABH audit-ready PDF logs
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-900 dark:text-white">Deployment Timeline</td>
                    <td className="py-4 px-4 sm:px-6 text-slate-600 dark:text-slate-400">
                      4 to 8 weeks for shipping and cabling
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20">
                      Live in under 90 minutes
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 5. STEP-BY-STEP CLINICAL OPD JOURNEY                          */}
        {/* ============================================================== */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto space-y-14 text-center">
            <div className="space-y-3 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-cyan-300 text-xs font-black uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                <span>The Patient & Physician Journey</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight">
                How Queueless Transforms an OPD Day
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                From the moment a patient steps into the hospital entrance to their completed prescription, every touchpoint is frictionless.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
              <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 relative space-y-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                  01
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Instant QR Check-in</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Patient scans the entrance banner with their camera. System verifies doctor schedule, issues digital token #24, and sends a WhatsApp pass.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 relative space-y-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center">
                  02
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Free-Roaming Wait</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Instead of sitting in a congested hallway, the patient sits in the hospital garden or cafeteria. Their phone tracker shows: "3 patients ahead • ETA 18 mins".
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 relative space-y-3">
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center">
                  03
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Audible Kiosk Chime</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Doctor hits "Call Next" hotkey. Lobby TV plays a gentle chime and speaks: "Token #24 please proceed to Cabin 4". Patient receives a vibration alert.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 relative space-y-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                  04
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Digital Rx & Vault</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Doctor writes digital Rx. Token is archived, Rx is emailed instantly, and a 15-day free follow-up window is logged in the patient's Universal Health Vault.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 6. QUEUELESS LABS RESEARCH & CLINICAL ROADMAP                  */}
        {/* ============================================================== */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800">
          <div className="max-w-4xl mx-auto p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-cyan-300 text-xs font-black uppercase tracking-wider mx-auto">
              <FlaskConical className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>Queueless Labs • Advanced Clinical R&D</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
              Pioneering Zero-Friction Outpatient Science
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              At <strong>Queueless Labs</strong>, our cross-functional team of distributed systems engineers and healthcare operations researchers develops next-generation queuing theory models, offline-first clinical protocols, and low-bandwidth telemetry designed specifically for high-density hospital networks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <span className="text-xs font-black text-blue-600 dark:text-cyan-400 block mb-1">Predictive AI ETA</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Calculates real-time patient wait intervals adjusted dynamically by doctor specialty and complexity.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block mb-1">Regional Voice Check-in</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Enables illiterate rural patients to speak their symptoms and phone number in local dialect for token dispatch.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 block mb-1">Emergency Auto-Preemption</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Instantly flags critical trauma or cardiac cases to insert ahead of routine queues without receptionist confusion.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
              <a
                href="mailto:contact@queuelesslabs.com"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-2 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>contact@queuelesslabs.com</span>
              </a>
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Executive response within 12 business hours</span>
              </span>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 7. COMPREHENSIVE CLINICAL FAQ SECTION                          */}
        {/* ============================================================== */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-cyan-300 text-xs font-black uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Hospital Director & Staff Inquiries</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
                Frequently Asked Clinical Questions
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                Detailed answers for Chief Medical Officers, Hospital Administrators, and Clinic Directors.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-[10px] font-black flex items-center justify-center shrink-0">
                          Q{index + 1}
                        </span>
                        <span>{faq.q}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 font-normal">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 8. CALL TO ACTION                                              */}
        {/* ============================================================== */}
        <section className="py-20 px-4 sm:px-6 bg-slate-900 text-white relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-cyan-300 text-xs font-black uppercase tracking-wider mx-auto">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Transform Your Facility Today</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to Permanently Eliminate OPD Waiting Rooms?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-normal">
              Join 450+ healthcare leaders operating serene, zero-wait OPDs with zero hardware capex. Launch in under 90 minutes.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/signup"
                className="px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Start 14-Day Free Pilot</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/roi-calculator"
                className="px-7 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Calculate Your OPD ROI Savings</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Commercial Footer */}
      <CommercialFooter />
    </div>
  );
};

export default AboutPage;
