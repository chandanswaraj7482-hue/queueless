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
  Eye,
  Database,
  Users,
  Server,
  Shield,
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';
import { SeoHead } from '../components/SeoHead';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-x-clip flex flex-col transition-colors duration-200">
      <SeoHead
        title="Privacy Policy | Queueless Healthcare OS — DPDP Act 2023, HIPAA, GDPR & Google OAuth Compliance"
        description="Official Privacy Policy and Data Protection Framework for Queueless Healthcare OS. Fully compliant with Google API Services User Data Policy, ABDM, Indian DPDP Act 2023, HIPAA, GDPR, and IT Act 2000."
        keywords="queueless privacy policy, healthcare data protection, google api user data policy limited use, abdm privacy, dpdp act 2023, hipaa compliant queue, gdpr healthcare"
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
              <span><strong>Last Updated:</strong> November 25, 2026</span>
              <span>•</span>
              <span><strong>Version:</strong> 4.2</span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                Google OAuth, ABDM, DPDP 2023, HIPAA, GDPR, IT Act 2000, Consumer Protection Act 2019 Compliant
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
                <strong>Queueless Technologies Inc. / Queueless Labs</strong> ("Queueless", "we", "us", or "our") develops and operates the <strong>Queueless Healthcare Operating System</strong> ("Platform"), an autonomous zero-wait outpatient queue management and digital clinical workflow platform used by hospitals, polyclinics, medical colleges, diagnostic centers, and healthcare facilities worldwide.
              </p>
              <p>
                This Privacy Policy explains how we collect, use, store, disclose, and protect information when you access or use the Platform, including our website at <a href="https://queueless-os.vercel.app" className="text-blue-600 dark:text-blue-400 underline font-semibold">queueless-os.vercel.app</a>, mobile-optimized patient check-in interfaces, hospital admin dashboards, doctor consultation consoles, reception POS terminals, TV kiosk displays, and any associated APIs.
              </p>
              <p>
                In data privacy terms:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>The Subscribing Healthcare Entity (Hospital/Clinic)</strong> acts as the <strong>Data Fiduciary (Data Controller)</strong> under the DPDP Act 2023 (India) and GDPR (EU) regarding all patient clinical encounters, consultations, prescriptions, and medical records.</li>
                <li><strong>Queueless</strong> acts strictly as the <strong>Data Processor (or Business Associate under HIPAA)</strong>, executing queue telemetry, authentication, payment orchestration, and communication protocols solely on the authenticated instructions of the subscribing hospital and the consenting patient.</li>
                <li>Under the <strong>Indian Information Technology Act 2000</strong> (as amended by IT (Amendment) Act 2008), Queueless qualifies as an "intermediary" and maintains "reasonable security practices and procedures" as mandated under Section 43A and Rule 8 of the IT (Reasonable Security Practices) Rules 2011.</li>
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
                  <li>We do NOT request or access your Google Drive files, Gmail messages, Google Calendar, contacts, photos, YouTube data, or any other Google service data beyond the basic profile scope.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-xs uppercase tracking-wide text-blue-900 dark:text-cyan-300">
                  B. Purpose of Google Data Collection:
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  We use your Google account data <strong>exclusively</strong> for the following purposes: (i) to verify your identity and prevent unauthorized access to private clinical records, (ii) to link your issued OPD queue tokens to your verified account, (iii) to permit instant access to your electronic prescriptions and 15-day follow-up records, and (iv) to deliver account-specific notifications related to your queue status.
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
                  <li><strong>Zero Commercial Advertising:</strong> We NEVER use Google user data to serve targeted advertisements, retargeting campaigns, or behavioral profiling.</li>
                  <li><strong>Zero Selling or Transfer:</strong> We NEVER sell, rent, lease, sublicense, or transfer Google user data to third-party data brokers, data aggregators, marketing firms, or any entity.</li>
                  <li><strong>Zero AI Model Training:</strong> We NEVER use your personal Google account data or health records to train generalized AI, machine learning models, or large language models.</li>
                  <li><strong>Zero Human Viewing:</strong> No human employee at Queueless reads or views your private Google data unless (a) explicitly authorized by you for technical troubleshooting, (b) required to comply with applicable law or valid legal process, or (c) necessary as part of security incident mitigation with your consent.</li>
                  <li><strong>Minimal Scope:</strong> We only request the minimum OAuth scopes necessary (openid, email, profile) and never request sensitive or restricted scopes.</li>
                </ul>
              </div>
            </section>

            {/* Section 3: CLINICAL DATA COLLECTION */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">3</span>
                <span>Information We Collect & Process</span>
              </h2>
              <p>
                We limit data collection exclusively to parameters strictly required for OPD queue dispatch, payment processing, and medical consultation record-keeping. We categorize the information as follows:
              </p>

              <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900 dark:text-slate-200 mt-4">3.1 Patient Information (Provided Directly by You)</h3>
              <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>Patient Demographics:</strong> Full name, verified mobile number (with country code), age, gender, blood group, and address.</li>
                <li><strong>Visit Information:</strong> Visit classification (New OPD Consultation or Free Follow-Up Review), chief complaints/symptoms, selected doctor, selected service, emergency contact details.</li>
                <li><strong>Payment Information:</strong> Transaction IDs, payment method (UPI/Card/Cash), consultation fee amount, and payment status. Note: Raw payment card numbers, CVV, or banking PINs are NEVER stored on our servers — these are processed exclusively by PCI-DSS Level 1 certified payment gateways (Cashfree/Dodo Payments).</li>
                <li><strong>Health Vault Credentials:</strong> If you create a Patient Vault account, we store your hashed PIN/password (never in plain text) to secure access to your consultation history.</li>
              </ul>

              <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900 dark:text-slate-200 mt-4">3.2 Hospital & Provider Information</h3>
              <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>Institutional Data:</strong> Hospital name, address, contact phone, operating hours, logo, and clinic slug/identifier.</li>
                <li><strong>Healthcare Provider Credentials:</strong> Doctor names, medical registration numbers, specialties, consultation room assignments, PIN codes, and consultation fee structures.</li>
                <li><strong>Payment Gateway Configuration:</strong> Hospital-configured payment gateway API credentials (Cashfree AppID/Secret, UPI VPA, bank account details) — stored encrypted in our database exclusively for routing patient payments directly to the hospital's own bank account.</li>
              </ul>

              <h3 className="font-bold text-xs uppercase tracking-wide text-slate-900 dark:text-slate-200 mt-4">3.3 Automatically Collected Data</h3>
              <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>Queue Telemetry:</strong> OPD Token ID, arrival timestamp, dwell time, assigned consultation cabin number, consultation duration, and queue position.</li>
                <li><strong>Device & Access Logs:</strong> IP address, browser type, device type, operating system version, access timestamps, and pages visited — strictly for security monitoring, fraud prevention, and debugging.</li>
                <li><strong>Cookies & Local Storage:</strong> We use essential functional cookies and browser localStorage for session persistence, theme preferences, and offline queue data caching. We do NOT use third-party advertising cookies, tracking pixels, or cross-site analytics trackers.</li>
              </ul>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Advertising Trackers:</strong> We do NOT sell patient records, display third-party advertisements, deploy cross-site tracking cookies, or use any invasive analytics. Your clinical waiting room data is never monetized.
                </span>
              </div>
            </section>

            {/* Section 4: PURPOSE & LEGAL BASIS */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">4</span>
                <span>Purpose of Data Processing & Legal Basis</span>
              </h2>
              <p>We process your personal data for the following specific, lawful purposes:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800">
                      <th className="border border-slate-200 dark:border-slate-700 px-3 py-2 text-left font-black text-slate-900 dark:text-white">Purpose</th>
                      <th className="border border-slate-200 dark:border-slate-700 px-3 py-2 text-left font-black text-slate-900 dark:text-white">Legal Basis (DPDP/GDPR)</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 dark:text-slate-400">
                    <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">OPD Queue Registration & Token Generation</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Performance of Contract / Consent</td></tr>
                    <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Processing Consultation Fee Payments</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Performance of Contract</td></tr>
                    <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Issuing Digital Prescriptions & Follow-Up Records</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Legitimate Interest / Consent</td></tr>
                    <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Real-Time Queue Status Display (TV Kiosk)</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Legitimate Interest (anonymized Token IDs only)</td></tr>
                    <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Hospital Subscription Billing & Invoicing</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Performance of Contract</td></tr>
                    <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Security Monitoring & Fraud Prevention</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Legitimate Interest / Legal Obligation</td></tr>
                    <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Compliance with Medical Record Retention Laws</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Legal Obligation</td></tr>
                    <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Service Improvement & Bug Fixes</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Legitimate Interest</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 5: DATA SHARING & THIRD PARTIES */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">5</span>
                <span>Data Sharing, Disclosure & Third-Party Services</span>
              </h2>
              <p>We share your data only in the following strictly limited circumstances:</p>
              <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>Subscribing Hospital:</strong> Patient data provided during check-in is shared with the hospital that the patient is visiting — including doctors, receptionists, and administrative staff — strictly for clinical and billing purposes.</li>
                <li><strong>Payment Processors:</strong> Transaction data is shared with <strong>Cashfree Payments</strong> and/or <strong>Dodo Payments</strong> solely for the purpose of processing UPI, card, and netbanking transactions. These processors are PCI-DSS Level 1 certified. Patient payments route directly to the hospital's own bank account — Queueless never holds patient funds.</li>
                <li><strong>Cloud Infrastructure Providers:</strong> We use <strong>Vercel</strong> (for serverless compute), <strong>Neon.tech</strong> (for PostgreSQL database), and <strong>Cloudflare</strong> (for DDoS protection and CDN). All infrastructure providers maintain SOC-2 Type II certifications.</li>
                <li><strong>Email/Communication Services:</strong> We use <strong>Resend</strong> and <strong>Brevo SMTP</strong> exclusively for transactional emails such as queue confirmations and appointment reminders. We NEVER send marketing emails without explicit opt-in consent.</li>
                <li><strong>Legal Obligations:</strong> We may disclose information if required by applicable law, court order, government regulation, or valid legal process (e.g., subpoena, search warrant) under Indian, US, or EU jurisdictions.</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, user data may be transferred as part of the transaction with equivalent or stronger privacy protections.</li>
              </ul>

              <div className="p-4 bg-rose-50 dark:bg-rose-950/60 rounded-2xl border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs font-semibold flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong>We NEVER sell, rent, or trade personal data</strong> to data brokers, advertisers, analytics companies, or any third party for monetary or commercial gain. Period.
                </span>
              </div>
            </section>

            {/* Section 6: HIPAA COMPLIANCE */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">6</span>
                <span>HIPAA & Protected Health Information (PHI) Security</span>
              </h2>
              <p>
                For healthcare practices operating within the United States or handling US patient data, Queueless adheres to the Health Insurance Portability and Accountability Act (HIPAA) of 1996 and HITECH Act:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>All PHI is encrypted in transit using Transport Layer Security (TLS 1.3) and encrypted at rest with military-grade AES-256.</li>
                <li>Queueless enters into formal <strong>Business Associate Agreements (BAAs)</strong> with institutional healthcare clients upon request.</li>
                <li>Strict Role-Based Access Control (RBAC) ensures hospital receptionists and doctors only view patient queues relevant to their designated department or cabin.</li>
                <li>Public waiting room displays (e.g. 55" Waiting Hall TV) strictly mask personal identities, displaying only non-identifying Token IDs (e.g. "Token A-024") and cabin numbers.</li>
                <li>All access to PHI is logged in immutable audit trails with timestamps, user identification, and action descriptions.</li>
              </ul>
            </section>

            {/* Section 7: ABDM & INDIAN DPDP ACT 2023 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">7</span>
                <span>ABDM, Indian DPDP Act 2023 & IT Act 2000 Compliance</span>
              </h2>
              <p>
                For Indian healthcare facilities, Queueless is engineered to align strictly with:
              </p>
              <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>Ayushman Bharat Digital Mission (ABDM):</strong> Pre-configured for ABHA Scan-and-Share Milestone 1 (M1) and Milestone 2 (M2) compliance as mandated by the National Health Authority (NHA).</li>
                <li><strong>Digital Personal Data Protection Act 2023 (DPDP Act):</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Section 4: Lawful purpose for processing personal data established through consent and contractual necessity.</li>
                    <li>Section 5: Explicit notice provided to data principals before data collection, including purpose, rights, and grievance redressal.</li>
                    <li>Section 6: Consent obtained is free, specific, informed, unconditional, and unambiguous with clear affirmative action.</li>
                    <li>Section 8(3): Data retention limited to purpose fulfillment period, after which data is erased.</li>
                    <li>Section 9: Special provisions for children's data (see Section 10 below).</li>
                    <li>Section 11: Reasonable security safeguards implemented including encryption, access control, and breach response.</li>
                    <li>Section 12: Data breach notification to the Data Protection Board of India and affected data principals without unreasonable delay.</li>
                  </ul>
                </li>
                <li><strong>Information Technology Act 2000:</strong> Compliance with Section 43A (compensation for failure to protect data), Section 72A (punishment for disclosure of information in breach of lawful contract), and IT (Reasonable Security Practices and Procedures) Rules 2011.</li>
                <li><strong>Patient data residency</strong> for Indian hospitals is strictly anchored in MeitY-empanelled sovereign Indian cloud data centers.</li>
              </ul>
            </section>

            {/* Section 8: GDPR */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">8</span>
                <span>GDPR Compliance (European Union & UK)</span>
              </h2>
              <p>
                For users in the European Economic Area (EEA), United Kingdom, and Switzerland, Queueless complies with the General Data Protection Regulation (GDPR). Your rights include:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>Right of Access (Art. 15):</strong> Request a copy of all personal data we hold about you.</li>
                <li><strong>Right to Rectification (Art. 16):</strong> Correct any inaccurate or incomplete personal data.</li>
                <li><strong>Right to Erasure (Art. 17):</strong> Request deletion of your personal data ("Right to be Forgotten").</li>
                <li><strong>Right to Restrict Processing (Art. 18):</strong> Limit how we use your data.</li>
                <li><strong>Right to Data Portability (Art. 20):</strong> Receive your data in a structured, machine-readable format (JSON/CSV).</li>
                <li><strong>Right to Object (Art. 21):</strong> Object to data processing based on legitimate interests.</li>
                <li><strong>Right to Withdraw Consent (Art. 7(3)):</strong> Withdraw consent at any time without affecting prior lawful processing.</li>
              </ul>
              <p>
                To exercise any GDPR rights, email <a href="mailto:privacy@queuelesslabs.com" className="text-blue-600 dark:text-blue-400 font-bold underline">privacy@queuelesslabs.com</a> with subject line "GDPR Data Request".
              </p>
            </section>

            {/* Section 9: DATA RETENTION */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">9</span>
                <span>Data Retention Policy</span>
              </h2>
              <p>We retain personal data only as long as necessary for the purposes stated in this policy:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800">
                      <th className="border border-slate-200 dark:border-slate-700 px-3 py-2 text-left font-black text-slate-900 dark:text-white">Data Category</th>
                      <th className="border border-slate-200 dark:border-slate-700 px-3 py-2 text-left font-black text-slate-900 dark:text-white">Retention Period</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 dark:text-slate-400">
                    <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Active queue & token data</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">24 hours after consultation completion</td></tr>
                    <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Patient consultation records</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">As per applicable medical record retention laws (typically 3-7 years)</td></tr>
                    <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Payment transaction records</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">7 years (as per Indian Income Tax Act and GST compliance)</td></tr>
                    <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Hospital subscription data</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Duration of active subscription + 90 days post-cancellation</td></tr>
                    <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Security & audit logs</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">12 months rolling</td></tr>
                    <tr><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Google OAuth tokens</td><td className="border border-slate-200 dark:border-slate-700 px-3 py-2">Until revoked by user or session expires</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 10: ACCOUNT DELETION & DATA PURGING */}
            <section className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <h2 className="text-base sm:text-lg font-black text-slate-950 dark:text-white">
                  10. User Data Deletion, Retention & Account Revocation Rights
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Every user (doctor, hospital administrator, receptionist, or patient) possesses full control over their personal and clinical data:
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
                  </a>. Upon revocation, Google SSO will be disabled and your data linked via Google will be purged within 48 hours.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-slate-900 dark:text-white">How to Request Full Data Erasure:</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  To permanently delete your patient profile, consultation history, or hospital workspace, send a written request to{' '}
                  <a href="mailto:privacy@queuelesslabs.com" className="text-blue-600 dark:text-blue-400 font-bold underline">
                    privacy@queuelesslabs.com
                  </a>{' '}
                  with the subject line <em>"Account Deletion Request"</em> from your registered email. You may also request deletion by calling our helpline or through the in-app settings.
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Our compliance team verifies identity within <strong>24 business hours</strong> and permanently purges or cryptographically shreds all associated personal identifiers within <strong>14 business days</strong>, subject to statutory medical record retention mandates imposed by applicable state medical councils, Income Tax Act, and GST regulations.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-slate-900 dark:text-white">Hospital Account Deletion:</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Hospital administrators can request complete workspace deletion including all patient records, doctor profiles, payment configurations, and queue logs. Post-deletion, all data is irrecoverably destroyed from primary databases within 30 days and from encrypted backups within 90 days.
                </p>
              </div>
            </section>

            {/* Section 11: CHILDREN'S PRIVACY */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">11</span>
                <span>Children's Privacy & Pediatric Care</span>
              </h2>
              <p>
                In compliance with <strong>COPPA (US)</strong>, <strong>Section 9 of the DPDP Act 2023 (India)</strong>, and <strong>GDPR Article 8</strong>:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>Queueless does not knowingly permit children under the age of 18 to create independent accounts or initiate unsupervised consultations.</li>
                <li>When pediatric patients are registered at a hospital outpatient department, the check-in is performed exclusively by or with the verifiable consent of a parent or legal guardian.</li>
                <li>If we discover that personal data has been collected from a child without verifiable parental consent, we will delete such data immediately upon notice.</li>
                <li>Parents/guardians may request access to, correction of, or deletion of their child's data by contacting <a href="mailto:privacy@queuelesslabs.com" className="text-blue-600 dark:text-blue-400 font-bold underline">privacy@queuelesslabs.com</a>.</li>
              </ul>
            </section>

            {/* Section 12: DIRECT HOSPITAL SETTLEMENT */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">12</span>
                <span>Zero Custody of Patient Consultation Funds</span>
              </h2>
              <p>
                All patient consultation fee transactions (UPI, credit/debit card, net banking, or cash at desk) operate under our strict <strong>Zero Fund Custody Guarantee</strong>:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>100% Direct Settlement:</strong> Consultation fees settle directly into the subscribing hospital's own verified merchant bank account via their self-configured Cashfree API credentials.</li>
                <li><strong>Zero Intermediate Escrow:</strong> Queueless never holds, routes, pools, or intermediates patient medical funds at any stage.</li>
                <li><strong>Hospital Self-Configuration:</strong> Each hospital independently configures their own payment gateway credentials (Cashfree AppID/Secret or Direct UPI VPA) through the Hospital Admin Dashboard.</li>
                <li><strong>Software Licensing Only:</strong> Payments made by hospitals to Queueless represent pure SaaS software licensing fees processed via PCI-DSS Level 1 compliant processors.</li>
              </ul>
            </section>

            {/* Section 13: SECURITY MEASURES */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">13</span>
                <span>Security Measures & Data Protection</span>
              </h2>
              <p>We implement industry-standard security measures to protect your data:</p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>TLS 1.3 encryption for all data in transit with HSTS preloading.</li>
                <li>AES-256 encryption for all data at rest.</li>
                <li>Role-Based Access Control (RBAC) with separate authentication tiers for Admin, Doctor, and Reception.</li>
                <li>Rate limiting, IP-based firewall rules, and DDoS protection via Cloudflare.</li>
                <li>Automated vulnerability scanning and dependency patching.</li>
                <li>Immutable audit logs for all data access and modifications.</li>
                <li>Regular backup with encrypted off-site storage.</li>
              </ul>
              <p>
                For detailed security architecture, see our <Link to="/security" className="text-blue-600 dark:text-blue-400 underline font-semibold">Security Policy</Link>.
              </p>
            </section>

            {/* Section 14: COOKIES */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">14</span>
                <span>Cookies & Tracking Technologies</span>
              </h2>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>Essential Cookies:</strong> Required for authentication, session management, theme preferences, and queue state persistence. Cannot be disabled without breaking core functionality.</li>
                <li><strong>localStorage:</strong> Used for offline queue caching, clinic configuration persistence, and performance optimization. Data is stored locally on your device and never transmitted to third parties.</li>
                <li><strong>No Advertising Cookies:</strong> We do NOT use Google Analytics, Facebook Pixel, or any third-party advertising or behavioral tracking cookies.</li>
                <li><strong>No Cross-Site Tracking:</strong> We do NOT engage in cross-site tracking, browser fingerprinting, or device graph creation.</li>
              </ul>
            </section>

            {/* Section 15: INTERNATIONAL DATA TRANSFERS */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">15</span>
                <span>International Data Transfers</span>
              </h2>
              <p>
                Your data may be processed in countries other than your country of residence. When transferring data internationally, we ensure adequate protection through:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>Standard Contractual Clauses (SCCs) approved by the European Commission for EU data transfers.</li>
                <li>Data Processing Agreements (DPAs) with all third-party sub-processors.</li>
                <li>Encryption in transit and at rest regardless of data location.</li>
                <li>Indian hospital data prioritized for storage in Indian data centers where available.</li>
              </ul>
            </section>

            {/* Section 16: CHANGES TO POLICY */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">16</span>
                <span>Changes to This Privacy Policy</span>
              </h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. When we make material changes:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>We will update the "Last Updated" date at the top of this page.</li>
                <li>For material changes affecting your rights, we will provide prominent notice via the Platform dashboard or email notification at least 30 days before the changes take effect.</li>
                <li>Your continued use of the Platform after the effective date constitutes acceptance of the updated policy.</li>
              </ul>
            </section>

            {/* Section 17: OFFICIAL CONTACT & GRIEVANCE REDRESSAL */}
            <section className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">17</span>
                <span>Official Contact & Statutory Grievance Redressal</span>
              </h2>
              <p>
                In compliance with the Information Technology Act 2000, Rule 3(2) of the Information Technology Rules 2021, the Digital Personal Data Protection Act 2023, the Consumer Protection Act 2019, and GDPR, the details of our designated <strong>Data Protection Officer & Grievance Redressal Officer</strong> are provided below:
              </p>

              <div className="p-5 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <p className="font-black text-slate-900 dark:text-white text-sm">
                  Queueless Technologies Inc. • Queueless Labs
                </p>
                <p><strong>Designated Grievance Officer:</strong> Chief Privacy & Compliance Officer</p>
                <p><strong>Registered Legal Office:</strong> Technology Corridor, Outer Ring Road, Bangalore, Karnataka 560103, India</p>
                <div className="space-y-1 pt-2">
                  <p className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Privacy & Data Requests:</span>
                    <a href="mailto:privacy@queuelesslabs.com" className="hover:underline">privacy@queuelesslabs.com</a>
                  </p>
                  <p className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold">
                    <Mail className="w-3.5 h-3.5" />
                    <span>General Support:</span>
                    <a href="mailto:support@queuelesslabs.com" className="hover:underline">support@queuelesslabs.com</a>
                  </p>
                  <p className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Legal & Compliance:</span>
                    <a href="mailto:legal@queuelesslabs.com" className="hover:underline">legal@queuelesslabs.com</a>
                  </p>
                </div>
                <p className="text-slate-500 dark:text-slate-400 pt-1">
                  Statutory Turnaround SLA: Acknowledgment within 24 hours; resolution within 15 business days as per Consumer Protection (E-Commerce) Rules 2020 and DPDP Act 2023 requirements.
                </p>
              </div>
            </section>
          </div>

          {/* Quick Nav Footer */}
          <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Explore related legal frameworks:</span>
            <div className="flex items-center gap-4 flex-wrap">
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
