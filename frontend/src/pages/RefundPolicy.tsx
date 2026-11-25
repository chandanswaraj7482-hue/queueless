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
  Ban,
  FileText,
  IndianRupee,
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';
import { SeoHead } from '../components/SeoHead';

export const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-x-clip flex flex-col transition-colors duration-200">
      <SeoHead
        title="Cancellation & Refund Policy | Queueless Healthcare OS — 30-Day Money-Back Guarantee"
        description="Transparent 30-day risk-free money-back guarantee, 14-day free pilot cancellation, and comprehensive refund policy for hospitals and clinics. Zero lock-in, automated mandate cancellation, and immediate refund processing. Consumer Protection Act 2019 compliant."
        keywords="queueless refund policy, hospital subscription cancellation, 14 day free pilot terms, 30 day money back guarantee, cloud refund policy, consumer protection act 2019"
        canonical="https://queueless-os.vercel.app/refund-policy"
      />

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
              Queueless Cancellation & Refund Policy
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span><strong>Effective Date:</strong> November 1, 2026</span>
              <span>•</span>
              <span><strong>Last Updated:</strong> November 25, 2026</span>
              <span>•</span>
              <span><strong>Supported Gateways:</strong> Cashfree & Dodo Payments</span>
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
                We want every hospital director, clinic administrator, and consulting doctor to deploy Queueless with absolute confidence. If within the first <strong>30 calendar days</strong> of your initial subscription purchase you feel Queueless did not meaningfully reduce waiting hall crowding, streamline doctor workflow, or meet your expectations for any reason whatsoever, you are entitled to a full 100% refund of your subscription fee — no questions asked.
              </p>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>No Hidden Obstacles:</strong> You do not need to attend lengthy exit surveys, provide technical explanations, or meet any usage thresholds. If you ask for a refund within 30 days, we issue it promptly and courteously.
                </span>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">2</span>
                <span>14-Day Free Pilot Period</span>
              </h2>
              <p>
                Every new hospital registration begins with a complimentary <strong>14-day free pilot period</strong> with full feature access:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>No payment information is required to begin the pilot (unless opting for AutoPay mandate setup).</li>
                <li>No charges are deducted during the 14-day pilot period.</li>
                <li>You may cancel the pilot at any time before Day 14 with zero penalties or charges.</li>
                <li>If you do not cancel, your subscription will activate on Day 15 at the selected plan rate.</li>
                <li>AutoPay mandates registered during the pilot can be cancelled with one click before Day 14.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">3</span>
                <span>How to Request a Refund or Cancellation</span>
              </h2>
              <p>
                Requesting a refund or cancellation takes less than 60 seconds. You can choose any of the following methods:
              </p>
              <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>Method 1 (Hospital Admin Dashboard):</strong> Log into your hospital admin portal, navigate to <em>Bank & UPI Gateway</em> tab → <em>Subscription & Billing</em> section, and click "Cancel Subscription" or "Request 30-Day Guarantee Refund".
                </li>
                <li>
                  <strong>Method 2 (Email):</strong> Send an email to <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-blue-600 dark:text-blue-400">billing@queuelesslabs.com</code> with your Hospital Name, Admin Email, and Receipt/Invoice ID (e.g., INV-560760).
                </li>
                <li>
                  <strong>Method 3 (Phone/WhatsApp):</strong> Contact our support team via the contact details provided on the Platform for immediate assistance.
                </li>
              </ul>
              <p>
                We will acknowledge your cancellation/refund request within <strong>24 hours</strong> of receipt.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">4</span>
                <span>Refund Processing Times by Payment Method</span>
              </h2>
              <p>
                Once approved, refunds are credited back directly to the original payment source:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800">
                      <th className="border border-slate-200 dark:border-slate-700 px-3 py-2 text-left font-black text-slate-900 dark:text-white">Payment Method</th>
                      <th className="border border-slate-200 dark:border-slate-700 px-3 py-2 text-left font-black text-slate-900 dark:text-white">Refund Timeline</th>
                      <th className="border border-slate-200 dark:border-slate-700 px-3 py-2 text-left font-black text-slate-900 dark:text-white">Credited To</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 dark:text-slate-400">
                    <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">UPI (GPay/PhonePe/Paytm)</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">24-48 hours</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Original UPI-linked bank account</td></tr>
                    <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Credit/Debit Card (Visa/MC/RuPay)</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">5-7 business days</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Original card account</td></tr>
                    <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Net Banking / NEFT</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">3-5 business days</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Original bank account</td></tr>
                    <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">International Cards (via Dodo Payments)</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">5-10 business days</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Original card account</td></tr>
                    <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Apple Pay / Google Pay</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">3-5 business days</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Original linked account</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                Note: Refund processing times are dependent on the payment gateway and your bank's internal clearing cycle. Queueless initiates the refund within 24 hours of approval.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">5</span>
                <span>Subscription Cancellation (Zero Lock-In)</span>
              </h2>
              <p>
                You may cancel your monthly or annual subscription at any point before your next renewal date:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>Upon cancellation, your hospital workspace and all clinical consoles remain fully operational until the end of your current paid billing term.</li>
                <li>No automated renewal charges will occur once cancellation is confirmed.</li>
                <li>You can export all patient queue histories, consultation records, payment receipts, and analytics data in JSON/CSV format before your billing cycle concludes.</li>
                <li>Cancellation confirmation will be sent to your registered email within 24 hours.</li>
                <li>There are absolutely <strong>zero early termination fees, exit charges, or penalties</strong> for cancellation.</li>
              </ul>
            </section>

            {/* Section 6: PATIENT CONSULTATION FEES */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">6</span>
                <span>Patient Consultation Fee Refunds</span>
              </h2>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/60 rounded-2xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-black text-amber-950 dark:text-amber-100">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>IMPORTANT: Patient Consultation Fees Are Not Processed by Queueless</span>
                </div>
                <p>
                  Patient consultation fees (doctor fees) are processed <strong>directly between the patient and the hospital</strong> using the hospital's own Cashfree or UPI payment credentials. These funds go directly to the hospital's bank account — Queueless never holds, routes, or touches these funds.
                </p>
                <p>
                  Therefore, refunds for consultation fees must be requested directly from the respective hospital or clinic. Queueless cannot process refunds for payments it did not receive.
                </p>
              </div>
            </section>

            {/* Section 7: 100% DIGITAL DELIVERY */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">7</span>
                <span>100% Digital Cloud Delivery Policy</span>
              </h2>
              <p>
                Queueless operates as a 100% digital, cloud-native Clinical Operating System. You receive instant digital access to your hospital workspace, reception dashboard, doctor tablet interface, and high-resolution printable QR assets immediately upon checkout:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>Zero physical hardware fees, zero shipping delays, and zero courier handling risks.</li>
                <li>Because Queueless is 100% software, your entire subscription fee is fully refundable under our 30-Day Money-Back Guarantee with zero deductions.</li>
                <li>No physical goods are shipped as part of any Queueless subscription plan.</li>
              </ul>
            </section>

            {/* Section 8: CONSUMER PROTECTION */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">8</span>
                <span>Consumer Protection Act 2019 Compliance</span>
              </h2>
              <p>
                This Refund & Cancellation Policy is in full compliance with:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>Consumer Protection Act 2019 (India):</strong> Sections 2(16), 2(42), and 18 — ensuring unfair trade practices are eliminated and consumer rights are upheld.</li>
                <li><strong>Consumer Protection (E-Commerce) Rules 2020:</strong> Including mandatory display of refund policy, cancellation terms, and grievance officer details.</li>
                <li><strong>RBI Guidelines on Digital Payments:</strong> Refund processing adheres to Reserve Bank of India mandated timelines for failed or reversed digital transactions.</li>
                <li><strong>Payment Gateway Compliance:</strong> All refunds are processed through PCI-DSS Level 1 certified payment gateways.</li>
              </ul>
            </section>

            {/* Section 9: CONTACT */}
            <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">9</span>
                <span>Billing & Refund Help Desk</span>
              </h2>
              <p>
                Have questions about an upcoming charge, need help with your receipt, or want to initiate a cancellation or refund? Our billing specialists are on standby:
              </p>
              <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <p className="font-black text-slate-900 dark:text-white text-sm">Queueless Labs Financial Operations Desk</p>
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Billing & Refunds:</span>
                    <a href="mailto:billing@queuelesslabs.com" className="hover:underline">billing@queuelesslabs.com</a>
                  </p>
                  <p className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold">
                    <Mail className="w-3.5 h-3.5" />
                    <span>General Support:</span>
                    <a href="mailto:support@queuelesslabs.com" className="hover:underline">support@queuelesslabs.com</a>
                  </p>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  Dedicated assistance for Cashfree UPI, Dodo Payments, Cards, Net Banking & Bank Transfer Invoicing.
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Response SLA: Acknowledgment within 24 hours; refund initiated within 48 hours of approval.
                </p>
              </div>
            </section>
          </div>

          {/* Quick Nav Footer */}
          <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Explore related policies:</span>
            <div className="flex items-center gap-4 flex-wrap">
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

export default RefundPolicy;
