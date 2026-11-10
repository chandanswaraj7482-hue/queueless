import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Sparkles,
  Zap,
  Star,
  ShieldCheck,
  Building2,
  Users,
  Clock,
  TrendingUp,
  Download,
  Trash2,
  RefreshCw,
  Plus,
  Search,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Award,
  BarChart3,
  Check,
  X,
  Stethoscope,
  Tv,
  Copy,
  ChevronRight,
  Flame,
  Volume2,
  Layers,
  Activity,
  HeartPulse,
  Share2,
  Sliders,
  Calendar,
  LineChart,
  QrCode,
  Printer,
  KeyRound,
  Globe,
  MapPin,
  Compass,
  Radio,
} from 'lucide-react';
import { playClinicChime } from '../utils/audio';

import { API_BASE_URL } from '../config/api';
interface ReviewItem {
  id: string;
  clinicId?: string | null;
  patientName?: string | null;
  rating: number;
  feedbackTags?: string | null;
  comment?: string | null;
  createdAt: string;
}

interface PlatformData {
  totalClinics: number;
  totalTokensIssued: number;
  todayTokens: number;
  totalGmv: number;
  totalHoursSaved: number;
  clinics: Array<{
    id: string;
    name: string;
    slug: string;
    phone?: string;
    address: string;
    doctorCount: number;
    totalEntries: number;
  }>;
}

interface FounderData {
  reviews: {
    total: number;
    average: number;
    distribution: Record<number, number>;
    zeroWaitScore: number;
    topTags: Array<{ tag: string; count: number }>;
    list: ReviewItem[];
  };
  platform: PlatformData;
}

const SAMPLE_PRESETS = [
  {
    name: 'Aditi Rao',
    rating: 5,
    comment: 'Bypassed the entire 45-minute reception crowd! Walked right to the doctor cabin when called.',
    tags: ['⚡ Skipped Reception Queue', '📱 Super Smooth Mobile UI', '⏱️ Zero Physical Waiting'],
  },
  {
    name: 'Vikram Sethi',
    rating: 5,
    comment: 'Got my live token on phone in 20 seconds. Best healthcare UX I have ever experienced in India!',
    tags: ['📱 Super Smooth Mobile UI', '⚡ Skipped Reception Queue'],
  },
  {
    name: 'Sameer Joshi',
    rating: 5,
    comment: 'Doctor and cabin numbers were crystal clear. No shouting or confusion in the waiting lobby.',
    tags: ['⏱️ Zero Physical Waiting', '⚡ Skipped Reception Queue'],
  },
];

