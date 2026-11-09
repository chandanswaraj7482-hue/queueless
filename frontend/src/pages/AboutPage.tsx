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
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';
import { WORLDWIDE_CURRENCIES, CurrencyConfig } from '../data/commercialData';

export const AboutPage: React.FC = () => {
  const [currencyCode, setCurrencyCode] = useState<string>(() => {
    return localStorage.getItem('queueless_currency') || 'USD';
  });

  const handleCurrencyChange = (newCode: string) => {
    setCurrencyCode(newCode);
    localStorage.setItem('queueless_currency', newCode);
  };

  const selectedCurrency: CurrencyConfig =
    WORLDWIDE_CURRENCIES[currencyCode] || WORLDWIDE_CURRENCIES.USD;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-x-clip flex flex-col transition-colors duration-200">
      {/* Universal Commercial Navbar */}
      <CommercialNavbar
        currentCurrencyCode={currencyCode}
        onCurrencyChange={handleCurrencyChange}
      />

      <main className="flex-1">
        {/* ============================================================== */}
        {/* HERO SECTION                                                  */}
        {/* ============================================================== */}
        <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 px-4 sm:px-6 relative z-10 text-center overflow-hidden">
          {/* Subtle Background Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-teal-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800 rounded-full text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-300 shadow-2xs">
              <HeartPulse className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Architecting the Zero-Wait Hospital of Tomorrow</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
              Eliminating the Agony of <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 dark:from-blue-400 dark:via-indigo-400 dark:to-teal-300 bg-clip-text text-transparent">
                Hospital Waiting Rooms.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Every day, millions of sick patients and anxious families wait 2 to 4 hours in crowded hospital corridors for a 6-minute consultation. Queueless is replacing outdated thermal paper kiosks with an autonomous, zero-hardware clinical queue operating system.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
                <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-cyan-400 block font-mono">450+</span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Hospitals Deployed</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 block font-mono">-78%</span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Lobby Crowding</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
                <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 block font-mono">1.8M+</span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Patients Served</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
                <span className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400 block font-mono">100%</span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">ABDM & NABH Ready</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* OUR STORY & MISSION                                            */}
        {/* ============================================================== */}
        <section className="py-16 px-4 sm:px-6 bg-slate-50/70 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
                <Award className="w-3.5 h-3.5" />
                <span>Our Founding Mission</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-snug">
                Why Should Healing Begin with a Two-Hour Standing Queue?
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                In most hospitals, the outpatient experience is broken by design. Mechanical token dispensers run out of paper rolls, metal touchscreens freeze constantly, and frustrated patients repeatedly crowd the reception counter asking, <em>"Doctor kab aayenge?"</em>
              </p>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                Queueless was engineered to dismantle this chaos entirely. We asked a fundamental question: <strong>Why force hospitals to buy ₹2.5 lakh metal kiosks when every patient already carries a smartphone and every lobby has a flat-screen TV?</strong>
              </p>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                By shifting queue intelligence to the cloud, patients scan a QR code at entrance doors, relax in cafeteria gardens, and receive real-time updates as their turn approaches.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                  <span>The Queueless Clinical Standard</span>
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      01
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">Zero Patient App Requirement</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        No 80MB app downloads. Instant browser web pass opens in 20 seconds via camera QR scan.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      02
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">Zero Proprietary Hardware Capex</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Operates on existing hospital Sony, Samsung, or LG TVs. Zero annual maintenance contracts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      03
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">Full Ayushman Bharat (ABDM) Sovereignty</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Pre-configured for ABHA registration, M1/M2 reporting, and automated NABH audit wait logs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      04
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">Automated 15-Day Follow-Up Engine</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Recognizes returning patients by phone ref ID and auto-applies hospital zero-fee rebooking rules.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* CORE PLATFORM VALUES                                           */}
        {/* ============================================================== */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto space-y-12 text-center">
            <div className="space-y-3 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Designed for Doctors, Loved by Patients.
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Every line of code is measured by one metric: clinical tranquility in the hospital corridor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="p-8 rounded-3xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-xl transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Doctor Workflow Sanity</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Physicians shouldn't manage waiting room crowds. With 1-tap call hotkeys, prescription history sync, and automated interval spacing, doctors see patients promptly without knocking interruptions.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-xl transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Users className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Patient Dignity & Calm</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Elderly patients and parents with sick children deserve comfortable seating away from viral exposure. Mobile queue alerts ensure patients only walk to the cabin when their consultation is up next.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-xl transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Building2 className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Hospital Financial Health</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Overcrowded lobbies bleed 8.5% of OPD walk-in patients to competitor clinics. Queueless recovers up to 85% of that lost revenue on Day 1 while eliminating expensive hardware maintenance contracts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* QUEUELESS LABS RESEARCH & ENGINEERING DIVISION                 */}
        {/* ============================================================== */}
        <section className="py-16 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800">
          <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-cyan-300 text-xs font-black uppercase tracking-wider mx-auto">
              <FlaskConical className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>Queueless Labs • Clinical Engineering Division</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
              Pioneering Zero-Friction Outpatient Architecture
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              At <strong>Queueless Labs</strong>, our engineering and healthcare operations research team designs next-generation distributed queue protocols, sub-second WebSocket hospital synchronization, and privacy-first clinical telemetry.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
              <a
                href="mailto:contact@queuelesslabs.com"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-2 shadow-sm transition-all hover:scale-105 active:scale-95"
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
        {/* CALL TO ACTION                                                 */}
        {/* ============================================================== */}
        <section className="py-20 px-4 sm:px-6 bg-slate-900 text-white relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to Transform Your Hospital's Outpatient Flow?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-normal">
              Join 450+ healthcare leaders operating serene, zero-wait OPDs with zero hardware capex.
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
                <span>Calculate Your OPD Savings</span>
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

