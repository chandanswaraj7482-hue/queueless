import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  Building2,
  Lock,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Mail,
  Zap,
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';

export const TermsOfService: React.FC = () => {
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

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 rounded-full text-xs font-black uppercase tracking-wider border border-blue-200 dark:border-blue-800">
              <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Hospital Subscription Agreement</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              Queueless Healthcare OS Terms of Service
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span><strong>Effective Date:</strong> November 1, 2026</span>
              <span>•</span>
              <span><strong>Version:</strong> 2.5 Clinical SaaS</span>
              <span>•</span>
              <span className="text-blue-700 dark:text-blue-400 font-semibold">Worldwide Enterprise Standards</span>
            </div>
          </div>

          {/* Core Content Body */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-10 shadow-lg space-y-10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">1</span>
                <span>Agreement to Terms & Applicability</span>
              </h2>
              <p>
                These Terms of Service ("Terms") constitute a legally binding agreement between Queueless Labs Inc. ("Queueless Labs", "Queueless", "we", "us") and the healthcare practice, clinic, polyclinic, or hospital entity ("Customer", "you") subscribing to or using the Queueless Healthcare Operating System.
              </p>
              <p>
                By completing subscription registration, checking out through our payment gateways (Dodo Payments or PayPal), or accessing any clinical dashboard, you agree to be bound by these Terms and our Privacy Policy.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">2</span>
                <span>Critical Medical Disclaimer</span>
              </h2>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/60 rounded-2xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-black text-amber-950 dark:text-amber-100">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>NOT A MEDICAL DIAGNOSTIC OR EMERGENCY DISPATCH DEVICE</span>
                </div>
                <p>
                  Queueless is an administrative workflow, queue ticketing, and waiting room coordination software platform. It does NOT provide clinical diagnosis, medical judgment, prescription verification, or emergency medical dispatch services.
                </p>
                <p>
                  Licensed medical practitioners inside consulting cabins remain exclusively responsible for patient triage, examination, medical care, and clinical outcomes. Queueless shall have zero liability for medical malpractice or clinical decisions made by clinic staff.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">3</span>
                <span>Subscription Plans, Billing & Payment Processing</span>
              </h2>
              <p>
                Access to Queueless Healthcare OS is granted under monthly or annual subscription plans (Starter Clinic, Growth Super OPD, Enterprise Hospital):
              </p>
              <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>Payment Gateways:</strong> All subscription payments are processed securely via <strong>Dodo Payments</strong> or <strong>PayPal</strong>. Your payment method will be charged automatically at the start of each billing cycle (monthly or annually) until cancelled.
                </li>
                <li>
                  <strong>Zero Platform Markup:</strong> Queueless charges 0% transaction commission on clinic consultation fees collected directly by your hospital.
                </li>
                <li>
                  <strong>Taxes & Invoicing:</strong> Invoices are generated electronically upon each successful charge, detailing applied VAT, GST, or regional sales taxes.
                </li>
                <li>
                  <strong>Failed Transactions:</strong> If recurring billing fails, our automated gateway will retry over a 7-day grace period before temporary suspension of active doctor consoles.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">4</span>
                <span>30-Day Risk-Free Money-Back Guarantee</span>
              </h2>
              <p>
                We stand behind Queueless with a full 30-day satisfaction guarantee. If your hospital is not completely satisfied with waiting room congestion reduction or doctor throughput improvements during the first 30 days of your initial subscription, you may request a 100% refund without hassle.
              </p>
              <p>
                Refunds are processed to the original payment method (Dodo Payments card or PayPal account) within 3-5 business days. Please review our <Link to="/refund-policy" className="text-blue-600 dark:text-blue-400 font-bold underline">Refund Policy</Link> for details.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">5</span>
                <span>Physical QR Standee Hardware Delivery & Warranty</span>
              </h2>
              <p>
                For plans including our physical Laser-Etched Acrylic QR Standee addon:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>Hardware is custom manufactured with your hospital branding and dispatched via express courier (DHL / FedEx / BlueDart) within 48 hours of subscription.</li>
                <li>Delivery typically occurs in 3 to 7 business days depending on clinic geography.</li>
                <li>We provide a <strong>1-Year Replacement Warranty</strong> against acrylic yellowing, laser engraving defects, or damage sustained during shipping.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">6</span>
                <span>Hospital Data Ownership & Privacy Safeguards</span>
              </h2>
              <p>
                You retain complete, unencumbered 100% ownership of all patient records, registration demographics, and consultation histories generated within your Queueless tenant. Queueless will never sell, lease, or monetize customer data.
              </p>
              <p>
                Upon subscription termination, you have the right to request a complete data export in standard open formats (JSON / CSV). All active databases are scrubbed within 30 days of confirmed closure.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">7</span>
                <span>Platform Uptime & Service Level Agreement (SLA)</span>
              </h2>
              <p>
                Queueless commits to maintaining a <strong>99.9% Service Uptime</strong> across core patient QR generation and doctor cabin calling services. Scheduled maintenance is executed during low-traffic overnight windows (02:00 - 04:00 local time) with prior advance notification.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">8</span>
                <span>Subscription Cancellation & Account Termination</span>
              </h2>
              <p>
                You may cancel your subscription at any time directly through your Director Admin Console or by contacting <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-blue-600 dark:text-blue-400">billing@queuelesslabs.com</code>. There are zero cancellation fees or lock-in penalties. Access remains active until the end of your paid billing term.
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">9</span>
                <span>Contacting Legal & Enterprise Support</span>
              </h2>
              <p>
                For contractual inquiries, Enterprise custom MSAs, or HIPAA Business Associate execution, reach out to our legal department:
              </p>
              <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <p><strong>Queueless Labs Inc. — Legal Counsel</strong></p>
                <p>Global SaaS Contracts & Enterprise Healthcare Division</p>
                <p className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold">
                  <Mail className="w-3.5 h-3.5" />
                  <a href="mailto:legal@queuelesslabs.com" className="hover:underline">legal@queuelesslabs.com</a>
                </p>
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
              <Link to="/security" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Security Architecture ➔
              </Link>
              <Link to="/refund-policy" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Refund Policy ➔
              </Link>
            </div>
          </div>
        </div>
      </main>

      <CommercialFooter />
    </div>
  );
};