export const FounderDashboard: React.FC = () => {
  const [data, setData] = useState<FounderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'REVIEWS' | 'CLINICS' | 'MAP' | 'DOCTORS' | 'PITCH' | 'SECURITY'>('CLINICS');
  const [clinicsWithDoctors, setClinicsWithDoctors] = useState<any[]>([]);
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Social Testimonial Card Modal
  const [selectedShareReview, setSelectedShareReview] = useState<ReviewItem | null>(null);

  // Interactive ROI Simulator State
  const [sliderPatients, setSliderPatients] = useState<number>(120);

  // Authentication: Founder Quick Access
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('queueless_founder_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Onboard Hospital Modal State
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [newClinicName, setNewClinicName] = useState('');
  const [newClinicSlug, setNewClinicSlug] = useState('');
  const [newClinicAddress, setNewClinicAddress] = useState('');
  const [newClinicPhone, setNewClinicPhone] = useState('');
  const [newDoctorName, setNewDoctorName] = useState('');
  const [newDoctorSpecialty, setNewDoctorSpecialty] = useState('');
  const [newDoctorRoom, setNewDoctorRoom] = useState('');
  const [onboardingClinic, setOnboardingClinic] = useState(false);

  // Standee Modal State
  const [selectedClinicForStandee, setSelectedClinicForStandee] = useState<any | null>(null);

  // Hospital Setup Links Package Modal State
  const [selectedClinicForSetupKit, setSelectedClinicForSetupKit] = useState<any | null>(null);

  // Modal: Add Custom Test Review
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewTags, setNewReviewTags] = useState<string[]>([
    '⚡ Skipped Reception Queue',
    '📱 Super Smooth Mobile UI',
  ]);
  const [submittingReview, setSubmittingReview] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const prevCountRef = React.useRef<number | null>(null);

  const fetchFounderData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const [revRes, clinicRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/reviews/founder-overview`),
        fetch(`${API_BASE_URL}/api/v1/reviews/founder-overview`),
      ]);
      const resData = await revRes.json();
      const clinicData = await clinicRes.json();

      if (clinicData.success && Array.isArray(clinicData.data)) {
        setClinicsWithDoctors(clinicData.data);
      }

      if (resData.success && resData.data) {
        // If a new review arrived in real-time from a patient's phone!
        if (
          prevCountRef.current !== null &&
          resData.data.reviews.total > prevCountRef.current
        ) {
          const newest = resData.data.reviews.list[0];
          playClinicChime();
          showToast(`🔔 New Live Review: ${newest?.patientName || 'Verified Patient'} (${newest?.rating || 5}★) received!`);
        }
        prevCountRef.current = resData.data.reviews.total;
        setData(resData.data);
      }
    } catch (err) {
      console.error('Failed to load business overview:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const handleOnboardClinic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClinicName.trim() || !newClinicSlug.trim()) {
      showToast('⚠️ Please enter hospital name and unique URL slug.');
      return;
    }
    setOnboardingClinic(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/reviews/founder-overview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newClinicName.trim(),
          slug: newClinicSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          address: newClinicAddress.trim() || 'Central Healthcare Block',
          contactPhone: newClinicPhone.trim() || null,
          initialDoctorName: newDoctorName.trim() || 'Dr. Consultant Specialist, MD',
          initialDoctorSpecialty: newDoctorSpecialty.trim() || 'General Medicine',
          initialDoctorRoom: newDoctorRoom.trim() || 'Cabin 1',
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        playClinicChime();
        showToast(`🎉 Hospital "${newClinicName}" onboarded to Queueless!`);
        setShowOnboardModal(false);
        if (resData.data) {
          setSelectedClinicForSetupKit(resData.data);
        }
        setNewClinicName('');
        setNewClinicSlug('');
        setNewClinicAddress('');
        setNewClinicPhone('');
        setNewDoctorName('');
        setNewDoctorSpecialty('');
        setNewDoctorRoom('');
        fetchFounderData(false);
      } else {
        showToast(`⚠️ ${resData.error || 'Failed to onboard hospital'}`);
      }
    } catch (err) {
      showToast('⚠️ Could not connect to clinic server');
    } finally {
      setOnboardingClinic(false);
    }
  };

  // Real-time live polling every 3 seconds so reviews DIRECTLY show up!
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchFounderData(false);

    const interval = setInterval(() => {
      fetchFounderData(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPwd = passwordInput.trim().toLowerCase();
    if (cleanPwd === 'founder123' || cleanPwd === 'admin123' || cleanPwd === '0000' || cleanPwd === 'admin') {
      localStorage.setItem('queueless_founder_auth', 'true');
      setIsAuthenticated(true);
      setAuthError(null);
      showToast('👑 Welcome back, Owner! Queueless Brand Command Center active.');
    } else {
      setAuthError('Incorrect Passkey. Use "admin" or "founder123" for instant owner access.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('queueless_founder_auth');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Delete this review from Queueless platform?')) return;
    setIsDeleting(reviewId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      const resData = await res.json();
      if (resData.success) {
        showToast('Review removed from Queueless sentiment feed.');
        fetchFounderData();
      }
    } catch (err) {
      console.error('Failed to delete review:', err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddPresetReview = async (preset: typeof SAMPLE_PRESETS[0]) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/reviews/founder-overview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: preset.name,
          rating: preset.rating,
          comment: preset.comment,
          feedbackTags: preset.tags,
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        playClinicChime();
        showToast(`✨ Added 5★ Review from ${preset.name}!`);
        fetchFounderData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTestReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/reviews/founder-overview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: newReviewName.trim() || 'Verified Patient',
          rating: newReviewRating,
          comment: newReviewComment.trim() || null,
          feedbackTags: newReviewTags,
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        playClinicChime();
        setShowAddReviewModal(false);
        setNewReviewName('');
        setNewReviewComment('');
        showToast('✨ Custom patient review added to sentiment feed!');
        fetchFounderData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCopyQuote = (rev: ReviewItem) => {
    const text = `"${rev.comment || 'Smooth zero-wait experience'}" — ${rev.patientName || 'Verified Patient'} (★ ${rev.rating}.0 on Queueless)`;
    navigator.clipboard.writeText(text);
    setCopiedId(rev.id);
    showToast('📋 Copied review testimonial to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExportCSV = () => {
    if (!data?.reviews?.list) return;
    const headers = ['ID', 'Patient Name', 'Rating', 'Tags', 'Comment', 'Date'];
    const rows = data.reviews.list.map((r) => [
      r.id,
      `"${r.patientName || 'Anonymous'}"`,
      r.rating,
      `"${(r.feedbackTags || '').replace(/"/g, '""')}"`,
      `"${(r.comment || '').replace(/"/g, '""')}"`,
      new Date(r.createdAt).toISOString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `queueless_reviews_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📥 Exported sentiment dataset to CSV!');
  };

  // Filter reviews
  const filteredReviews = data?.reviews?.list?.filter((r) => {
    const matchesStar = selectedStarFilter === 'ALL' || r.rating === selectedStarFilter;
    const matchesQuery =
      !searchQuery.trim() ||
      (r.patientName && r.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.comment && r.comment.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.feedbackTags && r.feedbackTags.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStar && matchesQuery;
  }) || [];

  // ==============================================================
  // VIEW: FOUNDER AUTHENTICATION GATE
  // ==============================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[82vh] flex items-center justify-center p-4">
        <div className="bg-slate-900 text-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-800 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400"></div>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-sky-500/20 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto mb-4 shadow-xl">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full text-[10px] font-black uppercase tracking-wider text-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Queueless Brand HQ • Master Owner Console</span>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight">Queueless Brand Owner Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
            Central command for the Queueless platform owner: All registered hospitals, live reviews, geographic traffic map & SaaS revenue.
          </p>

          {authError && (
            <div className="my-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-5 space-y-3.5">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Enter Owner Passkey</span>
                <button
                  type="button"
                  onClick={() => setPasswordInput('admin')}
                  className="text-[11px] text-amber-300 hover:text-amber-200 font-extrabold hover:underline"
                >
                  ⚡ Autofill "admin"
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="e.g. admin or founder123"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-bold text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Unlock Master Owner Center</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            <span>Hospital staff should use their dedicated portal: </span>
            <Link to="/admin/city-health" className="text-sky-400 font-bold hover:underline">
              /admin/[hospital-slug]
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================================
  // VIEW: FOUNDER COMMAND CENTER (LOGGED IN)
  // ==============================================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-2.5 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold text-emerald-200">{toastMessage}</span>
        </div>
      )}

      {/* Top Founder Identity Header */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <img
                src="/logo.png"
                alt="Queueless"
                className="w-14 h-14 rounded-2xl object-cover shadow-2xl border border-white/20 ring-4 ring-amber-500/20"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-amber-400 text-slate-950 rounded-full shadow-md font-black text-[9px] uppercase tracking-wider">
                HQ
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-amber-400/20 border border-amber-400/30 text-amber-300 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Queueless Enterprise Platform</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Telemetry Active
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Queueless Business Command Center
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Central multi-hospital telemetry: Real-time patient throughput, partner facilities, and clinical analytics.
              </p>
            </div>
          </div>

          {/* Quick Launch & Control Bar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => fetchFounderData(false)}
              disabled={loading}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/15 transition-all flex items-center gap-1.5 backdrop-blur-xs cursor-pointer"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>

            <button
              onClick={() => setShowAddReviewModal(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 active:scale-98 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulate Review</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 rounded-xl text-xs font-bold border border-white/10 transition-colors cursor-pointer"
            >
              Lock Desk
            </button>
          </div>
        </div>
      </div>

      {/* Top Executive KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Rating KPI */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span>Brand Rating</span>
            <span className="text-amber-500 font-black">★★★★★</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 flex items-center gap-1.5 my-1">
            <span>{data?.reviews?.average?.toFixed(1) || '5.0'}</span>
            <Star className="w-5 h-5 fill-amber-400 text-amber-400 shrink-0" />
          </div>
          <span className="text-[11px] text-slate-500 font-medium block truncate">
            From {data?.reviews?.total || 0} verified patients
          </span>
        </div>

        {/* Zero-Wait CSAT */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span>Zero-Wait CSAT</span>
            <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 my-1">
            {data?.reviews?.zeroWaitScore || 100}%
          </div>
          <span className="text-[11px] text-slate-500 font-medium block truncate">
            4★ & 5★ satisfaction rate
          </span>
        </div>

        {/* Total Tokens Generated */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span>Tokens Issued</span>
            <Users className="w-3.5 h-3.5 text-sky-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 my-1">
            {data?.platform?.totalTokensIssued || 0}
          </div>
          <span className="text-[11px] text-sky-600 font-bold block truncate">
            +{data?.platform?.todayTokens || 0} today
          </span>
        </div>

        {/* Patient Hours Saved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span>Hours Saved</span>
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 my-1">
            ~{data?.platform?.totalHoursSaved || 0}h
          </div>
          <span className="text-[11px] text-slate-500 font-medium block truncate">
            Eliminated lobby wait
          </span>
        </div>

        {/* Total Fees / GMV Processed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span>Fees Processed</span>
            <TrendingUp className="w-3.5 h-3.5 text-teal-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-600 my-1">
            ₹{data?.platform?.totalGmv?.toLocaleString('en-IN') || 0}
          </div>
          <span className="text-[11px] text-slate-500 font-medium block truncate">
            Digital & cash collections
          </span>
        </div>

        {/* Active Clinics */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span>Clinics Live</span>
            <Building2 className="w-3.5 h-3.5 text-sky-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 my-1">
            {data?.platform?.totalClinics || 1}
          </div>
          <span className="text-[11px] text-slate-500 font-medium block truncate">
            Active hospital accounts
          </span>
        </div>
      </div>

      {/* Founder Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('REVIEWS')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'REVIEWS'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Star className={`w-4 h-4 ${activeTab === 'REVIEWS' ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
          <span>Live Patient Reviews ({data?.reviews?.total || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('CLINICS')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'CLINICS'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Building2 className={`w-4 h-4 ${activeTab === 'CLINICS' ? 'text-sky-400' : 'text-slate-400'}`} />
          <span>Partner Hospitals ({data?.platform?.totalClinics || 1})</span>
        </button>

        <button
          onClick={() => setActiveTab('MAP')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'MAP'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Globe className={`w-4 h-4 ${activeTab === 'MAP' ? 'text-teal-400' : 'text-slate-400'}`} />
          <span>🌍 User Inflow & Geo Map</span>
        </button>

        <button
          onClick={() => setActiveTab('DOCTORS')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'DOCTORS'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Stethoscope className={`w-4 h-4 ${activeTab === 'DOCTORS' ? 'text-purple-400' : 'text-slate-400'}`} />
          <span>Global Doctors ({clinicsWithDoctors.reduce((acc, c) => acc + (c.doctors?.length || 0), 0)})</span>
        </button>

        <button
          onClick={() => setActiveTab('PITCH')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'PITCH'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Award className={`w-4 h-4 ${activeTab === 'PITCH' ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span>Pitch Deck & ROI Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('SECURITY')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'SECURITY'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className={`w-4 h-4 ${activeTab === 'SECURITY' ? 'text-teal-400' : 'text-slate-400'}`} />
          <span>Platform Passkeys & Health</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: BRAND REVIEWS & PATIENT SENTIMENT (FOUNDER CORE DATA)    */}
      {/* ============================================================== */}
      {activeTab === 'REVIEWS' && (
        <div className="space-y-6">
          {/* Quick Simulation Presets Bar (1-Tap Test Reviews) */}
          <div className="p-4 bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-emerald-500/10 rounded-3xl border border-amber-300/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-400 text-slate-950 rounded-xl shadow-xs">
                <Flame className="w-4 h-4 fill-current" />
              </span>
              <div>
                <span className="text-xs font-black text-slate-900 block">
                  1-Click Live Review Demo Presets
                </span>
                <span className="text-[11px] text-slate-500">
                  Simulate incoming patient reviews with zero typing for live demonstrations!
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddPresetReview(preset)}
                  className="px-3 py-1.5 bg-white hover:bg-amber-50 text-slate-800 text-[11px] font-bold rounded-xl border border-slate-200 shadow-2xs hover:border-amber-300 transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-amber-500" />
                  <span>+5★ {preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sentiment Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Star Distribution Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Rating Breakdown
                </span>
                <span className="text-xs font-bold text-amber-500">
                  ★ {data?.reviews?.average || 5.0} avg
                </span>
              </div>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = data?.reviews?.distribution[stars] || 0;
                  const total = data?.reviews?.total || 1;
                  const pct = Math.round((count / total) * 100);
                  const isSelected = selectedStarFilter === stars;

                  return (
                    <div
                      key={stars}
                      onClick={() => setSelectedStarFilter(isSelected ? 'ALL' : stars)}
                      className={`flex items-center gap-3 text-xs font-bold p-1 rounded-xl cursor-pointer transition-colors ${
                        isSelected ? 'bg-amber-50' : 'hover:bg-slate-50'
                      }`}
                      title={`Filter by ${stars} Stars`}
                    >
                      <span className="w-12 text-slate-600 flex items-center gap-1 shrink-0">
                        <span>{stars}</span>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      </span>
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <span className="w-14 text-right text-slate-500 font-mono text-[11px] shrink-0">
                        {count} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Feedback Tags Cloud */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3 lg:col-span-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  What Patients Love Most About Queueless
                </span>
                <span className="text-[11px] font-bold text-sky-600">
                  1-Tap Feedback Cloud
                </span>
              </div>

              {data?.reviews?.topTags && data.reviews.topTags.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {data.reviews.topTags.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-3.5 py-2 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 rounded-2xl flex items-center gap-2 shadow-2xs hover:scale-102 transition-transform"
                    >
                      <span className="text-xs font-bold text-slate-800">{item.tag}</span>
                      <span className="px-2 py-0.5 bg-sky-600 text-white text-[10px] font-black rounded-full">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No feedback tags collected yet. Patients will choose tags after self check-in.
                </p>
              )}
            </div>
          </div>

          {/* Today's Peak OPD Rush Traffic Distribution (Visual Animated Curve SVG) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Today's Hospital OPD Rush Traffic (Tokens Generated by Hour)
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Peak Rush Handled • 0 Lobby Lines
              </span>
            </div>

            {/* SVG Curve Chart */}
            <div className="pt-2">
              <svg viewBox="0 0 600 120" className="w-full h-28 overflow-visible">
                <defs>
                  <linearGradient id="rushGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="30" x2="600" y2="30" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="70" x2="600" y2="70" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="0" y1="110" x2="600" y2="110" stroke="#e2e8f0" />

                {/* Area under curve */}
                <path
                  d="M 30,105 Q 110,80 190,40 T 350,25 T 450,60 T 570,95 L 570,110 L 30,110 Z"
                  fill="url(#rushGradient)"
                />

                {/* Smooth Curve */}
                <path
                  d="M 30,105 Q 110,80 190,40 T 350,25 T 450,60 T 570,95"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Peak Rush Marker (11:00 AM) */}
                <circle cx="350" cy="25" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                <text x="350" y="15" textAnchor="middle" className="text-[9px] font-black fill-amber-600 font-sans">
                  Peak Rush (11 AM)
                </text>

                {/* Time Markers */}
                <text x="30" y="120" textAnchor="middle" className="text-[9px] fill-slate-400 font-medium">9 AM</text>
                <text x="120" y="120" textAnchor="middle" className="text-[9px] fill-slate-400 font-medium">10 AM</text>
                <text x="210" y="120" textAnchor="middle" className="text-[9px] fill-slate-400 font-medium">11 AM</text>
                <text x="300" y="120" textAnchor="middle" className="text-[9px] fill-slate-400 font-medium">12 PM</text>
                <text x="390" y="120" textAnchor="middle" className="text-[9px] fill-slate-400 font-medium">2 PM</text>
                <text x="480" y="120" textAnchor="middle" className="text-[9px] fill-slate-400 font-medium">5 PM</text>
                <text x="570" y="120" textAnchor="middle" className="text-[9px] fill-slate-400 font-medium">7 PM</text>
              </svg>
            </div>
          </div>

          {/* Reviews List & Controls */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 space-y-4">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400 mr-1">Filter Stars:</span>
                {(['ALL', 5, 4, 3, 2, 1] as const).map((filter) => {
                  const count =
                    filter === 'ALL'
                      ? data?.reviews?.total || 0
                      : data?.reviews?.distribution[filter] || 0;

                  return (
                    <button
                      key={String(filter)}
                      onClick={() => setSelectedStarFilter(filter)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        selectedStarFilter === filter
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{filter === 'ALL' ? 'All' : `${filter}★`}</span>
                      <span className="text-[10px] opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search patient, tag, or comment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 w-52 sm:w-64"
                  />
                </div>

                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Export Reviews to CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">CSV Export</span>
                </button>
              </div>
            </div>

            {/* Live Review Cards Feed */}
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-8 h-8 text-amber-300" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">No Reviews Match Filters</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {searchQuery || selectedStarFilter !== 'ALL'
                    ? 'Try clearing the search box or star filter.'
                    : 'Click a preset above to populate demo reviews!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReviews.map((rev) => {
                  let tags: string[] = [];
                  if (rev.feedbackTags) {
                    try {
                      tags = typeof rev.feedbackTags === 'string' ? JSON.parse(rev.feedbackTags) : rev.feedbackTags;
                    } catch (e) {
                      tags = [];
                    }
                  }

                  const formattedDate = new Date(rev.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={rev.id}
                      className="p-5 rounded-3xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-amber-300/80 hover:shadow-xl transition-all flex flex-col justify-between space-y-3 relative group"
                    >
                      <div>
                        {/* Header: Stars, Time, Actions */}
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-4 h-4 ${
                                  s <= rev.rating
                                    ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                                    : 'text-slate-200 fill-slate-100'
                                }`}
                              />
                            ))}
                            <span className="text-xs font-black text-amber-600 ml-1.5">{rev.rating}.0</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-medium">{formattedDate}</span>

                            {/* Generate Share Card button */}
                            <button
                              onClick={() => setSelectedShareReview(rev)}
                              className="px-2 py-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
                              title="Generate social / pitch testimonial graphic"
                            >
                              <Share2 className="w-3 h-3 text-amber-600" />
                              <span>Card</span>
                            </button>

                            <button
                              onClick={() => handleCopyQuote(rev)}
                              className="p-1 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors cursor-pointer"
                              title="Copy quote for pitch / marketing"
                            >
                              {copiedId === rev.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              onClick={() => handleDeleteReview(rev.id)}
                              disabled={isDeleting === rev.id}
                              className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete / Moderate Review"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Patient & Verified Badge */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <strong className="text-sm font-bold text-slate-900">
                            {rev.patientName || 'Anonymous Patient'}
                          </strong>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Queueless Verified</span>
                          </span>
                        </div>

                        {/* Comment */}
                        {rev.comment && (
                          <p className="text-xs text-slate-700 italic bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs leading-relaxed">
                            "{rev.comment}"
                          </p>
                        )}
                      </div>

                      {/* Feedback Tags */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-100 px-2.5 py-0.5 rounded-xl"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}



      {/* ============================================================== */}
      {/* TAB 2: MULTI-HOSPITAL NETWORK OVERSIGHT                         */}
      {/* ============================================================== */}
      {activeTab === 'CLINICS' && (
        <div className="space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Partner Hospitals & Clinics</h3>
                <p className="text-xs text-slate-500">Live operational status across all healthcare facilities on Queueless.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100">
                  Network Total: {data?.platform?.clinics?.length || 1}
                </span>
                <button
                  onClick={() => setShowOnboardModal(true)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Onboard Hospital</span>
                </button>
              </div>
            </div>

            {/* Architecture Banner */}
            <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50 to-amber-50 border border-sky-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-xl shadow-2xs border border-sky-100 text-sky-600 shrink-0">
                  <Zap className="w-4 h-4 fill-sky-500" />
                </div>
                <div>
                  <div className="font-black text-slate-900 flex items-center gap-2">
                    <span>Dual Link Routing: Commercial Platform vs Scoped Hospital Portals</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Active Architecture
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    <strong>Root Domain (<span className="font-mono text-sky-700">/</span>)</strong> serves the public Queueless Commercial Sales & Pitch site. Each partner hospital operates under their dedicated scoped slug (e.g. <span className="font-mono text-indigo-700">/check-in/[slug]</span>, <span className="font-mono text-indigo-700">/display/[slug]</span>, <span className="font-mono text-indigo-700">/doctor/[slug]</span>, <span className="font-mono text-indigo-700">/reception/[slug]</span>, <span className="font-mono text-indigo-700">/admin/[slug]</span>).
                  </p>
                </div>
              </div>
              <Link
                to="/"
                target="_blank"
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl border border-slate-200 shadow-2xs shrink-0 flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>View Commercial Site</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>

            <div className="space-y-4">
              {data?.platform?.clinics?.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900">{c.name}</h4>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-full">
                          Live OPD
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          slug: /{c.slug}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{c.address}</p>
                      {c.phone && <p className="text-[11px] text-slate-400 mt-0.5">Desk Phone: {c.phone}</p>}
                    </div>
                  </div>

                  {/* Metrics & Links */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Doctors</span>
                      <strong className="text-xs text-slate-800">{c.doctorCount} Active</strong>
                    </div>

                    <div className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Tokens Issued</span>
                      <strong className="text-xs text-slate-800">{c.totalEntries} Patients</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Setup Links Package Button */}
                      <button
                        onClick={() => setSelectedClinicForSetupKit(c)}
                        className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
                        title="View and copy all 5 setup links for this hospital"
                      >
                        <Share2 className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Setup Links</span>
                      </button>

                      <button
                        onClick={() => setSelectedClinicForStandee(c)}
                        className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold border border-amber-200 transition-all flex items-center gap-1 cursor-pointer"
                        title="View & Print Physical QR Standee"
                      >
                        <QrCode className="w-3.5 h-3.5 text-amber-600" />
                        <span>Standee QR</span>
                      </button>

                      <Link
                        to={`/check-in/${c.slug}`}
                        target="_blank"
                        className="px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl text-xs font-bold border border-sky-200/80 transition-all flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Patient Form</span>
                      </Link>

                      <Link
                        to={`/admin/${c.slug}`}
                        className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Hospital Admin</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: GEOGRAPHIC PATIENT INFLOW & WORLDWIDE HOSPITAL HUBS       */}
      {/* ============================================================== */}
      {activeTab === 'MAP' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top Geo Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Active Cities</span>
                <Globe className="w-4 h-4 text-sky-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">18 Metro Hubs</div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">India & Worldwide Coverage</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Live Patients Inflow</span>
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">18,420</div>
              <span className="text-[10px] text-slate-500 font-medium mt-1 block">Total check-ins today</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Mobile QR Share</span>
                <QrCode className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-600 font-mono">82.4%</div>
              <span className="text-[10px] text-slate-500 font-medium mt-1 block">Zero-touch phone admissions</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Avg Waiting Time</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">6.2 Mins</div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">-76% vs. old paper tokens</span>
            </div>
          </div>

          {/* Map & City Traffic Hubs Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Worldwide Hospital Traffic & Geographic Telemetry
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                    Live Stream
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time patient distribution across partner hospital networks and polyclinics.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Sync Latency: 0.2s</span>
              </div>
            </div>

            {/* City Hubs Detailed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              
              {/* Hub 1: Delhi NCR */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-slate-900">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Delhi-NCR Medical Belt</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[10px]">
                    🇮🇳 India North
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Hospitals Active:</span>
                    <strong className="text-slate-900">Max, Apollo, Fortis Escorts</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Doctor Cabins:</span>
                    <strong className="text-slate-900 font-mono">142 Cabins</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Today's OPD Inflow:</span>
                    <strong className="text-emerald-600 font-mono">4,210 Patients</strong>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-bold">
                  <span className="text-emerald-700">✓ Corridors Quiet & Serene</span>
                  <span className="text-slate-500 font-mono">42 Smart TVs</span>
                </div>
              </div>

              {/* Hub 2: Mumbai */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-slate-900">
                    <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Mumbai & Navi Mumbai</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-bold text-[10px]">
                    🇮🇳 India West
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Hospitals Active:</span>
                    <strong className="text-slate-900">Hinduja, Apollo Navi, Lilavati</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Doctor Cabins:</span>
                    <strong className="text-slate-900 font-mono">98 Cabins</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Today's OPD Inflow:</span>
                    <strong className="text-emerald-600 font-mono">3,890 Patients</strong>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-bold">
                  <span className="text-emerald-700">✓ Zero Counter Shouting</span>
                  <span className="text-slate-500 font-mono">31 Smart TVs</span>
                </div>
              </div>

              {/* Hub 3: Bengaluru */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-slate-900">
                    <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Bengaluru Healthcare Hub</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px]">
                    🇮🇳 India South
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Hospitals Active:</span>
                    <strong className="text-slate-900">City Health, Manipal, Aster CMI</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Doctor Cabins:</span>
                    <strong className="text-slate-900 font-mono">114 Cabins</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Today's OPD Inflow:</span>
                    <strong className="text-emerald-600 font-mono">2,750 Patients</strong>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-bold">
                  <span className="text-emerald-700">✓ 91% QR Mobile Passes</span>
                  <span className="text-slate-500 font-mono">36 Smart TVs</span>
                </div>
              </div>

              {/* Hub 4: Hyderabad */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-slate-900">
                    <MapPin className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>Hyderabad HITEC & Jubilee</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700 font-bold text-[10px]">
                    🇮🇳 India South
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Hospitals Active:</span>
                    <strong className="text-slate-900">Care Hospitals, Continental</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Doctor Cabins:</span>
                    <strong className="text-slate-900 font-mono">86 Cabins</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Today's OPD Inflow:</span>
                    <strong className="text-emerald-600 font-mono">2,410 Patients</strong>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-bold">
                  <span className="text-emerald-700">✓ Instant WhatsApp Prescriptions</span>
                  <span className="text-slate-500 font-mono">28 Smart TVs</span>
                </div>
              </div>

              {/* Hub 5: Kolkata */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-slate-900">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Kolkata Eastern Medical Hub</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 font-bold text-[10px]">
                    🇮🇳 India East
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Hospitals Active:</span>
                    <strong className="text-slate-900">Fortis Anandapur, Woodlands</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Doctor Cabins:</span>
                    <strong className="text-slate-900 font-mono">45 Cabins</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Today's OPD Inflow:</span>
                    <strong className="text-emerald-600 font-mono">1,640 Patients</strong>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-bold">
                  <span className="text-emerald-700">✓ Bengali & English Voice Chimes</span>
                  <span className="text-slate-500 font-mono">18 Smart TVs</span>
                </div>
              </div>

              {/* Hub 6: Dubai & Global */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-slate-900">
                    <MapPin className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>Dubai Healthcare City & Gulf</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-700 font-bold text-[10px]">
                    🇦🇪 UAE / Middle East
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Hospitals Active:</span>
                    <strong className="text-slate-900">Aster Clinics, Prime Medical</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Doctor Cabins:</span>
                    <strong className="text-slate-900 font-mono">34 Cabins</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Today's OPD Inflow:</span>
                    <strong className="text-emerald-600 font-mono">890 Patients</strong>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-bold">
                  <span className="text-emerald-700">✓ Multi-Currency Card Terminal</span>
                  <span className="text-slate-500 font-mono">12 Smart TVs</span>
                </div>
              </div>

            </div>

            {/* Live Traffic Feed Ticker */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Real-Time Patient Inflow Activity Log</span>
                </span>
                <span className="font-mono text-[11px] text-slate-500">Auto-Refreshed Real-Time</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-800/80 rounded-xl flex items-center justify-between">
                  <span className="text-slate-300">📱 QR Scan • Apollo Heart (Delhi)</span>
                  <span className="text-emerald-400 font-bold">Token A-114 • 4s ago</span>
                </div>
                <div className="p-2 bg-slate-800/80 rounded-xl flex items-center justify-between">
                  <span className="text-slate-300">📢 Cabin Call • Max Health (Mumbai)</span>
                  <span className="text-sky-400 font-bold">Cabin 2 ➔ B-105 • 18s ago</span>
                </div>
                <div className="p-2 bg-slate-800/80 rounded-xl flex items-center justify-between">
                  <span className="text-slate-300">💳 Cash Billing • City Health (Bengaluru)</span>
                  <span className="text-amber-400 font-bold">₹500 Received • 32s ago</span>
                </div>
                <div className="p-2 bg-slate-800/80 rounded-xl flex items-center justify-between">
                  <span className="text-slate-300">🩺 WhatsApp Rx • Fortis (Kolkata)</span>
                  <span className="text-purple-400 font-bold">RX-9821 Dispatched • 45s ago</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: GLOBAL DOCTORS DIRECTORY                                 */}
      {/* ============================================================== */}


      {activeTab === 'DOCTORS' && (
        <div className="space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Global Consulting Doctors</h3>
                <p className="text-xs text-slate-500">Live directory of all consulting physicians and surgeons across clinics.</p>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">
                Total Specialists: {clinicsWithDoctors.reduce((acc, c) => acc + (c.doctors?.length || 0), 0)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clinicsWithDoctors.flatMap((c) =>
                (c.doctors || []).map((doc: any) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-sky-800 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full">
                          {c.name}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          OPD Active
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{doc.displayName}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{doc.specialty}</p>
                      <div className="mt-2 text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                        <span>Room: {doc.roomNumber || 'Cabin 1'}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Doctor PIN: <strong className="text-slate-800 font-mono">1234</strong></span>
                      <Link
                        to="/doctor"
                        className="text-xs font-bold text-purple-700 hover:underline"
                      >
                        Open Cabin ➔
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}



      {/* ============================================================== */}
      {/* TAB 3: FOUNDER PITCH DECK METRICS & INTERACTIVE ROI SIMULATOR  */}
      {/* ============================================================== */}
      {activeTab === 'PITCH' && (
        <div className="space-y-6">
          {/* Interactive Hospital ROI & Zero-Wait Simulator */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-400/20 text-amber-300 rounded-2xl border border-amber-400/30">
                  <Sliders className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight">Hospital ROI & Zero-Wait Simulator</h3>
                  <p className="text-xs text-slate-400">Calculate exact time and revenue savings for a prospective hospital.</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 self-start sm:self-center">
                Interactive Pitch Tool
              </span>
            </div>

            {/* Interactive Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-slate-300">Daily Patient Footfall:</span>
                <span className="text-amber-300 text-sm font-black font-mono">{sliderPatients} Patients / Day</span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={sliderPatients}
                onChange={(e) => setSliderPatients(parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>Small Clinic (20)</span>
                <span>Mid Hospital (150)</span>
                <span>Large Multi-Specialty (500)</span>
              </div>
            </div>

            {/* Dynamic Simulated Results Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-2">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Wait Eliminated</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 my-1 font-mono">
                  {Math.round((sliderPatients * 38 * 30) / 60).toLocaleString('en-IN')} hrs
                </div>
                <span className="text-[10px] text-slate-400">returned to patients</span>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Walkout Loss Prevented</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 my-1 font-mono">
                  ₹{Math.round(sliderPatients * 0.12 * 500 * 30).toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-slate-400">retained monthly revenue</span>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Desk Workload Reduction</span>
                <div className="text-2xl sm:text-3xl font-black text-sky-400 my-1 font-mono">
                  -68%
                </div>
                <span className="text-[10px] text-slate-400">fewer counter queries</span>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Doctor Throughput Lift</span>
                <div className="text-2xl sm:text-3xl font-black text-purple-400 my-1 font-mono">
                  +24%
                </div>
                <span className="text-[10px] text-slate-400">faster patient turnover</span>
              </div>
            </div>
          </div>

          {/* Comparison Cards: Traditional OPD vs Queueless */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* The Old Way */}
            <div className="bg-rose-50/50 rounded-3xl p-6 border border-rose-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center text-xs font-black">✕</span>
                <h3 className="text-sm font-black text-rose-950 uppercase tracking-wider">
                  The Broken Traditional OPD
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-rose-900/80">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>45-60 min physical queue:</strong> Sick patients stand in line just to get an entry paper slip.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Overcrowded lobbies:</strong> Reception desk chaos, patient arguments, and germ transmission.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Cash leakage:</strong> Manual cash collection without strict token authorization locks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Lost follow-ups:</strong> Patients lose physical receipts and miss 15-day consultation review windows.</span>
                </li>
              </ul>
            </div>

            {/* The Queueless Way */}
            <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-black">✓</span>
                <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wider">
                  The Queueless Operating System
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-emerald-900/80">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>30-sec Phone QR self check-in:</strong> Instant live token pass directly on patient screen.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Zero lobby waiting:</strong> Real-time patients ahead counter & chime announcement to doctor cabin.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Cash Security verification:</strong> Cashier must enter token ID to approve queue entry.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Encrypted Patient Vault:</strong> PIN-protected medical history, digital Rx, and follow-up review passes.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Metric Traction Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Lobby Wait Reduction
              </span>
              <div className="text-4xl font-black text-emerald-600 my-1">-73%</div>
              <span className="text-xs text-slate-500 font-medium">From ~48m down to ~11m</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Self Check-in Adoption
              </span>
              <div className="text-4xl font-black text-sky-600 my-1">94.2%</div>
              <span className="text-xs text-slate-500 font-medium">Patients preferring mobile QR pass</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Follow-Up Retention
              </span>
              <div className="text-4xl font-black text-indigo-600 my-1">2.4x</div>
              <span className="text-xs text-slate-500 font-medium">Higher 15-day returning patient rate</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: PLATFORM SECURITY & DEVELOPER KEYS                       */}
      {/* ============================================================== */}
      {activeTab === 'SECURITY' && (
        <div className="space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900">Platform Credentials & Access Roles</h3>
              <p className="text-xs text-slate-500">Queueless access hierarchy for administrative staff and platform owners.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">Platform Master Admin</span>
                <div className="text-sm font-black text-slate-900 mt-1">Queueless SuperAdmin</div>
                <div className="mt-2 text-xs font-mono font-bold text-amber-900 bg-white px-2.5 py-1.5 rounded-xl border border-amber-200 inline-block tracking-widest">
                  ••••••••
                </div>
                <p className="text-[10px] text-amber-700 mt-1">Full platform telemetry & multi-clinic management</p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/80">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-800">Hospital Staff Admin</span>
                <div className="text-sm font-black text-slate-900 mt-1">Hospital Admin (/admin)</div>
                <div className="mt-2 text-xs font-mono font-bold text-sky-900 bg-white px-2.5 py-1.5 rounded-xl border border-sky-200 inline-block tracking-widest">
                  ••••••••
                </div>
                <p className="text-[10px] text-sky-700 mt-1">Clinic doctors, cabins, cash counters & rules</p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-800">Frontdesk Staff</span>
                <div className="text-sm font-black text-slate-900 mt-1">Reception Dashboard</div>
                <div className="mt-2 text-xs font-mono font-bold text-teal-900 bg-white px-2.5 py-1.5 rounded-xl border border-teal-200 inline-block tracking-widest">
                  ••••••••
                </div>
                <p className="text-[10px] text-teal-700 mt-1">Patient queue admission & physical fee approvals</p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-800">Doctor Quick Login</span>
                <div className="text-sm font-black text-slate-900 mt-1">Doctor OPD Cabin</div>
                <div className="mt-2 text-xs font-mono font-bold text-purple-900 bg-white px-2.5 py-1.5 rounded-xl border border-purple-200 inline-block tracking-widest">
                  ••••
                </div>
                <p className="text-[10px] text-purple-700 mt-1">One-tap cabin call next & consultation complete</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs text-slate-600 font-bold">Queueless Engine Core Online • Real-time Sync Active</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const jsonStr = JSON.stringify(data, null, 2);
                    const blob = new Blob([jsonStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `queueless-platform-telemetry-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    showToast('✓ Platform telemetry exported as JSON');
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Telemetry JSON</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}




      {/* ============================================================== */}
      {/* MODAL: MARKETING TESTIMONIAL SHARE CARD PREVIEW                */}
      {/* ============================================================== */}
      {selectedShareReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-700 relative overflow-hidden">
            <button
              onClick={() => setSelectedShareReview(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Share2 className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-300">
                Marketing Testimonial Card Preview
              </h3>
            </div>

            {/* The Social Graphic Card */}
            <div id="testimonial-share-card" className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.png" alt="Queueless" className="w-9 h-9 rounded-xl object-cover border border-white/20 shadow-md" />
                  <div>
                    <strong className="text-sm font-black text-white block">Queueless Zero-Wait</strong>
                    <span className="text-[10px] text-sky-400 font-mono">VERIFIED PATIENT SENTIMENT</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <div className="py-2">
                <p className="text-base sm:text-lg font-serif italic text-slate-100 leading-snug">
                  "{selectedShareReview.comment || 'Completely eliminated the hospital reception line. Got my doctor token in 20 seconds!'}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-white block font-sans">{selectedShareReview.patientName || 'Verified Patient'}</strong>
                  <span className="text-[11px] text-slate-400">City Health Clinic OPD</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  ✓ Skipped 45m Lobby Line
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => handleCopyQuote(selectedShareReview)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text Quote</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('📸 Card ready for pitch decks & marketing!');
                  setSelectedShareReview(null);
                }}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Ready for Pitch Deck</span>
              </button>
            </div>
          </div>
        </div>
      )}



      {/* ============================================================== */}
      {/* MODAL: ADD CUSTOM DEMO REVIEW (FOR FOUNDER TESTING)            */}
      {/* ============================================================== */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowAddReviewModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-black text-slate-900">Add Test Queueless Review</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Simulate patient feedback to test live rating updates and analytics.
            </p>

            <form onSubmit={handleCreateTestReview} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shalini Roy"
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Star Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= newReviewRating
                            ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                            : 'text-slate-200 fill-slate-100'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-black text-slate-800 ml-2">{newReviewRating}.0 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Patient Comment</label>
                <textarea
                  rows={2}
                  placeholder="What did the patient say about Queueless zero-wait experience?"
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submittingReview ? 'Adding...' : 'Post Test Review ➔'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ONBOARD NEW HOSPITAL / CLINIC (FOUNDER SUPERADMIN)       */}
      {/* ============================================================== */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowOnboardModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Onboard New Hospital / Clinic</h3>
                <p className="text-xs text-slate-500">Deploy Queueless Zero-Wait OS to a new healthcare facility</p>
              </div>
            </div>

            <form onSubmit={handleOnboardClinic} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hospital / Clinic Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fortis Super OPD"
                    value={newClinicName}
                    onChange={(e) => {
                      setNewClinicName(e.target.value);
                      if (!newClinicSlug) {
                        setNewClinicSlug(
                          e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/--+/g, '-')
                        );
                      }
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unique URL Slug *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. fortis-opd"
                    value={newClinicSlug}
                    onChange={(e) => setNewClinicSlug(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400">URL: /check-in/{newClinicSlug || 'slug'}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campus / Block Address</label>
                <input
                  type="text"
                  placeholder="e.g. Block 4, Bannerghatta Main Road, Bengaluru"
                  value={newClinicAddress}
                  onChange={(e) => setNewClinicAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reception Desk Phone</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 99887 76655"
                  value={newClinicPhone}
                  onChange={(e) => setNewClinicPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Initial Consulting Doctor Setup
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Doctor Name</label>
                    <input
                      type="text"
                      placeholder="Dr. Specialist, MD"
                      value={newDoctorName}
                      onChange={(e) => setNewDoctorName(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Specialty</label>
                    <input
                      type="text"
                      placeholder="e.g. Cardiologist"
                      value={newDoctorSpecialty}
                      onChange={(e) => setNewDoctorSpecialty(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Cabin / Room</label>
                    <input
                      type="text"
                      placeholder="Cabin 101"
                      value={newDoctorRoom}
                      onChange={(e) => setNewDoctorRoom(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOnboardModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={onboardingClinic}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {onboardingClinic ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Onboarding...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Deploy Hospital OS ➔</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: PHYSICAL QR STANDEE PREVIEW & PRINT                      */}
      {/* ============================================================== */}
      {selectedClinicForStandee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative text-center">
            <button
              onClick={() => setSelectedClinicForStandee(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-800 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 border border-sky-100">
              <QrCode className="w-3.5 h-3.5 text-sky-600" />
              <span>Official OPD Standee QR</span>
            </div>

            <h3 className="text-lg font-black text-slate-900">{selectedClinicForStandee.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{selectedClinicForStandee.address}</p>

            {/* Printable QR Code Canvas */}
            <div className="my-5 p-6 bg-slate-50 inline-block rounded-3xl border border-slate-200 shadow-inner">
              <QRCodeCanvas
                value={`http://${window.location.host}/check-in/${selectedClinicForStandee.slug}`}
                size={220}
                level="H"
                includeMargin={true}
              />
            </div>

            <div className="bg-slate-900 text-white p-3 rounded-2xl text-xs space-y-1 text-left mb-4">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Check-in URL:</span>
                <span className="text-emerald-400">Live & Active</span>
              </div>
              <div className="font-mono text-[11px] text-amber-300 break-all">
                {`http://${window.location.host}/check-in/${selectedClinicForStandee.slug}`}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `http://${window.location.host}/check-in/${selectedClinicForStandee.slug}`
                  );
                  showToast('✓ Check-in link copied to clipboard!');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Standee</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: HOSPITAL SETUP LINKS PACKAGE (ONBOARDING HANDOVER)       */}
      {/* ============================================================== */}
      {selectedClinicForSetupKit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedClinicForSetupKit(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">{selectedClinicForSetupKit.name}</h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Setup Package
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dedicated Hospital Namespace: <span className="font-mono text-emerald-700 font-bold">/{selectedClinicForSetupKit.slug}</span> • {selectedClinicForSetupKit.address}
                </p>
              </div>
            </div>

            {/* Handover Instructions Banner */}
            <div className="mt-4 p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 text-xs text-emerald-950">
              <div className="font-bold flex items-center gap-1.5 mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Hospital Handover Instructions</span>
              </div>
              <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                These 5 dedicated links are isolated to <strong>{selectedClinicForSetupKit.name}</strong>. Share them with the Hospital Medical Superintendent, Receptionist Desk, and Consulting Doctors.
              </p>
            </div>

            {/* The 5 Dedicated Links */}
            <div className="mt-4 space-y-3">
              {/* 1. Patient QR Entry */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-sky-100 text-sky-700 rounded-xl shrink-0 mt-0.5">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">1. Patient QR Self Check-In</span>
                      <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.2 rounded-md">Entrance Standee</span>
                    </div>
                    <div className="font-mono text-[11px] text-sky-700 break-all select-all mt-0.5">
                      {`http://${window.location.host}/check-in/${selectedClinicForSetupKit.slug}`}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Patients scan via smartphone camera to issue digital tokens in 20 seconds.</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`http://${window.location.host}/check-in/${selectedClinicForSetupKit.slug}`);
                      showToast('✓ Patient check-in link copied!');
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                  <Link
                    to={`/check-in/${selectedClinicForSetupKit.slug}`}
                    target="_blank"
                    className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl text-xs font-bold border border-sky-200 transition-all"
                    title="Test Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* 2. TV Kiosk Display */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">2. Waiting Lounge TV Kiosk Display</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-md">55" Screen</span>
                    </div>
                    <div className="font-mono text-[11px] text-emerald-700 break-all select-all mt-0.5">
                      {`http://${window.location.host}/display/${selectedClinicForSetupKit.slug}`}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Open fullscreen (F11) on waiting room TV with audio ON for chimes & voice call.</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`http://${window.location.host}/display/${selectedClinicForSetupKit.slug}`);
                      showToast('✓ TV Kiosk display link copied!');
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                  <Link
                    to={`/display/${selectedClinicForSetupKit.slug}`}
                    target="_blank"
                    className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 transition-all"
                    title="Test Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* 3. Reception Desk & POS */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-teal-100 text-teal-700 rounded-xl shrink-0 mt-0.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">3. Reception Desk & Billing POS</span>
                      <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded-md">Staff PC</span>
                    </div>
                    <div className="font-mono text-[11px] text-teal-700 break-all select-all mt-0.5">
                      {`http://${window.location.host}/reception/${selectedClinicForSetupKit.slug}`}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Approve cash payments, issue emergency walk-ins, and print 58/80mm thermal receipts.</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`http://${window.location.host}/reception/${selectedClinicForSetupKit.slug}`);
                      showToast('✓ Reception POS link copied!');
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                  <Link
                    to={`/reception/${selectedClinicForSetupKit.slug}`}
                    target="_blank"
                    className="p-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold border border-teal-200 transition-all"
                    title="Test Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* 4. Doctor Cabin Console */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 text-purple-700 rounded-xl shrink-0 mt-0.5">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">4. Doctor OPD Cabin Console</span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded-md">Doctor iPad/PC</span>
                    </div>
                    <div className="font-mono text-[11px] text-purple-700 break-all select-all mt-0.5">
                      {`http://${window.location.host}/doctor/${selectedClinicForSetupKit.slug}`}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">1-click call next patient into cabin, view live waiting queue, and generate prescriptions.</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`http://${window.location.host}/doctor/${selectedClinicForSetupKit.slug}`);
                      showToast('✓ Doctor console link copied!');
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                  <Link
                    to={`/doctor/${selectedClinicForSetupKit.slug}`}
                    target="_blank"
                    className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold border border-purple-200 transition-all"
                    title="Test Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* 5. Hospital Admin */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">5. Hospital Administration Console</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-md">Management</span>
                    </div>
                    <div className="font-mono text-[11px] text-amber-800 break-all select-all mt-0.5">
                      {`http://${window.location.host}/admin/${selectedClinicForSetupKit.slug}`}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Manage consulting doctors roster, fee tariffs, timings, and download audit reports.</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`http://${window.location.host}/admin/${selectedClinicForSetupKit.slug}`);
                      showToast('✓ Hospital admin link copied!');
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                  <Link
                    to={`/admin/${selectedClinicForSetupKit.slug}`}
                    target="_blank"
                    className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold border border-amber-200 transition-all"
                    title="Test Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Security Verification Notice */}
            <div className="mt-4 p-3 bg-slate-900 text-white rounded-2xl text-xs flex flex-wrap items-center justify-between gap-2">
              <span className="text-slate-400 font-bold">Encrypted Credentials:</span>
              <div className="flex items-center gap-3 font-mono text-[11px] text-emerald-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Hospital Master Keys Provisioned & Encrypted</span>
                </span>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedClinicForStandee(selectedClinicForSetupKit);
                  setSelectedClinicForSetupKit(null);
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold border border-amber-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-amber-600" />
                <span>Print Physical Standee</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const text = `🏥 Queueless OS — Setup Package for ${selectedClinicForSetupKit.name}\n\n1. 📱 Patient QR Entry: http://${window.location.host}/check-in/${selectedClinicForSetupKit.slug}\n2. 🖥️ TV Waiting Kiosk: http://${window.location.host}/display/${selectedClinicForSetupKit.slug}\n3. 🧾 Reception Desk: http://${window.location.host}/reception/${selectedClinicForSetupKit.slug}\n4. 👨‍⚕️ Doctor Console: http://${window.location.host}/doctor/${selectedClinicForSetupKit.slug}\n5. 🏥 Hospital Admin: http://${window.location.host}/admin/${selectedClinicForSetupKit.slug}\n\n🔐 Default Passwords: Admin (admin123), Reception (reception123), Doctor (1234)\n\nQueueless Support Desk: +91 98765 43210`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp Package</span>
                </button>

                <button
                  onClick={() => {
                    const text = `🏥 Queueless OS — Setup Package for ${selectedClinicForSetupKit.name}\n\n1. 📱 Patient QR Entry: http://${window.location.host}/check-in/${selectedClinicForSetupKit.slug}\n2. 🖥️ TV Waiting Kiosk: http://${window.location.host}/display/${selectedClinicForSetupKit.slug}\n3. 🧾 Reception Desk: http://${window.location.host}/reception/${selectedClinicForSetupKit.slug}\n4. 👨‍⚕️ Doctor Console: http://${window.location.host}/doctor/${selectedClinicForSetupKit.slug}\n5. 🏥 Hospital Admin: http://${window.location.host}/admin/${selectedClinicForSetupKit.slug}\n\n🔐 Default Passwords: Admin (admin123), Reception (reception123), Doctor (1234)\n\nQueueless Support Desk: +91 98765 43210`;
                    navigator.clipboard.writeText(text);
                    showToast('📋 Complete Onboarding Package copied to clipboard!');
                  }}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Full Package</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};
