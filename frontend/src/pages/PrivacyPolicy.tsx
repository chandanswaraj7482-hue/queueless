import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Mail,
  Building2,
  Clock,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';

export const PrivacyPolicy: React.FC = () => {
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
              <span>Healthcare Data Privacy Framework</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              Queueless Healthcare OS Privacy Policy
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span><strong>Effective Date:</strong> November 1, 2026</span>
              <span>•</span>
              <span><strong>Last Updated:</strong> November 5, 2026</span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">HIPAA, ABDM & GDPR Compliant</span>
            </div>
          </div>

          {/* Core Content Body */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-10 shadow-lg space-y-10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">1</span>
                <span>Our Role & Commitment to Patient Privacy</span>
              </h2>
              <p>
                Queueless Labs Inc. ("Queueless Labs", "Queueless", "we", "us", or "our") operates the Queueless Healthcare Operating System, a zero-wait clinical queue coordination platform utilized by hospitals, polyclinics, and healthcare facilities worldwide.
              </p>
              <p>
                In technical data protection terms, the <strong>subscribing Hospital or Clinic acts as the Data Controller</strong> regarding patient clinical encounters. <strong>Queueless acts as the Data Processor (or Business Associate under HIPAA)</strong>, securely storing and executing queue coordination strictly on the hospital's verified instructions.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">2</span>
                <span>Information We Collect and Process</span>
              </h2>
              <p>
                We limit data collection exclusively to what is clinically necessary to issue OPD queue tokens, notify patients, and route consultations to doctors:
              </p>
              <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>Patient OPD Demographics:</strong> Patient full name, contact mobile number, age, gender, and visit type (New Consultation or 15-Day Follow-Up).
                </li>
                <li>
                  <strong>Chief Clinical Complaints (Self-Reported):</strong> Brief symptom descriptions voluntarily provided by the patient at QR check-in so consulting doctors can review pre-filled context prior to cabin entry.
                </li>
                <li>
                  <strong>Queue Telemetry:</strong> Issued token number, time of arrival, estimated dwell time, assigned consulting cabin, and consultation duration.
                </li>
                <li>
                  <strong>Hospital Subscriber Data:</strong> Hospital Director name, business email, clinic address, official contact phone, and consultation fee structure.
                </li>
              </ul>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Advertising Trackers:</strong> We do NOT sell patient records, display third-party advertisements, or use invasive tracking cookies. Your clinical waiting room data is never monetized.
                </span>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">3</span>
                <span>HIPAA & Protected Health Information (PHI) Compliance</span>
              </h2>
              <p>
                For healthcare practices operating within the United States or handling US patient data, Queueless adheres to the Health Insurance Portability and Accountability Act (HIPAA) of 1996:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>All PHI is encrypted in transit using Transport Layer Security (TLS 1.3) and encrypted at rest with AES-256.</li>
                <li>Queueless enters into formal <strong>Business Associate Agreements (BAAs)</strong> with hospital clients upon request.</li>
                <li>Strict Role-Based Access Control (RBAC) ensures receptionists and doctors only view patient queues relevant to their designated department or cabin.</li>
                <li>Patient phone numbers and identifying details are masked on public displays (e.g. 55" Waiting Hall TV only broadcasts Token IDs such as "A-108", never full names).</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">4</span>
                <span>Ayushman Bharat (ABDM) & Indian DPDP Act 2023 Readiness</span>
              </h2>
              <p>
                For Indian clinics and hospitals, Queueless aligns with National Health Authority (NHA) standards for the Ayushman Bharat Digital Mission (ABDM):
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>Compatible with milestone M1/M2 ABHA Health ID verification.</li>
                <li>Patient data residency is maintained in certified Indian sovereign cloud regions (AWS Mumbai / ap-south-1).</li>
                <li>Full compliance with Digital Personal Data Protection Act (DPDP Act 2023) regarding purpose limitation and verifiable patient consent.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">5</span>
                <span>GDPR & UK Data Protection Act (Special Category Health Data)</span>
              </h2>
              <p>
                For European Union and United Kingdom clinics, processing of health data is governed under GDPR Article 6(1)(b) (performance of a contract) and Article 9(2)(h) (provision of health or social care treatment):
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Patients or clinics may request complete purging of historical queue tokens.</li>
                <li><strong>Right to Data Portability:</strong> Hospital directors can export full consultation and queue logs in JSON or CSV formats at any time.</li>
                <li><strong>Data Minimization:</strong> Symptoms and chief complaints are accessible only during the active consultation session.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">6</span>
                <span>Direct Hospital Bank Settlement & Zero Fund Custody</span>
              </h2>
              <p>
                Patient consultation fee transactions (whether paid via Direct Merchant UPI, Cashfree, Razorpay, or cash at counter) are governed under a strict <strong>Zero Fund Custody Policy</strong>:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>100% Direct Route to Hospital Bank:</strong> All patient OPD consultation fees paid via UPI (Google Pay, PhonePe, Paytm) or payment gateways route directly through the subscribing hospital's own configured merchant credentials into the hospital's bank account.</li>
                <li><strong>Zero Platform Custody:</strong> Queueless does NOT hold, pool, or custody patient consultation funds. Queueless is strictly an operating system and software infrastructure provider.</li>
                <li><strong>Separate SaaS Licensing:</strong> Payments made by hospitals to Queueless represent software licensing subscriptions (SaaS MRR) processed via PCI-DSS Level 1 compliant processors.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">7</span>
                <span>Multi-Tenant Partitioning & Founder Privacy Wall</span>
              </h2>
              <p>
                To maintain compliance with HIPAA, NABH, and GDPR data segregation mandates, Queueless implements an impenetrable data boundary between healthcare facilities and the platform founder:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>Hospital Workspace Isolation:</strong> Every subscribing clinic operates in an isolated tenant container. Staff at Hospital A have zero technical ability to access queues, doctors, or patient records of Hospital B.</li>
                <li><strong>Founder Privacy Wall:</strong> The top-level Founder Command Center operates strictly on anonymized, high-level B2B SaaS metrics (Daily footfall volume, MRR, doctor counts, access approval status). Individual patient medical details, chief complaints, and contact records are excluded from the founder dashboard.</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">8</span>
                <span>Data Retention and Anonymization</span>
              </h2>
              <p>
                Queue tokens, wait times, and consultation completion logs are retained for as long as the hospital maintains an active subscription, enabling long-term OPD throughput analysis. When a hospital terminates its workspace, all associated patient records are completely deleted or permanently anonymized within 30 days.
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">9</span>
                <span>Contacting Our Data Protection Officer (DPO)</span>
              </h2>
              <p>
                If you have questions regarding this Privacy Policy, your patient rights, or wish to execute a HIPAA Business Associate Agreement, please contact our dedicated compliance office:
              </p>
              <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <p><strong>Queueless Labs Inc. — Data Protection Office</strong></p>
                <p>Attn: Chief Privacy Officer & Grievance Officer</p>
                <p className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold">
                  <Mail className="w-3.5 h-3.5" />
                  <a href="mailto:privacy@queuelesslabs.com" className="hover:underline">privacy@queuelesslabs.com</a>
                </p>
                <p className="text-slate-500 dark:text-slate-400">Response SLA: Within 24-48 business hours</p>
              </div>
            </section>
          </div>

          {/* Quick Nav Footer */}
          <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Explore related policies:</span>
            <div className="flex items-center gap-4">
              <Link to="/terms" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Terms of Service ➔
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

