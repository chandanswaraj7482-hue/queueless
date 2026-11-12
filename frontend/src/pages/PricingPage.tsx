import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';
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
  const [currencyCode, setCurrencyCode] = useState<string>(() => {
    return localStorage.getItem('queueless_currency') || 'USD';
  });
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const [faqCategory, setFaqCategory] = useState<FaqCategory>('ALL');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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
      <CommercialNavbar
        currentCurrencyCode={currencyCode}
        onCurrencyChange={(code) => setCurrencyCode(code)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-16 pb-12 sm:pt-20 sm:pb-16 px-4 sm:px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 rounded-full text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-300 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Transparent Healthcare SaaS • Zero Setup Fees</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
              Predictable, Zero-Capex Plans for <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 dark:from-blue-400 dark:via-indigo-400 dark:to-teal-300 bg-clip-text text-transparent">
                Every Healthcare Practice.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
              Eliminate paper tokens and lobby crowding with predictable, credit-based plans matched to your OPD patient footfall. Includes instant pay-as-you-grow token refills for seasonal surges.
            </p>

            {/* High-Conversion Interactive Billing Cycle Segmented Control */}
            <div className="pt-6 flex flex-col items-center justify-center gap-2.5">
              <div className="p-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 backdrop-blur-md inline-flex items-center shadow-inner">
                {/* Monthly Button */}
                <button
                  type="button"
                  onClick={() => setBillingCycle('MONTHLY')}
                  className={`px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                    billingCycle === 'MONTHLY'
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
                  className={`px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                    billingCycle === 'ANNUAL'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-100'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>Annual Billing</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-colors ${
                      billingCycle === 'ANNUAL'
                        ? 'bg-emerald-400 text-slate-950 shadow-2xs'
                        : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    }`}
                  >
                    Save ~17% (2 Mo Free)
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
                  className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all card-interactive ${
                    plan.highlight
                      ? 'bg-white dark:bg-slate-900 border-2 border-blue-600 dark:border-blue-500 shadow-2xl shadow-blue-500/15 scale-102 ring-4 ring-blue-500/10'
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
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">/ doctor / month</span>
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
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card CTA */}
                  <div className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer btn-physics ${
                        plan.highlight
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 ring-2 ring-blue-500/20 active:scale-95 shimmer-sweep hover-glow-blue'
                          : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white active:scale-95'
                      }`}
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>Start 14-Day Free Pilot ➔</span>
                    </button>
                    <p className="text-[10px] text-center text-slate-500 dark:text-slate-400 mt-2 font-semibold flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>14 Days Free • Instant Cloud Setup • Cancel Anytime</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Optional Power Add-On: Custom Hospital Logo & White-Label Suite */}
          <div className="max-w-5xl mx-auto mt-12 p-6 rounded-3xl bg-gradient-to-r from-purple-50 via-indigo-50/60 to-blue-50/80 dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-blue-950/40 border border-purple-200/90 dark:border-purple-800/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2.5 py-0.5 rounded-full border border-purple-300/70 dark:border-purple-700">
                    Paid White-Label Add-On
                  </span>
                  <span className="text-xs font-mono font-extrabold text-purple-900 dark:text-purple-200">
                    {selectedCurrency.code === 'INR' ? '₹1,999/month' : '$29/month'}
                  </span>
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">
                  Custom Hospital Logo & Full White-Label Suite
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 max-w-xl leading-relaxed">
                  Replace default Queueless emblems with your hospital's official high-resolution branding on patient passes, 55" waiting room TV kiosks, printed standees, and doctor prescription letterheads.
                </p>
              </div>
            </div>
            <Link
              to={`/signup?addon=custom_logo&currency=${currencyCode}`}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shrink-0 shadow-md shadow-purple-600/30 transition-all active:scale-95 whitespace-nowrap cursor-pointer flex items-center gap-2"
            >
              <span>Add to Hospital Plan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

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

              {/* PayPal Badge */}
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <span className="text-xl font-black text-[#003087]">Pay</span>
                <span className="text-xl font-black text-[#0079C1] -ml-2">Pal</span>
                <div className="text-left ml-1">
                  <span className="block text-xs font-black text-slate-900 dark:text-white">PayPal Verified</span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400">Buyer Protection Guaranteed</span>
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
            <div className="text-center space-y-2 mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                Detailed Feature Comparison
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Compare capabilities across our clinical tiers to match your facility scale.
              </p>
            </div>

            <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
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
                    <td className="p-4 sm:p-5 text-center text-slate-600 dark:text-slate-400">Up to 2</td>
                    <td className="p-4 sm:p-5 text-center font-bold text-blue-700 dark:text-blue-300 bg-blue-50/30 dark:bg-blue-950/30">Up to 8</td>
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
                      <div>Token Credit Roll-Over & Validity</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">Retention policy for unused top-up credits</div>
                    </td>
                    <td className="p-4 sm:p-5 text-center text-slate-600 dark:text-slate-400 font-medium">
                      30-Day Cycle
                    </td>
                    <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-blue-50/30 dark:bg-blue-950/30">
                      ✓ 60-Day Roll-Over
                    </td>
                    <td className="p-4 sm:p-5 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      ✓ Perpetual Enterprise Pool
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
                    <td className="p-4 sm:p-5 font-semibold text-slate-800 dark:text-slate-200">Dodo Payments & PayPal Integration</td>
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    faqCategory === cat.id
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
              Join 450+ hospitals running zero-wait OPDs. Activate your zero-wait clinical workspace today with Dodo Payments, PayPal, or Simulated Test Mode.
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

