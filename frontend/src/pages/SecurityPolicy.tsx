import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Server,
  KeyRound,
  Database,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Mail,
  Zap,
  Globe,
  CreditCard,
  Shield,
  FileCheck2,
  Activity,
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';
import { SeoHead } from '../components/SeoHead';

export const SecurityPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-x-clip flex flex-col transition-colors duration-200">
      <SeoHead
        title="Security Architecture & Compliance | Queueless Healthcare OS — PCI-DSS, HIPAA, DPDP 2023 & ABDM"
        description="Enterprise healthcare security architecture for Queueless OS: TLS 1.3, AES-256 encryption, zero-custody multi-gateway payments (Cashfree, Razorpay, Dodo Payments, Direct UPI), RBAC, and DPDP/HIPAA/ABDM alignment."
        keywords="queueless security architecture, hipaa technical safeguards, abdm m1 m2 security, dpdp act 2023 security, pci-dss healthcare payments, cashfree razorpay dodo security"
        canonical="https://queueless-os.vercel.app/security"
        breadcrumbs={[{ name: 'Security & Compliance', item: '/security' }]}
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
              <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Zero-Custody & Bank-Grade Healthcare Security</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              Queueless Security & Compliance Architecture
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span><strong>Last Updated:</strong> November 25, 2026</span>
              <span>•</span>
              <span><strong>Standards:</strong> PCI-DSS Level 1 Gateways, HIPAA, ABDM & DPDP Act 2023</span>
              <span>•</span>
              <span><strong>Encryption:</strong> AES-256 & TLS 1.3</span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">99.9% Uptime SLA</span>
            </div>
          </div>

          {/* Core Content Body */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-10 shadow-lg space-y-10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">1</span>
                <span>End-to-End Cryptographic Controls</span>
              </h2>
              <p>
                Every patient check-in token, consultation workflow, and administrative request across Queueless Healthcare OS is protected by industry-standard cryptographic controls:
              </p>
              <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>Data in Transit (TLS 1.3):</strong> All traffic across patient mobile check-ins, hospital admin portals, doctor cabin consoles, reception desks, and 55" lobby TV kiosks enforces HTTPS with TLS 1.3 and strict HSTS headers.
                </li>
                <li>
                  <strong>Data at Rest (AES-256):</strong> PostgreSQL databases, audit logs, and clinic configuration records are encrypted at rest using AES-256 encryption managed on isolated cloud infrastructure.
                </li>
                <li>
                  <strong>Credential & Secret Protection:</strong> Hospital staff passwords and PINs are hashed prior to storage, and third-party gateway credentials configured by hospitals are stored within isolated tenant configuration records accessible only to authenticated server-side payment orchestration routes.
                </li>
              </ul>
            </section>

            {/* Section 2: Zero-Custody Payment Security */}
            <section className="space-y-4 p-5 sm:p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-black text-base">
                <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>2. Zero-Custody Payment Security (SaaS vs. Patient Funds)</span>
              </div>
              <p className="text-emerald-950/90 dark:text-emerald-100/90">
                Queueless strictly separates <strong>B2B SaaS subscription billing</strong> from <strong>patient consultation fee collection</strong>:
              </p>
              <ul className="space-y-2 list-disc pl-5 text-emerald-950/85 dark:text-emerald-100/85">
                <li>
                  <strong>Hospital-Owned Payment Gateways:</strong> Hospitals self-configure their own merchant credentials (Cashfree App ID & Secret, Razorpay Key ID & Secret, Dodo Payments API Key, or Direct Hospital UPI VPA) inside their Hospital Admin Dashboard. Patient consultation fees settle directly into the hospital's own bank account. Queueless retains 0% commission and never acts as a payment aggregator or custodian of patient funds.
                </li>
                <li>
                  <strong>PCI-DSS Level 1 Tokenization:</strong> Raw card numbers, CVVs, net-banking credentials, and UPI PINs never touch Queueless servers. All sensitive payment inputs are captured inside PCI-DSS Level 1 certified checkout environments operated by Dodo Payments, Cashfree, Razorpay, or the patient's own NPCI UPI app.
                </li>
                <li>
                  <strong>Cryptographic Webhook Verification:</strong> Payment confirmation webhooks (including Dodo Payments, Cashfree, and Razorpay HMAC-SHA256 signatures) are verified server-side before activating workspaces or issuing confirmed queue tokens.
                </li>
              </ul>
            </section>

            {/* Section 3: RBAC */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">3</span>
                <span>Role-Based Access Control (RBAC) & Authentication</span>
              </h2>
              <p>
                Hospital frontline operations require speed without sacrificing access boundaries. Queueless enforces strict role separation across four operational surfaces:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-black text-slate-900 dark:text-white block text-xs">Hospital Director Admin</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Protected by hospital admin credentials and Google OAuth 2.0. Controls department setup, doctor roster, consultation fees, and the hospital's own payment gateway keys.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-black text-slate-900 dark:text-white block text-xs">Doctor Cabin Console</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Protected by individual 4-digit doctor PINs. Restricts visibility to assigned cabin queues, vitals, and consultation notes.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-black text-slate-900 dark:text-white block text-xs">Reception Desk POS</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Protected by desk credentials. Scoped strictly to token issuance, walk-in registration, and counter fee reconciliation.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-black text-slate-900 dark:text-white block text-xs">Public Kiosk & Patient Token Pass</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Lobby TV kiosks display anonymized token numbers only (no phone numbers, payment details, or clinical notes). Patient passes use unguessable public token identifiers.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Google OAuth & API Security */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">4</span>
                <span>Google OAuth 2.0 & API Security</span>
              </h2>
              <p>
                For hospital administrators signing in via Google OAuth 2.0, Queueless requests only minimal identity scopes (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">openid</code>, <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">email</code>, <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">profile</code>). Our use and transfer of information received from Google APIs adheres strictly to the{' '}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline font-semibold"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
            </section>

            {/* Section 5: Multi-Tenant Isolation */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">5</span>
                <span>Multi-Tenant Isolation & Regulatory Alignment</span>
              </h2>
              <p>
                Every hospital operates inside a logically isolated tenant boundary tagged with immutable <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">clinicId</code> keys across all database queries and real-time WebSocket rooms, preventing cross-clinic data leakage.
              </p>
              <div className="overflow-x-auto pt-1">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                      <th className="py-2.5 pr-4 font-black">Framework / Law</th>
                      <th className="py-2.5 font-black">Implemented Technical Safeguards</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-600 dark:text-slate-400">
                    <tr>
                      <td className="py-2.5 pr-4 font-bold text-slate-800 dark:text-slate-200">DPDP Act 2023 (India)</td>
                      <td className="py-2.5">Reasonable security safeguards under Section 8(5), consent-backed collection, and verifiable deletion workflows.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-bold text-slate-800 dark:text-slate-200">IT Act 2000 & Rules 2011</td>
                      <td className="py-2.5">Section 43A reasonable security practices, encrypted SPDI handling, and statutory grievance redressal.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-bold text-slate-800 dark:text-slate-200">ABDM (M1 / M2)</td>
                      <td className="py-2.5">Zero-PHI lobby displays, structured token orchestration, and consent-first health record linking.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 font-bold text-slate-800 dark:text-slate-200">HIPAA (§164.312) & GDPR (Art. 32)</td>
                      <td className="py-2.5">Unique user identification, transmission security (TLS 1.3), encryption at rest (AES-256), and BAA availability for US clinics.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 6: Disaster Recovery */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">6</span>
                <span>Infrastructure Resilience, Backups & Incident Response</span>
              </h2>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>Edge & DDoS Protection:</strong> Global edge caching and automated DDoS mitigation protect hospital check-in URLs and APIs from volumetric abuse.</li>
                <li><strong>Recovery Objectives:</strong> Automated point-in-time database recovery targeting <strong>RTO &lt; 30 minutes</strong> and <strong>RPO &lt; 5 minutes</strong>.</li>
                <li><strong>Breach Notification:</strong> Confirmed security incidents impacting personal data are notified to affected hospitals and relevant authorities (including CERT-In / DPB / supervisory authorities where applicable) within statutory timelines (≤ 72 hours).</li>
              </ul>
            </section>

            {/* Section 7: Vulnerability Disclosure */}
            <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">7</span>
                <span>Security Vulnerability Disclosure</span>
              </h2>
              <p>
                We welcome responsible security disclosures from cybersecurity researchers, hospital IT teams, and payment compliance auditors. Please report any potential security issue to:
              </p>
              <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <p><strong>Queueless Labs Security Response Team</strong></p>
                <p className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold">
                  <Mail className="w-3.5 h-3.5" />
                  <a href="mailto:security@queuelesslabs.com" className="hover:underline">security@queuelesslabs.com</a>
                </p>
                <p className="text-slate-500 dark:text-slate-400">Acknowledgment SLA: Within 12 hours • Support: support@queuelesslabs.com</p>
              </div>
            </section>
          </div>

          {/* Quick Nav Footer */}
          <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Explore related legal & compliance policies:</span>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/privacy" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Privacy Policy ➔
              </Link>
              <Link to="/terms" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Terms of Service ➔
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
