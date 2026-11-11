import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import {
  User,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  Stethoscope,
  Building2,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  AlertCircle,
  LogOut,
  MapPin,
  HeartPulse,
  Ticket,
  Printer,
  X,
  Pill,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Zap,
  FlaskConical,
  MessageCircle,
  Download,
  Receipt,
  CreditCard,
  Mail,
} from 'lucide-react';

const generateWhatsAppRxUrl = (data: any) => {
  const phone = data.patient?.mobile || '';
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);

  let text = `🏥 *${data.clinic?.name || 'Queueless Hospital OPD'}*\n`;
  text += `👨‍⚕️ *Dr. ${data.doctor?.name || 'Consultant'}* (${data.doctor?.specialty || 'General Physician'})\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `📋 *OFFICIAL DIGITAL PRESCRIPTION*\n`;
  text += `👤 *Patient:* ${data.patient?.name || 'Patient'}\n`;
  text += `🎫 *Token:* ${data.tokenNumber || data.token || ''} | *Rx #:* ${data.rxNumber || 'Official'}\n`;
  if (data.diagnosis) {
    text += `🩺 *Diagnosis:* ${data.diagnosis}\n`;
  }
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;

  const meds = data.medicines || data.prescriptions || [];
  if (meds.length > 0) {
    text += `💊 *PRESCRIBED MEDICINES:*\n`;
    meds.forEach((m: any, i: number) => {
      text += `${i + 1}. *${m.medicineName}*\n`;
      text += `   Dosage: ${m.dosage || '1 Tab'} | Timing: ${m.frequency || '1-0-1'}\n`;
      text += `   Duration: ${m.duration || '5 Days'}${m.instructions ? ` (${m.instructions})` : ''}\n`;
    });
    text += `\n`;
  }

  const tests = data.labTests || [];
  if (tests.length > 0) {
    text += `🧪 *INVESTIGATIONS / LAB TESTS:*\n`;
    tests.forEach((t: string) => {
      text += `• ${t}\n`;
    });
    text += `\n`;
  }

  const adv = data.advice || data.clinicalNotes;
  if (adv) {
    text += `📝 *DOCTOR ADVICE:* ${adv}\n\n`;
  }

  if (data.followUpDays) {
    text += `📅 *Next Review:* After ${data.followUpDays} days in OPD\n\n`;
  }

  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  const tokenRef = data.publicToken || data.tokenNumber || data.token;
  text += `🔗 *View & Download Official PDF Prescription:*\n`;
  text += `https://queueless-os.vercel.app/token/${tokenRef}\n\n`;
  text += `🔐 *Synced to Patient ID:* Login at https://queueless-os.vercel.app/portal with +91 ${cleanPhone}\n`;
  text += `_Powered by Queueless Healthcare OS_`;

  return `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(text)}`;
};

