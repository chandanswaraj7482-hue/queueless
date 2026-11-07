import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Mail,
  Zap,
  Clock,
  RotateCcw,
  Printer,
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';

export const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-x-clip flex flex-col transition-colors duration-200">
      <CommercialNavbar />

      <main className="flex-1 py-14 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>100% Risk-Free Guarantee</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              Queueless Refund & Cancellation Policy
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span><strong>Effective Date:</strong> November 1, 2026</span>
              <span>•</span>
              <span><strong>Supported Gateways:</strong> Dodo Payments & PayPal</span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">30-Day Money-Back Guarantee</span>
            </div>
          </div>

          {/* Core Content Body */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-10 shadow-lg space-y-10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">1</span>
                <span>Our 30-Day 100% Risk-Free Money-Back Guarantee</span>
              </h2>
              <p>
                We want every hospital director, clinic administrator, and consulting doctor to deploy Queueless with absolute confidence. If within the first <strong>30 calendar days</strong> of your initial subscription purchase you feel Queueless did not meaningfully reduce waiting hall crowding or streamline doctor workflow, you are entitled to a full 100% refund of your subscription fee.
              </p>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>No Hidden Obstacles:</strong> You do not need to attend lengthy exit surveys or provide technical explanations. If you ask for a refund within 30 days, we issue it promptly.
                </span>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">2</span>
                <span>How to Request a Refund</span>
              </h2>
              <p>
                Requesting a refund takes less than 60 seconds. You can choose either of the following methods:
              </p>
              <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>Method 1 (Director Admin Console):</strong> Log into your hospital portal at <Link to="/login" className="text-blue-600 dark:text-blue-400 underline font-bold">/login</Link>, navigate to <em>Settings ➔ Subscription & Billing</em>, and click "Request 30-Day Guarantee Refund".
                </li>
                <li>
                  <strong>Method 2 (Email Support):</strong> Send an email to <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-blue-600 dark:text-blue-400">billing@queueless.com</code> with your Hospital Name, Admin Email, and Receipt / Invoice ID (e.g., INV-560760).
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">3</span>
                <span>Refund Processing Times by Payment Gateway</span>
              </h2>
              <p>
                Once approved, refunds are credited back directly to the original payment source:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-black text-slate-900 dark:text-white text-xs">Dodo Payments (Cards & NetBanking)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    Funds are returned to your credit or debit card within <strong>3 to 5 business days</strong>, depending on your bank's clearing cycle.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-[#003087] dark:text-[#387df5]">Pay</span>
                    <span className="text-base font-black text-[#0079C1] dark:text-[#52a6e6] -ml-1.5">Pal</span>
                    <span className="font-black text-slate-900 dark:text-white text-xs ml-1">Worldwide</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    Refunds to PayPal accounts are typically completed <strong>instantly to within 48 hours</strong> back to your PayPal balance or linked card.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">4</span>
                <span>Subscription Cancellation (Zero Lock-In)</span>
              </h2>
              <p>
                You may cancel your monthly or annual subscription at any point before your next renewal date:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>Upon cancellation, your hospital workspace and doctor cabin consoles will remain fully operational until the end of your prepaid term.</li>
                <li>No automated renewal charges will occur once cancellation is confirmed.</li>
                <li>You can export all patient queue histories and consultation receipts before your billing cycle concludes.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">5</span>
                <span>100% Digital Cloud Delivery Policy</span>
              </h2>
              <p>
                Queueless operates as a 100% digital, cloud-native Clinical Operating System. You receive instant digital access to your hospital workspace, reception dashboard, doctor tablet interface, and high-resolution printable QR assets immediately upon checkout:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>Zero physical hardware fees, zero shipping delays, and zero courier handling risks.</li>
                <li>Because Queueless is 100% software, your entire subscription fee is fully refundable under our 30-Day Money-Back Guarantee with zero deductions.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">6</span>
                <span>Billing & Refund Help Desk</span>
              </h2>
              <p>
                Have questions about an upcoming charge or need help with your receipt? Our billing specialists are on standby:
              </p>
              <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <p><strong>Queueless Financial Operations Desk</strong></p>
                <p className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold">
                  <Mail className="w-3.5 h-3.5" />
                  <span>billing@queueless.com</span>
                </p>
                <p className="text-slate-500 dark:text-slate-400">Dedicated assistance for Dodo Payments, PayPal & Bank Transfer Invoicing</p>
              </div>
            </section>
          </div>

          {/* Quick Nav Footer */}
          <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Explore related policies:</span>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Privacy Policy ➔
              </Link>
              <Link to="/terms" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Terms of Service ➔
              </Link>
              <Link to="/security" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Security Architecture ➔
              </Link>
            </div>
          </div>
        </div>
      </main>

      <CommercialFooter />
    </div>
  );
};

