import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { PatientCheckIn } from './pages/PatientCheckIn';
import { PatientStatus } from './pages/PatientStatus';
import { ReceptionDashboard } from './pages/ReceptionDashboard';
import { DoctorView } from './pages/DoctorView';
import { DisplayKiosk } from './pages/DisplayKiosk';
import { ClinicAdmin } from './pages/ClinicAdmin';
import { PatientPortal } from './pages/PatientPortal';
import { FounderDashboard } from './pages/FounderDashboard';
import { QueuelessWebsite } from './pages/QueuelessWebsite';
import { FeaturesPage } from './pages/FeaturesPage';
import { PricingPage } from './pages/PricingPage';
import { RoiCalculatorPage } from './pages/RoiCalculatorPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { HospitalLogin } from './pages/HospitalLogin';
import { HospitalOnboarding } from './pages/HospitalOnboarding';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { SecurityPolicy } from './pages/SecurityPolicy';
import { RefundPolicy } from './pages/RefundPolicy';
import { API_BASE_URL } from './config/api';
import { PrescriptionView } from './pages/PrescriptionView';
import { ScrollToTop } from './components/ScrollToTop';
import {
  Users,
  Stethoscope,
  Tv,
  QrCode,
  Smartphone,
  ShieldCheck,
  Activity,
  Layers,
  User,
  Search,
  X,
  ArrowRight,
  Ticket,
  AlertCircle,
  Zap,
} from 'lucide-react';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [trackError, setTrackError] = useState<string | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  // Hide standard navbar on patient-facing flows, TV kiosk displays, doctor consoles, reception desks, and admin panels
  if (
    location.pathname === '/' ||
    location.pathname === '/display' ||
    location.pathname.startsWith('/display') ||
    location.pathname === '/check-in' ||
    location.pathname.startsWith('/check-in') ||
    location.pathname.startsWith('/token') ||
    location.pathname.startsWith('/status') ||
    location.pathname === '/doctor' ||
    location.pathname.startsWith('/doctor') ||
    location.pathname === '/reception' ||
    location.pathname.startsWith('/reception') ||
    location.pathname === '/admin' ||
    location.pathname.startsWith('/admin') ||
    location.pathname === '/hospital-admin' ||
    location.pathname.startsWith('/hospital-admin') ||
    location.pathname === '/queueless-admin' ||
    location.pathname.startsWith('/queueless-admin') ||
    location.pathname === '/super-admin' ||
    location.pathname === '/platform-admin' ||
    location.pathname === '/business' ||
    location.pathname === '/founder' ||
    location.pathname === '/hq' ||
    location.pathname === '/owner' ||
    location.pathname === '/features' ||
    location.pathname === '/pricing' ||
    location.pathname === '/roi-calculator' ||
    location.pathname === '/about' ||
    location.pathname === '/blog' ||
    location.pathname.startsWith('/blog') ||
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/get-started' ||
    location.pathname === '/buy' ||
    location.pathname === '/privacy' ||
    location.pathname === '/privacy-policy' ||
    location.pathname === '/terms' ||
    location.pathname === '/terms-of-service' ||
    location.pathname === '/security' ||
    location.pathname === '/compliance' ||
    location.pathname === '/refund-policy' ||
    location.pathname === '/cancellation' ||
    location.pathname === '/website' ||
    location.pathname === '/landing' ||
    location.pathname === '/commercial' ||
    location.pathname === '/demo' ||
    location.pathname.startsWith('/prescription') ||
    location.pathname.startsWith('/rx')
  ) {
    return null;
  }

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setTrackError('Please enter your Assigned Token ID');
      return;
    }
    if (!nameInput.trim()) {
      setTrackError('Please enter Patient Name for identity verification');
      return;
    }

    setTrackingLoading(true);
    setTrackError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/queue/track-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tokenInput.trim(),
          patientName: nameInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.publicToken) {
        setShowSearchModal(false);
        setTokenInput('');
        setNameInput('');
        navigate(`/token/${data.publicToken}`);
      } else {
        setTrackError(data.error || 'Verification failed. Patient name does not match this token.');
      }
    } catch (err) {
      setTrackError('Could not connect to clinic server');
    } finally {
      setTrackingLoading(false);
    }
  };

  const links = [
    { to: '/check-in/city-health', label: 'Patient QR', icon: Smartphone },
    { to: '/portal', label: 'Passes', icon: User },
    { to: '/reception', label: 'Reception', icon: Users },
    { to: '/doctor', label: 'Doctor OPD', icon: Stethoscope },
    { to: '/display', label: 'TV Kiosk', icon: Tv },
  ];

  const isQueuelessAdmin =
    location.pathname === '/queueless-admin' ||
    location.pathname === '/super-admin' ||
    location.pathname === '/platform-admin' ||
    location.pathname === '/business' ||
    location.pathname === '/founder' ||
    location.pathname === '/hq';

  const isHospitalAdmin = location.pathname === '/admin';

  return (
    <>
      <header className="sticky top-0 z-40 glass-panel border-b border-slate-200/80 dark:border-slate-800 dark:bg-slate-900/90 print:hidden transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Queueless"
                className="h-9 w-9 rounded-full shadow-md border border-slate-200 dark:border-slate-700 object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  Queueless
                </span>
                <span className="text-[10px] bg-sky-100/80 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 font-bold px-1.5 py-0.2 rounded-md uppercase tracking-wider border border-sky-200/60 dark:border-sky-800/60">
                  PRO
                </span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block -mt-0.5 tracking-wider uppercase">
                Clinic Queue OS
              </span>
            </div>
          </Link>

          {/* Minimal, Clean Public Nav Bar */}
          <div className="flex items-center gap-2">
            {/* Quick Track Token Button */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-800 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800 rounded-xl text-xs font-bold transition-all shadow-xs"
              title="Track Token ID e.g. A-108"
            >
              <Search className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>Track Token</span>
            </button>

            {/* Back to Home / Commercial SaaS */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white shadow-xs border border-transparent dark:border-slate-700"
            >
              <span>Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Track Token Modal */}
      {showSearchModal && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSearchModal(false);
          }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative my-auto animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setShowSearchModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 rounded-xl border border-sky-200/60 dark:border-sky-800/60">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Track OPD Token</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Live queue position, wait time, and cabin status</p>
              </div>
            </div>

            {trackError && (
              <div className="my-3 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{trackError}</span>
              </div>
            )}

            <form onSubmit={handleTrackSubmit} className="mt-3 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Token ID
                </label>
                <div className="relative">
                  <Ticket className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    autoFocus
                    required
                    placeholder="e.g. A-118, 118"
                    value={tokenInput}
                    onChange={(e) => {
                      setTokenInput(e.target.value);
                      setTrackError(null);
                    }}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-black text-slate-900 dark:text-white uppercase placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Patient Name (Security Verification)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karan Mehra"
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      setTrackError(null);
                    }}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  🔒 Required so other people cannot view your private health information.
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSearchModal(false);
                    navigate('/portal');
                  }}
                  className="text-xs text-sky-700 dark:text-sky-400 hover:underline font-bold cursor-pointer"
                >
                  Patient Login & History ➔
                </button>

                <button
                  type="submit"
                  disabled={trackingLoading || !tokenInput.trim() || !nameInput.trim()}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{trackingLoading ? 'Verifying...' : 'Track Live'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-200">
        <Navigation />
        <main className="flex-1">
          <Routes>
            {/* 1. Official Commercial B2B SaaS Modular Routes */}
            <Route path="/" element={<QueuelessWebsite />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/roi-calculator" element={<RoiCalculatorPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<HospitalLogin />} />
            <Route path="/signup" element={<HospitalOnboarding />} />
            <Route path="/get-started" element={<HospitalOnboarding />} />
            <Route path="/buy" element={<HospitalOnboarding />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/security" element={<SecurityPolicy />} />
            <Route path="/compliance" element={<SecurityPolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/cancellation" element={<RefundPolicy />} />
            <Route path="/website" element={<QueuelessWebsite />} />
            <Route path="/landing" element={<QueuelessWebsite />} />
            <Route path="/commercial" element={<QueuelessWebsite />} />
            <Route path="/demo" element={<QueuelessWebsite />} />

            {/* 2. Hospital Dedicated Link Setup Packages (HIPAA & ABDM notranslate Shielded) */}
            <Route path="/check-in" element={<Navigate to="/check-in/city-health" replace />} />
            <Route path="/check-in/:slug" element={<div className="notranslate" translate="no"><PatientCheckIn /></div>} />
            <Route path="/checkin" element={<Navigate to="/check-in/city-health" replace />} />
            <Route path="/checkin/:slug" element={<div className="notranslate" translate="no"><PatientCheckIn /></div>} />
            <Route path="/reception" element={<Navigate to="/reception/city-health" replace />} />
            <Route path="/reception/:slug" element={<div className="notranslate" translate="no"><ReceptionDashboard /></div>} />
            <Route path="/doctor" element={<Navigate to="/doctor/city-health" replace />} />
            <Route path="/doctor/:slug" element={<div className="notranslate" translate="no"><DoctorView /></div>} />
            <Route path="/doctor/:slug/:doctorId" element={<div className="notranslate" translate="no"><DoctorView /></div>} />
            <Route path="/doctor/:slug/cabin/:doctorId" element={<div className="notranslate" translate="no"><DoctorView /></div>} />
            <Route path="/display" element={<Navigate to="/display/city-health" replace />} />
            <Route path="/display/:clinicId" element={<DisplayKiosk />} />
            <Route path="/admin" element={<Navigate to="/admin/caremax-opd" replace />} />
            <Route path="/admin/:slug" element={<div className="notranslate" translate="no"><ClinicAdmin /></div>} />
            <Route path="/hospital-admin" element={<Navigate to="/admin/caremax-opd" replace />} />
            <Route path="/hospital-admin/:slug" element={<div className="notranslate" translate="no"><ClinicAdmin /></div>} />
            <Route path="/founder" element={<FounderDashboard />} />
            <Route path="/owner" element={<FounderDashboard />} />

            {/* 3. Patient Tracking & History (Protected Health Information - notranslate) */}
            <Route path="/portal" element={<div className="notranslate" translate="no"><PatientPortal /></div>} />
            <Route path="/track" element={<div className="notranslate" translate="no"><PatientPortal /></div>} />
            <Route path="/patient-portal" element={<div className="notranslate" translate="no"><PatientPortal /></div>} />
            <Route path="/token/:publicToken" element={<div className="notranslate" translate="no"><PatientStatus /></div>} />
            <Route path="/status/:publicToken" element={<div className="notranslate" translate="no"><PatientStatus /></div>} />
            <Route path="/prescription/:publicToken" element={<div className="notranslate" translate="no"><PrescriptionView /></div>} />
            <Route path="/rx/:publicToken" element={<div className="notranslate" translate="no"><PrescriptionView /></div>} />

            {/* 4. Queueless Master SuperAdmin & Hospital Onboarding Console */}
            <Route path="/queueless-admin" element={<FounderDashboard />} />
            <Route path="/super-admin" element={<FounderDashboard />} />
            <Route path="/platform-admin" element={<FounderDashboard />} />
            <Route path="/business" element={<FounderDashboard />} />
            <Route path="/founder" element={<FounderDashboard />} />
            <Route path="/hq" element={<FounderDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
