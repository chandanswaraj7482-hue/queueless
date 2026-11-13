import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Server,
  Key,
  Database,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Mail,
  Zap,
  Globe,
  Award,
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';

export const SecurityPolicy: React.FC = () => {
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
              <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Bank-Grade Healthcare Architecture</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              Queueless Security & Compliance Architecture
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span><strong>Standard:</strong> SOC-2 Type II, HIPAA & ABDM Aligned</span>
              <span>•</span>
              <span><strong>Encryption:</strong> AES-256 (At Rest) & TLS 1.3 (In Transit)</span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">99.99% Hospital Uptime</span>
            </div>
          </div>

          {/* Core Content Body */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-10 shadow-lg space-y-10 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">1</span>
                <span>End-to-End Cryptographic Security</span>
              </h2>
              <p>
                Patient queue tokens, consultation fees, and doctor notes transmitted through Queueless Healthcare OS are protected by enterprise cryptographic controls across every hop of their lifecycle:
              </p>
              <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>
                  <strong>Data in Transit:</strong> All communications between patient smartphones, reception thermal terminals, doctor tablets, and lobby 55" TV kiosks enforce TLS 1.3 with strict HSTS (HTTP Strict Transport Security) preloading.
                </li>
                <li>
                  <strong>Data at Rest:</strong> Database records, patient records, and audit logs are encrypted using Advanced Encryption Standard with 256-bit keys (AES-256). Cryptographic keys are rotated automatically via dedicated hardware security modules (HSM).
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">2</span>
                <span>Role-Based Access Control (RBAC) & PIN Protection</span>
              </h2>
              <p>
                Hospital frontline operations require high speed without compromising data perimeter boundaries. Queueless implements three distinct access tiers:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-black text-slate-900 dark:text-white block text-xs">Director Admin</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Protected by master email authentication. Controls doctor staffing, consultation pricing, billing receipts, and analytics.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-black text-slate-900 dark:text-white block text-xs">Doctor Cabin Console</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Protected by individual 4-digit doctor PINs. Grants access only to assigned cabin patients and clinical prescription presets.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-black text-slate-900 dark:text-white block text-xs">Reception Cashier</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Protected by desk password. Restricts access to ticketing and fee collection, blocking private doctor consultation notes.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">3</span>
                <span>Payment Security (Dodo Payments & Cashfree)</span>
              </h2>
              <p>
                Both subscription billing and patient consultation fee collections adhere to the highest international financial security standards:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>Payment processing environments maintain <strong>PCI-DSS Level 1 Certification</strong>, the highest tier of security in the payments industry.</li>
                <li>Raw payment card and banking data never touch Queueless servers; all entries are tokenized directly within sandboxed iframe containers provided by Dodo Payments and Cashfree.</li>
                <li>Instant webhook verification ensures immediate hospital workspace activation upon confirmed charge.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">4</span>
                <span>Multi-Tenant Isolation & Zero Data Leakage</span>
              </h2>
              <p>
                Every hospital and polyclinic operates within a logically segregated tenant environment. Each clinic's database rows, token queues, doctor rosters, and financial audit trails are tagged with immutable tenant identifiers (`clinicId`), preventing cross-tenant data leakage.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">5</span>
                <span>Disaster Recovery & Redundant Edge Backup</span>
              </h2>
              <p>
                Queueless infrastructure is distributed across redundant availability zones with automated point-in-time database backups:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>Recovery Time Objective (RTO):</strong> Less than 30 minutes in the event of primary zone disruption.</li>
                <li><strong>Recovery Point Objective (RPO):</strong> Less than 5 minutes of queue telemetry data.</li>
                <li><strong>DDoS Mitigation:</strong> Cloudflare Enterprise DDoS shielding blocks over 120 million malicious automated requests daily.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">6</span>
                <span>Security Vulnerability Disclosure</span>
              </h2>
              <p>
                We welcome responsible security disclosures from cybersecurity researchers and healthcare IT teams. Please report potential vulnerabilities to:
              </p>
              <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <p><strong>Queueless Labs Security Response Team</strong></p>
                <p className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold">
                  <Mail className="w-3.5 h-3.5" />
                  <a href="mailto:security@queuelesslabs.com" className="hover:underline">security@queuelesslabs.com</a>
                </p>
                <p className="text-slate-500 dark:text-slate-400">Security Response SLA: Acknowledged within 12 hours</p>
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

