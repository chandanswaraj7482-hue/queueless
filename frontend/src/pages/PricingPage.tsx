import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  Zap,
  ShieldCheck,
  CreditCard,
  Building2,
  Lock,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Phone,
  Check,
  Award,
  ShieldAlert,
  MessageSquare,
  Printer,
  Coins,
  X,
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';
import { SeoHead } from '../components/SeoHead';
import {
  WORLDWIDE_CURRENCIES,
  PLAN_TEMPLATES,
  FAQS,
  PlanTemplate,
  CurrencyConfig,
  FaqCategory,
} from '../data/commercialData';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryCurrency = searchParams.get('currency')?.toUpperCase();

  const [currencyCode, setCurrencyCode] = useState<string>(() => {
    if (queryCurrency && WORLDWIDE_CURRENCIES[queryCurrency]) return queryCurrency;
    return localStorage.getItem('queueless_currency') || 'USD';
  });

  useEffect(() => {
    if (queryCurrency && WORLDWIDE_CURRENCIES[queryCurrency]) {
      setCurrencyCode(queryCurrency);
      localStorage.setItem('queueless_currency', queryCurrency);
    }
  }, [queryCurrency]);

  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const [faqCategory, setFaqCategory] = useState<FaqCategory>('ALL');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showSurgeModal, setShowSurgeModal] = useState(false);
  const [selectedSurgePack, setSelectedSurgePack] = useState<'5K' | '15K' | '50K'>('15K');

  const selectedCurrency: CurrencyConfig =
    WORLDWIDE_CURRENCIES[currencyCode] || WORLDWIDE_CURRENCIES.USD;

  const handleSelectPlan = (plan: PlanTemplate) => {
    navigate(`/signup?plan=${plan.id}&currency=${currencyCode}&cycle=${billingCycle}`);
  };

  const filteredFaqs =
    faqCategory === 'ALL'
      ? FAQS
      : FAQS.filter((f) => f.category === faqCategory);

  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-x-clip flex flex-col transition-colors duration-200">
      <SeoHead
        title="Clinical Queue OS Pricing & Hospital Location Plans"
        description="Predictable hospital queue management pricing starting at $149/mo (₹9,999/mo) per clinic location. Zero setup fees, unlimited OPD doctors, smart TV kiosks included."
        keywords="hospital queue pricing, clinic queue cost, OPD token software price, ABDM queue license, zero capex clinic OS"
        canonical="https://queueless-os.vercel.app/pricing"
      />
      <CommercialNavbar
        currentCurrencyCode={currencyCode}
        onCurrencyChange={(code) => setCurrencyCode(code)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-8 sm:pt-24 sm:pb-10 px-4 sm:px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 rounded-full text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-300 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Transparent Healthcare SaaS • Zero Setup Fees</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
              Predictable, Zero-Capex Plans <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 dark:from-blue-400 dark:via-indigo-400 dark:to-teal-300 bg-clip-text text-transparent">
                for Every Healthcare Practice.
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
              Eliminate paper tokens and lobby crowding with predictable, credit-based plans matched to your OPD patient footfall. Includes instant pay-as-you-grow token refills for seasonal surges.
            </p>

            {/* High-Conversion Interactive Billing Cycle Segmented Control */}
            <div className="pt-3 sm:pt-4 flex flex-col items-center justify-center gap-2">
              <div className="p-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 backdrop-blur-md inline-flex items-center shadow-inner">
                {/* Monthly Button */}
                <button
                  type="button"
                  onClick={() => setBillingCycle('MONTHLY')}
                  className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs font-black transition-all cursor-pointer ${billingCycle === 'MONTHLY'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-md scale-100 ring-1 ring-slate-900/5 dark:ring-white/10'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  Monthly Billing
                </button>

                {/* Annual Button with Savings Pill */}
                <button
                  type="button"
                  onClick={() => setBillingCycle('ANNUAL')}
                  className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 ${billingCycle === 'ANNUAL'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-100'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  <span>Annual Billing</span>
                  <span
                    className={`px-1.5 py-0.5 sm:px-2 rounded-full text-[9px] font-black uppercase tracking-wider transition-colors ${billingCycle === 'ANNUAL'
                        ? 'bg-emerald-400 text-slate-950 shadow-2xs'
                        : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      }`}
                  >
                    <span className="hidden sm:inline">Save ~17% (2 Mo Free)</span>
                    <span className="sm:hidden">Save 17%</span>
                  </span>
                </button>
              </div>

              {/* Real-time Dynamic Feedback Hint */}
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 animate-in fade-in duration-200">
                {billingCycle === 'ANNUAL' ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Annual discount applied: Pay for 10 months, get 12 months full service.</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>Flexible month-to-month billing with zero lock-in or cancellation penalties.</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards Grid */}
        <section className="pb-20 px-4 sm:px-6 relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {PLAN_TEMPLATES.map((plan) => {
              const rates = selectedCurrency.rates[plan.id];
              const displayRate =
                billingCycle === 'ANNUAL'
                  ? Math.round(rates.annual / 12)
                  : rates.monthly;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-5 sm:p-8 flex flex-col justify-between transition-all card-interactive ${plan.highlight
                      ? 'bg-white dark:bg-slate-900 border-2 border-blue-600 dark:border-blue-500 shadow-2xl shadow-blue-500/15 lg:scale-102 ring-4 ring-blue-500/10'
                      : 'bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 shadow-lg hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl'
                    }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[10px] tracking-wider uppercase shadow-md whitespace-nowrap shimmer-sweep">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">{plan.tagline}</p>

                    {/* Price Header */}
                    <div className="mt-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-950 dark:text-white font-mono">
                          {selectedCurrency.symbol}
                          {displayRate.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {plan.id === 'ENTERPRISE' ? '/ hospital location / month' : '/ clinic location / month'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                        {billingCycle === 'ANNUAL'
                          ? `Billed annually (${selectedCurrency.symbol}${rates.annual.toLocaleString()}/yr)`
                          : 'Billed monthly with zero lock-in'}
                      </p>
                    </div>

                    {/* Specs info */}
                    <div className="py-4 space-y-2 border-b border-slate-100 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                        <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>{plan.doctorLimit}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-[11px]">
                        <span className="font-semibold text-slate-500">Setup:</span>
                        <span>{plan.hardwareIncluded}</span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="pt-5 space-y-2.5">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Included In This Plan:
                      </p>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => {
                          let displayFeature = feature;
                          if (billingCycle === 'ANNUAL') {
                            displayFeature = displayFeature
                              .replace(/AutoPay Monthly Renewal/g, 'Annual AutoPay Renewal (Save ~17% • 2 Months Free)')
                              .replace(/Auto-Renews Day 15/g, 'Auto-Renews Annually on Day 15 (Save ~17% • 2 Months Free)')
                              .replace(/AutoPay Recurring Mandate/g, 'Annual Corporate AutoPay (Save ~17% Billed Annually)');
                          }
                          return (
                            <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              <span>{displayFeature}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  {/* Card CTA */}
                  <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer btn-physics ${plan.highlight
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 ring-2 ring-blue-500/20 active:scale-95 shimmer-sweep hover-glow-blue'
                          : plan.id === 'ENTERPRISE'
                            ? 'bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-black hover:to-indigo-900 text-white border border-indigo-500/40 active:scale-95 shadow-md'
                            : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white active:scale-95'
                        }`}
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>
                        {plan.id === 'ENTERPRISE' ? 'Deploy Enterprise License ➔' : 'Start 14-Day Free Pilot ➔'}
                      </span>
                    </button>
                    <p className="text-[10px] text-center text-slate-500 dark:text-slate-400 mt-2 font-semibold flex items-center justify-center gap-1">
                      {plan.id === 'ENTERPRISE' ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Dedicated Hospital SLA • Custom Integration • 30-Day Guarantee</span>
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>
                            {billingCycle === 'ANNUAL'
                              ? `14-Day Free Pilot • Pay ${selectedCurrency.symbol}0 Today • First Annual Charge on Day 15 (${selectedCurrency.symbol}${rates.annual.toLocaleString()}/yr)`
                              : `14-Day Free Pilot • Pay ${selectedCurrency.symbol}0 Today • Auto-renews monthly on Day 15 (${selectedCurrency.symbol}${rates.monthly}/mo)`}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clinical Power Add-Ons Suite Grid */}
          <div className="max-w-6xl mx-auto mt-16 space-y-6">
            <div className="text-center space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/70 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                Hospital Modular Add-Ons
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Power-Up Your Clinical OPD Infrastructure
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                Mix and match modular upgrades anytime. 100% cloud setup with zero disruption to active consultation queues.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Card 1: White-Label Suite */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200/90 dark:border-purple-800/80 shadow-md flex flex-col justify-between hover:border-purple-400 transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 px-2 py-0.5 rounded-md">
                      Brand Customization
                    </span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1">
                      Full White-Label Suite
                    </h4>
                    <div className="text-base font-black text-purple-600 dark:text-purple-400 font-mono mt-0.5">
                      {selectedCurrency.code === 'INR' ? '₹2,999' : '$29'}<span className="text-[11px] text-slate-400 font-normal">/month</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Custom hospital logo on digital patient passes, 55" waiting TV kiosk displays, printable vector QR kits, and doctor Rx letterheads.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    to={`/signup?addon=custom_logo&currency=${currencyCode}`}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Add White-Label</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 2: WhatsApp Business Green-Tick */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200/90 dark:border-emerald-800/80 shadow-md flex flex-col justify-between hover:border-emerald-400 transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md">
                      Patient Communications
                    </span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1">
                      WhatsApp Alerts & Rx
                    </h4>
                    <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                      {selectedCurrency.code === 'INR' ? '₹1,499' : '$19'}<span className="text-[11px] text-slate-400 font-normal">/month</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Live token countdown updates, doctor calling notifications, and 1-tap digital Rx PDFs delivered directly to patient WhatsApp.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    to={`/signup?addon=whatsapp&currency=${currencyCode}`}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>Add WhatsApp Suite</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 3: Surge Token Refills */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200/90 dark:border-amber-800/80 shadow-md flex flex-col justify-between hover:border-amber-400 transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md">
                      Pay-As-You-Grow
                    </span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1">
                      Surge Token Packs
                    </h4>
                    <div className="text-base font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                      {selectedCurrency.code === 'INR' ? '₹3,999 – ₹24,999' : '$49 – $299'}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Instant cloud credit top-ups during seasonal OPD patient surges. 5,000 / 15,000 / 50,000 digital token bundles available with 1 tap.
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSurgeModal(true)}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>View Packs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Surge Token Packs Interactive Modal */}
          {showSurgeModal && (
            <div
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowSurgeModal(false);
              }}
            >
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white my-auto text-left relative">
                <button
                  type="button"
                  onClick={() => setShowSurgeModal(false)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 rounded-2xl">
                    <Coins className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      On-Demand Cloud Top-Up
                    </span>
                    <h3 className="text-lg font-black text-slate-950 dark:text-white tracking-tight">
                      Seasonal Surge Token Packs
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
                  Experiencing peak patient footfall or seasonal epidemics? Top-up extra patient queue tokens instantly without upgrading your monthly subscription plan.
                </p>

                <div className="space-y-3 mb-6">
                  {/* Pack 1: 5,000 */}
                  <div
                    onClick={() => setSelectedSurgePack('5K')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      selectedSurgePack === '5K'
                        ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900 dark:text-white">5,000 Extra Tokens</span>
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">Single Clinic</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Valid for 90 days • Instant activation</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                        {selectedCurrency.code === 'INR' ? '₹3,999' : '$49'}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-mono">One-time</span>
                    </div>
                  </div>

                  {/* Pack 2: 15,000 (Popular) */}
                  <div
                    onClick={() => setSelectedSurgePack('15K')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between relative ${
                      selectedSurgePack === '15K'
                        ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <span className="absolute -top-2.5 right-4 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black uppercase rounded-full shadow-xs">
                      ★ Most Popular
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900 dark:text-white">15,000 Extra Tokens</span>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">Polyclinic</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Valid for 180 days • Zero expiration pressure</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                        {selectedCurrency.code === 'INR' ? '₹9,999' : '$129'}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-mono">One-time</span>
                    </div>
                  </div>

                  {/* Pack 3: 50,000 */}
                  <div
                    onClick={() => setSelectedSurgePack('50K')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      selectedSurgePack === '50K'
                        ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900 dark:text-white">50,000 Extra Tokens</span>
                        <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-full">Hospital Network</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Full multi-department surge coverage</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                        {selectedCurrency.code === 'INR' ? '₹24,999' : '$299'}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-mono">One-time</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSurgeModal(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowSurgeModal(false);
                      navigate(`/signup?addon=token_surge&pack=${selectedSurgePack}&currency=${currencyCode}`);
                    }}
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>Refill {selectedSurgePack} Tokens</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Gateways Bar */}
          <div className="max-w-4xl mx-auto mt-16 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-md text-center">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Official Global Payment Partners
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-6">
              Subscribe in your local currency with instant automated provisioning. All transactions are protected by bank-grade 256-bit encryption.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              {/* Dodo Payments Badge */}
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div className="text-left">
                  <span className="block text-xs font-black text-slate-900 dark:text-white">Dodo Payments</span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400">Global Cards & Instant Checkout</span>
                </div>
              </div>

              {/* Dodo Payments & Cashfree Badge */}
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div className="text-left ml-1">
                  <span className="block text-xs font-black text-slate-900 dark:text-white">Dodo Payments & Cashfree</span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400">Global & Domestic Settlement</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div className="text-left">
                  <span className="block text-xs font-black text-slate-900 dark:text-white">30-Day Money Back</span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400">100% Satisfaction Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison Matrix */}
        <section className="py-16 px-4 sm:px-6 bg-slate-100/70 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-2 mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                Detailed Feature Comparison
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Compare capabilities across our clinical tiers to match your facility scale.
              </p>

              {/* Mobile Horizontal Scroll Hint */}
              <div className="sm:hidden pt-2 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-[11px] font-bold text-blue-700 dark:text-blue-300 shadow-2xs">
                  <span>Swipe table left & right to compare all plans ➔</span>
                </span>
              </div>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm scrollbar-thin">
              <table className="min-w-[700px] w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950">
                    <th className="p-4 sm:p-5 font-bold text-slate-700 dark:text-slate-300 w-1/3">Feature</th>
                    <th className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white text-center">Starter</th>
                    <th className="p-4 sm:p-5 font-bold text-blue-700 dark:text-blue-300 text-center bg-blue-50/50 dark:bg-blue-950/40">Growth OPD</th>
                    <th className="p-4 sm:p-5 font-bold text-slate-900 dark:text-white text-center">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-800 dark:text-slate-200">Doctor Cabins Supported</td>
                    <td className="p-4 sm:p-5 text-center text-slate-600 dark:text-slate-400">Up to 3</td>
                    <td className="p-4 sm:p-5 text-center font-bold text-blue-700 dark:text-blue-300 bg-blue-50/30 dark:bg-blue-950/30">Up to 12</td>
                    <td className="p-4 sm:p-5 text-center font-bold text-slate-900 dark:text-white">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-800 dark:text-slate-200">
                      <div>Monthly Digital Patient Tokens</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">Base patient queue allowance per month</div>
                    </td>
                    <td className="p-4 sm:p-5 text-center font-bold text-slate-800 dark:text-slate-200">
                      <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">1,500 Tokens</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">~50 patients / day</div>
                    </td>
                    <td className="p-4 sm:p-5 text-center font-bold text-blue-700 dark:text-blue-300 bg-blue-50/30 dark:bg-blue-950/30">
                      <div className="text-xs sm:text-sm font-black text-blue-700 dark:text-blue-400">10,000 Tokens</div>
                      <div className="text-[10px] text-blue-600/80 dark:text-blue-400/80 font-normal">~350 patients / day</div>
                    </td>
                    <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      <div className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">50,000+ Tokens</div>
                      <div className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-normal">High-Volume Custom SLA</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-800 dark:text-slate-200">
                      <div>Pay-As-You-Grow Token Refills</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">Top-up credit packs if patient volume surges</div>
                    </td>
                    <td className="p-4 sm:p-5 text-center text-slate-600 dark:text-slate-400 font-semibold">
                      ₹0.20 / $0.003 per credit
                    </td>
                    <td className="p-4 sm:p-5 text-center font-bold text-blue-700 dark:text-blue-300 bg-blue-50/30 dark:bg-blue-950/30">
                      ₹0.15 / $0.002 per credit
                      <span className="block text-[9px] text-blue-600 dark:text-blue-400 font-medium">25% Volume Discount</span>
                    </td>
                    <td className="p-4 sm:p-5 text-center font-bold text-slate-900 dark:text-white">
                      Volume Discounted Tier
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-800 dark:text-slate-200">
                      <div>Token Credit Validity & Expiration</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">Strict retention policy: unused credits expire with plan cycle</div>
                    </td>
                    <td className="p-4 sm:p-5 text-center text-slate-600 dark:text-slate-400 font-medium">
                      <span className="text-rose-600 dark:text-rose-400 font-bold block">Strict 30-Day Expiry</span>
                      <span className="text-[9px] text-slate-400 block">Zero roll-over to new plans</span>
                    </td>
                    <td className="p-4 sm:p-5 text-center font-bold text-blue-700 dark:text-blue-300 bg-blue-50/30 dark:bg-blue-950/30">
                      <span className="text-blue-600 dark:text-blue-400 font-bold block">Active Cycle Expiry</span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 block">Expires on monthly renewal • No carryover</span>
                    </td>
                    <td className="p-4 sm:p-5 text-center font-bold text-slate-900 dark:text-white">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold block">Annual Contract Period</span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 block">Expires on renewal date • No rollover</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-800 dark:text-slate-200">
                      <div>🔁 AutoPay Recurring Mandate</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">Direct founder account recurring revenue via Cashfree & Dodo</div>
                    </td>
                    <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      ✓ Cashfree UPI / Dodo AutoPay
                    </td>
                    <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-blue-50/30 dark:bg-blue-950/30">
                      ✓ Cashfree UPI / Dodo AutoPay
                    </td>
                    <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      ✓ Dedicated Auto-Mandate
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-800 dark:text-slate-200">
                      <div>✨ 14-Day Free Pilot & Billing Conversion</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">Zero payment today; auto-activates premium when trial ends</div>
                    </td>
                    <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="block">Pay {selectedCurrency.symbol}0 Today</span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-normal block">
                        {billingCycle === 'ANNUAL' ? 'Annual charge on Day 15' : 'Monthly AutoPay on Day 15'}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-blue-50/30 dark:bg-blue-950/30">
                      <span className="block">Pay {selectedCurrency.symbol}0 Today</span>
                      <span className="text-[9px] text-blue-600/90 dark:text-blue-300 font-normal block">
                        {billingCycle === 'ANNUAL' ? 'Annual charge on Day 15' : 'Monthly AutoPay on Day 15'}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="block">14-Day Pilot Available</span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-normal block">Custom Billing Terms</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-800 dark:text-slate-200">Lobby 55" TV Kiosk Display</td>
                    <td className="p-4 sm:p-5 text-center text-slate-400">1 Screen</td>
                    <td className="p-4 sm:p-5 text-center font-bold text-blue-700 dark:text-blue-300 bg-blue-50/30 dark:bg-blue-950/30">3 Screens</td>
                    <td className="p-4 sm:p-5 text-center font-bold text-slate-900 dark:text-white">Unlimited Screens</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-800 dark:text-slate-200">Audio Chimes & Voice TTS Announcements</td>
                    <td className="p-4 sm:p-5 text-center text-slate-400">Basic</td>
                    <td className="p-4 sm:p-5 text-center font-bold text-blue-700 dark:text-blue-300 bg-blue-50/30 dark:bg-blue-950/30">Bilingual (Hindi + English)</td>
                    <td className="p-4 sm:p-5 text-center font-bold text-slate-900 dark:text-white">Multi-Language Custom</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-800 dark:text-slate-200">15-Day Follow-Up Engine</td>
                    <td className="p-4 sm:p-5 text-center text-slate-400">—</td>
                    <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-blue-50/30 dark:bg-blue-950/30">✓ Included</td>
                    <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400">✓ Included</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-800 dark:text-slate-200">Thermal Slip Printer Dispatch (58/80mm)</td>
                    <td className="p-4 sm:p-5 text-center text-slate-400">—</td>
                    <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-blue-50/30 dark:bg-blue-950/30">✓ Supported</td>
                    <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400">✓ Supported</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-800 dark:text-slate-200">Dodo Payments & Cashfree Gateway Integration</td>
                    <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400">✓ Supported</td>
                    <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-blue-50/30 dark:bg-blue-950/30">✓ Supported</td>
                    <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400">✓ Supported</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-800 dark:text-slate-200">Custom Domain & White-Label</td>
                    <td className="p-4 sm:p-5 text-center text-slate-400">—</td>
                    <td className="p-4 sm:p-5 text-center text-slate-400 bg-blue-50/30 dark:bg-blue-950/30">—</td>
                    <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400">✓ Full White-Label</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-slate-800 dark:text-slate-200">HL7 FHIR / HMS API Webhooks</td>
                    <td className="p-4 sm:p-5 text-center text-slate-400">—</td>
                    <td className="p-4 sm:p-5 text-center text-slate-400 bg-blue-50/30 dark:bg-blue-950/30">—</td>
                    <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400">✓ Dedicated API</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* AutoPay & Strict Token Validity Policy Banner */}
            <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800 text-xs text-slate-800 dark:text-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-black text-amber-900 dark:text-amber-300">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>
                  {billingCycle === 'ANNUAL'
                    ? '14-Day Free Pilot, Annual AutoPay Renewal (Save ~17% • 2 Mo Free) & Token Expiry Policy'
                    : '14-Day Free Pilot, AutoPay Recurring Mandate & Strict Token Expiry Policy'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                • <strong>14-Day Free Pilot with Upfront AutoPay Mandate:</strong> Clinics start their 14-day evaluation with <strong>₹0 / $0 charged today</strong>. An automated recurring AutoPay mandate (Cashfree UPI AutoPay for India, Dodo Payments for Global) is authorized during onboarding. You will not be charged during the 14-day free trial. When the 14-day trial period finishes, your chosen {billingCycle === 'ANNUAL' ? 'annual plan (billed annually with ~17% discount applied - 2 months free)' : 'monthly plan'} will be <strong>automatically purchased and debited</strong> via AutoPay. You may cancel anytime before Day 14 from your dashboard with 1 tap.
              </p>
              <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                • <strong>Strict Validity Window:</strong> All {billingCycle === 'ANNUAL' ? 'annual' : 'monthly'} token allowances and top-up credits are strictly valid for their specific billing period ({billingCycle === 'ANNUAL' ? '365 days for annual subscriptions' : '30 days for monthly subscriptions'}). Unused tokens expire automatically on plan renewal or expiration and <strong>do not stack or roll over into future plan purchases</strong>.
              </p>
              <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                • <strong>{billingCycle === 'ANNUAL' ? 'Annual AutoPay Mandate' : 'AutoPay Mandate'}:</strong> Subscriptions are billed on an {billingCycle === 'ANNUAL' ? 'annual recurring basis (with ~17% savings - pay for 10 months, get 12)' : 'automated recurring monthly debit'} (Cashfree UPI AutoPay for Indian Clinics, and Dodo Payments Recurring for Global Cards). Mandates ensure uninterrupted clinic queue operations and direct settlement to platform founder accounts with 0% downtime.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="py-20 px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Everything you need to know about pricing, payment setup, and deployment.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { id: 'ALL', label: 'All Questions' },
                { id: 'DIRECTORS', label: 'For Directors' },
                { id: 'PAYMENTS_COMPLIANCE', label: 'Payments & Security' },
                { id: 'DOCTORS', label: 'For Doctors' },
                { id: 'RECEPTION', label: 'For Reception' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFaqCategory(cat.id as FaqCategory)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${faqCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-xs font-black'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-4">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                    >
                      <span>{faq.q}</span>
                      <span className="text-blue-600 dark:text-blue-400 text-lg font-black shrink-0">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom Call to Action */}
        <section className="pb-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 sm:p-12 text-white text-center shadow-xl shadow-blue-500/20 relative overflow-hidden">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Ready to Eliminate Lobby Chaos in 20 Minutes?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto mt-2">
              Join 450+ hospitals running zero-wait OPDs. Activate your zero-wait clinical workspace today with Dodo Payments or Cashfree.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/signup"
                className="px-8 py-3.5 bg-white text-blue-700 hover:bg-blue-50 font-black text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2 active:scale-98"
              >
                <Zap className="w-4 h-4 fill-blue-700 text-blue-700" />
                <span>Activate Queueless OS ➔</span>
              </Link>
              <Link
                to="/roi-calculator"
                className="px-6 py-3.5 bg-blue-700/60 hover:bg-blue-700/80 text-white font-bold text-xs rounded-xl border border-blue-400/40 transition-all"
              >
                Calculate Hospital ROI ➔
              </Link>
            </div>
          </div>
        </section>
      </main>

      <CommercialFooter />
    </div>
  );
};

