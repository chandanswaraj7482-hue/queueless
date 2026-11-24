import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Lock,
  Mail,
  Globe,
  CreditCard,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Youtube,
  Instagram,
  Linkedin,
  Twitter,
  Languages,
  ArrowUp,
  Activity,
  HeartPulse,
} from 'lucide-react';
import { GOOGLE_LANGUAGES, getStoredLanguage, changeLanguage } from '../utils/googleTranslate';

export const CommercialFooter: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<string>(getStoredLanguage);
  const [langToast, setLangToast] = useState<string | null>(null);

  const handleLanguageChange = (code: string) => {
    setCurrentLang(code);
    changeLanguage(code);
    const langObj = GOOGLE_LANGUAGES.find((l) => l.code === code);
    if (langObj) {
      setLangToast(`${langObj.native} active`);
      setTimeout(() => setLangToast(null), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 text-xs relative z-10 pt-16 pb-12 overflow-hidden transition-colors duration-200">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[260px] bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* Main Footer Grid: 2 Columns on Mobile/Tablet, 6 Columns on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 sm:gap-x-8 gap-y-10 lg:gap-8">
          
          {/* Brand & Identity Column (Spans 2 columns) */}
          <div className="col-span-2 space-y-4 pr-0 lg:pr-4">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Queueless"
                  className="w-10 h-10 rounded-xl object-cover border border-sky-500/30 shadow-md group-hover:scale-105 transition-transform"
                />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl text-white tracking-tight group-hover:text-sky-400 transition-colors">
                    Queueless
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-sky-500/15 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full">
                    HEALTHCARE OS
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Zero-Wait Clinical Queue Operating System</p>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Autonomous clinical queue operating system eliminating waiting hall congestion, preventing walkout revenue loss, and delivering dignified zero-wait patient experiences.
            </p>

            {/* Live Operational Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-emerald-400">99.99% Uptime</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">ABDM M1/M2 Certified</span>
            </div>

            {/* Clean Minimalist Social Media Icon Buttons */}
            <div className="pt-1 flex items-center gap-2">
              <a
                href="https://twitter.com/queueless"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-sky-500/20 text-slate-400 hover:text-sky-400 border border-slate-800 hover:border-sky-500/40 flex items-center justify-center transition-all"
                title="X (Twitter)"
              >
                <Twitter className="w-3.5 h-3.5 fill-current" />
              </a>
              <a
                href="https://linkedin.com/company/queueless"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 border border-slate-800 hover:border-blue-500/40 flex items-center justify-center transition-all"
                title="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5 fill-current" />
              </a>
              <a
                href="https://youtube.com/@queueless"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 flex items-center justify-center transition-all"
                title="YouTube"
              >
                <Youtube className="w-3.5 h-3.5 fill-current" />
              </a>
              <a
                href="https://instagram.com/queueless"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-pink-500/20 text-slate-400 hover:text-pink-400 border border-slate-800 hover:border-pink-500/40 flex items-center justify-center transition-all"
                title="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Direct Official Contact */}
            <div className="pt-1">
              <a
                href="mailto:contact@queuelesslabs.com"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-sky-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>contact@queuelesslabs.com</span>
              </a>
              <p className="text-[11px] text-slate-500 mt-0.5">Enterprise onboarding, hospital networks & custom integrations</p>
            </div>
          </div>

          {/* Column 2: Platform Suite */}
          <div className="col-span-1 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Platform Suite</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Autonomous Queue
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Zero-Scroll TV Wall
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  15 Voice Chimes
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  WhatsApp Rx Suite
                </Link>
              </li>
              <li>
                <Link to="/roi-calculator" className="hover:text-white transition-colors">
                  Revenue Leakage Audit
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sky-400 font-semibold hover:text-sky-300 flex items-center gap-1">
                  <span>Clinical Insights & Blog</span>
                  <ArrowRight className="w-3 h-3 shrink-0" />
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sky-400 font-semibold hover:text-sky-300 flex items-center gap-1">
                  <span>Transparent Pricing</span>
                  <ArrowRight className="w-3 h-3 shrink-0" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Solutions */}
          <div className="col-span-1 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Solutions</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Multi-Specialty Hospitals
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Polyclinics & Daycare
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Diagnostics & Imaging
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Hospital Chains & Networks
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-white transition-colors">
                  Hospital Onboarding
                </Link>
              </li>
              <li>
                <Link to="/roi-calculator" className="hover:text-white transition-colors">
                  ROI Payback Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Live Portals */}
          <div className="col-span-1 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Live Portals</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/portal" className="hover:text-white transition-colors">
                  Patient Token Tracker
                </Link>
              </li>
              <li>
                <Link to="/city-health/doctor" className="hover:text-white transition-colors">
                  Doctor Cabin Console
                </Link>
              </li>
              <li>
                <Link to="/city-health/reception" className="hover:text-white transition-colors">
                  Reception POS & Desk
                </Link>
              </li>
              <li>
                <Link to="/city-health/display" className="hover:text-white transition-colors">
                  55" TV Lobby Kiosk
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Hospital Admin HQ
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors flex items-center gap-1 text-slate-300 font-semibold">
                  <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Hospital Staff Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Trust & Compliance */}
          <div className="col-span-1 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Trust & Legal</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>About Queueless</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-white transition-colors">
                  Security Architecture
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-white transition-colors">
                  Refund & Cancellation
                </Link>
              </li>
              <li className="pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>ABDM Certified</span>
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Global Security & Multi-Language Ribbon */}
        <div className="pt-8 pb-4 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
              Compliance & Security:
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>256-Bit Cryptographic SSL</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium">
              <CreditCard className="w-3 h-3 text-sky-400" />
              <span>Direct UPI & NetBanking</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium">
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              <span>HIPAA & ABDM Aligned</span>
            </span>
          </div>

          {/* Interactive Multi-Language Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all text-xs font-semibold">
              <Languages className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <select
                aria-label="Select Clinical Language"
                value={currentLang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer text-xs pr-1"
              >
                {GOOGLE_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900 text-slate-100 font-medium py-1">
                    {l.flag} {l.native} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            {langToast && (
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-lg whitespace-nowrap">
                ✓ {langToast}
              </span>
            )}
          </div>
        </div>

        {/* Sleek, Ultra-Luxury Gradient Brand Watermark with Interactive Hover Animation */}
        <div className="pt-10 pb-6 text-center select-none w-full max-w-full overflow-hidden flex items-center justify-center relative group">
          {/* Interactive Ambient Radial Glow Behind Watermark */}
          <div className="absolute inset-0 max-w-4xl mx-auto h-36 bg-gradient-to-r from-sky-500/20 via-indigo-500/30 to-emerald-400/20 blur-3xl opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 pointer-events-none" />

          <h2
            className="relative text-5xl sm:text-8xl md:text-[10.5rem] lg:text-[13rem] font-black tracking-tighter group-hover:tracking-wide select-none leading-none opacity-85 group-hover:opacity-100 transition-all duration-700 ease-out transform group-hover:scale-[1.03] active:scale-95 cursor-pointer drop-shadow-md"
            style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 45%, #06b6d4 75%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Queueless
          </h2>
        </div>

        {/* Bottom Copyright & Compliance Strip: Completely Center-Aligned on all screens */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col items-center justify-center text-center gap-3 text-[11px] text-slate-400">
          <p className="text-center text-slate-400 leading-relaxed max-w-xl">
            © {new Date().getFullYear()} <strong className="text-slate-200 font-bold">Queueless Healthcare OS</strong>. Built for zero-wait clinical excellence. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-slate-400 text-center leading-relaxed max-w-2xl">
            <span>India DPDP Compliant</span>
            <span className="text-slate-600">•</span>
            <span>Zero Patient PHI Monetization</span>
            <span className="text-slate-600">•</span>
            <span>99.99% Hospital SLA Uptime</span>
          </div>

          {/* Minimalist, Clean Center-Aligned Back to Top Pill */}
          <div className="pt-2">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all text-xs font-semibold cursor-pointer active:scale-95 shadow-sm"
              title="Scroll to top of page"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 text-sky-400" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
