import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone,
  Stethoscope,
  Tv,
  Printer,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  Clock,
  Sparkles,
  Volume2,
  Users,
  Building2,
  HeartPulse,
  Lock,
  Layers,
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';
import { SeoHead } from '../components/SeoHead';
import { GLOBAL_COMPLIANCE } from '../data/commercialData';

export const FeaturesPage: React.FC = () => {
  const [currencyCode, setCurrencyCode] = useState<string>('USD');

  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-x-clip flex flex-col transition-colors duration-200">
      <SeoHead
        title="5 Clinical Portals & Full OPD Feature Suite"
        description="Explore Queueless 5-portal ecosystem: Vector QR Patient Badges, 55-inch Lobby Smart TV Kiosks, 1-Tap Doctor Calling, and Multi-Floor OPD Orchestration."
        keywords="hospital queue features, OPD smart TV display, digital token system, doctor calling console, reception desk queue software"
        canonical="https://queueless-os.vercel.app/features"
      />
      <CommercialNavbar
        currentCurrencyCode={currencyCode}
        onCurrencyChange={(code) => setCurrencyCode(code)}
      />

      <main className="flex-1">
        {/* Features Hero */}
        <section className="pt-16 pb-14 sm:pt-20 sm:pb-18 px-4 sm:px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 rounded-full text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-300 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Full Clinical Architecture & Product Suite</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
              Built Specifically for the High-Velocity <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 dark:from-blue-400 dark:via-indigo-400 dark:to-teal-300 bg-clip-text text-transparent">
                Hospital Waiting Hall.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
              Queueless is not a generic scheduling calendar. It is a real-time clinical operating system connecting your entry doors, cashier, waiting hall TV, and consulting cabins.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/signup"
                className="px-7 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all inline-flex items-center gap-2 active:scale-98 shimmer-sweep"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Activate Queueless OS ➔</span>
              </Link>
              <Link
                to="/pricing"
                className="px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-800 transition-all shadow-2xs hover-card-premium"
              >
                View Plans & Pricing ➔
              </Link>
            </div>
          </div>
        </section>

        {/* 5 Architectural Pillars Section */}
        <section className="py-12 px-4 sm:px-6 relative z-10">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Pillar 1: Branded Self-QR & Web Pass */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-8 sm:p-12 shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-10 items-center hover-card-premium">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-black uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/60">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Pillar 01 • Patient Experience</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white leading-tight">
                  Zero-App Patient Self Check-In & Live Boarding Pass
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Patients scan your branded counter QR code with any smartphone camera. In under 20 seconds, they register with their name, phone, age, and chief complaints. No 40MB app download or account creation required.
                </p>
                <ul className="space-y-2 pt-2 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Instant token issuance with live queue countdown on their phone</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Digital Apple Wallet & Google Wallet boarding pass ticket cutouts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Instant SMS / WhatsApp notification when their token is called</span>
                  </li>
                </ul>
              </div>

              {/* Visual Card */}
              <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-300">Live Web Pass Active</span>
                  </div>
                  <span className="text-xs font-mono bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded border border-blue-500/40">
                    Token #A-108
                  </span>
                </div>
                <div className="py-6 text-center space-y-2">
                  <p className="text-xs text-slate-400">Estimated Dwell Time</p>
                  <p className="text-4xl font-black text-white tracking-tight font-mono">~6 Mins</p>
                  <p className="text-xs text-emerald-400 font-bold">2 Patients Ahead of You</p>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Assigned Cabin: Cabin 3 (Dr. Sharma)</span>
                  <span className="text-blue-400 font-bold font-mono">Room 102</span>
                </div>
              </div>
            </div>

            {/* Pillar 2: Doctor Cabin Console */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-8 sm:p-12 shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-10 items-center hover-card-premium">
              <div className="order-2 lg:order-1 bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Doctor Cabin Console</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 text-[10px] font-black border border-blue-200 dark:border-blue-800">
                    Shortcut: Alt + N
                  </span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-slate-900 dark:text-white">Current: Priya Sharma (28y/F)</span>
                    <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      In Consultation
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Chief Complaint: High fever & severe sore throat for 3 days.
                  </p>
                  <div className="pt-2 flex gap-1.5 flex-wrap">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-medium border border-slate-200 dark:border-slate-700">
                      URTI Preset
                    </span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-medium border border-slate-200 dark:border-slate-700">
                      Viral Fever
                    </span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-medium border border-slate-200 dark:border-slate-700">
                      E-Prescription
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Call Next Patient (Alt+N)</span>
                </button>
              </div>

              <div className="order-1 lg:order-2 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-black uppercase tracking-wider border border-indigo-200/60 dark:border-indigo-800/60">
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Pillar 02 • Clinical Workflow</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white leading-tight">
                  Doctor Cabin Touch Console & Alt+N Global Hotkey
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Doctors should spend time examining patients, not managing chaotic waiting hall crowds. Our distraction-free cabin interface opens on any browser or iPad, pre-filling chief complaints before the patient knocks.
                </p>
                <ul className="space-y-2 pt-2 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Single-key <strong>Alt+N</strong> hotkey calls the next patient immediately</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Instant consultation timer tracks dwell time to optimize doctor scheduling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Protected by individual doctor 4-digit PIN authentication</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pillar 3: Lobby 55" Smart TV Display */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-8 sm:p-12 shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-10 items-center hover-card-premium">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-black uppercase tracking-wider border border-purple-200/60 dark:border-purple-800/60">
                  <Tv className="w-3.5 h-3.5" />
                  <span>Pillar 03 • Waiting Hall Coordination</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white leading-tight">
                  Waiting Hall 55" Smart TV Display with Bilingual Audio
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Turn any commercial Smart TV, Android TV, PC monitor, or Amazon FireStick into an ultra-high-definition hospital broadcast display without expensive dedicated hardware.
                </p>
                <ul className="space-y-2 pt-2 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Bilingual Hindi and English text-to-speech voice announcements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Synchronized acoustic chimes cut through ambient hospital chatter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Dynamic multi-cabin grid shows active consultations across all floors</span>
                  </li>
                </ul>
              </div>

              {/* TV Mockup */}
              <div className="bg-slate-950 rounded-2xl p-5 border-4 border-slate-800 shadow-2xl space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-purple-400" />
                    <span>MAIN WAITING HALL DISPLAY</span>
                  </span>
                  <span className="text-emerald-400 font-mono">10:42 AM</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-white">
                  <div className="p-3 bg-blue-900/40 rounded-xl border border-blue-500/40">
                    <span className="text-[10px] text-blue-300 font-bold block uppercase">Cabin 1 • General Medicine</span>
                    <span className="text-2xl font-black text-white font-mono">A-108</span>
                    <span className="text-[10px] text-slate-300 block">Dr. R. K. Verma</span>
                  </div>
                  <div className="p-3 bg-purple-900/40 rounded-xl border border-purple-500/40">
                    <span className="text-[10px] text-purple-300 font-bold block uppercase">Cabin 2 • Pediatrics</span>
                    <span className="text-2xl font-black text-white font-mono">P-042</span>
                    <span className="text-[10px] text-slate-300 block">Dr. Anita Rao</span>
                  </div>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg text-[10px] text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-amber-400" />
                    <span>Now Calling: Token A-108 to Cabin 1</span>
                  </span>
                  <span className="text-emerald-400">Live Telemetry</span>
                </div>
              </div>
            </div>

            {/* Pillar 4: Frontdesk Reception & Thermal Dispatch */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-8 sm:p-12 shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-10 items-center hover-card-premium">
              <div className="order-2 lg:order-1 bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Frontdesk Cashier Terminal</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                    Thermal ESC/POS Ready
                  </span>
                </div>
                <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700/80 font-mono text-xs space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>OPD TOKEN SLIP</span>
                    <span>#T-204</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Patient: Rajesh Gupta (45y/M)<br />
                    Consultation: Cardiology ($50)
                  </div>
                  <div className="pt-2 border-t border-slate-700 flex justify-between font-bold text-white">
                    <span>STATUS: PAID (CASH)</span>
                    <span className="text-emerald-400">PRINTED (3.8s)</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>1-Click Thermal Print (58mm / 80mm)</span>
                </button>
              </div>

              <div className="order-1 lg:order-2 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-black uppercase tracking-wider border border-emerald-200/60 dark:border-emerald-800/60">
                  <Printer className="w-3.5 h-3.5" />
                  <span>Pillar 04 • Frontdesk Speed</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white leading-tight">
                  Frontdesk Cashier & 4-Second Thermal Slip Generator
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  For elderly patients or walk-ins without smartphones, your reception team can admit patients and print official thermal token receipts in under 4 seconds.
                </p>
                <ul className="space-y-2 pt-2 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Works with standard 58mm and 80mm USB & Bluetooth thermal receipt printers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Cash Drawer Reconciliation verifies physical cash matches issued tokens</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Instant priority token override for urgent medical emergencies</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pillar 5: Director Walkout Defense & Analytics */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-8 sm:p-12 shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-10 items-center hover-card-premium">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-black uppercase tracking-wider border border-amber-200/60 dark:border-amber-800/60">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Pillar 05 • Executive Control</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white leading-tight">
                  Hospital Director Analytics & Walkout Defense Engine
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Every patient who walks out of your waiting hall due to long delays costs your hospital revenue and reputation. Queueless gives directors real-time visibility into OPD throughput.
                </p>
                <ul className="space-y-2 pt-2 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span><strong>15-Day Follow-Up Engine</strong> routes return visits seamlessly with discounted fee tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Real-time revenue counter and walkout leakage defense telemetry</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Doctor consultation duration benchmarking across specialties</span>
                  </li>
                </ul>
              </div>

              {/* Analytics Metric Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-blue-50/70 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-2xl space-y-1">
                  <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase">Lobby Congestion</span>
                  <p className="text-3xl font-black text-blue-950 dark:text-blue-200 font-mono">-73%</p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400">Reduced within 48 hours</p>
                </div>
                <div className="p-5 bg-emerald-50/70 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Return Retention</span>
                  <p className="text-3xl font-black text-emerald-950 dark:text-emerald-200 font-mono">2.4x</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Via 15-Day Follow-Up Protocol</p>
                </div>
                <div className="p-5 bg-purple-50/70 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 rounded-2xl space-y-1">
                  <span className="text-[11px] font-bold text-purple-800 dark:text-purple-300 uppercase">Self Check-In Speed</span>
                  <p className="text-3xl font-black text-purple-950 dark:text-purple-200 font-mono">20 Sec</p>
                  <p className="text-[10px] text-purple-600 dark:text-purple-400">Zero frontdesk queue</p>
                </div>
                <div className="p-5 bg-amber-50/70 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-2xl space-y-1">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase">Patient CSAT</span>
                  <p className="text-3xl font-black text-amber-950 dark:text-amber-200 font-mono">4.9 / 5</p>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400">Zero-Wait verified rating</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Compliance Grid */}
        <section className="py-16 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border-y border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Enterprise Regulatory & Clinical Compliance
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Engineered to meet the most stringent international healthcare data sovereignty standards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GLOBAL_COMPLIANCE.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 space-y-2 hover-card-premium shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{comp.flag}</span>
                    <span className="font-black text-sm text-slate-900 dark:text-white">{comp.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block">{comp.region}</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{comp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              Transform Your Hospital OPD Today
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Setup takes less than 20 minutes. Select your plan, check out with Dodo Payments or PayPal, and print your QR standee today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/signup"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-2xl shadow-xl shadow-blue-500/25 transition-all inline-flex items-center gap-2 active:scale-98 shimmer-sweep"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Deploy Queueless OS ➔</span>
              </Link>
              <Link
                to="/pricing"
                className="px-6 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover-card-premium"
              >
                Compare Pricing Plans ➔
              </Link>
            </div>
          </div>
        </section>
      </main>

      <CommercialFooter />
    </div>
  );
};

