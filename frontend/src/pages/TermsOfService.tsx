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
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';
import { SeoHead } from '../components/SeoHead';

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-x-clip flex flex-col transition-colors duration-200">
      <SeoHead
        title="Terms of Service | Queueless Healthcare OS Enterprise Agreement"
        description="Official Terms of Service and Master Subscription Agreement for Queueless Healthcare Operating System. Covers clinical disclaimers, Google Authentication, service SLAs, and zero fund custody."
        keywords="queueless terms of service, hospital software subscription agreement, clinical queue terms, hipaa master service agreement, google authentication terms"
        canonical="https://queueless-os.vercel.app/terms"
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

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 rounded-full text-xs font-black uppercase tracking-wider border border-blue-200 dark:border-blue-800">
              <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Hospital Master Subscription Agreement</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              Queueless Healthcare OS Terms of Service
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span><strong>Effective Date:</strong> November 1, 2026</span>
              <span>•</span>
              <span><strong>Last Updated:</strong> November 13, 2026</span>
              <span>•</span>
              <span><strong>Version:</strong> 3.0 Enterprise Clinical SaaS</span>
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
                <span>Agreement to Terms & Legal Scope</span>
              </h2>
              <p>
                These Terms of Service ("Terms") constitute a legally binding contract between <strong>Queueless Technologies Inc. / Queueless Labs</strong> ("Queueless", "we", "us") and the healthcare provider, hospital, clinic, diagnostic center, or individual user ("Customer", "you") accessing or utilizing the Queueless Healthcare Operating System and associated portals.
              </p>
              <p>
                By creating a hospital account, checking in as a patient, or accessing any console, you affirm that you have read, understood, and agreed to these Terms and our <Link to="/privacy" className="text-blue-600 dark:text-cyan-400 underline font-semibold">Privacy Policy</Link>.
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
                  Queueless is an administrative workflow, queue orchestration, and waiting room coordination software platform. It does NOT provide clinical medical diagnosis, triage judgment, prescription verification, or emergency medical dispatch services (such as 108/112/911 ambulance services).
                </p>
                <p>
                  Licensed physicians and hospital personnel remain exclusively responsible for patient examination, clinical triage, medical care, and healthcare outcomes. Queueless shall bear zero liability for medical outcomes or physician clinical determinations.
                </p>
              </div>
            </section>

            {/* Section 3: GOOGLE AUTHENTICATION & SINGLE SIGN-ON */}
            <section className="space-y-3 p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
              <h2 className="text-lg font-black text-blue-950 dark:text-blue-100 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                <span>3. Google Authentication & Single Sign-On (SSO) Services</span>
              </h2>
              <p className="text-blue-950 dark:text-slate-200">
                Queueless supports Google Sign-In powered by Firebase Authentication for swift access to patient health vaults and hospital consoles:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-700 dark:text-slate-300 text-xs">
                <li>You may authenticate using your verified Google credentials, granting Queueless access to your verified email address, display name, and avatar.</li>
                <li>Queueless strictly adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-cyan-400 underline font-semibold">Google API Services User Data Policy</a>, including the Limited Use requirements.</li>
                <li>Your Google profile data is never sold, never shared with commercial advertising brokers, and never utilized for artificial intelligence model training.</li>
                <li>Users may revoke Google account integration at any time through Google Account Security settings.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">4</span>
                <span>Subscription Plans, Billing & Payment Processing</span>
              </h2>
              <p>
                Access to Queueless Healthcare OS is granted under flexible monthly or annual subscriptions (Starter Clinic, Growth Super OPD, Enterprise Hospital Network):
              </p>
              <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>Direct Hospital Settlement Guarantee:</strong> 100% of patient consultation fees paid via UPI or clinic payment methods settle directly into your own hospital bank account. Queueless retains 0% commission on medical fees and exercises zero custody of patient funds.
                </li>
                <li>
                  <strong>Software SaaS Invoicing:</strong> Software licensing fees are charged on recurring monthly or annual cycles through PCI-DSS Level 1 compliant payment gateways.
                </li>
                <li>
                  <strong>Taxes & Regulatory Billing:</strong> Invoices are dispatched electronically with applicable GST/VAT compliant tax identifiers.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">5</span>
                <span>30-Day Risk-Free Money-Back Guarantee</span>
              </h2>
              <p>
                Every new hospital or polyclinic subscription is covered under our <strong>30-Day 100% Money-Back Guarantee</strong>. If Queueless does not tangibly reduce waiting lobby congestion or improve patient satisfaction during your first 30 days, notify us for a full, unconditional refund.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">6</span>
                <span>Platform Uptime & Service Level Agreement (SLA)</span>
              </h2>
              <p>
                Queueless commits to maintaining a <strong>99.9% Service Uptime SLA</strong> for core patient QR generation, real-time WebSocket token broadcasts, and doctor calling consoles. Unscheduled downtime exceeding SLA thresholds qualifies enterprise customers for pro-rata service credits.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">7</span>
                <span>Account Cancellation & Data Portability</span>
              </h2>
              <p>
                Hospitals may cancel subscriptions at any time with zero termination penalties. Upon cancellation, your workspace remains functional until the conclusion of the paid term. You may export all clinical logs in open JSON or CSV formats. Following account closure, tenant data is irreversibly wiped within 30 days.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">8</span>
                <span>Legal Counsel & Enterprise Inquiries</span>
              </h2>
              <p>
                For custom Enterprise Master Service Agreements (MSAs), HIPAA BAA signatures, or institutional tenders, contact our legal counsel:
              </p>
              <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <p><strong>Queueless Technologies Inc. • Legal Division</strong></p>
                <p>Corporate Headquarters: Technology Corridor, Outer Ring Road, Bangalore, Karnataka 560103, India</p>
                <p className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold pt-1">
                  <Mail className="w-3.5 h-3.5" />
                  <a href="mailto:legal@queuelesslabs.com" className="hover:underline">legal@queuelesslabs.com</a>
                  <span>•</span>
                  <a href="mailto:privacy@queuelesslabs.com" className="hover:underline">privacy@queuelesslabs.com</a>
                </p>
              </div>
            </section>
          </div>

          {/* Quick Nav Footer */}
          <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Explore related legal frameworks:</span>
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

export default TermsOfService;