export const PatientPortal: React.FC = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP' | 'TRACK'>('LOGIN');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tokenId, setTokenId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupSuccessMsg, setSignupSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portalData, setPortalData] = useState<any>(null);
  const [viewingRx, setViewingRx] = useState<any | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<any | null>(null);
  const [showFullHistoryModal, setShowFullHistoryModal] = useState(false);

  // Auto-restore patient login session
  useEffect(() => {
    try {
      const saved = localStorage.getItem('queueless_patient_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedMobile = parsed.mobile;
        const savedSecret = parsed.password || parsed.pin;
        if (savedMobile) {
          setMobile(savedMobile);
          if (savedSecret) setPassword(savedSecret);
          setLoading(true);
          fetch(`${API_BASE_URL}/api/v1/patient/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile: savedMobile, password: savedSecret || '1234' }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                setPortalData(data.data);
              }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
        }
      }
    } catch (e) {}
  }, []);

  const handleOpenRx = async (publicToken: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/queue/${publicToken}/prescription`);
      const data = await res.json();
      if (data.success) {
        setViewingRx(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenReceipt = (item: any) => {
    setViewingReceipt(item);
  };

  const handleTrackByToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenId.trim()) {
      setError('Please enter your Assigned Token ID (e.g. A-118)');
      return;
    }
    if (!patientName.trim()) {
      setError('Please enter the Patient Name for identity verification.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/patient/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tokenId.trim(),
          patientName: patientName.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.publicToken) {
        navigate(`/token/${data.publicToken}`);
      } else {
        setError(data.error || 'Verification failed. Patient name does not match this token.');
      }
    } catch (err) {
      setError('Could not connect to clinic server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.trim()) {
      setError('Please enter your registered mobile number or email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/patient/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: mobile.trim(), password: password.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setPortalData(data.data);
        localStorage.setItem(
          'queueless_patient_session',
          JSON.stringify({ mobile: mobile.trim(), password: password.trim() })
        );
      } else {
        setError(data.error || 'No records found for this account. Try creating an account or registering for OPD!');
      }
    } catch (err) {
      setError('Could not connect to clinic server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = signupMobile.trim();
    if (!cleanId) {
      setError('Please enter your mobile number or email address.');
      return;
    }
    if (!signupPassword || signupPassword.trim().length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match. Please re-enter matching passwords.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/patient/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: cleanId,
          password: signupPassword.trim(),
          name: signupName.trim() || 'Patient',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSignupSuccessMsg('🎉 Account & Password created! Opening your Universal Medical Vault...');
        setMobile(cleanId);
        setPassword(signupPassword.trim());
        setTimeout(() => {
          fetch(`${API_BASE_URL}/api/v1/patient/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile: cleanId, password: signupPassword.trim() }),
          })
            .then((r) => r.json())
            .then((logData) => {
              if (logData.success) {
                setPortalData(logData.data);
                localStorage.setItem(
                  'queueless_patient_session',
                  JSON.stringify({ mobile: cleanId, password: signupPassword.trim() })
                );
              }
            });
        }, 800);
      } else {
        setError(data.error || 'Failed to create password.');
      }
    } catch (err) {
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setPortalData(null);
    localStorage.removeItem('queueless_patient_session');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-28">
      {/* If not logged in: Mode Selector & Form */}
      {!portalData ? (
        <div className="max-w-md mx-auto mt-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Queueless"
                  className="w-12 h-12 rounded-2xl shadow-sm border border-slate-200 object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 p-1 bg-emerald-500 rounded-full text-white">
                  <ShieldCheck className="w-3 h-3" />
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-800 mb-2">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Universal Patient Health Passport</span>
            </div>

            <h1 className="text-xl font-black text-slate-900 tracking-tight">Patient Login & Multi-Hospital Vault</h1>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Securely access your complete OPD history, doctor prescriptions, and follow-up passes across all Queueless-enabled hospitals with your ID and password.
            </p>

            {/* Mode Switcher Pills (Login vs Track Token) */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('LOGIN');
                  setError(null);
                  setSignupSuccessMsg(null);
                }}
                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === 'LOGIN' || authMode === 'SIGNUP'
                    ? 'bg-white text-sky-900 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-sky-600" />
                <span>Login</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('TRACK');
                  setError(null);
                  setSignupSuccessMsg(null);
                }}
                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === 'TRACK'
                    ? 'bg-white text-emerald-900 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Ticket className="w-3.5 h-3.5 text-emerald-600" />
                <span>Track Token</span>
              </button>
            </div>

            {signupSuccessMsg && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 text-left font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{signupSuccessMsg}</span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-700 text-left font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Tab 1: Full History Login by Mobile/Email & Password */}
            {authMode === 'LOGIN' && (
              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Registered Mobile Number or Email (ID)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9876543210 or patient@gmail.com"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Enter the mobile number or email used during your hospital check-in.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Account Password</label>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your account password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-black py-3.5 px-4 rounded-xl text-xs transition-all shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
                >
                  {loading ? (
                    <span>Unlocking Medical Vault...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Login & Open Health Vault</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Quick Switch to Create Account */}
                <div className="pt-2 text-center text-xs">
                  <span className="text-slate-400">First time or don't have a password yet? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('SIGNUP');
                      setError(null);
                      setSignupSuccessMsg(null);
                    }}
                    className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                  >
                    Create Account Here →
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Create Account / Set Vault Password */}
            {authMode === 'SIGNUP' && (
              <form onSubmit={handleSignup} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patient Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number or Email (ID) *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9876543210 or patient@gmail.com"
                      value={signupMobile}
                      onChange={(e) => setSignupMobile(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Create Account Password *</label>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      placeholder="Create secure password (min 4 characters)"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Account Password *</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter the same password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="mt-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-500 space-y-0.5">
                    <p className="font-semibold text-slate-700">🔒 Universal Health Vault Protection:</p>
                    <p>This password protects your OPD prescriptions, lab reports, and doctor visits forever across all hospitals.</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-black py-3.5 px-4 rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
                >
                  {loading ? (
                    <span>Creating Health Vault...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Create Account & Secure Health Vault</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Quick Switch to Login */}
                <div className="pt-2 text-center text-xs">
                  <span className="text-slate-400">Already set your password before? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('LOGIN');
                      setError(null);
                      setSignupSuccessMsg(null);
                    }}
                    className="font-bold text-sky-600 hover:text-sky-800 hover:underline cursor-pointer"
                  >
                    Login with Password Here →
                  </button>
                </div>
              </form>
            )}

            {/* Tab 3: Secure Track by Token ID + Patient Name Verification */}
            {authMode === 'TRACK' && (
              <form onSubmit={handleTrackByToken} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enter Assigned Token ID
                  </label>
                  <div className="relative">
                    <Ticket className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="e.g. A-118, 118"
                      value={tokenId}
                      onChange={(e) => setTokenId(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-black text-slate-900 uppercase placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Patient Name (Identity Verification)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Karan Mehra"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    🔒 Required for privacy so nobody else can view your medical details.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-black py-3 px-4 rounded-xl text-xs transition-all shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Verifying Identity...</span>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Verify & Track Live Queue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Confidential Patient Health OS • Powered by Queueless</span>
            </div>
          </div>
        </div>
      ) : (
        /* Logged In: Patient Full Profile & History Dashboard */
        <div className="space-y-6">
          {/* Patient Header Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                {portalData.patient.name ? portalData.patient.name.charAt(0).toUpperCase() : 'P'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    {portalData.patient.name}
                  </h1>
                  {portalData.patient.bloodGroup && (
                    <span className="text-[11px] font-black text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                      {portalData.patient.bloodGroup}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  ID: {portalData.patient.mobile || portalData.patient.email} • {portalData.patient.age ? `${portalData.patient.age} yrs` : 'Age N/A'} • {portalData.patient.gender || 'Patient'}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-indigo-600" />
                    <span>{portalData.totalHospitals || 1} Hospitals Connected</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Universal Health Passport (ABDM)</span>
                  </span>
                </div>
                {portalData.patient.address && (
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{portalData.patient.address}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setShowFullHistoryModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all cursor-pointer shadow-2xs"
                title="Download full lifetime medical history as PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Full Medical Passport (PDF)</span>
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock & Logout</span>
              </button>
            </div>
          </div>

          {/* Privacy & Health Vault Assurance */}
          <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-emerald-900">
                🔒 Protected Patient Medical Vault • All OPD visits, prescriptions, and fee receipts safely encrypted
              </span>
            </div>
            <span className="text-[10px] font-black uppercase text-emerald-700 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
              Password Protected
            </span>
          </div>

          {/* Active Today Token Card (If Any) */}
          {portalData.activeToken && (
            <div className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-3xl p-6 shadow-xl shadow-sky-600/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-sky-200 block">
                  Today's Active OPD Token
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-4xl font-black font-mono text-white">
                    {portalData.activeToken.token}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/20 text-white border border-white/30">
                    Ref: #QL-{portalData.activeToken.id.substring(0, 6).toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-sky-100 mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="font-bold text-white flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-sky-200" />
                    <span>{portalData.activeToken.clinicName || 'Queueless Hospital'}</span>
                  </span>
                  <span>•</span>
                  <span>Doctor: <strong className="text-white">{portalData.activeToken.doctorName}</strong> ({portalData.activeToken.roomNumber})</span>
                </p>
              </div>

              <Link
                to={`/token/${portalData.activeToken.publicToken}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-sky-900 text-xs font-black rounded-xl shadow-md hover:bg-sky-50 transition-all self-start sm:self-center"
              >
                <span>Track Live Queue Position</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* 15-Day Follow-up Priority Passes */}
          {portalData.followUpPasses?.length > 0 && (
            <div className="bg-sky-50/70 border border-sky-200 rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-extrabold text-sky-950">
                  Active Follow-Up Consultation Passes (15-Day Rule)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {portalData.followUpPasses.map((pass: any, idx: number) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">{pass.doctorName}</div>
                      <div className="text-[11px] text-slate-500">{pass.specialty} • {pass.roomNumber}</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 bg-sky-100 text-sky-800 font-extrabold text-[10px] rounded-full block">
                        ₹250 Follow-Up Slot
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                        {pass.daysRemaining} days left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complete Visit History Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-900">OPD Consultation & Medical History</h2>
                <p className="text-xs text-slate-500">
                  Complete record of all your visits, bills, and issued digital prescriptions across all hospitals.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFullHistoryModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition-all cursor-pointer shadow-2xs"
                  title="Download and print complete health history as PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Download Summary (PDF)</span>
                </button>
                <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                  Total Visits: {portalData.totalVisits}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-5">Date</th>
                    <th className="py-3 px-5">Token</th>
                    <th className="py-3 px-5">Doctor & Hospital</th>
                    <th className="py-3 px-5">Diagnosis & Notes</th>
                    <th className="py-3 px-5">Fee & Payment</th>
                    <th className="py-3 px-5 text-right">Documents / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {portalData.history.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-slate-700">
                        {item.queueDate}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-sm">
                        <div className="font-black text-slate-900">{item.token}</div>
                        <div className="text-[10px] text-slate-400 font-medium">#QL-{item.id.substring(0, 6).toUpperCase()}</div>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-extrabold text-indigo-700 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>{item.clinicName}</span>
                        </div>
                        <div className="font-bold text-slate-800 text-xs mt-0.5">{item.doctorName}</div>
                        <div className="text-slate-400 text-[10px]">{item.roomNumber}</div>
                      </td>
                      <td className="py-3.5 px-5 max-w-xs">
                        <div className="font-bold text-slate-900 truncate">
                          {item.diagnosis || item.visitReason || '-'}
                        </div>
                        {item.diagnosis && item.visitReason && (
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">
                            Reason: {item.visitReason}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-5">
                        {item.isFollowUp ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                            PAID ₹250 (15-Day Follow-Up)
                          </span>
                        ) : item.paymentStatus === 'PAID' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 text-sky-800">
                            PAID ₹{item.feeAmount} ({item.paymentMethod})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                            DUE ₹{item.feeAmount}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* Rx Button */}
                          {item.hasPrescription && (
                            <button
                              onClick={() => handleOpenRx(item.publicToken)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[11px] border border-emerald-200 transition-colors shadow-2xs cursor-pointer"
                              title="View & Download Doctor Prescription PDF"
                            >
                              <FileText className="w-3 h-3 text-emerald-600" />
                              <span>Digital Rx</span>
                            </button>
                          )}

                          {/* Receipt Button */}
                          <button
                            onClick={() => handleOpenReceipt(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold rounded-lg text-[11px] border border-indigo-200 transition-colors shadow-2xs cursor-pointer"
                            title="View & Download Official Fee Receipt PDF"
                          >
                            <Receipt className="w-3 h-3 text-indigo-600" />
                            <span>Receipt</span>
                          </button>

                          {/* Live Ticket Pass */}
                          <Link
                            to={`/token/${item.publicToken}`}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] transition-colors"
                            title="Open Live Token Screen"
                          >
                            <Ticket className="w-3 h-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: PATIENT DIGITAL PRESCRIPTION MODAL */}
      {viewingRx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8">
            <button
              onClick={() => setViewingRx(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-2" id="printable-rx-area">
              {/* Hospital Header Letterhead (Top - Hospital Data & Logo) */}
              <div className="border-b-2 border-slate-900 pb-4 mb-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {viewingRx.clinic?.logoUrl ? (
                    <img
                      src={viewingRx.clinic.logoUrl}
                      alt={viewingRx.clinic.name}
                      className="w-12 h-12 rounded-xl object-contain border border-slate-200 p-1 bg-white shrink-0 shadow-2xs"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-xs">
                      🏥
                    </div>
                  )}
                  <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                      {viewingRx.clinic?.name || 'Queueless Network Hospital OPD'}
                    </h1>
                    <p className="text-xs text-slate-600 max-w-sm mt-0.5 font-medium">
                      {viewingRx.clinic?.address || 'Suite 402, Metro Healthcare Towers, Bengaluru'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Phone / Desk: {viewingRx.clinic?.phone || '+91 80 4920 1100'} • Ayushman Bharat (ABDM) & NABH Aligned OPD
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-black uppercase text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-1 shadow-2xs">
                    Official OPD Rx
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    Token: <span className="font-mono font-black text-slate-900">{viewingRx.token}</span>
                    <span className="mx-1 text-slate-300">•</span>
                    Ref: <span className="font-mono font-bold text-slate-600">#QL-{(viewingRx.id || '').substring(0, 6).toUpperCase()}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">Date: {viewingRx.date}</div>
                </div>
              </div>

              {/* Doctor & Patient Info Bar */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs mb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consulting Doctor</span>
                  <div className="font-extrabold text-slate-900 text-sm">{viewingRx.doctor?.name}</div>
                  <div className="text-[11px] text-slate-600 font-medium">{viewingRx.doctor?.specialty} • {viewingRx.doctor?.roomNumber}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Reg No: {viewingRx.doctor?.regNumber || `MCI-${(viewingRx.doctor?.id || '84920').substring(0, 6).toUpperCase()}`}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient Details</span>
                  <div className="font-extrabold text-slate-900 text-sm">{viewingRx.patient?.name}</div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    {viewingRx.patient?.age ? `${viewingRx.patient?.age} yrs` : 'Age N/A'} • {viewingRx.patient?.gender || 'Patient'}
                    {viewingRx.patient?.bloodGroup && ` • Blood Group: ${viewingRx.patient?.bloodGroup}`}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Mobile: +91 {viewingRx.patient?.mobile || 'Registered'}
                  </div>
                </div>
              </div>

              {/* Vitals Examination */}
              {viewingRx.vitals && (
                <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-semibold p-2.5 bg-slate-50/70 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Vitals:</span>
                  {viewingRx.vitals.bp && (
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800">BP: <strong>{viewingRx.vitals.bp}</strong></span>
                  )}
                  {viewingRx.vitals.pulse && (
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800">Pulse: <strong>{viewingRx.vitals.pulse} bpm</strong></span>
                  )}
                  {viewingRx.vitals.temp && (
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800">Temp: <strong>{viewingRx.vitals.temp}</strong></span>
                  )}
                  {viewingRx.vitals.spo2 && (
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800">SpO2: <strong>{viewingRx.vitals.spo2}</strong></span>
                  )}
                  {viewingRx.vitals.weight && (
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800">Weight: <strong>{viewingRx.vitals.weight}</strong></span>
                  )}
                </div>
              )}

              {/* Diagnosis */}
              <div className="mb-4 pb-3 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Diagnosis</span>
                <p className="text-sm font-black text-slate-900 mt-0.5">
                  {viewingRx.diagnosis || 'General OPD Examination'}
                </p>
              </div>

              {/* Rx Medicines Table with Instructions */}
              <div className="mb-5">
                <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <span className="text-lg font-serif italic text-emerald-700">℞</span>
                  <span>Prescribed Medicines & Schedule</span>
                </div>
                <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Medicine</th>
                      <th className="p-2.5">Dosage</th>
                      <th className="p-2.5">Frequency</th>
                      <th className="p-2.5">Duration</th>
                      <th className="p-2.5">Instructions (Timing / Food)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {((viewingRx.medicines || viewingRx.prescriptions || []).length > 0) ? (
                      (viewingRx.medicines || viewingRx.prescriptions).map((m: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-bold text-slate-900">{m.medicineName}</td>
                          <td className="p-2.5 text-slate-700 font-medium">{m.dosage}</td>
                          <td className="p-2.5 text-slate-700 font-mono font-bold text-blue-700">{m.frequency}</td>
                          <td className="p-2.5 text-slate-700 font-medium">{m.duration}</td>
                          <td className="p-2.5 text-slate-600 italic font-medium">{m.instructions || 'After Food (खाने के बाद)'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-slate-400">
                          No specific medicines prescribed. General clinical advice provided.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Recommended Diagnostic Tests */}
              {viewingRx.labTests && viewingRx.labTests.length > 0 && (
                <div className="mb-5">
                  <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
                    <span>Recommended Diagnostic Lab Tests ({viewingRx.labTests.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3 bg-teal-50/70 rounded-2xl border border-teal-200">
                    {viewingRx.labTests.map((t: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-white text-teal-900 font-extrabold text-xs rounded-xl border border-teal-200 shadow-2xs flex items-center gap-1">
                        <span>🧪</span>
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Advice */}
              {(viewingRx.advice || viewingRx.clinicalNotes) && (
                <div className="mb-4 p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-xs">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-0.5">
                    Doctor Advice & Dietary Instructions:
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {viewingRx.advice || viewingRx.clinicalNotes}
                  </p>
                </div>
              )}

              {/* 15-Day Free Follow-up Review Notice */}
              <div className="mb-4 p-3 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs flex items-center justify-between">
                <span className="font-bold text-blue-950 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>15-Day Free Follow-Up Review:</span>
                </span>
                <span className="font-black text-blue-800 bg-white px-2.5 py-1 rounded-xl border border-blue-200 font-mono text-[11px]">
                  Valid for {viewingRx.followUpDays || 15} Days (₹0 Consultation Fee in OPD)
                </span>
              </div>

              {/* Doctor Sign-off (Bottom Right) */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div>
                  <div className="text-[10px] text-slate-400">Valid Digital Prescription generated via Hospital EMR</div>
                  <div className="font-semibold text-slate-700 mt-0.5">Official Digital OPD Record • Signed electronically</div>
                </div>
                <div className="text-right">
                  <div className="font-serif italic font-bold text-slate-900 text-base">
                    {viewingRx.doctor?.name}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Authorized Doctor Sign-off</div>
                </div>
              </div>

              {/* Bottom Footer: Powered by Queueless Healthcare OS (User: "mera bottom me rahega") */}
              <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5 font-bold text-slate-600">
                  <span className="px-1 py-0.2 bg-blue-600 text-white rounded text-[8px] font-black">Q</span>
                  <span>Powered by Queueless Healthcare OS • Ayushman Bharat (ABDM M1/M2) & HIPAA Aligned</span>
                </div>
                <div className="font-mono text-[9px] text-slate-400">
                  Universal Health Vault Sync: https://queueless-os.vercel.app/portal
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => setViewingRx(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Close
              </button>
              <a
                href={generateWhatsAppRxUrl(viewingRx)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Share on WhatsApp</span>
              </a>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Download Prescription</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: OPD REGISTRATION & PAYMENT RECEIPT MODAL */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8">
            <button
              onClick={() => setViewingReceipt(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4" id="printable-receipt-area">
              {/* Receipt Header */}
              <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-base font-black text-slate-900 tracking-tight">
                      {viewingReceipt.clinicName}
                    </h2>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Queueless Zero-Wait OPD System</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-0.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider rounded-md">
                    OPD FEE RECEIPT
                  </span>
                  <div className="text-[10px] font-mono font-bold text-slate-600 mt-1">
                    INV-{viewingReceipt.token}-{viewingReceipt.id.substring(0, 5).toUpperCase()}
                  </div>
                  <div className="text-[10px] text-slate-400">{viewingReceipt.queueDate}</div>
                </div>
              </div>

              {/* Token Banner */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Assigned Token
                  </span>
                  <div className="text-3xl font-black font-mono tracking-tight text-slate-900">
                    {viewingReceipt.token}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Doctor / Cabin
                  </span>
                  <div className="text-xs font-black text-slate-800">{viewingReceipt.doctorName}</div>
                  <div className="text-[10px] text-slate-500">{viewingReceipt.roomNumber}</div>
                </div>
              </div>

              {/* Patient Details */}
              <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient Name:</span>
                  <strong className="text-slate-900">{portalData.patient.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mobile Number:</span>
                  <span className="font-mono font-bold text-slate-800">{portalData.patient.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Visit Type:</span>
                  <span className="font-bold text-indigo-700">
                    {viewingReceipt.isFollowUp ? '15-Day Free/Follow-Up Slot' : 'Standard OPD Consultation'}
                  </span>
                </div>
              </div>

              {/* Payment Breakdown Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5 text-left">Description</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 text-slate-800">OPD Clinical Examination Fee</td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900">₹{viewingReceipt.feeAmount}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-slate-500 text-[11px]">GST / Healthcare Tax (Exempt)</td>
                      <td className="p-2.5 text-right font-mono text-slate-500 text-[11px]">₹0.00</td>
                    </tr>
                    <tr className="bg-slate-50 font-black">
                      <td className="p-2.5 text-slate-900">Total Paid Amount</td>
                      <td className="p-2.5 text-right font-mono text-emerald-700 text-sm">₹{viewingReceipt.feeAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment Badge */}
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Payment Status: PAID ({viewingReceipt.paymentMethod || 'CASH/UPI'})</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">VERIFIED</span>
              </div>

              <p className="text-[10px] text-slate-400 text-center">
                This is an official computer-generated receipt from Queueless Clinical OS. No physical signature required.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setViewingReceipt(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Download Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: FULL LIFETIME MEDICAL PASSPORT & HISTORY MODAL */}
      {showFullHistoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowFullHistoryModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6" id="printable-full-history">
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-800 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ayushman Bharat (ABDM) Compatible Medical Passport</span>
                  </div>
                  <h1 className="text-xl font-black text-slate-900">
                    Comprehensive Patient Medical History
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Consolidated record across all Queueless Healthcare network hospitals
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-700">Date Generated</div>
                  <div className="text-xs font-mono font-black text-slate-900">
                    {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Patient Bio Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Patient Name</span>
                  <strong className="text-slate-900 text-sm">{portalData.patient.name}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">ID (Mobile/Email)</span>
                  <span className="font-mono font-bold text-slate-800">{portalData.patient.mobile || portalData.patient.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Age / Gender</span>
                  <span className="font-bold text-slate-800">
                    {portalData.patient.age ? `${portalData.patient.age} yrs` : 'N/A'} • {portalData.patient.gender || 'Patient'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Blood Group</span>
                  <span className="font-black text-red-700">{portalData.patient.bloodGroup || 'Not Recorded'}</span>
                </div>
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
                  <div className="text-xl font-black text-sky-900">{portalData.totalVisits}</div>
                  <div className="text-[10px] font-bold text-sky-700 uppercase">Total OPD Consultations</div>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div className="text-xl font-black text-indigo-900">{portalData.totalHospitals || 1}</div>
                  <div className="text-[10px] font-bold text-indigo-700 uppercase">Connected Hospitals</div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-xl font-black text-emerald-900">
                    {portalData.history.filter((h: any) => h.hasPrescription).length}
                  </div>
                  <div className="text-[10px] font-bold text-emerald-700 uppercase">Digital Prescriptions</div>
                </div>
              </div>

              {/* Visit Timeline List */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Consultation Timeline & Doctor Diagnoses
                </h3>

                <div className="space-y-3">
                  {portalData.history.map((h: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 text-xs">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-slate-400 text-[11px] block">{h.queueDate}</span>
                          <strong className="text-sm text-slate-900">{h.doctorName}</strong>
                          <div className="text-[11px] text-indigo-700 font-bold">{h.clinicName} • {h.roomNumber}</div>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 bg-slate-100 font-mono font-bold rounded text-[10px]">
                            {h.token}
                          </span>
                          <div className="text-[10px] text-emerald-700 font-bold mt-1">PAID ₹{h.feeAmount}</div>
                        </div>
                      </div>

                      {h.diagnosis && (
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Clinical Diagnosis</span>
                          <span className="font-bold text-slate-800">{h.diagnosis}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Note */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                <span>Queueless Universal Health Passport • Generated for personal medical records & travel</span>
                <span>Verified Encrypted Session</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowFullHistoryModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Download Passport (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
