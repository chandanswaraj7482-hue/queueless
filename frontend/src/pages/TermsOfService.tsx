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
  Scale,
  Ban,
  Gavel,
  Globe,
  Users,
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';
import { SeoHead } from '../components/SeoHead';

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans relative overflow-x-clip flex flex-col transition-colors duration-200">
      <SeoHead
        title="Terms of Service | Queueless Healthcare OS — Master Subscription Agreement"
        description="Official Terms of Service and Master Subscription Agreement for Queueless Healthcare Operating System. Covers clinical disclaimers, Google Authentication, payment processing, service SLAs, liability, governing law, and zero fund custody."
        keywords="queueless terms of service, hospital software subscription agreement, clinical queue terms, hipaa master service agreement, google authentication terms, saas agreement healthcare"
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
              <span><strong>Last Updated:</strong> November 25, 2026</span>
              <span>•</span>
              <span><strong>Version:</strong> 4.2 Enterprise Clinical SaaS</span>
              <span>•</span>
              <span className="text-blue-700 dark:text-blue-400 font-semibold">Governed by Indian Law & IT Act 2000</span>
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
                These Terms of Service ("Terms") constitute a legally binding contract between <strong>Queueless Technologies Inc. / Queueless Labs</strong> ("Queueless", "we", "us") and the healthcare provider, hospital, clinic, diagnostic center, or individual user ("Customer", "you") accessing or utilizing the Queueless Healthcare Operating System ("Platform") and all associated portals, APIs, mobile interfaces, and services.
              </p>
              <p>
                By creating a hospital account, subscribing to any plan, checking in as a patient, or accessing any console (Hospital Admin, Doctor, Reception, Founder, TV Kiosk, or Patient Portal), you affirm that you have read, understood, and agreed to be bound by these Terms and our <Link to="/privacy" className="text-blue-600 dark:text-cyan-400 underline font-semibold">Privacy Policy</Link>, <Link to="/refund-policy" className="text-blue-600 dark:text-cyan-400 underline font-semibold">Refund & Cancellation Policy</Link>, and <Link to="/security" className="text-blue-600 dark:text-cyan-400 underline font-semibold">Security Policy</Link>.
              </p>
              <p>
                If you are entering into these Terms on behalf of a healthcare organization, you represent and warrant that you have the authority to bind such organization to these Terms.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">2</span>
                <span>Definitions</span>
              </h2>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>"Platform"</strong> means the Queueless Healthcare Operating System, including web application, mobile-optimized interfaces, APIs, real-time WebSocket services, and all associated features.</li>
                <li><strong>"Hospital/Clinic"</strong> means any subscribing healthcare entity that purchases a Queueless subscription plan.</li>
                <li><strong>"Patient"</strong> means any individual who checks in for a consultation or creates a Patient Vault account via the Platform.</li>
                <li><strong>"Subscription Plan"</strong> means the Starter Clinic, Growth Super OPD, or Enterprise Hospital Network tiers, as described on our <Link to="/pricing" className="text-blue-600 dark:text-blue-400 underline font-semibold">Pricing Page</Link>.</li>
                <li><strong>"SaaS Fee"</strong> means the recurring monthly or annual software licensing fee paid by the Hospital to Queueless.</li>
                <li><strong>"Consultation Fee"</strong> means the medical fee charged by a doctor/hospital to a patient, which is processed through the hospital's own payment gateway and deposited directly into the hospital's bank account.</li>
              </ul>
            </section>

            {/* Section 3: MEDICAL DISCLAIMER */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">3</span>
                <span>Critical Medical Disclaimer</span>
              </h2>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/60 rounded-2xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-black text-amber-950 dark:text-amber-100">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>NOT A MEDICAL DIAGNOSTIC OR EMERGENCY DISPATCH DEVICE</span>
                </div>
                <p>
                  Queueless is an administrative workflow, queue orchestration, payment processing, and waiting room coordination software platform. It does NOT provide clinical medical diagnosis, triage judgment, prescription verification, pharmaceutical dispensing, or emergency medical dispatch services (such as 108/112/911 ambulance services).
                </p>
                <p>
                  Licensed physicians, registered medical practitioners, and hospital personnel remain exclusively responsible for patient examination, clinical triage, medical care, prescriptions, and healthcare outcomes. Queueless shall bear zero liability for medical outcomes, physician clinical determinations, misdiagnosis, treatment delays, or any adverse health event.
                </p>
                <p>
                  <strong>In case of a medical emergency, immediately contact your local emergency services (108/112 in India, 911 in US) or visit the nearest hospital emergency department.</strong>
                </p>
              </div>
            </section>

            {/* Section 4: GOOGLE AUTH */}
            <section className="space-y-3 p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
              <h2 className="text-lg font-black text-blue-950 dark:text-blue-100 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                <span>4. Google Authentication & Single Sign-On (SSO) Services</span>
              </h2>
              <p className="text-blue-950 dark:text-slate-200">
                Queueless supports Google Sign-In powered by Firebase Authentication for swift access to patient health vaults and hospital consoles:
              </p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-700 dark:text-slate-300 text-xs">
                <li>You may authenticate using your verified Google credentials, granting Queueless access to your verified email address, display name, and avatar — no other Google data is accessed.</li>
                <li>Queueless strictly adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-cyan-400 underline font-semibold">Google API Services User Data Policy</a>, including the Limited Use requirements.</li>
                <li>Your Google profile data is never sold, never shared with commercial advertising brokers, and never utilized for artificial intelligence model training.</li>
                <li>Users may revoke Google account integration at any time through <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-cyan-400 underline font-semibold">Google Account Security settings</a>.</li>
              </ul>
            </section>

            {/* Section 5: SUBSCRIPTION & BILLING */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">5</span>
                <span>Subscription Plans, Billing & Payment Processing</span>
              </h2>
              <p>
                Access to Queueless Healthcare OS is granted under flexible monthly or annual subscriptions:
              </p>
              <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>14-Day Free Pilot:</strong> Every new hospital receives a complimentary 14-day pilot period with full access to all features. No payment is charged during the pilot. You may cancel at any time before Day 14 to avoid any charges.</li>
                <li><strong>Subscription Tiers:</strong> Starter Clinic (up to 3 doctors), Growth Super OPD (up to 12 doctors), Enterprise Hospital Network (unlimited). Current pricing is displayed on our <Link to="/pricing" className="text-blue-600 dark:text-blue-400 underline font-semibold">Pricing Page</Link>.</li>
                <li><strong>Auto-Renewal:</strong> Subscriptions auto-renew at the end of each billing cycle unless cancelled before the renewal date. You will receive reminder notifications 7 days and 1 day before renewal.</li>
                <li><strong>Direct Hospital Settlement Guarantee:</strong> 100% of patient consultation fees paid via UPI or clinic payment methods settle directly into your own hospital bank account via your self-configured Cashfree or Direct UPI credentials. Queueless retains 0% commission on medical fees and exercises zero custody of patient funds.</li>
                <li><strong>SaaS Invoicing:</strong> Software licensing fees are charged on recurring monthly or annual cycles through PCI-DSS Level 1 compliant payment gateways (Cashfree for India, Dodo Payments for international).</li>
                <li><strong>Taxes & Regulatory Billing:</strong> All invoices include applicable GST (18% for Indian customers) or VAT as required by local jurisdiction. GST-compliant tax invoices are dispatched electronically.</li>
                <li><strong>Price Changes:</strong> We reserve the right to modify subscription pricing with at least 30 days' prior written notice. Existing subscriptions continue at the contracted rate until their current billing cycle concludes.</li>
              </ul>
            </section>

            {/* Section 6: REFUND */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">6</span>
                <span>30-Day Risk-Free Money-Back Guarantee</span>
              </h2>
              <p>
                Every new hospital or polyclinic subscription is covered under our <strong>30-Day 100% Money-Back Guarantee</strong>. If Queueless does not tangibly reduce waiting lobby congestion or improve patient satisfaction during your first 30 days, notify us for a full, unconditional refund. Full refund terms are detailed in our <Link to="/refund-policy" className="text-blue-600 dark:text-blue-400 underline font-semibold">Refund & Cancellation Policy</Link>.
              </p>
            </section>

            {/* Section 7: ACCEPTABLE USE */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">7</span>
                <span>Acceptable Use Policy</span>
              </h2>
              <p>You agree NOT to:</p>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>Use the Platform for any unlawful purpose or in violation of any applicable law, regulation, or medical licensing requirement.</li>
                <li>Attempt to gain unauthorized access to any account, system, or network connected to the Platform.</li>
                <li>Reverse engineer, decompile, disassemble, or attempt to derive the source code of the Platform.</li>
                <li>Transmit malicious code, viruses, or any harmful content through the Platform.</li>
                <li>Use automated bots, scrapers, or similar technologies to access or extract data from the Platform without authorization.</li>
                <li>Impersonate any person, healthcare provider, or entity.</li>
                <li>Use the Platform to store or transmit data unrelated to healthcare queue management and clinical operations.</li>
                <li>Sublicense, resell, or redistribute the Platform without prior written consent from Queueless.</li>
                <li>Share, publish, or expose patient data accessed through the Platform in violation of applicable privacy laws.</li>
              </ul>
              <p>
                Violation of these terms may result in immediate suspension or termination of your account without refund.
              </p>
            </section>

            {/* Section 8: INTELLECTUAL PROPERTY */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">8</span>
                <span>Intellectual Property Rights</span>
              </h2>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>The Platform, including all software, designs, algorithms, documentation, trademarks, and content, is the exclusive intellectual property of Queueless Technologies Inc.</li>
                <li>Your subscription grants a limited, non-exclusive, non-transferable, revocable license to use the Platform for your internal healthcare operations during the active subscription period.</li>
                <li>Hospital-uploaded logos, branding assets, and patient data remain the property of the respective hospital/patient. Queueless claims no ownership over customer-generated content.</li>
                <li>The Queueless name, logo, and "Zero-Wait Clinical Queue Operating System" tagline are trademarks of Queueless Technologies Inc.</li>
              </ul>
            </section>

            {/* Section 9: SLA */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">9</span>
                <span>Platform Uptime & Service Level Agreement (SLA)</span>
              </h2>
              <p>
                Queueless commits to maintaining a <strong>99.9% Service Uptime SLA</strong> for core patient QR generation, real-time WebSocket token broadcasts, payment processing, and doctor calling consoles. Unscheduled downtime exceeding SLA thresholds qualifies enterprise customers for pro-rata service credits upon request.
              </p>
              <p>
                Scheduled maintenance windows will be communicated at least 48 hours in advance and will be conducted during off-peak hours (typically 2:00 AM - 5:00 AM IST).
              </p>
            </section>

            {/* Section 10: LIMITATION OF LIABILITY */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">10</span>
                <span>Limitation of Liability</span>
              </h2>
              <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:</p>
              <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>Queueless shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, goodwill, or business opportunities.</li>
                <li>Our total aggregate liability for any claim arising from or related to these Terms or the Platform shall not exceed the total SaaS fees paid by you to Queueless in the 12 months preceding the claim.</li>
                <li>Queueless is not liable for: (a) medical outcomes or clinical decisions, (b) payment gateway failures or bank processing delays not within our control, (c) internet connectivity issues, (d) unauthorized access resulting from your failure to secure credentials, or (e) force majeure events.</li>
              </ul>
            </section>

            {/* Section 11: INDEMNIFICATION */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">11</span>
                <span>Indemnification</span>
              </h2>
              <p>
                You agree to indemnify, defend, and hold harmless Queueless and its directors, officers, employees, agents, and affiliates from any claims, damages, losses, liabilities, or expenses (including reasonable legal fees) arising from: (a) your use of the Platform, (b) your violation of these Terms, (c) your violation of any third-party rights including patient privacy, (d) any medical malpractice claims related to consultations facilitated through the Platform, or (e) any breach of applicable healthcare regulations by your organization.
              </p>
            </section>

            {/* Section 12: CANCELLATION */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">12</span>
                <span>Account Cancellation & Data Portability</span>
              </h2>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li>Hospitals may cancel subscriptions at any time with zero termination penalties by contacting <a href="mailto:billing@queuelesslabs.com" className="text-blue-600 dark:text-blue-400 underline font-bold">billing@queuelesslabs.com</a> or through the Admin Dashboard.</li>
                <li>Upon cancellation, your workspace remains fully functional until the conclusion of the paid term.</li>
                <li>You may export all clinical logs, patient records, payment histories, and consultation data in open JSON or CSV formats before your billing cycle concludes.</li>
                <li>Following account closure, tenant data is irreversibly wiped from primary databases within 30 days and from encrypted backups within 90 days, subject to statutory retention requirements.</li>
              </ul>
            </section>

            {/* Section 13: FORCE MAJEURE */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">13</span>
                <span>Force Majeure</span>
              </h2>
              <p>
                Neither party shall be liable for any failure or delay in performing obligations under these Terms due to events beyond reasonable control, including but not limited to: natural disasters, pandemics, government actions, war, terrorism, power outages, internet infrastructure failures, payment gateway outages, or acts of God.
              </p>
            </section>

            {/* Section 14: GOVERNING LAW & DISPUTE RESOLUTION */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">14</span>
                <span>Governing Law & Dispute Resolution</span>
              </h2>
              <ul className="space-y-2 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of India, including the Information Technology Act 2000, the Indian Contract Act 1872, the Consumer Protection Act 2019, and the Digital Personal Data Protection Act 2023.</li>
                <li><strong>Jurisdiction:</strong> The courts of Bangalore, Karnataka, India shall have exclusive jurisdiction over any disputes arising from these Terms.</li>
                <li><strong>Arbitration:</strong> Any dispute that cannot be resolved through good-faith negotiation within 30 days shall be referred to binding arbitration under the Arbitration and Conciliation Act, 1996, to be conducted in Bangalore, India, in English, before a sole arbitrator mutually agreed upon by both parties.</li>
                <li><strong>Consumer Grievance:</strong> Nothing in these Terms limits your right to file a consumer complaint under the Consumer Protection Act 2019 with the appropriate Consumer Disputes Redressal Commission.</li>
              </ul>
            </section>

            {/* Section 15: SEVERABILITY */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">15</span>
                <span>General Provisions</span>
              </h2>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600 dark:text-slate-400">
                <li><strong>Severability:</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.</li>
                <li><strong>Entire Agreement:</strong> These Terms, together with the Privacy Policy, Refund Policy, and Security Policy, constitute the entire agreement between you and Queueless regarding the Platform.</li>
                <li><strong>Waiver:</strong> Failure by Queueless to enforce any right or provision shall not constitute a waiver of that right or provision.</li>
                <li><strong>Assignment:</strong> You may not assign or transfer these Terms without prior written consent. Queueless may assign these Terms in connection with a merger, acquisition, or sale of assets.</li>
                <li><strong>Notices:</strong> All legal notices shall be sent to the email addresses registered with the account or to <a href="mailto:legal@queuelesslabs.com" className="text-blue-600 dark:text-blue-400 underline font-bold">legal@queuelesslabs.com</a>.</li>
              </ul>
            </section>

            {/* Section 16: CHANGES */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">16</span>
                <span>Changes to These Terms</span>
              </h2>
              <p>
                We reserve the right to modify these Terms at any time. Material changes will be communicated via email notification and dashboard announcement at least 30 days before taking effect. Your continued use of the Platform after the effective date constitutes acceptance of the revised Terms. If you disagree with any changes, you may cancel your subscription before the effective date.
              </p>
            </section>

            {/* Section 17: CONTACT */}
            <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h2 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-center font-mono">17</span>
                <span>Legal Counsel & Enterprise Inquiries</span>
              </h2>
              <p>
                For custom Enterprise Master Service Agreements (MSAs), HIPAA BAA signatures, institutional tenders, or any questions regarding these Terms:
              </p>
              <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <p className="font-black text-slate-900 dark:text-white text-sm">Queueless Technologies Inc. • Legal Division</p>
                <p><strong>Registered Office:</strong> Technology Corridor, Outer Ring Road, Bangalore, Karnataka 560103, India</p>
                <p><strong>CIN / Company Registration:</strong> Available upon request</p>
                <div className="space-y-1 pt-1">
                  <p className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Legal:</span>
                    <a href="mailto:legal@queuelesslabs.com" className="hover:underline">legal@queuelesslabs.com</a>
                  </p>
                  <p className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Billing:</span>
                    <a href="mailto:billing@queuelesslabs.com" className="hover:underline">billing@queuelesslabs.com</a>
                  </p>
                  <p className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Privacy:</span>
                    <a href="mailto:privacy@queuelesslabs.com" className="hover:underline">privacy@queuelesslabs.com</a>
                  </p>
                  <p className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Support:</span>
                    <a href="mailto:support@queuelesslabs.com" className="hover:underline">support@queuelesslabs.com</a>
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Quick Nav Footer */}
          <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Explore related legal frameworks:</span>
            <div className="flex items-center gap-4 flex-wrap">
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
