import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

  // Lock background body scrolling when mobile navigation drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen]);

  const selectedCurrency: CurrencyConfig =
    WORLDWIDE_CURRENCIES[currentCurrencyCode] || WORLDWIDE_CURRENCIES.USD;

  const handleCurrencySelect = (code: string) => {
    localStorage.setItem('queueless_currency', code);
    if (onCurrencyChange) {
      onCurrencyChange(code);
    }
  };

  const navLinks = [
    { label: 'Features', href: '/features' },
    { label: 'ROI Calculator', href: '/roi-calculator' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
  ];

  const mobileNavLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'ROI Calculator', href: '/roi-calculator' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 w-full max-w-full overflow-hidden transition-all duration-300 ${isScrolled
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
          className={`px-3 sm:px-6 py-2.5 sm:py-3.5 transition-all duration-300 border-b ${isScrolled
              ? 'bg-white/90 dark:bg-[#060D1D]/90 backdrop-blur-2xl backdrop-saturate-150 border-slate-200/80 dark:border-slate-800/80 shadow-[0_4px_25px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)]'
              : 'bg-white/80 dark:bg-[#060D1D]/75 backdrop-blur-xl backdrop-saturate-150 border-slate-200/60 dark:border-slate-800/60'
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
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm border border-sky-400/30 group-hover:scale-105 transition-transform"
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
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-tight hidden xl:block">Zero-Wait Clinical Queue Operating System</p>
              </div>
            </Link>

            {/* Clean Central Nav Links - Visible on Wide Desktops (>= 1280px) to prevent Tablet Clipping */}
            <nav className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {navLinks.map((item, idx) => {
                const isActive =
                  location.pathname === item.href ||
                  (item.href === '/#about-founder' && location.pathname === '/' && location.hash === '#about-founder');
                const isLast = idx === navLinks.length - 1;
                return (
                  <React.Fragment key={item.href}>
                    <Link
                      to={item.href}
                      className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${isActive
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
                className="p-2 text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/90 dark:border-slate-700/60 backdrop-blur-md rounded-full transition-all cursor-pointer shadow-2xs shrink-0 flex items-center justify-center hover:scale-105 active:scale-95"
                aria-label="Toggle Theme"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>

              {/* Currency Selector Pill (Desktop only >= 1280px; on tablet/mobile available in drawer) */}
              <div className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/90 dark:border-slate-700/60 backdrop-blur-md rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 transition-all shadow-2xs">
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


              {/* Start Free Pilot Button (Visible on Tablet sm: and Desktop) */}
              {onOpenAuditModal ? (
                <button
                  type="button"
                  onClick={onOpenAuditModal}
                  className="hidden sm:inline-flex px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] sm:text-xs rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Start Free Pilot</span>
                </button>
              ) : (
                <Link
                  to="/signup"
                  className="hidden sm:inline-flex px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] sm:text-xs rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Start Free Pilot</span>
                </Link>
              )}

              {/* Patient Portal Quick Link (Desktop >= 1280px; on tablet/phone available in drawer) */}
              <Link
                to="/portal"
                className="hidden xl:inline-flex px-3 py-1.5 sm:px-3.5 sm:py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 backdrop-blur-md font-bold text-xs rounded-full shadow-2xs hover:scale-105 active:scale-95 transition-all items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                title="Universal Patient Health Vault — View Prescriptions & Visits"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Patient Vault</span>
              </Link>

              {/* Log In Button (Visible on Tablet sm: and Desktop) */}
              <Link
                to="/login"
                className="hidden sm:inline-flex px-3.5 py-1.5 sm:px-4 sm:py-2 bg-white/90 hover:bg-white dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white border border-slate-200/90 dark:border-slate-700 backdrop-blur-md font-bold text-xs rounded-full shadow-2xs hover:scale-105 active:scale-95 transition-all items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                title="Hospital Director, Doctor & Receptionist Login"
              >
                <span>Log In</span>
              </Link>

              {/* Mobile/Tablet Hamburger Toggle (Clean and prominent on mobile and tablet <= 1280px) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl cursor-pointer transition-all border border-slate-200 dark:border-slate-800 shadow-2xs shrink-0"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 stroke-[2.5]" /> : <Menu className="w-6 h-6 stroke-[2.5]" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Dropdown Portal Overlay (rendered outside overflow-hidden navbar container) */}
          {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
            <div className="fixed inset-0 z-[99999] w-full h-screen h-[100dvh] bg-white dark:bg-[#060D1D] flex flex-col justify-between overflow-y-auto overscroll-contain animate-in fade-in duration-200 text-slate-900 dark:text-slate-100 p-5 sm:p-7 border-l border-slate-200 dark:border-slate-800">
              <div className="space-y-4">
                {/* Drawer Top Header: Logo on left, Theme toggle & Close button on right */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800">
                  <Link
                    to="/"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2.5 group cursor-pointer"
                  >
                    <img
                      src="/logo.png"
                      alt="Queueless"
                      className="w-9 h-9 rounded-xl object-cover shadow-xs border border-blue-500/20"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
                          Queueless
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-teal-500 text-white px-1.5 py-0.5 rounded-full">
                          OS
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Zero-Wait Healthcare OS</p>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2">
                    {/* Mobile Theme Toggle Button */}
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="p-2.5 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-800 transition-all cursor-pointer shadow-2xs flex items-center justify-center active:scale-95"
                      aria-label="Toggle Theme"
                      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                      {theme === 'dark' ? (
                        <Sun className="w-5 h-5 text-amber-400" />
                      ) : (
                        <Moon className="w-5 h-5 text-slate-700" />
                      )}
                    </button>

                    {/* Close 'X' Button */}
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-800 transition-all cursor-pointer shadow-2xs active:scale-95"
                      aria-label="Close Navigation Menu"
                    >
                      <X className="w-6 h-6 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* 1. Universal Patient Vault Card */}
                <Link
                  to="/portal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 active:scale-[0.99] text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-200 shrink-0" />
                    <span>Universal Patient Health Vault (Rx & Records)</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-emerald-200 shrink-0" />
                </Link>

                {/* 2. Navigation Links: Includes Home, Features, ROI Calculator, Pricing, Blog, About */}
                <div className="space-y-1">
                  {mobileNavLinks.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          if (item.href === '/') {
                            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                          }
                        }}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors ${isActive
                            ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-extrabold border border-blue-200 dark:border-blue-900'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/80 hover:text-slate-950 dark:hover:text-white'
                          }`}
                      >
                        <span className="flex items-center gap-2.5">
                          {item.label === 'Home' && <span className="text-base">🏠</span>}
                          {item.label === 'Features' && <span className="text-base">⚡</span>}
                          {item.label === 'ROI Calculator' && <span className="text-base">📊</span>}
                          {item.label === 'Pricing' && <span className="text-base">💳</span>}
                          {item.label === 'Blog' && <span className="text-base">📰</span>}
                          {item.label === 'About' && <span className="text-base">👥</span>}
                          <span>{item.label}</span>
                        </span>
                        <ArrowRight className="w-4 h-4 opacity-40" />
                      </Link>
                    );
                  })}
                </div>

                {/* 3. Action CTAs */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  {onOpenAuditModal ? (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuditModal();
                      }}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-xl shadow-lg shadow-blue-600/30 text-center flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] transition-all"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>Start 14-Day Free Pilot ➔</span>
                    </button>
                  ) : (
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-xl shadow-lg shadow-blue-600/30 block active:scale-[0.99] transition-all"
                    >
                      Start 14-Day Free Pilot ➔
                    </Link>
                  )}

                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 px-4 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl block active:scale-[0.99] transition-all"
                  >
                    Hospital Staff Sign In (Director / Doctor / Desk) ➔
                  </Link>
                </div>
              </div>

              {/* Bottom Utility Drawer: Currency & Compliance info */}
              <div className="pt-4 pb-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Currency:</span>
                  </span>
                  <select
                    aria-label="Mobile Currency"
                    value={currentCurrencyCode}
                    onChange={(e) => {
                      handleCurrencySelect(e.target.value);
                    }}
                    className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold px-2 py-1 rounded-lg focus:outline-none text-xs"
                  >
                    {Object.values(WORLDWIDE_CURRENCIES).map((curr) => (
                      <option key={curr.code} value={curr.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                        {curr.flag} {curr.code} ({curr.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span className="flex items-center gap-1 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    ABDM & HIPAA Certified
                  </span>
                  <span>450+ Hospitals</span>
                </div>
              </div>
            </div>,
            document.body
          )}
        </header>
      </div>
      {/* Frozen Top Navbar Spacer so content below is not occluded */}
      <div className="h-[92px] sm:h-[104px] w-full shrink-0" aria-hidden="true" />
    </>
  );
};

