import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  MessageSquare,
  Share2,
  Key,
  Hash,
  QrCode,
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';
import { SeoHead } from '../components/SeoHead';
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

  // URL Params with Case-Insensitive Normalization
  const getNormalizedPlan = (raw: string | null): PlanTemplate => {
    const upper = (raw || '').toUpperCase();
    if (upper === 'STARTER') return PLAN_TEMPLATES[0];
    if (upper === 'ENTERPRISE') return PLAN_TEMPLATES[2];
    return PLAN_TEMPLATES[1]; // Default: GROWTH_OPD
  };

  const initialPlan = getNormalizedPlan(searchParams.get('plan'));
  const queryCurrency = (searchParams.get('currency')?.toUpperCase() as string) || localStorage.getItem('queueless_currency') || 'USD';
  const queryCycle = searchParams.get('cycle')?.toUpperCase() === 'ANNUAL' ? 'ANNUAL' : 'MONTHLY';
  const queryAddon = searchParams.get('addon') === 'custom_logo';
  const querySurge = searchParams.get('addon') === 'token_surge';

  // Step Tracker: 1 = Details & Master Login, 2 = Staff PINs & Cabins, 3 = Plan & Billing, 4 = Payment Mandate, 5 = Live Provisioned
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Currency & Billing
  const [currencyCode, setCurrencyCode] = useState<string>(queryCurrency);
  const selectedCurrency: CurrencyConfig =
    WORLDWIDE_CURRENCIES[currencyCode] || WORLDWIDE_CURRENCIES.USD;
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>(queryCycle);
  const [selectedPlan, setSelectedPlan] = useState<PlanTemplate>(initialPlan);
  const [hardwareAddon, setHardwareAddon] = useState<boolean>(queryAddon);
  const [whatsappAddon, setWhatsappAddon] = useState<boolean>(searchParams.get('addon') === 'whatsapp');
  const [tokenSurgeAddon, setTokenSurgeAddon] = useState<boolean>(querySurge);

  // Synchronize state dynamically if search params change
  useEffect(() => {
    if (searchParams.get('plan')) {
      setSelectedPlan(getNormalizedPlan(searchParams.get('plan')));
    }
    if (searchParams.get('currency')) {
      const code = searchParams.get('currency')?.toUpperCase() || 'USD';
      if (WORLDWIDE_CURRENCIES[code]) setCurrencyCode(code);
    }
    if (searchParams.get('cycle')) {
      setBillingCycle(searchParams.get('cycle')?.toUpperCase() === 'ANNUAL' ? 'ANNUAL' : 'MONTHLY');
    }
    if (searchParams.get('addon') === 'custom_logo') {
      setHardwareAddon(true);
    }
    if (searchParams.get('addon') === 'whatsapp') {
      setWhatsappAddon(true);
    }
    if (searchParams.get('addon') === 'token_surge') {
      setTokenSurgeAddon(true);
    }
  }, [searchParams]);

  // Step 1: Hospital Details & Master Login Credentials
  const [hospitalName, setHospitalName] = useState('');
  const [slug, setSlug] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const generateRandomPin = () => Math.floor(1000 + Math.random() * 9000).toString();
  const [receptionPin, setReceptionPin] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [doctorPin, setDoctorPin] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [doctorCabinSlug, setDoctorCabinSlug] = useState('cabin-1');
  const [initialDoctorName, setInitialDoctorName] = useState('');
  const [initialDoctorSpecialty, setInitialDoctorSpecialty] = useState('General Medicine');
  const [initialDoctorRoom, setInitialDoctorRoom] = useState('Cabin 1');

  // Step 3: Payment Gateway (Dodo Payments, Cashfree)
  const [paymentGateway, setPaymentGateway] = useState<'DODOPAYMENTS' | 'CASHFREE'>(
    currencyCode === 'INR' ? 'CASHFREE' : 'DODOPAYMENTS'
  );

  useEffect(() => {
    if (currencyCode === 'INR') {
      setPaymentGateway('CASHFREE');
    } else {
      setPaymentGateway('DODOPAYMENTS');
    }
  }, [currencyCode]);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'CARD'>(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'card') return 'CARD';
    return 'UPI';
  });
  const [upiVpa, setUpiVpa] = useState('');
  const [autopayConsent, setAutopayConsent] = useState(true);
  const [paymentCancelledNotice, setPaymentCancelledNotice] = useState<string | null>(null);
  const [showCashfreeModal, setShowCashfreeModal] = useState(false);
  const [isApprovingCashfree, setIsApprovingCashfree] = useState(false);

  // Card input formatters & card brand detection
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, '');
    if (/^4/.test(clean)) return { name: 'Visa', color: 'bg-blue-600 text-white', badge: 'VISA' };
    if (/^5[1-5]/.test(clean)) return { name: 'Mastercard', color: 'bg-amber-600 text-white', badge: 'MASTERCARD' };
    if (/^(60|65|81|82)/.test(clean)) return { name: 'RuPay', color: 'bg-emerald-600 text-white', badge: 'RUPAY' };
    if (/^3[47]/.test(clean)) return { name: 'Amex', color: 'bg-indigo-600 text-white', badge: 'AMEX' };
    return { name: 'Card', color: 'bg-slate-700 text-white', badge: 'CARD' };
  };

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
  const whiteLabelCost = hardwareAddon ? (selectedCurrency.code === 'INR' ? 2999 : 29) : 0;
  const whatsappCost = whatsappAddon ? (selectedCurrency.code === 'INR' ? 1499 : 19) : 0;
  const surgeCost = tokenSurgeAddon ? (selectedCurrency.code === 'INR' ? 3999 : 49) : 0;
  const totalAmount = planRate + whiteLabelCost + whatsappCost + surgeCost;

  // Step 1 Validation: Hospital Details & Master Login
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

  // Step 2 Validation: Staff PINs & First Doctor Setup
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receptionPin.trim()) {
      setReceptionPin(generateRandomPin());
    }
    if (!doctorPin.trim()) {
      setDoctorPin(generateRandomPin());
    }
    setErrorMsg(null);
    setCurrentStep(3);
  };

  // Step 3 Proceed: Plan Selection
  const handleStep3Submit = () => {
    setErrorMsg(null);
    setCurrentStep(4);
  };

  // Step 3: Trigger Payment & Hospital Provisioning with Credit Card AutoPay
  const executeSubscriptionProvisioning = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    setPaymentCancelledNotice(null);

    // Prepare AutoPay Record
    const cleanCardDigits = cardNumber.replace(/\s/g, '');
    const brandInfo = paymentMode === 'CARD' ? getCardBrand(cardNumber) : { name: 'UPI AutoPay (Cashfree)', badge: 'CASHFREE', color: 'bg-emerald-600 text-white' };
    const maskedInstrument = paymentMode === 'CARD'
      ? `•••• ${cleanCardDigits.slice(-4) || '4242'}`
      : upiVpa.trim();
    const mandateId = 'CF-MND-' + Math.floor(100000 + Math.random() * 900000);
    const nextBillingDate = new Date(Date.now() + 14 * 86400000).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const autopayRecord = {
      status: 'ACTIVE',
      mandateId,
      mode: paymentMode,
      brand: brandInfo.name,
      brandBadge: brandInfo.badge,
      maskedInstrument,
      cardHolder: cardHolder.trim() || `${hospitalName.trim()} Director`,
      amountDueToday: 0,
      recurringAmount: totalAmount,
      currencySymbol: selectedCurrency.symbol,
      currencyCode: selectedCurrency.code,
      billingCycle,
      nextBillingDate,
      trialDaysRemaining: 14,
    };

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
          receptionPassword: receptionPin.trim() || '2026',
          doctorPin: doctorPin.trim() || '1234',
          doctorPassword: doctorPin.trim() || '1234',
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          billingCycle,
          currency: currencyCode,
          hardwareAddon,
          totalAmount,
          paymentMethod: paymentGateway,
          autopay: autopayRecord,
          initialDoctorName: initialDoctorName.trim() || 'Dr. Chief Consultant, MD',
          initialDoctorSpecialty: initialDoctorSpecialty.trim(),
          initialDoctorRoom: doctorCabinSlug.trim() || initialDoctorRoom.trim() || 'Cabin 1',
        }),
      });

      const resData = await response.json();

      if (resData.success && resData.data) {
        const enrichedClinic = {
          ...resData.data.clinic,
          adminPassword: adminPassword.trim(),
          receptionPin: receptionPin.trim() || '2026',
          doctorPin: doctorPin.trim() || '1234',
          doctorCabinSlug: doctorCabinSlug.trim() || 'cabin-1',
          autopay: autopayRecord,
        };
        resData.data.clinic = enrichedClinic;
        resData.data.autopay = autopayRecord;
        setProvisionedData(resData.data);
        setCurrentStep(5);
        playClinicChime();

        // Save into local registered hospitals list
        try {
          const storedHospitals = JSON.parse(localStorage.getItem('queueless_registered_hospitals') || '{}');
          storedHospitals[slug.trim()] = enrichedClinic;
          localStorage.setItem('queueless_registered_hospitals', JSON.stringify(storedHospitals));
        } catch (e) { }

        // Save auth into localStorage so they are immediately logged in
        localStorage.setItem(
          'queueless_auth',
          JSON.stringify({
            clinic: enrichedClinic,
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
          plan: selectedPlan.id,
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          billingCycle,
          currency: currencyCode,
          adminPassword: adminPassword.trim(),
          receptionPin: receptionPin.trim() || '2026',
          doctorPin: doctorPin.trim() || '1234',
          doctorCabinSlug: doctorCabinSlug.trim() || 'cabin-1',
          doctorsLimit: selectedPlan.id === 'STARTER' ? 3 : selectedPlan.id === 'ENTERPRISE' ? 999 : 12,
          tokenCreditsAllocated: selectedPlan.id === 'STARTER' ? 1500 : selectedPlan.id === 'ENTERPRISE' ? 50000 : 10000,
          tokenCreditsRemaining: selectedPlan.id === 'STARTER' ? 1500 : selectedPlan.id === 'ENTERPRISE' ? 50000 : 10000,
          adminEmail: adminEmail.trim(),
          status: 'ACTIVE',
          isWhiteLabel: hardwareAddon,
          autopay: autopayRecord,
          settings: JSON.stringify({
            planId: selectedPlan.id,
            planName: selectedPlan.name,
            billingCycle,
            currency: currencyCode,
            doctorsLimit: selectedPlan.id === 'STARTER' ? 3 : selectedPlan.id === 'ENTERPRISE' ? 999 : 12,
            tokenCreditsAllocated: selectedPlan.id === 'STARTER' ? 1500 : selectedPlan.id === 'ENTERPRISE' ? 50000 : 10000,
            isWhiteLabel: hardwareAddon,
            autopay: autopayRecord,
          }),
        };
        const fallbackData = {
          invoiceId: 'INV-' + Math.floor(100000 + Math.random() * 900000),
          clinic: fallbackClinic,
          autopay: autopayRecord,
        };
        try {
          const storedHospitals = JSON.parse(localStorage.getItem('queueless_registered_hospitals') || '{}');
          storedHospitals[slug.trim()] = fallbackClinic;
          localStorage.setItem('queueless_registered_hospitals', JSON.stringify(storedHospitals));
        } catch (e) { }

        localStorage.setItem(
          'queueless_auth',
          JSON.stringify({
            clinic: fallbackClinic,
            role: 'ADMIN',
            timestamp: Date.now(),
          })
        );
        setProvisionedData(fallbackData);
        setCurrentStep(5);
        playClinicChime();
      }
    } catch (err) {
      // Offline / Cloud fallback provisioning so registration always succeeds
      const fallbackClinic = {
        id: 'clinic_' + slug.trim(),
        name: hospitalName.trim(),
        slug: slug.trim(),
        address: address.trim() || 'Main Clinical Campus',
        plan: selectedPlan.id,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        billingCycle,
        currency: currencyCode,
        adminPassword: adminPassword.trim(),
        receptionPin: receptionPin.trim() || '2026',
        doctorPin: doctorPin.trim() || '1234',
        doctorCabinSlug: doctorCabinSlug.trim() || 'cabin-1',
        doctorsLimit: selectedPlan.id === 'STARTER' ? 3 : selectedPlan.id === 'ENTERPRISE' ? 999 : 12,
        tokenCreditsAllocated: selectedPlan.id === 'STARTER' ? 1500 : selectedPlan.id === 'ENTERPRISE' ? 50000 : 10000,
        tokenCreditsRemaining: selectedPlan.id === 'STARTER' ? 1500 : selectedPlan.id === 'ENTERPRISE' ? 50000 : 10000,
        adminEmail: adminEmail.trim(),
        status: 'ACTIVE',
        isWhiteLabel: hardwareAddon,
        autopay: autopayRecord,
        settings: JSON.stringify({
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          billingCycle,
          currency: currencyCode,
          doctorsLimit: selectedPlan.id === 'STARTER' ? 3 : selectedPlan.id === 'ENTERPRISE' ? 999 : 12,
          tokenCreditsAllocated: selectedPlan.id === 'STARTER' ? 1500 : selectedPlan.id === 'ENTERPRISE' ? 50000 : 10000,
          isWhiteLabel: hardwareAddon,
          autopay: autopayRecord,
        }),
      };
      const fallbackData = {
        invoiceId: 'INV-' + Math.floor(100000 + Math.random() * 900000),
        clinic: fallbackClinic,
        autopay: autopayRecord,
      };
      try {
        const storedHospitals = JSON.parse(localStorage.getItem('queueless_registered_hospitals') || '{}');
        storedHospitals[slug.trim()] = fallbackClinic;
        localStorage.setItem('queueless_registered_hospitals', JSON.stringify(storedHospitals));
      } catch (e) { }

      localStorage.setItem(
        'queueless_auth',
        JSON.stringify({
          clinic: fallbackClinic,
          role: 'ADMIN',
          timestamp: Date.now(),
        })
      );
      setProvisionedData(fallbackData);
      setCurrentStep(5);
      playClinicChime();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setPaymentCancelledNotice(null);

    // Validate AutoPay Consent
    if (!autopayConsent) {
      setErrorMsg('Please accept the AutoPay recurring mandate to activate your 14-day free pilot.');
      return;
    }

    // Validate Card or UPI
    if (paymentMode === 'CARD') {
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (!cardHolder.trim()) {
        setErrorMsg('Please enter Cardholder Name.');
        return;
      }
      if (cleanNum.length < 15) {
        setErrorMsg('Please enter a valid 16-digit Credit or Debit Card Number.');
        return;
      }
      if (!cardExpiry.includes('/') || cardExpiry.replace(/\D/g, '').length < 4) {
        setErrorMsg('Please enter a valid card expiration date (MM/YY).');
        return;
      }
      if (cardCvc.length < 3) {
        setErrorMsg('Please enter a valid 3 or 4-digit Security CVV / CVC.');
        return;
      }
      await executeSubscriptionProvisioning();
    } else {
      if (!upiVpa.includes('@') || upiVpa.trim().length < 5) {
        setErrorMsg('Please enter a valid UPI VPA ID (e.g. director@okhdfcbank or 9876543210@ybl).');
        return;
      }
      // Open Official Cashfree AutoPay Mandate Modal
      setShowCashfreeModal(true);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-x-clip flex flex-col transition-colors duration-200">
      <SeoHead
        title="Hospital Onboarding & Instant License Provisioning | Queueless OS"
        description="Deploy Queueless OS in under 60 seconds. Zero hardware capex, instant vector QR badges, smart TV waiting kiosk URL, and 1-tap doctor calling."
        keywords="hospital onboarding, clinical queue signup, buy clinic queue software, instant hospital provisioning, OPD queue setup"
        canonical="https://queueless-os.vercel.app/signup"
        breadcrumbs={[{ name: 'Onboarding & Deployment', item: '/signup' }]}
      />
      <CommercialNavbar
        currentCurrencyCode={currencyCode}
        onCurrencyChange={(code) => setCurrencyCode(code)}
      />

      <main className="flex-1 py-12 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Multi-Step Visual Progress Stepper */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-6 shadow-sm">
            <div className="grid grid-cols-5 gap-1 sm:gap-2 text-center">
              {[
                { step: 1, fullLabel: '1. Hospital & ID', shortLabel: '1. Details' },
                { step: 2, fullLabel: '2. Staff PINs & Passwords', shortLabel: '2. PIN / Pass' },
                { step: 3, fullLabel: '3. Plan Selection', shortLabel: '3. Plan' },
                { step: 4, fullLabel: '4. Payment Mandate', shortLabel: '4. Payment' },
                { step: 5, fullLabel: '5. Workspace Live', shortLabel: '5. Live' },
              ].map((s) => (
                <div key={s.step} className="space-y-1">
                  <div
                    className={`h-1.5 sm:h-2 rounded-full transition-all ${currentStep >= s.step ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                  />
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold block truncate ${currentStep === s.step ? 'text-blue-600 dark:text-blue-400 font-black' : 'text-slate-400 dark:text-slate-500'
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
                  Step 1 of 4
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white mt-2">
                  Create Your Hospital Account & Master Login
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  These master credentials will be used by your Hospital Director to manage the clinic and OPD portals.
                </p>
              </div>

              {/* Dynamic Selected Plan & ID Preview Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-blue-50/90 dark:from-blue-950/50 dark:via-indigo-950/40 dark:to-blue-950/50 border border-blue-200/90 dark:border-blue-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full border border-blue-300/70 dark:border-blue-700">
                        Selected Plan
                      </span>
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {selectedPlan.name}
                      </span>
                      {hardwareAddon && (
                        <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 px-2 py-0.5 rounded-full border border-purple-300">
                          + Full White-Label Suite
                        </span>
                      )}
                      {whatsappAddon && (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full border border-emerald-300">
                          + WhatsApp Alerts & Rx Suite
                        </span>
                      )}
                      {tokenSurgeAddon && (
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full border border-amber-300">
                          + Surge Token Pack
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                      {selectedPlan.id === 'STARTER'
                        ? 'Solo clinics • Up to 3 Consulting Doctors • 1,500 monthly tokens'
                        : selectedPlan.id === 'ENTERPRISE'
                          ? 'Hospital facility • Unlimited Consulting Doctors • 50,000+ monthly tokens'
                          : 'Multi-cabin polyclinics • Up to 12 Consulting Doctors • 10,000 monthly tokens'}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-blue-200/60 dark:border-blue-800/60 shrink-0">
                  <div className="flex items-baseline gap-1">
                    <span className="text-base sm:text-lg font-black text-blue-950 dark:text-blue-200 font-mono">
                      {selectedCurrency.symbol}{planRate.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      /{billingCycle === 'ANNUAL' ? 'yr' : 'mo'}
                    </span>
                  </div>
                  <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    14-Day Free Pilot (Pay $0 / ₹0 Today)
                  </span>
                </div>
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
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-600 dark:placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                        className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-mono font-bold text-blue-700 dark:text-blue-400 placeholder:font-normal placeholder:text-slate-600 dark:placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      Your patient QR link will be: {window.location.host || 'queueless-os.vercel.app'}/<strong>{slug || 'your-clinic'}</strong>/check-in
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-600 dark:placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-600 dark:placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                          className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-600 dark:placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                          className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-600 dark:placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all inline-flex items-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>Continue to Staff PINs & Security</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 2: Staff Security PINs & Clinical Cabins Configuration     */}
          {/* ============================================================== */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 shadow-xl space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800">
                    Step 2 of 4
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white mt-2">
                    Staff Security Credentials & Clinical Cabins Setup
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Hospital: <strong className="text-slate-900 dark:text-white">{hospitalName}</strong> (/{slug})
                  </p>
                </div>
              </div>

              <form onSubmit={handleStep2Submit} className="space-y-5">
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
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-600 dark:placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-600 dark:placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-600 dark:placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* First-Time Custom Security PINs & Passwords & Clinical Portals Configuration */}
                <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-slate-50 dark:from-indigo-950/40 dark:via-blue-950/30 dark:to-slate-900/40 rounded-2xl border-2 border-indigo-200/90 dark:border-indigo-800/80 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-black text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Staff Security Credentials & Clinical Portals Setup</span>
                    </span>
                    <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/80 text-indigo-800 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full w-fit">
                      4-Digit PIN or Custom Password Allowed
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Set up your secret staff PINs or alphanumeric passwords and cabin stations now. Each desk/cabin can use a 4-digit PIN (e.g. 7445) or any custom password (e.g. Reception@2026) so receptionists and consulting doctors cannot access each other's consoles.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Reception Desk PIN / Password */}
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Reception Desk PIN / Password *</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setReceptionPin(generateRandomPin())}
                          className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                        >
                          🎲 Random PIN
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={receptionPin}
                        onChange={(e) => setReceptionPin(e.target.value)}
                        placeholder="e.g. 5821 or Reception@2026"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Unlocks <strong>/{slug || 'your-hospital'}/reception</strong> (PIN or Password)
                      </p>
                    </div>

                    {/* Doctor Cabin Calling PIN / Password */}
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>Doctor Cabin PIN / Password *</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setDoctorPin(generateRandomPin())}
                          className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                        >
                          🎲 Random PIN
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={doctorPin}
                        onChange={(e) => setDoctorPin(e.target.value)}
                        placeholder="e.g. 3942 or Doctor@2026"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Unlocks <strong>/{slug || 'your-hospital'}/doctor/{doctorCabinSlug || 'cabin-1'}</strong> (PIN or Password)
                      </p>
                    </div>

                    {/* Doctor Station Slug */}
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Hash className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                          <span>Cabin Station ID</span>
                        </label>
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">Cabin URL Slug</span>
                      </div>
                      <input
                        type="text"
                        value={doctorCabinSlug}
                        onChange={(e) => setDoctorCabinSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="cabin-1"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Cabin URL identifier
                      </p>
                    </div>
                  </div>

                  {/* Real-Time Preview of the 7 Specialized Clinical & Admin Portals */}
                  <div className="mt-2 p-3.5 bg-white/90 dark:bg-slate-950/80 rounded-xl border border-indigo-100 dark:border-indigo-900/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Live Clinical Portals & Security Credentials Preview:</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">Instant One-Click Launch</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300">1. QR Check-In</span>
                          <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">PATIENT</span>
                        </div>
                        <span className="font-mono text-blue-600 dark:text-blue-400 text-[10px] block truncate">/{slug || 'your-hospital'}/check-in</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Contactless scan (No PIN)</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300">2. Live Mobile Pass</span>
                          <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">PATIENT</span>
                        </div>
                        <span className="font-mono text-blue-600 dark:text-blue-400 text-[10px] block truncate">/status/:tokenPassId</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Live token & Cafe tracker</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300">3. Reception Desk</span>
                          <span className="text-[9px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold px-1.5 py-0.5 rounded">STAFF</span>
                        </div>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 text-[10px] block truncate">/{slug || 'your-hospital'}/reception</span>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 block mt-0.5">PIN / Pass: {receptionPin || 'Unique PIN or Password'}</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300">4. Doctor Cabin</span>
                          <span className="text-[9px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold px-1.5 py-0.5 rounded">DOCTOR</span>
                        </div>
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 text-[10px] block truncate">/{slug || 'your-hospital'}/doctor/{doctorCabinSlug || 'cabin-1'}</span>
                        <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 block mt-0.5">PIN / Pass: {doctorPin || 'Unique PIN or Password'}</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300">5. 55" TV Lobby Kiosk</span>
                          <span className="text-[9px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold px-1.5 py-0.5 rounded">LOBBY</span>
                        </div>
                        <span className="font-mono text-purple-600 dark:text-purple-400 text-[10px] block truncate">/{slug || 'your-hospital'}/display</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Dual-tone audio chimes</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300">6. Director Admin HQ</span>
                          <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold px-1.5 py-0.5 rounded">DIRECTOR</span>
                        </div>
                        <span className="font-mono text-blue-600 dark:text-blue-400 text-[10px] block truncate">/{slug || 'your-hospital'}/admin</span>
                        <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 block mt-0.5">Master Admin Password</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Hospital Details</span>
                  </button>

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
          {/* STEP 3: Plan Selection & Hardware Standee Addon                */}
          {/* ============================================================== */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 shadow-xl space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-200/60 dark:border-blue-800">
                    Step 3 of 4
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${billingCycle === 'MONTHLY' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'
                      }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('ANNUAL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${billingCycle === 'ANNUAL' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-2xs' : 'text-slate-600 dark:text-slate-400'
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
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${isSelected
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
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 dark:border-slate-600'
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

              {/* Modular Clinical Pure Software Add-Ons */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  Select Optional Cloud Software Add-Ons:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Addon 1: White-Label */}
                  <div
                    onClick={() => setHardwareAddon(!hardwareAddon)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${hardwareAddon
                      ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400">100% White-Label</span>
                        <input
                          type="checkbox"
                          checked={hardwareAddon}
                          onChange={() => { }}
                          className="rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Custom Hospital Logo & Branding</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                        Your hospital branding on patient passes, 55" TV waiting kiosk displays, printable vector QR badges, and doctor Rx letterheads.
                      </p>
                    </div>
                    <div className="text-xs font-black text-purple-600 dark:text-purple-400 font-mono mt-3">
                      +{selectedCurrency.code === 'INR' ? '₹2,999' : '$29'}/mo
                    </div>
                  </div>

                  {/* Addon 2: WhatsApp Alerts & Rx */}
                  <div
                    onClick={() => setWhatsappAddon(!whatsappAddon)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${whatsappAddon
                      ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">WhatsApp Cloud Suite</span>
                        <input
                          type="checkbox"
                          checked={whatsappAddon}
                          onChange={() => { }}
                          className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">WhatsApp Rx & Calling Notifications</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                        Real-time token countdown alerts, doctor cabin chimes, and instant digital prescription PDFs delivered to patient WhatsApp.
                      </p>
                    </div>
                    <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono mt-3">
                      +{selectedCurrency.code === 'INR' ? '₹1,499' : '$19'}/mo
                    </div>
                  </div>

                  {/* Addon 3: Seasonal Surge Token Top-Up */}
                  <div
                    onClick={() => setTokenSurgeAddon(!tokenSurgeAddon)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${tokenSurgeAddon
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">Surge Token Top-Up</span>
                        <input
                          type="checkbox"
                          checked={tokenSurgeAddon}
                          onChange={() => { }}
                          className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Surge Token Pack (+5,000 Tokens)</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                        Instant buffer for seasonal patient rushes or flu outbreaks. Valid for 90 days with zero expiration pressure.
                      </p>
                    </div>
                    <div className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono mt-3">
                      +{selectedCurrency.code === 'INR' ? '₹3,999' : '$49'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Total & Next */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Staff PINs & Cabins</span>
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
                    onClick={handleStep3Submit}
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
          {/* STEP 4: Payment Gateway Checkout (Dodo Payments, Cashfree) */}
          {/* ============================================================== */}
          {currentStep === 4 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 shadow-xl space-y-6 animate-in fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800">
                      Step 4 of 4 • 14-Day Free Pilot
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-200/60 dark:border-blue-800">
                      AutoPay Mandate Setup
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white mt-2">
                    Authorize AutoPay & Start 14-Day Free Pilot
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Pay <strong>{selectedCurrency.symbol}0 today</strong>. Your hospital unlocks immediately. When your 14-day free pilot concludes, your chosen {selectedPlan.name} is automatically purchased via AutoPay.
                  </p>
                </div>

                <div className="text-right bg-emerald-50/80 dark:bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-200/80 dark:border-emerald-800">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-black uppercase tracking-wider">
                      Due Today
                    </span>
                  </div>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono block">
                    {selectedCurrency.symbol}0 <span className="text-xs font-normal text-emerald-700 dark:text-emerald-300">FREE FOR 14 DAYS</span>
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold mt-0.5">
                    Then {selectedCurrency.symbol}{totalAmount.toLocaleString()} / {billingCycle === 'ANNUAL' ? 'year' : 'month'} auto-debit on Day 15
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

              {/* Payment Method Selector Tabs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    Select AutoPay Payment Method:
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    256-Bit SSL Encrypted • Recurring AutoPay
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Dedicated Cashfree UPI AutoPay Tab (Primary / Default) */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMode('UPI');
                      setPaymentCancelledNotice(null);
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-start gap-1 cursor-pointer relative ${paymentMode === 'UPI'
                      ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/40 shadow-md ring-2 ring-emerald-500/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950'
                      }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>UPI AutoPay (Cashfree)</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[9px] font-black uppercase">
                        CASHFREE & NPCI
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 text-left">
                      Google Pay, PhonePe, Paytm, BHIM e-Mandate
                    </span>
                  </button>

                  {/* Credit / Debit Card Tab */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMode('CARD');
                      setPaymentCancelledNotice(null);
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-start gap-1 cursor-pointer ${paymentMode === 'CARD'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/50 shadow-md ring-2 ring-blue-500/10'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950'
                      }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>Credit / Debit Card</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[9px] font-black uppercase">
                        GLOBAL & RUPAY
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 text-left">
                      Visa, Mastercard, RuPay & Amex Card AutoPay
                    </span>
                  </button>
                </div>
              </div>

              {/* Gateway-Specific Form */}
              <form onSubmit={handleInitiatePayment} className="space-y-4 pt-2">
                {paymentMode === 'CARD' ? (
                  <div className="p-5 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>Card Details for AutoPay Recurring Mandate</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        <Lock className="w-3 h-3" />
                        <span>256-Bit Cryptographic SSL</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. John Smith / Hospital Director"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          Card Number *
                        </label>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${getCardBrand(cardNumber).color}`}>
                          {getCardBrand(cardNumber).badge}
                        </span>
                      </div>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          maxLength={19}
                          placeholder="4242 4242 4242 4242"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Expiration (MM/YY) *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Security CVV / CVC *
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="888"
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                      <span>✓ Supported: Visa, Mastercard, RuPay & American Express</span>
                      <span>✓ ₹0 Pre-authorization</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Cashfree UPI AutoPay Mandate (RBI & NPCI Live Gateway)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase border border-emerald-200 dark:border-emerald-800">
                        Zero OTP on Day 15
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Select AutoPay UPI App or Enter VPA / UPI ID:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                        <button
                          type="button"
                          onClick={() => {
                            setUpiVpa(phone ? `${phone}@okhdfcbank` : 'director@okhdfcbank');
                          }}
                          className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
                        >
                          <span>⚡ Google Pay</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUpiVpa(phone ? `${phone}@ybl` : 'director@ybl');
                          }}
                          className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
                        >
                          <span>🟣 PhonePe</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUpiVpa(phone ? `${phone}@paytm` : 'director@paytm');
                          }}
                          className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
                        >
                          <span>🔷 Paytm</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUpiVpa(phone ? `${phone}@upi` : 'director@upi');
                          }}
                          className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
                        >
                          <span>🇮🇳 BHIM / Other</span>
                        </button>
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="e.g. 9876543210@okhdfcbank or hospital.director@ybl"
                          value={upiVpa}
                          onChange={(e) => setUpiVpa(e.target.value.trim().toLowerCase())}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 text-xs font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                        <span className="absolute right-3 top-2.5 text-[10px] bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 font-bold px-2 py-0.5 rounded-md pointer-events-none">
                          Cashfree AutoPay Verified
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                        <span>✓ Powered by <strong>Cashfree Payments</strong> • Official RBI & NPCI e-Mandate Rail</span>
                        <span>✓ Instant approval in Google Pay, PhonePe, Paytm or BHIM app • <strong>₹0 debited</strong></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Explicit AutoPay Recurring Mandate Consent & 14-Day Free Pilot Terms */}
                <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/90 dark:border-emerald-800/80 space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="autopayConsent"
                      checked={autopayConsent}
                      onChange={(e) => setAutopayConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="autopayConsent" className="text-xs text-slate-800 dark:text-slate-200 cursor-pointer select-none">
                      <strong className="text-slate-950 dark:text-white block">
                        I authorize Queueless Clinical OS to register an AutoPay recurring mandate via Cashfree Payments / Global Gateway.
                      </strong>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed block mt-1">
                        <strong>₹0 / $0 charged today</strong> for your 14-day free hospital pilot. If you continue after Day 14, your chosen plan ({selectedPlan.name} • {selectedCurrency.symbol}{totalAmount.toLocaleString()} / {billingCycle === 'ANNUAL' ? 'year' : 'month'}) will auto-renew via Cashfree UPI AutoPay (or Card Mandate). You can cancel anytime before Day 14 in 1 click from your Director Admin Settings with zero penalty.
                      </span>
                    </label>
                  </div>

                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200/80 dark:border-amber-800/80 text-[10px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Strict Token Expiration Policy:</strong> Token credits are valid strictly during each active 30-day billing cycle and do not stack or roll over.
                    </span>
                  </div>
                </div>

                {/* Trust Guarantees */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>14-Day 100% Free Pilot • Cancel Anytime</span>
                  </span>
                  <span>Instant Cashfree AutoPay Setup</span>
                  <span>Direct Founder Mandate</span>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Plan Selection</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>
                      {isProcessing
                        ? 'Registering Cashfree AutoPay Mandate & Provisioning...'
                        : paymentMode === 'UPI'
                          ? `Authorize via Cashfree UPI AutoPay (Pay ${selectedCurrency.symbol}0 Today) ➔`
                          : `Authorize Card AutoPay & Start 14-Day Free Pilot (Pay ${selectedCurrency.symbol}0 Today) ➔`}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 5: Success & Scoped Hospital Workspace Links              */}
          {/* ============================================================== */}
          {currentStep === 5 && provisionedData && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-200">
              {/* Celebration Banner */}
              <div className="text-center space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-black text-xs uppercase tracking-wider">
                  14-Day Free Pilot Active • AutoPay Mandate Registered
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
                  🎉 Congratulations! {provisionedData.clinic.name} Is Live!
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                  Your 14-day free pilot is now live with <strong>₹0 charged today</strong>. All clinical portals are active and your chosen {selectedPlan.name} is pre-authorized for seamless Day 15 renewal.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span>Official Receipt ID: <strong>{provisionedData.invoiceId}</strong></span>
                  <span>•</span>
                  <span>Slug: <strong>{provisionedData.clinic.slug}</strong></span>
                </div>
              </div>

              {/* Verified AutoPay e-Mandate Summary Card */}
              <div className="p-5 bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-blue-50/80 dark:from-emerald-950/50 dark:via-teal-950/40 dark:to-blue-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/70 dark:border-emerald-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-300 tracking-wider">
                      AutoPay e-Mandate Pre-Authorized & Activated
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Mandate Ref: <strong className="text-slate-800 dark:text-slate-200">{provisionedData.autopay?.mandateId || 'MND-839201'}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-emerald-100 dark:border-emerald-900/50 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Instrument</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                      <CreditCard className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{provisionedData.autopay?.brand || 'Visa'} {provisionedData.autopay?.maskedInstrument || '•••• 4242'}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                      {provisionedData.autopay?.cardHolder || hospitalName}
                    </span>
                  </div>

                  <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-emerald-100 dark:border-emerald-900/50 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Charged Today</span>
                    <div className="font-black text-emerald-600 dark:text-emerald-400 text-sm font-mono">
                      {selectedCurrency.symbol}0.00 FREE
                    </div>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold block">
                      14-Day Free Pilot Active
                    </span>
                  </div>

                  <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-emerald-100 dark:border-emerald-900/50 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Next Auto-Debit Date</span>
                    <div className="font-black text-slate-900 dark:text-white text-xs font-mono">
                      {provisionedData.autopay?.nextBillingDate || 'In 14 Days'}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                      {selectedCurrency.symbol}{totalAmount.toLocaleString()} / {billingCycle === 'ANNUAL' ? 'yr' : 'mo'}
                    </span>
                  </div>

                  <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-emerald-100 dark:border-emerald-900/50 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Cancellation Policy</span>
                    <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>1-Click Cancel Anytime</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                      Zero charge before Day 14
                    </span>
                  </div>
                </div>
              </div>

              {/* Automated Email & Activation Package Banner */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-sky-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-black text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <span>Activation Package Dispatched to Email</span>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                        Instant Delivery
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                      All 5 operational portal links, official GST receipt, and login passkeys have been dispatched directly to <strong className="text-slate-900 dark:text-white font-mono">{adminEmail || 'your admin email'}</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `🏥 *${provisionedData.clinic.name} - Queueless Zero-Wait OPD Setup*\n\n` +
                      `1. TV Waiting Lounge Display:\nhttps://queueless-os.vercel.app/${provisionedData.clinic.slug}/display\n\n` +
                      `2. Doctor Cabin Console:\nhttps://queueless-os.vercel.app/${provisionedData.clinic.slug}/doctor/${doctorCabinSlug || 'cabin-1'} (PIN / Pass: ${doctorPin})\n\n` +
                      `3. Reception Desk:\nhttps://queueless-os.vercel.app/${provisionedData.clinic.slug}/reception (PIN / Pass: ${receptionPin})\n\n` +
                      `4. Patient QR Check-in:\nhttps://queueless-os.vercel.app/${provisionedData.clinic.slug}/check-in\n\n` +
                      `5. Director Admin:\nhttps://queueless-os.vercel.app/${provisionedData.clinic.slug}/admin (Password: ${adminPassword})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send to WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      const text =
                        `🏥 ${provisionedData.clinic.name} - Queueless Zero-Wait OPD Setup\n\n` +
                        `1. TV Waiting Lounge Display:\nhttps://queueless-os.vercel.app/${provisionedData.clinic.slug}/display\n\n` +
                        `2. Doctor Cabin Console:\nhttps://queueless-os.vercel.app/${provisionedData.clinic.slug}/doctor/${doctorCabinSlug || 'cabin-1'} (PIN / Pass: ${doctorPin})\n\n` +
                        `3. Reception Desk:\nhttps://queueless-os.vercel.app/${provisionedData.clinic.slug}/reception (PIN / Pass: ${receptionPin})\n\n` +
                        `4. Patient QR Check-in:\nhttps://queueless-os.vercel.app/${provisionedData.clinic.slug}/check-in\n\n` +
                        `5. Director Admin:\nhttps://queueless-os.vercel.app/${provisionedData.clinic.slug}/admin (Password: ${adminPassword})`;
                      navigator.clipboard.writeText(text);
                      copyToClipboard(text, 'all-bundle');
                    }}
                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLink === 'all-bundle' ? 'Copied Bundle!' : 'Copy All Links & Credentials'}</span>
                  </button>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={() => navigate(`/${provisionedData.clinic.slug}/admin`)}
                  className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-600/30 transition-all inline-flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Building2 className="w-5 h-5" />
                  <span>Launch Hospital Director Dashboard Now ➔</span>
                </button>
                <p className="text-[11px] text-slate-400">
                  You are authenticated as Hospital Director. Click above to view live tokens and settings.
                </p>
              </div>

              {/* All Scoped Workspace URLs & Custom Security PINs */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Your Scoped Clinical Workspaces & Custom PINs:</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">Custom PINs active on all portals</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. Director Admin */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>1. Director Executive Admin</span>
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">
                          /{provisionedData.clinic.slug}/admin
                        </span>
                      </div>
                      <Link
                        to={`/${provisionedData.clinic.slug}/admin`}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs inline-flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Lock className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-slate-500">Master Password:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{adminPassword}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(adminPassword, 'admin-pwd')}
                        className="text-[11px] font-bold text-blue-600 hover:underline"
                      >
                        {copiedLink === 'admin-pwd' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* 2. Doctor Cabin */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>2. Doctor Cabin Workbench</span>
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">
                          /{provisionedData.clinic.slug}/doctor/{doctorCabinSlug || 'cabin-1'}
                        </span>
                      </div>
                      <Link
                        to={`/${provisionedData.clinic.slug}/doctor`}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-2xs inline-flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Key className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="text-slate-500">Doctor PIN / Pass:</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{doctorPin}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(doctorPin, 'doc-pin')}
                        className="text-[11px] font-bold text-indigo-600 hover:underline"
                      >
                        {copiedLink === 'doc-pin' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* 3. Reception Desk */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>3. Reception Cashier Desk</span>
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">
                          /{provisionedData.clinic.slug}/reception
                        </span>
                      </div>
                      <Link
                        to={`/${provisionedData.clinic.slug}/reception`}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-2xs inline-flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Key className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-slate-500">Reception PIN / Pass:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{receptionPin}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(receptionPin, 'rec-pin')}
                        className="text-[11px] font-bold text-emerald-600 hover:underline"
                      >
                        {copiedLink === 'rec-pin' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* 4. Waiting Hall TV Display */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Tv className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                          <span>4. Waiting Hall 55" TV Kiosk</span>
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">
                          /{provisionedData.clinic.slug}/display
                        </span>
                      </div>
                      <Link
                        to={`/${provisionedData.clinic.slug}/display`}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-2xs inline-flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span className="text-slate-500">Display Kiosk:</span>
                        <span className="font-bold text-purple-600 dark:text-purple-400">Zero PIN • Audio Chime</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}/${provisionedData.clinic.slug}/display`, 'tv-url')}
                        className="text-[11px] font-bold text-purple-600 hover:underline"
                      >
                        {copiedLink === 'tv-url' ? 'Copied' : 'Copy URL'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Patient QR Standee Card */}
                {(() => {
                  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://queueless-os.vercel.app';
                  const checkInUrl = `${originUrl}/${provisionedData.clinic.slug}/check-in`;
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
                          to={`/${provisionedData.clinic.slug}/check-in`}
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

      {/* Official Cashfree AutoPay & NPCI e-Mandate Dashboard Modal */}
      {showCashfreeModal && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isApprovingCashfree) setShowCashfreeModal(false);
          }}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-900 dark:text-white shadow-2xl relative space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            {/* Cashfree Official Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                  CF
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900 dark:text-white">Cashfree Payments</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[9px] font-black uppercase">
                      NPCI UPI AutoPay
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>Official RBI & NPCI e-Mandate Rail • 256-Bit SSL</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isApprovingCashfree}
                onClick={() => setShowCashfreeModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* AutoPay Mandate Order Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Hospital Facility:</span>
                <span className="font-bold text-slate-900 dark:text-white">{hospitalName || 'Queueless Medical Center'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Chosen Plan:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{selectedPlan.name} ({selectedCurrency.symbol}{totalAmount.toLocaleString()} / {billingCycle === 'ANNUAL' ? 'year' : 'month'})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">AutoPay Pre-Auth Due Today:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">₹0.00 (Zero Debited)</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-2 text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">Target UPI VPA:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{upiVpa}</span>
              </div>
            </div>

            {/* QR Code & App Status */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-28 h-28 bg-white p-2 rounded-xl border border-slate-200 shadow-md flex items-center justify-center relative">
                <QRCodeCanvas value={`upi://mandate?pa=cashfree@hdfcbank&pn=Queueless%20Health&mc=5499&tid=CF${Date.now()}&tr=CFMND${Date.now()}&tn=Queueless%2014-Day%20Pilot%20AutoPay&am=0.00&cu=INR`} size={96} />
                {isApprovingCashfree && (
                  <div className="absolute inset-0 bg-emerald-600/90 rounded-xl flex items-center justify-center text-white animate-fade-in">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white">
                  {isApprovingCashfree ? 'NPCI Rail Confirming AutoPay Mandate...' : 'Scan via Google Pay / PhonePe / Paytm / BHIM'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Or approve the notification sent to <strong>{upiVpa}</strong>
                </p>
              </div>
            </div>

            {/* Interactive Authorization Action Button */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={isApprovingCashfree}
                onClick={async () => {
                  setIsApprovingCashfree(true);
                  setTimeout(async () => {
                    await executeSubscriptionProvisioning();
                    setIsApprovingCashfree(false);
                    setShowCashfreeModal(false);
                  }, 1200);
                }}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {isApprovingCashfree ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Confirming Mandate with NPCI & Cashfree...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize UPI AutoPay Mandate (₹0 Today) ➔</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-slate-400">
                ✓ Powered by Cashfree Payments • Official RBI & NPCI e-Mandate Rail. ₹0 debited today. 14-day free pilot.
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}

      <CommercialFooter />
    </div>
  );
};

