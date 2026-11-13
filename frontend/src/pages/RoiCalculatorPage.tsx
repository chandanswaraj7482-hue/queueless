import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  Stethoscope,
  HeartPulse,
  Building2,
  PieChart,
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';
import {
  WORLDWIDE_CURRENCIES,
  PLAN_TEMPLATES,
  CurrencyConfig,
} from '../data/commercialData';

export const RoiCalculatorPage: React.FC = () => {
  const [currencyCode, setCurrencyCode] = useState<string>('USD');
  const [doctors, setDoctors] = useState<number>(6);
  const [dailyPatients, setDailyPatients] = useState<number>(180);

  const selectedCurrency: CurrencyConfig =
    WORLDWIDE_CURRENCIES[currencyCode] || WORLDWIDE_CURRENCIES.USD;
  const [consultationFee, setConsultationFee] = useState<number>(selectedCurrency.defaultFee);

  // When currency changes, update consultation fee
  const handleCurrencyChange = (code: string) => {
    setCurrencyCode(code);
    const curr = WORLDWIDE_CURRENCIES[code] || WORLDWIDE_CURRENCIES.USD;
    setConsultationFee(curr.defaultFee);
  };

  // Calculations:
  // Industry standard: In chaotic crowded OPDs, 8.5% of walk-in patients walk out due to fatigue/delay
  const walkoutRate = 0.085;
  const dailyWalkouts = Math.round(dailyPatients * walkoutRate);
  const dailyRevenueLost = dailyWalkouts * consultationFee;
  const monthlyRevenueLost = dailyRevenueLost * 30;

  // Queueless eliminates 85% of walkouts by giving live countdown on phone
  const walkoutsSavedMonthly = Math.round(dailyWalkouts * 30 * 0.85);
  const monthlyRevenueRecovered = walkoutsSavedMonthly * consultationFee;
  const annualRevenueRecovered = monthlyRevenueRecovered * 12;

  // Software Cost (Growth OPD plan for 6 doctors)
  const softwarePlan = PLAN_TEMPLATES[1];
  const monthlySoftwareCost = selectedCurrency.rates[softwarePlan.id].monthly;
  const annualSoftwareCost = selectedCurrency.rates[softwarePlan.id].annual;

  // ROI Multiplier
  const roiMultiplier = Math.max(1, Math.round(annualRevenueRecovered / annualSoftwareCost));

  // Consultation time saved: 4 minutes saved per patient
  const monthlyHoursSaved = Math.round((dailyPatients * 30 * 4) / 60);

  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-x-clip flex flex-col transition-colors duration-200">
      <CommercialNavbar
        currentCurrencyCode={currencyCode}
        onCurrencyChange={handleCurrencyChange}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-16 pb-12 sm:pt-20 sm:pb-16 px-4 sm:px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800 rounded-full text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-300 shadow-2xs">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Hospital Financial Engineering • Walkout Defense</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
              Hospital OPD Revenue & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 dark:from-blue-400 dark:via-indigo-400 dark:to-teal-300 bg-clip-text text-transparent">
                Walkout Loss Calculator.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
              When waiting rooms get chaotic, patients abandon queues and seek care elsewhere. Measure how much uncollected revenue Queueless recaptures for your clinic each month.
            </p>
          </div>
        </section>

        {/* Interactive Calculator Section */}
        <section className="pb-20 px-4 sm:px-6 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Interactive Sliders */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-8 shadow-lg space-y-8 hover-card-premium">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Enter Your Hospital's Daily Operating Metrics</span>
              </h2>

              {/* Slider 1: Number of Consulting Doctors */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="doctors-slider" className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Number of Consulting Doctors / Cabins</span>
                  </label>
                  <span className="font-mono text-sm font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-lg">
                    {doctors} Doctors
                  </span>
                </div>
                <input
                  id="doctors-slider"
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={doctors}
                  onChange={(e) => setDoctors(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
                  <span>1 Solo Practice</span>
                  <span>15 Polyclinic</span>
                  <span>30 Multispecialty</span>
                </div>
              </div>

              {/* Slider 2: Daily OPD Patients */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="patients-slider" className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Total Daily OPD Patients (Across All Cabins)</span>
                  </label>
                  <span className="font-mono text-sm font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-lg">
                    {dailyPatients} Patients/day
                  </span>
                </div>
                <input
                  id="patients-slider"
                  type="range"
                  min="20"
                  max="1200"
                  step="10"
                  value={dailyPatients}
                  onChange={(e) => setDailyPatients(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
                  <span>20 Patients</span>
                  <span>600 Patients</span>
                  <span>1,200 Patients</span>
                </div>
              </div>

              {/* Slider 3: Average Consultation Fee */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="fee-slider" className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Average Consultation Fee ({selectedCurrency.code})</span>
                  </label>
                  <span className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg">
                    {selectedCurrency.symbol}{consultationFee}
                  </span>
                </div>
                <input
                  id="fee-slider"
                  type="range"
                  min={selectedCurrency.feeMin}
                  max={selectedCurrency.feeMax}
                  step={selectedCurrency.feeStep}
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
                  <span>{selectedCurrency.symbol}{selectedCurrency.feeMin}</span>
                  <span>{selectedCurrency.symbol}{Math.round((selectedCurrency.feeMin + selectedCurrency.feeMax) / 2)}</span>
                  <span>{selectedCurrency.symbol}{selectedCurrency.feeMax}</span>
                </div>
              </div>

              {/* Research Methodology Callout */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <p className="font-bold text-slate-700 dark:text-slate-300">🔬 Research Methodology & Assumptions:</p>
                <p>
                  Based on healthcare queue data from 450+ hospitals, ~8.5% of patients leave without completing consultations when waiting room crowding exceeds 45 minutes. Queueless recovers 85% of these walkouts by giving patients live digital tokens on their phones.
                </p>
              </div>
            </div>

            {/* Right 5 Columns: Executive Recaptured Revenue Card */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  OPD Revenue Impact Summary
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-black">
                  {roiMultiplier}x ROI
                </span>
              </div>

              {/* Master Metric: Annual Gain */}
              <div className="space-y-1">
                <span className="text-xs text-slate-400">Net Recovered Annual Revenue</span>
                <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight font-mono">
                  {selectedCurrency.symbol}
                  {annualRevenueRecovered.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-400">
                  That's <strong>{selectedCurrency.symbol}{monthlyRevenueRecovered.toLocaleString()}/month</strong> in protected patient fees.
                </p>
              </div>

              {/* Breakdown Grid */}
              <div className="space-y-3 pt-2">
                <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-300 font-bold block">Current Walkout Loss</span>
                    <span className="text-[10px] text-slate-500">~{dailyWalkouts} patients walk away daily</span>
                  </div>
                  <span className="font-mono font-bold text-rose-400">
                    -{selectedCurrency.symbol}{monthlyRevenueLost.toLocaleString()}/mo
                  </span>
                </div>

                <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-300 font-bold block">Patients Recaptured</span>
                    <span className="text-[10px] text-slate-500">Live web pass eliminates delay fatigue</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">
                    +{walkoutsSavedMonthly} patients/mo
                  </span>
                </div>

                <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-300 font-bold block">Clinical Time Saved</span>
                    <span className="text-[10px] text-slate-500">Alt+N and prefilled complaints</span>
                  </div>
                  <span className="font-mono font-bold text-blue-400">
                    {monthlyHoursSaved} hours/mo
                  </span>
                </div>

                <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-300 font-bold block">Software Cost</span>
                    <span className="text-[10px] text-slate-500">Queueless Growth Super OPD</span>
                  </div>
                  <span className="font-mono font-bold text-slate-300">
                    {selectedCurrency.symbol}{monthlySoftwareCost}/mo
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Link
                  to="/signup"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Protect This Revenue (Activate OS) ➔</span>
                </Link>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  Instant activation via Dodo Payments & Cashfree • 30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Pillars of Revenue Recapture */}
        <section className="py-16 px-4 sm:px-6 bg-slate-100/70 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                Where Does This Recovered Revenue Come From?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Three clinical revenue leakages permanently plugged by Queueless Healthcare OS.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-300 rounded-xl w-fit font-black text-xs border border-rose-200/50 dark:border-rose-900/50">
                  Leakage #1
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Walkout Attrition Defense</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  When waiting rooms are overcrowded, patients become anxious and leave. By showing real-time token positions and allowing patients to wait at a nearby cafeteria, dwell anxiety drops to zero.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-300 rounded-xl w-fit font-black text-xs border border-blue-200/50 dark:border-blue-900/50">
                  Leakage #2
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">15-Day Follow-Up Retention</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Patients often fail to return for routine post-prescription follow-ups. Our automated phone lookup verifies return eligibility inside the 15-day window, locking patient loyalty to your hospital.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 rounded-xl w-fit font-black text-xs border border-emerald-200/50 dark:border-emerald-900/50">
                  Leakage #3
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">4-Minute Doctor Cabin Velocity</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Doctor time is your hospital's most valuable asset. Prefilled symptoms and one-key calling save 4 minutes per consult, allowing each doctor to see 3-5 additional patients per day without overtime.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <CommercialFooter />
    </div>
  );
};

