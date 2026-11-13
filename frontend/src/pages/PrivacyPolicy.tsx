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
  ExternalLink,
  Trash2,
  KeyRound,
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';
import { SeoHead } from '../components/SeoHead';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-x-clip flex flex-col transition-colors duration-200">
      <SeoHead
        title="Privacy Policy | Queueless Healthcare OS & Google OAuth Compliance"
        description="Official Privacy Policy and Data Protection Framework for Queueless Healthcare OS. Fully compliant with Google API Services User Data Policy, ABDM, Indian DPDP Act 2023, HIPAA, and GDPR."
        keywords="queueless privacy policy, healthcare data protection, google api user data policy limited use, abdm privacy, dpdp act 2023, hipaa compliant queue"
        canonical="https://queueless-os.vercel.app/privacy"
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
              <span>Enterprise Healthcare Data Privacy Framework</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              Queueless Healthcare OS Privacy Policy
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span><strong>Effective Date:</strong> November 1, 2026</span>
              <span>•</span>
              <span><strong>Last Updated:</strong> November 13, 2026</span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                Google OAuth, ABDM, DPDP 2023 & HIPAA Compliant
              </span>
            </div>
          </div>

          {/* Core Content Body */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-10 shadow-lg space-y-10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">1</span>
                <span>Our Identity, Scope & Fiduciary Commitment</span>
              </h2>
              <p>
                <strong>Queueless Technologies Inc. / Queueless Labs</strong> ("Queueless", "we", "us", or "our") develops and operates the <strong>Queueless Healthcare Operating System</strong>, an autonomous zero-wait outpatient queue management and digital clinical workflow platform used by hospitals, polyclinics, medical colleges, and diagnostic centers worldwide.
              </p>
              <p>
                In data privacy terms:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>The Subscribing Healthcare Entity (Hospital/Clinic)</strong> acts as the <strong>Data Fiduciary (Data Controller)</strong> regarding all patient clinical encounters, consultations, and prescriptions.</li>
                <li><strong>Queueless</strong> acts strictly as the <strong>Data Processor (or Business Associate under HIPAA)</strong>, executing queue telemetry, authentication, and communication protocols solely on the authenticated instructions of the hospital and patient.</li>
              </ul>
            </section>

            {/* Section 2: MANDATORY GOOGLE OAUTH & API SERVICES COMPLIANCE */}
            <section className="space-y-4 p-5 sm:p-6 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                <h2 className="text-base sm:text-lg font-black text-blue-950 dark:text-blue-100">
                  2. Google API Services & OAuth User Data Policy (Limited Use Disclosure)
                </h2>
              </div>

              <p className="text-blue-950 dark:text-slate-200">
                Queueless integrates with <strong>Google Identity Services & Firebase Authentication</strong> to provide seamless, secure Single Sign-On (SSO) for hospital administrators, doctors, receptionists, and patients accessing their Universal Health Vault.
              </p>

              <div className="space-y-2">
                <h3 className="font-bold text-xs uppercase tracking-wide text-blue-900 dark:text-cyan-300">
                  A. What Google Data We Request & Process:
                </h3>
                <ul className="space-y-1 list-disc pl-5 text-slate-700 dark:text-slate-300 text-xs">
                  <li><strong>Basic Profile & Email:</strong> Your verified Google account email address, full display name, and avatar/profile picture.</li>
                  <li><strong>Google User ID (UID):</strong> A unique cryptographic identifier issued by Google to authenticate your session across devices.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-xs uppercase tracking-wide text-blue-900 dark:text-cyan-300">
                  B. Purpose of Google Data Collection:
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  We use your Google account data strictly to verify your identity, prevent unauthorized access to private clinical records, link your issued OPD queue tokens to your verified account, and permit instant access to your electronic prescriptions and 15-day follow-up records.
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-blue-300/80 dark:border-blue-800 shadow-xs space-y-2">
                <span className="text-[11px] font-black uppercase text-blue-700 dark:text-cyan-300 tracking-wider block">
                  Mandatory Limited Use Compliance Statement:
                </span>
                <p className="text-xs font-semibold text-slate-900 dark:text-white leading-relaxed">
                  "Queueless' use and transfer of information received from Google APIs to any other app will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-cyan-400 underline inline-flex items-center gap-0.5">Google API Services User Data Policy <ExternalLink className="w-3 h-3" /></a>, including the Limited Use requirements."
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-xs uppercase tracking-wide text-blue-900 dark:text-cyan-300">
                  C. Absolute Restrictions on Google User Data:
                </h3>
                <ul className="space-y-1.5 list-disc pl-5 text-slate-700 dark:text-slate-300 text-xs">
                  <li><strong>Zero Commercial Advertising:</strong> We NEVER use Google user data to serve targeted advertisements or retargeting campaigns.</li>
                  <li><strong>Zero Selling or Transfer:</strong> We NEVER sell, rent, or transfer Google user data to third-party data brokers, data aggregators, or marketing firms.</li>
                  <li><strong>Zero AI Model Training:</strong> We NEVER use your personal Google account data or health records to train generalized AI or machine learning models.</li>
                  <li><strong>Zero Human Viewing:</strong> No human employee at Queueless reads or views your private Google data unless explicitly authorized by you for technical troubleshooting, required to comply with law, or as part of security incident mitigation.</li>
                </ul>
              </div>
            </section>

            {/* Section 3: CLINICAL DATA COLLECTION */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">3</span>
                <span>Clinical Information We Collect and Process</span>
              </h2>
              <p>
                We limit clinical data collection exclusively to parameters strictly required for OPD queue dispatch and medical consultation record-keeping:
              </p>
              <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>Patient Demographics:</strong> Full name, verified mobile number, age, gender, and visit classification (New OPD Consultation or Free 15-Day Review).
                </li>
                <li>
                  <strong>Chief Complaints & Symptoms:</strong> Voluntarily provided symptom summaries submitted during digital check-in to provide consulting doctors with preliminary context.
                </li>
                <li>
                  <strong>Queue Telemetry:</strong> OPD Token ID, arrival timestamp, dwell time, assigned consultation cabin number, and consultation duration.
                </li>
                <li>
                  <strong>Healthcare Provider Credentials:</strong> Doctor registration number, clinic address, designated consulting hours, and consultation fee structure.
                </li>
              </ul>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Advertising Trackers:</strong> We do NOT sell patient records, display third-party advertisements, or use invasive cross-site cookies. Your clinical waiting room data is never monetized.
                </span>
              </div>
            </section>

            {/* Section 4: HIPAA COMPLIANCE */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">4</span>
                <span>HIPAA & Protected Health Information (PHI) Security</span>
              </h2>
              <p>
                For healthcare practices operating within the United States or handling US patient data, Queueless adheres to the Health Insurance Portability and Accountability Act (HIPAA) of 1996 and HITECH Act:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>All PHI is encrypted in transit using Transport Layer Security (TLS 1.3) and encrypted at rest with military-grade AES-256.</li>
                <li>Queueless enters into formal <strong>Business Associate Agreements (BAAs)</strong> with institutional healthcare clients.</li>
                <li>Strict Role-Based Access Control (RBAC) ensures hospital receptionists and doctors only view patient queues relevant to their designated department or cabin.</li>
                <li>Public waiting room displays (e.g. 55" Waiting Hall TV) strictly mask personal identities, displaying only non-identifying Token IDs (e.g. "Token #24") and cabin numbers.</li>
              </ul>
            </section>

            {/* Section 5: ABDM & INDIAN DPDP ACT 2023 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">5</span>
                <span>Ayushman Bharat (ABDM) & Indian DPDP Act 2023 Sovereignty</span>
              </h2>
              <p>
                For Indian healthcare facilities, Queueless is engineered to align strictly with the National Health Authority (NHA) standards for the <strong>Ayushman Bharat Digital Mission (ABDM)</strong> and the <strong>Digital Personal Data Protection Act (DPDP Act 2023)</strong>:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>Pre-configured for ABHA Scan-and-Share Milestone 1 (M1) and Milestone 2 (M2) compliance.</li>
                <li>Patient data residency is strictly anchored in MeitY-empanelled sovereign Indian cloud data centers (AWS Mumbai / ap-south-1).</li>
                <li>Consent Architecture: All patient data processing is anchored on voluntary, specific, and revocable consent, adhering to Section 6 of the DPDP Act 2023.</li>
              </ul>
            </section>

            {/* Section 6: ACCOUNT DELETION & DATA PURGING */}
            <section className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <h2 className="text-base sm:text-lg font-black text-slate-950 dark:text-white">
                  6. User Data Deletion, Retention & Account Revocation Rights
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Every user (doctor, hospital administrator, or patient) possesses full control over their personal and clinical data:
              </p>

              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-slate-900 dark:text-white">How to Revoke Google Account Access:</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  You can revoke Queueless' access to your Google account at any moment by visiting your Google Security settings at{' '}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline font-semibold"
                  >
                    Google Third-Party Apps Permissions
                  </a>.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-slate-900 dark:text-white">How to Request Full Data Erasure:</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  To permanently delete your patient profile, consultation history, or hospital workspace, send a written request to{' '}
                  <a href="mailto:privacy@queuelesslabs.com" className="text-blue-600 dark:text-blue-400 font-bold underline">
                    privacy@queuelesslabs.com
                  </a>{' '}
                  with the subject line <em>"Account Deletion Request"</em> from your registered email.
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Our compliance team verifies identity within <strong>24 business hours</strong> and permanently purges or cryptographically shreds all associated personal identifiers within <strong>14 business days</strong>, subject to statutory medical record retention mandates imposed by applicable state medical councils.
                </p>
              </div>
            </section>

            {/* Section 7: CHILDREN'S PRIVACY */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">7</span>
                <span>Children's Privacy & Pediatric Care (COPPA & DPDP Section 9)</span>
              </h2>
              <p>
                Queueless does not knowingly permit children under the age of 18 to create independent accounts or initiate unsupervised consultations. When pediatric patients are registered at a hospital outpatient department, the check-in is performed exclusively by or with the verifiable consent of a parent or legal guardian.
              </p>
            </section>

            {/* Section 8: DIRECT HOSPITAL SETTLEMENT */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">8</span>
                <span>Zero Custody of Patient Consultation Funds</span>
              </h2>
              <p>
                All patient consultation fee transactions (UPI, credit/debit card, net banking, or cash at desk) operate under our strict <strong>Zero Fund Custody Guarantee</strong>:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>100% Direct Settlement:</strong> Consultation fees settle directly into the subscribing hospital's own verified merchant bank account.</li>
                <li><strong>Zero Intermediate Escrow:</strong> Queueless never holds, routes, or pools patient medical funds.</li>
                <li><strong>Software Licensing:</strong> Payments made by clinics to Queueless represent pure software licensing fees processed via PCI-DSS Level 1 compliant processors.</li>
              </ul>
            </section>

            {/* Section 9: OFFICIAL CONTACT & GRIEVANCE REDRESSAL */}
            <section className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">9</span>
                <span>Official Contact & Statutory Grievance Redressal</span>
              </h2>
              <p>
                In compliance with the Information Technology Act 2000, Rule 3(2) of the Information Technology Rules 2021, and the Digital Personal Data Protection Act 2023, the details of our designated <strong>Data Protection Officer & Grievance Redressal Officer</strong> are provided below:
              </p>

              <div className="p-5 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <p className="font-black text-slate-900 dark:text-white text-sm">
                  Queueless Technologies Inc. • Queueless Labs
                </p>
                <p><strong>Designated Grievance Officer:</strong> Chief Privacy & Compliance Officer</p>
                <p><strong>Registered Legal Office:</strong> Technology Corridor, Outer Ring Road, Bangalore, Karnataka 560103, India</p>
                <p className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold pt-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Official Compliance Email:</span>
                  <a href="mailto:privacy@queuelesslabs.com" className="hover:underline">
                    privacy@queuelesslabs.com
                  </a>
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Statutory Turnaround SLA: Acknowledgment within 24 hours; resolution within 15 business days.
                </p>
              </div>
            </section>
          </div>

          {/* Quick Nav Footer */}
          <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Explore related legal frameworks:</span>
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

export default PrivacyPolicy;
