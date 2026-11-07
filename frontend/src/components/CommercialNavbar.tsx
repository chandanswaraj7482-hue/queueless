import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  Smartphone,
  Tv,
  Stethoscope,
  Users,
  Lock,
  ExternalLink,
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
  const [rolesDropdownOpen, setRolesDropdownOpen] = useState(false);
  const rolesRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rolesRef.current && !rolesRef.current.contains(e.target as Node)) {
        setRolesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    { label: 'Live Simulator', href: '/#interactive-demo' },
    { label: 'ROI Calculator', href: '/roi-calculator' },
    { label: 'Pricing', href: '/pricing' },
  ];

  const hospitalRoles = [
    {
      to: '/check-in/city-health',
      title: 'Patient QR Pass',
      desc: 'Mobile Check-in & Live Queue',
      icon: Smartphone,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      badge: 'Mobile Pass',
    },
    {
      to: '/display/city-health',
      title: '55" TV Waiting Kiosk',
      desc: 'Lobby OLED with Audio Chimes',
      icon: Tv,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      badge: 'Smart TV',
    },
    {
      to: '/doctor/city-health',
      title: 'Doctor Cabin Desk',
      desc: '1-Click Calling & Hotkey Alt+N',
      icon: Stethoscope,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      badge: 'PIN: 1234',
    },
    {
      to: '/reception/city-health',
      title: 'Reception Cashier POS',
      desc: 'Counter Admission & Thermal Slips',
      icon: Users,
      color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
      badge: 'Pass: reception123',
    },
    {
      to: '/admin/city-health',
      title: 'Hospital Admin Console',
      desc: '15-Day Free Follow-Up Rules',
      icon: Lock,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      badge: 'Pass: admin123',
    },
  ];

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
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
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative">
              <img
                src="/logo.jpg"
                alt="Queueless"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl object-cover shadow-sm border border-slate-200/90 dark:border-slate-700 group-hover:scale-105 transition-transform"
              />
              <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 animate-pulse"></span>
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
                (item.href === '/#interactive-demo' && location.pathname === '/' && location.hash === '#interactive-demo');
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
                  <span className="text-slate-300 dark:text-slate-700 select-none font-bold">·</span>
                </React.Fragment>
              );
            })}

            {/* Live Roles Dropdown */}
            <div className="relative" ref={rolesRef}>
              <button
                type="button"
                onClick={() => setRolesDropdownOpen(!rolesDropdownOpen)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 backdrop-blur-md ${
                  rolesDropdownOpen
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100/70 dark:hover:bg-blue-950/70 border border-blue-200/50 dark:border-blue-800/40'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Roles</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    rolesDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {rolesDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                      Open in Separate Tab
                    </span>
                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">Live Sync</span>
                  </div>
                  <div className="space-y-1">
                    {hospitalRoles.map((role) => {
                      const Icon = role.icon;
                      return (
                        <Link
                          key={role.to}
                          to={role.to}
                          target="_blank"
                          onClick={() => setRolesDropdownOpen(false)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${role.color}`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">
                                {role.title}
                              </span>
                              <span className="block text-[10px] text-slate-400 truncate">
                                {role.desc}
                              </span>
                            </div>
                          </div>
                          <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded shrink-0 flex items-center gap-0.5">
                            <span>{role.badge}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Currency Selector Pill (Hidden on mobile header, available in mobile drawer) */}
            {/* Currency Selector Pill */}
            <div className="hidden md:flex items-center gap-1 px-2.5 py-1.5 bg-slate-100/70 hover:bg-slate-200/80 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 transition-all shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <select
                aria-label="Currency"
                value={currentCurrencyCode}
                onChange={(e) => handleCurrencySelect(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-slate-200 font-bold cursor-pointer focus:outline-none pr-0.5 text-xs"
              >
                {Object.values(WORLDWIDE_CURRENCIES).map((curr) => (
                  <option key={curr.code} value={curr.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium">
                    {curr.flag} {curr.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Dark / Light Mode Toggle Button (Icon Only, Sleek Circular Tactile Design) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-100/70 hover:bg-slate-200/80 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md rounded-full text-slate-700 dark:text-amber-400 transition-all shadow-2xs cursor-pointer flex items-center justify-center active:scale-95 shrink-0"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400/25 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 fill-slate-700/20 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Book a Demo Button (Exact match to reference design: Solid High-Contrast Pill) */}
            {onOpenAuditModal ? (
              <button
                type="button"
                onClick={onOpenAuditModal}
                className="px-2.5 py-1 sm:px-4 sm:py-2 bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-[11px] sm:text-xs rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Book a Demo</span>
              </button>
            ) : (
              <Link
                to="/signup"
                className="px-2.5 py-1 sm:px-4 sm:py-2 bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-[11px] sm:text-xs rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Book a Demo</span>
              </Link>
            )}

            {/* Log In Button (Shown on desktop & tablet; available in mobile drawer on small screens) */}
            <Link
              to="/login"
              className="hidden sm:inline-flex px-3.5 py-1.5 sm:px-4 sm:py-2 bg-white/70 dark:bg-slate-900/70 hover:bg-white/95 dark:hover:bg-slate-800/90 text-slate-900 dark:text-slate-100 border border-slate-300/70 dark:border-slate-700/70 backdrop-blur-md font-bold text-xs rounded-full shadow-2xs hover:scale-105 active:scale-95 transition-all items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              title="Hospital Director, Doctor & Receptionist Login"
            >
              <span>Log In</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-slate-200/60 dark:border-slate-800/60 mt-3 space-y-2.5 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl rounded-2xl p-3 border shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-xs font-bold ${
                  location.pathname === item.href
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Hospital Roles */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
                Live Hospital Roles (Separate Links)
              </span>
              <div className="space-y-1">
                {hospitalRoles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <Link
                      key={role.to}
                      to={role.to}
                      target="_blank"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-blue-500" />
                        <span>{role.title}</span>
                      </div>
                      <span className="text-[10px] text-blue-600 font-bold bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        {role.badge}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Currency Picker in Drawer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Select Currency:</span>
              </span>
              <select
                aria-label="Mobile Currency"
                value={currentCurrencyCode}
                onChange={(e) => {
                  handleCurrencySelect(e.target.value);
                  setMobileMenuOpen(false);
                }}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold px-2 py-1 rounded-lg focus:outline-none text-xs"
              >
                {Object.values(WORLDWIDE_CURRENCIES).map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {curr.code} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full text-center py-2 px-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
              </button>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                Hospital Staff Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-sm"
              >
                Activate Hospital OS ➔
              </Link>
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

