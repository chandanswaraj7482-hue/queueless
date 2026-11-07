import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Lock,
  Phone,
  Mail,
  Heart,
  Globe,
  Award,
  CreditCard,
  Building2,
  Tv,
  Stethoscope,
  Users,
  Smartphone,
  Printer,
  Sparkles,
  QrCode,
  ArrowRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  Youtube,
  Instagram,
  Linkedin,
  Twitter,
  Bot,
  X,
  MessageSquare,
  Languages,
  Check,
} from 'lucide-react';
import { ClinicalAiAssistant } from './ClinicalAiAssistant';
import { GOOGLE_LANGUAGES, getStoredLanguage, changeLanguage } from '../utils/googleTranslate';

const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', name: 'English (India)', native: 'English', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'ar-AE', name: 'Arabic', native: 'العربية', flag: '🇦🇪' },
  { code: 'en-US', name: 'English (Global)', native: 'English (US)', flag: '🇺🇸' },
];

export const CommercialFooter: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<string>(getStoredLanguage);
  const [langToast, setLangToast] = useState<string | null>(null);

  const handleLanguageChange = (code: string) => {
    setCurrentLang(code);
    localStorage.setItem('queueless_language', code);
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    if (langObj) {
      setLangToast(`${langObj.native} (${langObj.name}) active`);
      setTimeout(() => setLangToast(null), 3000);
    }
  };

  return (
    <footer className="bg-slate-950 dark:bg-[#030712] text-slate-400 border-t border-slate-800/80 text-xs relative z-10 pt-16 pb-6 overflow-hidden transition-colors duration-200">
      {/* Subtle Ambient Radial Backlight for High-End Depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1: Brand, Bio, Social Links & Security */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="relative">
                <img
                  src="/logo.jpg"
                  alt="Queueless"
                  className="w-10 h-10 rounded-2xl object-cover border border-slate-700 shadow-md group-hover:scale-105 transition-transform"
                />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl text-white tracking-tight group-hover:text-blue-400 transition-colors">
                    Queueless
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-0.5 rounded-full shadow-2xs">
                    HEALTHCARE OS
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Zero-Wait Clinical Queue Operating System</p>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empowering hospitals and polyclinics across 120+ countries to eliminate waiting room crowding, stop walkout patient revenue leakage, and deliver dignified zero-wait patient experiences.
            </p>

            {/* OmniTools-Inspired Social Media Buttons Row */}
            <div className="pt-1 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                FOLLOW US & CLINICAL COMMUNITY
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="https://youtube.com/@queueless"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold inline-flex items-center gap-1.5 transition-all shadow-2xs hover:scale-105 active:scale-95"
                >
                  <Youtube className="w-3.5 h-3.5 fill-current" />
                  <span>YouTube</span>
                </a>
                <a
                  href="https://instagram.com/queueless"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 text-[11px] font-bold inline-flex items-center gap-1.5 transition-all shadow-2xs hover:scale-105 active:scale-95"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://linkedin.com/company/queueless"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[11px] font-bold inline-flex items-center gap-1.5 transition-all shadow-2xs hover:scale-105 active:scale-95"
                >
                  <Linkedin className="w-3.5 h-3.5 fill-current" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://twitter.com/queueless"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold inline-flex items-center gap-1.5 transition-all shadow-2xs hover:scale-105 active:scale-95"
                >
                  <Twitter className="w-3.5 h-3.5 fill-current" />
                  <span>X (Twitter)</span>
                </a>
              </div>
            </div>

            {/* OmniTools-Inspired Badges Ribbon */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 font-bold text-[10px] inline-flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Zero Patient App Download
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-blue-400 font-bold text-[10px] inline-flex items-center gap-1.5 shadow-2xs">
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                ABDM & HIPAA Certified
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-purple-400 font-bold text-[10px] inline-flex items-center gap-1.5 shadow-2xs">
                <Zap className="w-3 h-3 text-purple-400" />
                20-Second QR Check-In
              </span>
            </div>

            {/* Payment & Security Verification Badges */}
            <div className="pt-2 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Authorized Global Payment Gateways</span>
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 font-bold text-[11px] inline-flex items-center gap-1.5 shadow-2xs hover:border-slate-700 transition-colors">
                  <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                  <span>Dodo Payments (Cards & UPI)</span>
                </span>
                <span className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 font-bold text-[11px] inline-flex items-center gap-1.5 shadow-2xs hover:border-slate-700 transition-colors">
                  <span className="text-[#0079C1] font-black">P</span>
                  <span className="text-[#00457C] font-black">P</span>
                  <span className="text-slate-200">PayPal Verified</span>
                </span>
                <span className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 font-bold text-[11px] inline-flex items-center gap-1.5 shadow-2xs hover:border-slate-700 transition-colors">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-Bit SSL Banking Grade</span>
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Solutions & Product */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Product Suite</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/features" className="hover:text-blue-400 transition-colors hover:translate-x-0.5 inline-block">
                  Platform Architecture
                </Link>
              </li>
              <li>
                <Link to="/roi-calculator" className="hover:text-blue-400 transition-colors hover:translate-x-0.5 inline-block">
                  OPD Revenue Calculator
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-blue-400 transition-colors hover:translate-x-0.5 inline-block">
                  Transparent Pricing
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-blue-300 transition-colors text-blue-400 font-bold flex items-center gap-1 group">
                  <span>Activate Queueless OS</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </li>
              <li>
                <span className="text-slate-400 font-medium">ABDM ABHA M1/M2 Bridge</span>
              </li>
              <li>
                <span className="text-slate-400 font-medium">Bilingual Voice Chime Engine</span>
              </li>
              <li>
                <span className="text-slate-400 font-medium">15-Day Follow-Up Engine</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Live Hospital Portals */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hospital Portals</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Hospital Director Console</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>Frontdesk Admission Desk</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-slate-500" />
                  <span>Doctor Cabin Interface</span>
                </Link>
              </li>
              <li>
                <Link to="/display" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-slate-500" />
                  <span>Waiting Hall Smart TV Kiosk</span>
                </Link>
              </li>
              <li>
                <Link to="/patient-portal" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Patient Live Token Pass</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Compliance & Legal Policies */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privacy & Legal</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/privacy" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Privacy Policy (HIPAA/GDPR)</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Security Architecture</span>
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>30-Day Money-Back Guarantee</span>
                </Link>
              </li>
              <li className="pt-1 text-[11px] text-slate-500">
                SOC-2 Type II, HIPAA & ABDM Aligned
              </li>
            </ul>
          </div>
        </div>

        {/* ============================================================== */}
        {/* OMNITOOLS-INSPIRED: TRENDING CLINICAL HUB BAR                   */}
        {/* ============================================================== */}
        <div className="py-6 border-b border-slate-800/80">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-bold shrink-0">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Trending Clinical Hub:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/features" className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px] font-medium flex items-center gap-1">
                ✦ ABDM M1/M2 Bridge
              </Link>
              <Link to="/features" className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px] font-medium flex items-center gap-1">
                ✦ OPD Queue Optimization
              </Link>
              <Link to="/display" className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px] font-medium flex items-center gap-1">
                ✦ Smart TV Waiting Kiosk
              </Link>
              <Link to="/roi-calculator" className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px] font-medium flex items-center gap-1">
                ✦ Zero-Wait Token Pass
              </Link>
              <Link to="/pricing" className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px] font-medium flex items-center gap-1">
                ✦ 15-Day Follow-Up Engine
              </Link>
              <Link to="/features" className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px] font-medium flex items-center gap-1">
                ✦ Doctor Cabin Alt+N Hotkey
              </Link>
              <Link to="/signup" className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px] font-medium flex items-center gap-1">
                ✦ Instant Digital Setup
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Copyright Row with Clinical Language Selector & Trust Badges */}
        <div className="pt-8 pb-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 border-b border-slate-800/70">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} <strong>Queueless Technologies Inc.</strong> All rights reserved.</span>
          </div>

          {/* Interactive Multi-Language Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all text-xs font-semibold shadow-2xs">
              <Languages className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Language:</span>
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

            {/* Language Confirmation Alert Toast */}
            {langToast && (
              <span className="animate-in fade-in slide-in-from-bottom-2 text-[10px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-full whitespace-nowrap">
                ✓ {langToast}
              </span>
            )}
          </div>

          {/* Trust Center Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-semibold">
              🇮🇳 India DPDP Compliant
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-semibold">
              🔒 Zero Patient PHI Monetization
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-semibold">
              ⚡ 99.99% Hospital SLA Uptime
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SIGNATURE MASSIVE "Queueless" WORDMARK WATERMARK (EXACT TO REF) */}
        {/* ============================================================== */}
        <div className="relative pt-6 sm:pt-10 pb-4 text-center overflow-hidden select-none pointer-events-none w-full flex items-center justify-center">
          {/* Subtle Ambient Backlight Glow under the wordmark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[140px] bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-teal-500/15 rounded-full blur-[100px] pointer-events-none" />

          <h2
            className="text-[44px] min-[380px]:text-[54px] min-[480px]:text-[72px] sm:text-[110px] md:text-[150px] lg:text-[195px] xl:text-[240px] font-black tracking-tight sm:tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-slate-600/90 via-slate-700/40 to-slate-900/10 dark:from-slate-600 dark:via-slate-700/35 dark:to-transparent transition-all duration-700 select-none whitespace-nowrap block"
            aria-hidden="true"
          >
            Queueless
          </h2>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PROFESSIONAL INTERACTIVE AI CLINICAL ASSISTANT                 */}
      {/* ============================================================== */}
      <ClinicalAiAssistant />
    </footer>
  );
};
