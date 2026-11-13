import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Globe,
  Zap,
  LogIn,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { WORLDWIDE_CURRENCIES, CurrencyConfig } from '../data/commercialData';
import { useTheme } from '../context/ThemeContext';

interface CommercialNavbarProps {
  currentCurrencyCode?: string;
  onCurrencyChange?: (code: string) => void;
  onOpenAuditModal?: () => void;
}

export const CommercialNavbar: React.FC<CommercialNavbarProps> = ({
  currentCurrencyCode = 'USD',
  onCurrencyChange,
  onOpenAuditModal,
}) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const selectedCurrency: CurrencyConfig =
    WORLDWIDE_CURRENCIES[currentCurrencyCode] || WORLDWIDE_CURRENCIES.USD;

  const handleCurrencySelect = (code: string) => {
    if (onCurrencyChange) {
      onCurrencyChange(code);
    } else {
      localStorage.setItem('queueless_currency', code);
    }
  };

  const navLinks = [
    { label: 'Features', href: '/features' },
    { label: 'ROI Calculator', href: '/roi-calculator' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 w-full max-w-full overflow-hidden transition-all duration-300 ${
          isScrolled
            ? 'shadow-[0_10px_35px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.45)]'
            : ''
        }`}
      >
      {/* Top Global Compliance Ribbon */}
      <div className="bg-slate-950/80 dark:bg-slate-950/70 backdrop-blur-xl text-white text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-slate-800/50 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-black text-[10px] uppercase tracking-wider shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Enterprise
            </span>
            <span className="text-slate-300 hidden md:inline truncate">
              Ayushman Bharat (ABDM M1/M2) & HIPAA Certified Zero-Wait Clinical OS • Active in 450+ Hospitals
            </span>
            <span className="text-slate-300 md:hidden text-[10px] truncate">
              ABDM & HIPAA Certified • 450+ OPDs
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {onOpenAuditModal && (
              <button
                type="button"
                onClick={onOpenAuditModal}
                className="px-2 py-0.5 sm:px-2.5 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/40 text-[9px] sm:text-[10px] font-bold cursor-pointer transition-all inline-flex items-center gap-1 shadow-2xs whitespace-nowrap"
              >
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                <span>60s OPD Audit ➔</span>
              </button>
            )}
            <Link
              to="/signup"
              className="text-slate-300 hover:text-white font-semibold text-[11px] hidden sm:inline-flex items-center gap-1"
            >
              <span>Instant Setup</span>
              <ArrowRight className="w-3 h-3 text-blue-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main High-Conversion Commercial Header */}
      <header
        className={`px-3 sm:px-6 py-2.5 sm:py-3.5 transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl backdrop-saturate-150 border-slate-200/70 dark:border-slate-800/70 shadow-[0_4px_25px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.35)]'
            : 'bg-white/65 dark:bg-slate-950/65 backdrop-blur-xl backdrop-saturate-150 border-slate-200/40 dark:border-slate-800/40'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => {
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
            }}
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 cursor-pointer"
            title="Queueless Healthcare OS - Home"
          >
            <div className="relative">
              <img
                src="/logo.png"
                alt="Queueless"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm border border-sky-400/30 dark:border-sky-500/30 group-hover:scale-105 transition-transform"
              />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-black text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">Queueless</span>
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full shadow-2xs">
                  HEALTHCARE OS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-tight hidden sm:block">Zero-Wait Clinical Queue Operating System</p>
            </div>
          </Link>

          {/* Clean Central Nav Links with Exact Dribbble SkyBound Dot Separators & Active Yellow Pill */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            {navLinks.map((item, idx) => {
              const isActive =
                location.pathname === item.href ||
                (item.href === '/#about-founder' && location.pathname === '/' && location.hash === '#about-founder');
              const isLast = idx === navLinks.length - 1;
              return (
                <React.Fragment key={item.href}>
                  <Link
                    to={item.href}
                    className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {!isLast && (
                    <span className="text-slate-300 dark:text-slate-700 select-none font-bold">·</span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Toggle Button (Desktop & Tablet) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-md rounded-full transition-all cursor-pointer shadow-2xs"
              aria-label="Toggle Theme"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 dark:text-slate-200" />
              )}
            </button>

            {/* Currency Selector Pill (Desktop only) */}
            <div className="hidden md:flex items-center gap-1 px-2.5 py-1.5 bg-slate-100/70 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-md rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 transition-all shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
              <select
                aria-label="Currency"
                value={currentCurrencyCode}
                onChange={(e) => handleCurrencySelect(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-slate-100 font-bold cursor-pointer focus:outline-none pr-0.5 text-xs"
              >
                {Object.values(WORLDWIDE_CURRENCIES).map((curr) => (
                  <option key={curr.code} value={curr.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium">
                    {curr.flag} {curr.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Book a Demo Button (Desktop only: md:inline-flex; on phone it slides into drawer) */}
            {onOpenAuditModal ? (
              <button
                type="button"
                onClick={onOpenAuditModal}
                className="hidden md:inline-flex px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold text-[11px] sm:text-xs rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Book a Demo</span>
              </button>
            ) : (
              <Link
                to="/signup"
                className="hidden md:inline-flex px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold text-[11px] sm:text-xs rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Book a Demo</span>
              </Link>
            )}

            {/* Patient Portal Quick Link (Desktop only: md:inline-flex; on phone it slides into drawer) */}
            <Link
              to="/portal"
              className="hidden md:inline-flex px-3 py-1.5 sm:px-3.5 sm:py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 backdrop-blur-md font-bold text-xs rounded-full shadow-2xs hover:scale-105 active:scale-95 transition-all items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              title="Universal Patient Health Vault — View Prescriptions & Visits"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Patient Vault</span>
            </Link>

            {/* Log In Button (Desktop only: md:inline-flex; on phone it slides into drawer) */}
            <Link
              to="/login"
              className="hidden md:inline-flex px-3.5 py-1.5 sm:px-4 sm:py-2 bg-white/70 hover:bg-white/95 text-slate-900 border border-slate-300/70 backdrop-blur-md font-bold text-xs rounded-full shadow-2xs hover:scale-105 active:scale-95 transition-all items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              title="Hospital Director, Doctor & Receptionist Login"
            >
              <span>Log In</span>
            </Link>

            {/* Mobile Hamburger Toggle (The ONLY button visible on phone/mobile screens!) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-800 hover:text-slate-950 hover:bg-slate-100 rounded-2xl cursor-pointer transition-all border border-slate-200/80 shadow-2xs shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 stroke-[2.5]" /> : <Menu className="w-6 h-6 stroke-[2.5]" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Slider Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-4 border-t border-slate-200/80 mt-3 space-y-3 bg-white/95 backdrop-blur-2xl rounded-3xl p-4 border border-slate-200 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            {/* 1. Prominent Patient Vault Mobile Button */}
            <Link
              to="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>✨ Universal Patient Health Vault (Rx & Records)</span>
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-200" />
            </Link>

            {/* 2. Navigation Links */}
            <div className="space-y-1 py-1">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    location.pathname === item.href
                      ? 'bg-blue-50 text-blue-700 font-extrabold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* 3. Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              {onOpenAuditModal ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuditModal();
                  }}
                  className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-sm text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book a Demo (60s OPD Audit) ➔</span>
                </button>
              ) : (
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 px-4 bg-slate-950 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-sm block"
                >
                  Book a Demo ➔
                </Link>
              )}

              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl block"
              >
                Hospital Staff Sign In (Director / Doctor / Desk) ➔
              </Link>
            </div>

            {/* 4. Mobile Theme & Currency Picker in Drawer */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                }}
                className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                <span className="flex items-center gap-1.5">
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-700" />
                  )}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </span>
                <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {theme}
                </span>
              </button>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                  <span>Currency:</span>
                </span>
                <select
                  aria-label="Mobile Currency"
                  value={currentCurrencyCode}
                  onChange={(e) => {
                    handleCurrencySelect(e.target.value);
                    setMobileMenuOpen(false);
                  }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold px-1.5 py-1 rounded-lg focus:outline-none text-[11px]"
                >
                  {Object.values(WORLDWIDE_CURRENCIES).map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.flag} {curr.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
    {/* Frozen Top Navbar Spacer so content below is not occluded */}
    <div className="h-[92px] sm:h-[104px] w-full shrink-0" aria-hidden="true" />
  </>
  );
};

