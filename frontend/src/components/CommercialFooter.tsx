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
  ExternalLink,
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

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 text-xs relative z-10 pt-16 pb-8 overflow-hidden transition-colors duration-200">
      {/* Subtle Ambient Radial Backlight for High-End Depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[320px] bg-gradient-to-b from-sky-600/10 via-indigo-600/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* Main 5-Column Balanced Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Col 1: Brand & Identity */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-4">
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
              Empowering hospitals and healthcare facilities across 120+ countries to eliminate waiting room congestion, prevent walkout revenue leakage, and deliver dignified zero-wait patient experiences.
            </p>

            {/* Clean Minimalist Social Media Icon Buttons */}
            <div className="pt-2 flex items-center gap-2">
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
            <div className="pt-2">
              <a
                href="mailto:contact@queuelesslabs.com"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-sky-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>contact@queuelesslabs.com</span>
              </a>
              <p className="text-[11px] text-slate-400 mt-0.5">Enterprise onboarding, hospital networks & custom integrations</p>
            </div>
          </div>

          {/* Col 2: Platform Capabilities */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Platform Suite</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Autonomous Queue Engine
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Zero-Scroll TV Wall Display
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  15 Regional Voice Chimes
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  WhatsApp Prescription Suite
                </Link>
              </li>
              <li>
                <Link to="/roi-calculator" className="hover:text-white transition-colors">
                  OPD Revenue Leakage Audit
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sky-400 font-bold hover:text-sky-300 flex items-center gap-1">
                  <span>Transparent Pricing</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Healthcare Solutions */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Solutions</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Multi-Specialty Hospitals
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Polyclinics & Daycare OPDs
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Diagnostics & Imaging Centers
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">
                  Enterprise Hospital Chains
                </Link>
              </li>
              <li>
                <Link to="/portal" className="hover:text-white transition-colors">
                  Patient Token Tracker
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>Hospital Staff Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Compliance */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Trust & Legal</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy (HIPAA / GDPR)
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
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>ABDM M1/M2 Certified</span>
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Global Payment & Verification Security Ribbon */}
        <div className="pt-6 pb-4 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              Security & Payment Standards:
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>256-Bit Cryptographic SSL</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <CreditCard className="w-3 h-3 text-sky-400" />
              <span>Dodo Payments & UPI</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-[#0079C1] font-bold">Pay</span>
              <span className="text-[#00457C] font-bold">Pal</span>
              <span className="ml-1 text-slate-200">Verified</span>
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

        {/* Bottom Copyright & Compliance Notice */}
        <div className="pt-4 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} <strong className="text-slate-300 font-bold">Queueless Labs Inc.</strong> All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3">
            <span>India DPDP Compliant</span>
            <span>•</span>
            <span>Zero Patient PHI Monetization</span>
            <span>•</span>
            <span>99.99% Hospital SLA Uptime</span>
          </div>
        </div>

        {/* Sleek, Low-Opacity Subtle Watermark */}
        <div className="pt-4 pb-2 text-center select-none pointer-events-none w-full flex items-center justify-center opacity-15 hover:opacity-25 transition-opacity">
          <h2 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-slate-700 whitespace-nowrap">
            Queueless
          </h2>
        </div>

      </div>
    </footer>
  );
};
