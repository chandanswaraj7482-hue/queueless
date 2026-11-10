import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Lock,
  Stethoscope,
  Users,
  LogIn,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';

import { API_BASE_URL } from '../config/api';
export const HospitalLogin: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'ADMIN' | 'DOCTOR' | 'RECEPTION'>('ADMIN');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please provide your Hospital ID / Slug and Password');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/clinics/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim(),
          role,
        }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        const hospitalName = data.data.clinic?.name || data.data.name || 'Hospital';
        const targetSlug = data.data.clinic?.slug || data.data.slug;
        const targetUrl = data.data.redirectUrl || `/admin/${targetSlug}`;

        setSuccessMsg(`✓ Welcome back! Opening ${hospitalName} ${role.toLowerCase()} dashboard...`);
        localStorage.setItem(
          'queueless_auth',
          JSON.stringify({
            clinic: data.data.clinic || { id: data.data.clinicId, name: hospitalName, slug: targetSlug },
            role: data.data.role || role,
            timestamp: Date.now(),
          })
        );

        setTimeout(() => {
          navigate(targetUrl);
        }, 800);
      } else {
        setError(data.error || 'Invalid credentials or inactive subscription.');
      }
    } catch (err) {
      setError('Could not connect to hospital authentication server. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-x-clip flex flex-col transition-colors duration-200">
      <CommercialNavbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 relative z-10">
        <div className="max-w-md w-full space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
              Hospital Portal Sign In
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your subscribed hospital credentials to access your clinical dashboard.
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-200/80 dark:bg-slate-900 p-1 rounded-2xl border border-slate-300/60 dark:border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setRole('ADMIN');
                setError(null);
              }}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'ADMIN'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Director</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('DOCTOR');
                setError(null);
              }}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'DOCTOR'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Doctor</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('RECEPTION');
                setError(null);
              }}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'RECEPTION'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Reception</span>
            </button>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-5">
            {error && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-800 dark:text-rose-300 font-semibold flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span>{error}</span>
                  <div className="pt-1">
                    <Link to="/signup" className="text-blue-600 dark:text-blue-400 underline font-bold">
                      Need a new hospital workspace? Activate Hospital OS ➔
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hospital Identifier (Slug, Name, or Phone)
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. city-health or 9876543210"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setError(null);
                    }}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {role === 'DOCTOR' ? 'Doctor 4-Digit PIN or Password' : 'Admin / Desk Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Authenticating...' : `Sign In to ${role} Console ➔`}</span>
              </button>
            </form>

            <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Are you a patient looking for your live token?{' '}
                <Link to="/portal" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                  Track Live Token
                </Link>
              </span>
            </div>
          </div>

          {/* New Customer Callout */}
          <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl border border-blue-200/80 dark:border-blue-900 text-center space-y-2">
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Don't have an active hospital subscription yet?
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Purchase your plan via Dodo Payments or PayPal and get all 5 clinical portals provisioned in 20 seconds.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs transition-all active:scale-98"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Subscribe & Deploy Hospital OS ➔</span>
            </Link>
          </div>
        </div>
      </main>

      <CommercialFooter />
    </div>
  );
};
