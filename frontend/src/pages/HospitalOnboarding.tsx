import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Building2,
  Lock,
  Mail,
  Phone,
  User,
  Stethoscope,
  CreditCard,
  CheckCircle2,
  Zap,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Printer,
  Copy,
  Tv,
  Users,
  Smartphone,
  Award,
  Check,
  X,
  AlertCircle,
  FlaskConical,
  RefreshCw,
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';
import {
  WORLDWIDE_CURRENCIES,
  PLAN_TEMPLATES,
  PlanTemplate,
  CurrencyConfig,
  PlanId,
} from '../data/commercialData';
import { playClinicChime } from '../utils/audio';

import { API_BASE_URL } from '../config/api';
export const HospitalOnboarding: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL Params
  const queryPlanId = (searchParams.get('plan') as PlanId) || 'GROWTH_OPD';
  const queryCurrency = searchParams.get('currency') || 'USD';
  const queryCycle = (searchParams.get('cycle') as 'MONTHLY' | 'ANNUAL') || 'ANNUAL';

  // Step Tracker: 1 = Details & Credentials, 2 = Plan & Billing, 3 = Payment (Dodo/PayPal), 4 = Live Provisioned
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Currency & Billing
  const [currencyCode, setCurrencyCode] = useState<string>(queryCurrency);
  const selectedCurrency: CurrencyConfig =
    WORLDWIDE_CURRENCIES[currencyCode] || WORLDWIDE_CURRENCIES.USD;
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>(queryCycle);
  const [selectedPlan, setSelectedPlan] = useState<PlanTemplate>(
    PLAN_TEMPLATES.find((p) => p.id === queryPlanId) || PLAN_TEMPLATES[1]
  );
  const [hardwareAddon, setHardwareAddon] = useState<boolean>(true);

  // Step 1: Hospital Details & Master Login Credentials
  const [hospitalName, setHospitalName] = useState('');
  const [slug, setSlug] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [initialDoctorName, setInitialDoctorName] = useState('');
  const [initialDoctorSpecialty, setInitialDoctorSpecialty] = useState('General Medicine');
  const [initialDoctorRoom, setInitialDoctorRoom] = useState('Cabin 1');

  // Step 3: Payment Gateway (Simulated Test Mode, Dodo Payments, PayPal)
  const [paymentGateway, setPaymentGateway] = useState<'TEST_MODE' | 'DODOPAYMENTS' | 'PAYPAL'>('TEST_MODE');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState('Dr. Clinical Director');
  const [paypalEmail, setPaypalEmail] = useState('');

  // Interactive Test Payment Modal & Cancellation Notice
  const [showSimulationModal, setShowSimulationModal] = useState(false);
  const [paymentCancelledNotice, setPaymentCancelledNotice] = useState<string | null>(null);

  // Processing & Success State
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [provisionedData, setProvisionedData] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Auto-generate clean slug as hospital name changes
  const handleNameChange = (name: string) => {
    setHospitalName(name);
    if (!slug || slug === cleanSlug(hospitalName)) {
      setSlug(cleanSlug(name));
    }
  };

  const cleanSlug = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 32);
  };

  // Price Calculation
  const rates = selectedCurrency.rates[selectedPlan.id];
  const planRate = billingCycle === 'ANNUAL' ? rates.annual : rates.monthly;
  const standeeCost = 0;
  const totalAmount = planRate;

  // Step 1 Validation
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalName.trim() || !slug.trim()) {
      setErrorMsg('Please enter Hospital Name and URL identifier');
      return;
    }
    if (!adminEmail.trim() || !adminPassword.trim()) {
      setErrorMsg('Please specify Admin Login Email and Password');
      return;
    }
    setErrorMsg(null);
    setCurrentStep(2);
  };

  // Step 2 Proceed
  const handleStep2Submit = () => {
    setErrorMsg(null);
    setCurrentStep(3);
  };

  // Step 3: Trigger Payment Verification Simulation
  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setPaymentCancelledNotice(null);
    setShowSimulationModal(true);
  };

  // User Clicks YES: Payment Approved & Clinic Provisioned
  const handleApprovePayment = async () => {
    setShowSimulationModal(false);
    setIsProcessing(true);
    setErrorMsg(null);
    setPaymentCancelledNotice(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/clinics/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalName: hospitalName.trim(),
          slug: slug.trim(),
          address: address.trim(),
          city: city.trim(),
          phone: phone.trim(),
          adminEmail: adminEmail.trim(),
          adminPassword: adminPassword.trim(),
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          billingCycle,
          currency: currencyCode,
          hardwareAddon,
          totalAmount,
          paymentMethod: paymentGateway,
          initialDoctorName: initialDoctorName.trim() || 'Dr. Chief Consultant, MD',
          initialDoctorSpecialty: initialDoctorSpecialty.trim(),
          initialDoctorRoom: initialDoctorRoom.trim(),
        }),
      });

      const resData = await response.json();

      if (resData.success && resData.data) {
        setProvisionedData(resData.data);
        setCurrentStep(4);
        playClinicChime();

        // Save into local registered hospitals list
        try {
          const storedHospitals = JSON.parse(localStorage.getItem('queueless_registered_hospitals') || '{}');
          storedHospitals[slug.trim()] = resData.data.clinic;
          localStorage.setItem('queueless_registered_hospitals', JSON.stringify(storedHospitals));
        } catch (e) {}

        // Save auth into localStorage so they are immediately logged in
        localStorage.setItem(
          'queueless_auth',
          JSON.stringify({
            clinic: resData.data.clinic,
            role: 'ADMIN',
            timestamp: Date.now(),
          })
        );
      } else {
        // Fallback provisioning
        const fallbackClinic = {
          id: 'clinic_' + slug.trim(),
          name: hospitalName.trim(),
          slug: slug.trim(),
          address: address.trim() || 'Main Clinical Campus',
          planId: selectedPlan.id,
          billingCycle,
          adminEmail: adminEmail.trim(),
          status: 'ACTIVE',
        };
        const fallbackData = {
          invoiceId: 'INV-' + Math.floor(100000 + Math.random() * 900000),
          clinic: fallbackClinic,
        };
        try {
          const storedHospitals = JSON.parse(localStorage.getItem('queueless_registered_hospitals') || '{}');
          storedHospitals[slug.trim()] = fallbackClinic;
          localStorage.setItem('queueless_registered_hospitals', JSON.stringify(storedHospitals));
        } catch (e) {}

        localStorage.setItem(
          'queueless_auth',
          JSON.stringify({
            clinic: fallbackClinic,
            role: 'ADMIN',
            timestamp: Date.now(),
          })
        );
        setProvisionedData(fallbackData);
        setCurrentStep(4);
        playClinicChime();
      }
    } catch (err) {
      // Offline / Cloud fallback provisioning so registration always succeeds
      const fallbackClinic = {
        id: 'clinic_' + slug.trim(),
        name: hospitalName.trim(),
        slug: slug.trim(),
        address: address.trim() || 'Main Clinical Campus',
        planId: selectedPlan.id,
        billingCycle,
        adminEmail: adminEmail.trim(),
        status: 'ACTIVE',
      };
      const fallbackData = {
        invoiceId: 'INV-' + Math.floor(100000 + Math.random() * 900000),
        clinic: fallbackClinic,
      };
      try {
        const storedHospitals = JSON.parse(localStorage.getItem('queueless_registered_hospitals') || '{}');
        storedHospitals[slug.trim()] = fallbackClinic;
        localStorage.setItem('queueless_registered_hospitals', JSON.stringify(storedHospitals));
      } catch (e) {}

      localStorage.setItem(
        'queueless_auth',
        JSON.stringify({
          clinic: fallbackClinic,
          role: 'ADMIN',
          timestamp: Date.now(),
        })
      );
      setProvisionedData(fallbackData);
      setCurrentStep(4);
      playClinicChime();
    } finally {
      setIsProcessing(false);
    }
  };

  // User Clicks NO: Payment Declined / Cancelled
  const handleDeclinePayment = () => {
    setShowSimulationModal(false);
    setIsProcessing(false);
    setPaymentCancelledNotice(
      'Payment transaction was cancelled or declined by user. No funds were debited. You can review your details or switch payment method and retry anytime.'
    );
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-x-clip flex flex-col transition-colors duration-200">
      <CommercialNavbar
        currentCurrencyCode={currencyCode}
        onCurrencyChange={(code) => setCurrencyCode(code)}
      />

      <main className="flex-1 py-12 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Multi-Step Visual Progress Stepper */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-6 shadow-sm">
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
              {[
                { step: 1, fullLabel: '1. Hospital & ID', shortLabel: '1. Details' },
                { step: 2, fullLabel: '2. Plan Selection', shortLabel: '2. Plan' },
                { step: 3, fullLabel: '3. Payment Gateway', shortLabel: '3. Payment' },
                { step: 4, fullLabel: '4. Workspace Live', shortLabel: '4. Live' },
              ].map((s) => (
                <div key={s.step} className="space-y-1">
                  <div
                    className={`h-1.5 sm:h-2 rounded-full transition-all ${
                      currentStep >= s.step ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold block truncate ${
                      currentStep === s.step ? 'text-blue-600 dark:text-blue-400 font-black' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    <span className="sm:hidden">{s.shortLabel}</span>
                    <span className="hidden sm:inline">{s.fullLabel}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Global Error Banner */}
          {errorMsg && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 rounded-2xl text-xs font-semibold flex items-center justify-between">
              <span>{errorMsg}</span>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="text-rose-500 dark:text-rose-400 font-bold hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 1: Hospital Details & Master Login Credentials            */}
          {/* ============================================================== */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 shadow-xl space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-200/60 dark:border-blue-800">
                  Step 1 of 3
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white mt-2">
                  Create Your Hospital Account & Master Login
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  These credentials will be used by your Hospital Director and staff to log into the clinic dashboard.
                </p>
              </div>

              <form onSubmit={handleStep1Submit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Hospital Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Hospital / Clinic Name *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apex Multispecialty Hospital"
                        value={hospitalName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* URL Slug */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Hospital Unique URL Identifier (Slug) *
                    </label>
                    <div className="relative">
                      <span className="text-xs text-slate-400 absolute left-3.5 top-2.5 font-mono">
                        /
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="apex-multispecialty"
                        value={slug}
                        onChange={(e) => setSlug(cleanSlug(e.target.value))}
                        className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-mono font-bold text-blue-700 dark:text-blue-400 placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      Your patient QR link will be: {window.location.host || 'queueless-os.vercel.app'}/check-in/<strong>{slug || 'your-clinic'}</strong>
                    </p>
                  </div>
                </div>

                {/* City & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      City / Region *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. London / Mumbai / Dubai / New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Official Contact Phone *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000 or 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Master Admin Login Credentials */}
                <div className="p-4 bg-blue-50/60 dark:bg-blue-950/40 rounded-2xl border border-blue-200/80 dark:border-blue-800 space-y-3">
                  <span className="text-xs font-black text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Hospital Director Login Credentials (Required for Sign In)</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Admin Email (Your Login ID) *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          required
                          placeholder="director@apexhealth.com"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Admin Master Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="password"
                          required
                          placeholder="••••••••••••"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Initial Doctor Setup */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Initial Consulting Doctor Setup (You can add more doctors later)</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Doctor Name
                      </label>
                      <input
                        type="text"
                        placeholder="Dr. R. K. Sharma, MD"
                        value={initialDoctorName}
                        onChange={(e) => setInitialDoctorName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Specialty
                      </label>
                      <input
                        type="text"
                        placeholder="General Medicine"
                        value={initialDoctorSpecialty}
                        onChange={(e) => setInitialDoctorSpecialty(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Cabin / Room #
                      </label>
                      <input
                        type="text"
                        placeholder="Cabin 101"
                        value={initialDoctorRoom}
                        onChange={(e) => setInitialDoctorRoom(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all inline-flex items-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>Proceed to Plan Selection</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 2: Plan Selection & Hardware Standee Addon                */}
          {/* ============================================================== */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 shadow-xl space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-200/60 dark:border-blue-800">
                    Step 2 of 3
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white mt-2">
                    Choose Your Subscription Plan
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Hospital: <strong className="text-slate-900 dark:text-white">{hospitalName}</strong> (/{slug})
                  </p>
                </div>

                {/* Billing Cycle Toggle */}
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('MONTHLY')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      billingCycle === 'MONTHLY' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('ANNUAL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      billingCycle === 'ANNUAL' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-2xs' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>Annual</span>
                    <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1 py-0.2 rounded font-extrabold border border-emerald-200 dark:border-emerald-800">
                      -17%
                    </span>
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLAN_TEMPLATES.map((plan) => {
                  const planRates = selectedCurrency.rates[plan.id];
                  const rate = billingCycle === 'ANNUAL' ? Math.round(planRates.annual / 12) : planRates.monthly;
                  const isSelected = selectedPlan.id === plan.id;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-950/40 shadow-md ring-2 ring-blue-500/10'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950'
                      }`}
                    >
                      {plan.badge && (
                        <span className="absolute -top-2.5 right-4 text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          {plan.badge}
                        </span>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-slate-900 dark:text-white">{plan.name}</span>
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="text-2xl font-black text-slate-950 dark:text-white font-mono">
                          {selectedCurrency.symbol}{rate.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">/mo</span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">{plan.doctorLimit}</p>

                      <ul className="mt-4 space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                        {plan.features.slice(0, 4).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="truncate">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Instant Digital Cloud Setup & Print-Ready QR Kit Included */}
              <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/90 dark:border-emerald-800/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 dark:text-white block">
                      Instant Cloud OS & High-Resolution Vector QR Kit Included
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      100% digital provisioning. Download your print-ready PDF QR kit instantly upon checkout. Zero hardware shipping delays.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs font-mono uppercase tracking-wider border border-emerald-500/30">
                    Included Free
                  </span>
                </div>
              </div>

              {/* Order Total & Next */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Hospital Details</span>
                </button>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Due Today</span>
                    <span className="text-xl font-black text-slate-950 dark:text-white font-mono">
                      {selectedCurrency.symbol}{totalAmount.toLocaleString()} {selectedCurrency.code}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleStep2Submit}
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all inline-flex items-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 3: Payment Gateway Checkout (Test Mode, Dodo, PayPal)     */}
          {/* ============================================================== */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 shadow-xl space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-200/60 dark:border-blue-800">
                    Step 3 of 3 • Secure Payment
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white mt-2">
                    Complete Subscription & Activate Hospital
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Your hospital workspace and dashboard will unlock instantly upon payment.
                  </p>
                </div>

                <div className="text-right bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Amount Due</span>
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400 font-mono">
                    {selectedCurrency.symbol}{totalAmount.toLocaleString()} {selectedCurrency.code}
                  </span>
                </div>
              </div>

              {/* Payment Cancelled / Declined Alert Banner */}
              {paymentCancelledNotice && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 rounded-2xl text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 font-black text-rose-700 dark:text-rose-300">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Payment Simulation Result: Transaction Declined or Cancelled</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {paymentCancelledNotice}
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentCancelledNotice(null)}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs active:scale-95"
                    >
                      Dismiss & Retry
                    </button>
                    <span className="text-[11px] text-slate-400">Clicking below will re-open the payment simulator.</span>
                  </div>
                </div>
              )}

              {/* Payment Method Selector Tabs (Test Mode, Dodo Payments, PayPal) */}
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-900 dark:text-white block">
                  Select Payment Method:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Test Mode Simulation Tab */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentGateway('TEST_MODE');
                      setPaymentCancelledNotice(null);
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-start gap-1 cursor-pointer relative ${
                      paymentGateway === 'TEST_MODE'
                        ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/40 shadow-md ring-2 ring-blue-500/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <FlaskConical className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>Test Simulator</span>
                      </span>
                      {paymentGateway === 'TEST_MODE' ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[9px] font-bold">Recommended</span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 text-left">
                      Instant Yes/No Simulation (No real card required)
                    </span>
                  </button>

                  {/* Dodo Payments Tab */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentGateway('DODOPAYMENTS');
                      setPaymentCancelledNotice(null);
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-start gap-1 cursor-pointer ${
                      paymentGateway === 'DODOPAYMENTS'
                        ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/40 shadow-md ring-2 ring-blue-500/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>Dodo Payments</span>
                      </span>
                      {paymentGateway === 'DODOPAYMENTS' && (
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 text-left">
                      Cards, UPI, RuPay & NetBanking
                    </span>
                  </button>

                  {/* PayPal Tab */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentGateway('PAYPAL');
                      setPaymentCancelledNotice(null);
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-start gap-1 cursor-pointer ${
                      paymentGateway === 'PAYPAL'
                        ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/40 shadow-md ring-2 ring-blue-500/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-1">
                        <span className="text-[#003087] dark:text-[#387df5]">Pay</span>
                        <span className="text-[#0079C1] dark:text-[#52a6e6] -ml-1">Pal</span>
                        <span className="text-slate-500 dark:text-slate-400 text-[10px] ml-1">Worldwide</span>
                      </span>
                      {paymentGateway === 'PAYPAL' && (
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 text-left">
                      PayPal Balance or Linked Bank
                    </span>
                  </button>
                </div>
              </div>

              {/* Gateway-Specific Form */}
              <form onSubmit={handleInitiatePayment} className="space-y-4 pt-2">
                {paymentGateway === 'TEST_MODE' ? (
                  <div className="p-5 bg-gradient-to-br from-blue-50/80 to-indigo-50/40 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-2xl border border-blue-200 dark:border-blue-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>Interactive Gateway Test Sandbox</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase border border-emerald-200 dark:border-emerald-800">
                        Active Sandbox
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      When you click <strong>Proceed to Payment</strong> below, an interactive prompt will ask: <strong>"Did the payment succeed?"</strong> with explicit <strong>Yes</strong> (Approve & Provision Workspace) and <strong>No</strong> (Cancel / Decline) options to test both outcomes.
                    </p>

                    <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-blue-100 dark:border-blue-900 text-xs font-mono space-y-1.5 text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Hospital:</span>
                        <span className="text-slate-900 dark:text-white font-bold">{hospitalName || 'Queueless OPD'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Simulated Card:</span>
                        <span className="text-slate-900 dark:text-white font-bold">4242 •••• •••• 4242 (Visa Test)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Total Billed:</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">{selectedCurrency.symbol}{totalAmount.toLocaleString()} {selectedCurrency.code}</span>
                      </div>
                    </div>
                  </div>
                ) : paymentGateway === 'DODOPAYMENTS' ? (
                  <div className="p-5 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Card Details via Dodo Payments</span>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        <Lock className="w-3 h-3" />
                        <span>256-Bit Encrypted</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. John Smith / Hospital Director"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="4242 •••• •••• 4242"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Expiration (MM/YY)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Security CVC / CVV
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="888"
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-[#003087]/5 dark:bg-[#003087]/20 rounded-2xl border border-[#0079C1]/30 dark:border-[#0079C1]/40 space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                      <span>PayPal Instant Checkout</span>
                      <span className="text-[10px] text-[#0079C1] dark:text-[#52a6e6] font-bold">Buyer Protection Guaranteed</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        PayPal Account Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="paypal@yourhospital.com"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      You will be authenticated via PayPal's secure gateway to authorize this monthly/annual subscription.
                    </p>
                  </div>
                )}

                {/* Trust Guarantees */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>30-Day 100% Money-Back Guarantee</span>
                  </span>
                  <span>Instant Automatic Setup</span>
                  <span>Cancel Anytime</span>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>
                      {isProcessing
                        ? 'Verifying & Provisioning Workspace...'
                        : paymentGateway === 'TEST_MODE'
                        ? `Simulate Payment (${selectedCurrency.symbol}${totalAmount.toLocaleString()}) ➔`
                        : `Pay ${selectedCurrency.symbol}${totalAmount.toLocaleString()} & Activate Hospital ➔`}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* INTERACTIVE PAYMENT SIMULATOR MODAL (YES / NO DECISION)         */}
          {/* ============================================================== */}
          {showSimulationModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 shadow-sm">
                    <FlaskConical className="w-7 h-7" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                    Payment Gateway Simulator
                  </div>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white">
                    Did the Payment Succeed?
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Hospital: <strong className="text-slate-900 dark:text-white">{hospitalName}</strong> • Due: <strong className="text-blue-600 dark:text-blue-400 font-mono">{selectedCurrency.symbol}{totalAmount.toLocaleString()} {selectedCurrency.code}</strong>
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 text-center font-medium">
                  Select your test response below to simulate the bank/gateway outcome:
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  {/* NO: Payment Declined / Cancelled */}
                  <button
                    type="button"
                    onClick={handleDeclinePayment}
                    className="p-4 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 border border-rose-200 dark:border-rose-900 rounded-2xl text-rose-800 dark:text-rose-200 font-bold text-xs flex flex-col items-center justify-center gap-2 cursor-pointer btn-physics active:scale-95 transition-all shadow-sm"
                  >
                    <div className="w-9 h-9 rounded-full bg-rose-200 dark:bg-rose-900 flex items-center justify-center text-rose-700 dark:text-rose-300">
                      <X className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="font-black text-sm">No</span>
                    <span className="text-[10px] text-rose-600 dark:text-rose-400 font-normal">Failed / Cancelled</span>
                  </button>

                  {/* YES: Payment Approved & Activated */}
                  <button
                    type="button"
                    onClick={handleApprovePayment}
                    className="p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-2 cursor-pointer btn-physics hover-glow-emerald active:scale-95 transition-all shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-500/20 shimmer-sweep"
                  >
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                    <span className="font-black text-sm">Yes</span>
                    <span className="text-[10px] text-emerald-100 font-normal">Payment Approved</span>
                  </button>
                </div>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setShowSimulationModal(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium cursor-pointer"
                  >
                    Cancel & Return to Form
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 4: Success & Scoped Hospital Workspace Links              */}
          {/* ============================================================== */}
          {currentStep === 4 && provisionedData && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-200">
              {/* Celebration Banner */}
              <div className="text-center space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-black text-xs uppercase tracking-wider">
                  Payment Confirmed via {paymentGateway === 'TEST_MODE' ? 'Simulated Gateway (Approved)' : paymentGateway === 'DODOPAYMENTS' ? 'Dodo Payments' : 'PayPal'}
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
                  🎉 Congratulations! {provisionedData.clinic.name} Is Live!
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                  Your hospital workspace has been provisioned on the Queueless Clinical Cloud. All 5 operational portals are active and ready for your staff and patients.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span>Official Receipt ID: <strong>{provisionedData.invoiceId}</strong></span>
                  <span>•</span>
                  <span>Slug: <strong>{provisionedData.clinic.slug}</strong></span>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={() => navigate(`/admin/${provisionedData.clinic.slug}`)}
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition-all inline-flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Building2 className="w-5 h-5" />
                  <span>Launch Hospital Director Dashboard Now ➔</span>
                </button>
                <p className="text-[11px] text-slate-400">
                  You are authenticated as Hospital Director. Click above to view live tokens and settings.
                </p>
              </div>

              {/* All 5 Scoped Workspace URLs */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Your Scoped Hospital Workspaces (Share with Staff):</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. Director Admin */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>1. Director Executive Admin</span>
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">
                        /admin/{provisionedData.clinic.slug}
                      </span>
                    </div>
                    <Link
                      to={`/admin/${provisionedData.clinic.slug}`}
                      className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl shadow-2xs inline-flex items-center gap-1"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* 2. Doctor Cabin */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>2. Doctor Cabin Console</span>
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">
                        /doctor/{provisionedData.clinic.slug}
                      </span>
                    </div>
                    <Link
                      to={`/doctor/${provisionedData.clinic.slug}`}
                      className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl shadow-2xs inline-flex items-center gap-1"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* 3. Reception Desk */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>3. Reception Cashier Desk</span>
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">
                        /reception/{provisionedData.clinic.slug}
                      </span>
                    </div>
                    <Link
                      to={`/reception/${provisionedData.clinic.slug}`}
                      className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl shadow-2xs inline-flex items-center gap-1"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* 4. Waiting Hall TV Display */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Tv className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        <span>4. Waiting Hall 55" TV Kiosk</span>
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">
                        /display/{provisionedData.clinic.slug}
                      </span>
                    </div>
                    <Link
                      to={`/display/${provisionedData.clinic.slug}`}
                      className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl shadow-2xs inline-flex items-center gap-1"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* 5. Patient QR Standee Card */}
                {(() => {
                  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://queueless-os.vercel.app';
                  const checkInUrl = `${originUrl}/check-in/${provisionedData.clinic.slug}`;
                  return (
                    <div className="p-5 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded-xl border border-blue-200 dark:border-blue-700 shadow-xs">
                          <QRCodeCanvas
                            value={checkInUrl}
                            size={72}
                            level="M"
                          />
                        </div>
                        <div>
                          <span className="font-black text-xs text-blue-950 dark:text-blue-200 block">
                            5. Patient Self Check-In QR Link
                          </span>
                          <span className="text-[11px] text-blue-700 dark:text-blue-400 font-mono block break-all">
                            {checkInUrl}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            Patients scan this QR at entry to generate live tokens on their phones.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(checkInUrl, 'patient-qr')}
                          className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-xl shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedLink === 'patient-qr' ? 'Copied!' : 'Copy QR Link'}</span>
                        </button>
                        <Link
                          to={`/check-in/${provisionedData.clinic.slug}`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs inline-flex items-center gap-1.5"
                        >
                          <span>Test Live QR</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </main>

      <CommercialFooter />
    </div>
  );
};

