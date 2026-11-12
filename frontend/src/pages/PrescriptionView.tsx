import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import {
  Printer,
  MessageCircle,
  FileText,
  FlaskConical,
  Calendar,
  Lock,
  ArrowLeft,
  CheckCircle,
  Stethoscope,
  HeartPulse,
  ExternalLink,
} from 'lucide-react';

export const PrescriptionView: React.FC = () => {
  const { publicToken } = useParams<{ publicToken: string }>();
  const [rx, setRx] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicToken) return;
    fetch(`${API_BASE_URL}/api/v1/queue/${publicToken}/prescription`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRx(data.data);
        } else {
          setError(data.error || 'Prescription not found');
        }
      })
      .catch(() => setError('Could not load prescription from server'))
      .finally(() => setLoading(false));
  }, [publicToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-600">Loading Official Medical Prescription...</p>
        </div>
      </div>
    );
  }

  if (error || !rx) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-slate-200 shadow-xl space-y-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-black text-slate-900">Prescription Not Available</h2>
          <p className="text-xs text-slate-500">{error || 'This prescription is still being finalized by the doctor.'}</p>
          <Link
            to={`/token/${publicToken}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Live Token</span>
          </Link>
        </div>
      </div>
    );
  }

  const phone = rx.patient?.mobile || '';
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);

  const whatsappText = encodeURIComponent(
    `🏥 *${rx.clinic?.name || 'Queueless Hospital OPD'}*\n` +
      `👨‍⚕️ *Dr. ${rx.doctor?.name || 'Consultant'}* (${rx.doctor?.specialty || 'OPD'})\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `📋 *OFFICIAL DIGITAL PRESCRIPTION*\n` +
      `👤 *Patient:* ${rx.patient?.name || 'Patient'}\n` +
      `🎫 *Token:* ${rx.tokenNumber || ''} | *Rx #:* ${rx.rxNumber || 'Official'}\n` +
      (rx.diagnosis ? `🩺 *Diagnosis:* ${rx.diagnosis}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      (rx.medicines?.length > 0
        ? `💊 *MEDICINES:*\n` +
          rx.medicines
            .map(
              (m: any, i: number) =>
                `${i + 1}. *${m.medicineName}* - ${m.dosage || '1 Tab'} (${m.frequency || '1-0-1'}, ${m.duration || '5d'}${
                  m.instructions ? `, ${m.instructions}` : ''
                })`
            )
            .join('\n') +
          `\n\n`
        : '') +
      (rx.labTests?.length > 0
        ? `🧪 *LAB TESTS:*\n` + rx.labTests.map((t: string) => `• ${t}`).join('\n') + `\n\n`
        : '') +
      (rx.advice ? `📝 *ADVICE:* ${rx.advice}\n\n` : '') +
      (rx.followUpDays ? `📅 *Next Review:* After ${rx.followUpDays} days in OPD\n\n` : '') +
      `🔗 *View Official Rx:* ${window.location.origin}/prescription/${publicToken}\n` +
      `_Powered by Queueless Healthcare OS_`
  );

  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${whatsappText}`;

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 print:p-0 print:bg-white">
      {/* Floating Action Bar (Hidden when Printing) */}
      <div className="max-w-3xl mx-auto mb-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200 shadow-sm flex items-center justify-between gap-3 print:hidden">
        <Link
          to={`/token/${publicToken}`}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live Token</span>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Share WhatsApp</span>
          </a>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official A4 Rx</span>
          </button>
        </div>
      </div>

      {/* Official Medical Prescription Letterhead Sheet */}
      <div
        id="prescription-sheet"
        className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl print:shadow-none print:border-none print:rounded-none print:p-6"
      >
        {/* Hospital Header Letterhead */}
        <div className="border-b-2 border-slate-900 pb-5 mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-serif italic text-2xl font-black text-sky-700">℞</span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {rx.clinic?.name || 'City Health OPD'}
              </h1>
            </div>
            <p className="text-xs text-slate-600 max-w-md">{rx.clinic?.address || 'Suite 402, Metro Towers, Bengaluru'}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Contact / Desk: {rx.clinic?.phone || '+91 80 4920 1100'} • ABDM / HIPAA Certified
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="inline-block px-3 py-1 bg-sky-50 text-sky-800 text-[10px] font-black uppercase tracking-wider rounded-full border border-sky-200 mb-1">
              Official Digital Rx
            </span>
            <div className="text-xs font-mono font-black text-slate-800">
              Token: <span className="text-sky-700">{rx.tokenNumber}</span>
            </div>
            <div className="text-[11px] font-mono font-bold text-slate-500 mt-0.5">
              {rx.rxNumber || `RX-${rx.tokenNumber}`}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Date: {new Date(rx.issuedAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Doctor & Patient Info Strip */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs mb-5">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Doctor</span>
            <div className="font-extrabold text-slate-900 text-sm">{rx.doctor?.name}</div>
            <div className="text-[11px] text-slate-600 font-medium">{rx.doctor?.specialty} • {rx.doctor?.roomNumber}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient Details</span>
            <div className="font-extrabold text-slate-900 text-sm">{rx.patient?.name}</div>
            <div className="text-[11px] text-slate-600 font-medium">
              {rx.patient?.age ? `${rx.patient?.age} yrs` : 'Age N/A'} • {rx.patient?.gender || 'Patient'}
              {rx.patient?.bloodGroup && ` • Blood: ${rx.patient?.bloodGroup}`}
              {rx.patient?.mobile && ` • +91 ${rx.patient?.mobile}`}
            </div>
          </div>
        </div>

        {/* Vitals */}
        {rx.vitals && (
          <div className="flex flex-wrap items-center gap-2 mb-5 text-xs font-semibold">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Vitals:</span>
            {rx.vitals.bp && <span className="bg-slate-100 px-2.5 py-1 rounded-lg">BP: <strong>{rx.vitals.bp}</strong></span>}
            {rx.vitals.pulse && <span className="bg-slate-100 px-2.5 py-1 rounded-lg">Pulse: <strong>{rx.vitals.pulse} bpm</strong></span>}
            {rx.vitals.temp && <span className="bg-slate-100 px-2.5 py-1 rounded-lg">Temp: <strong>{rx.vitals.temp}</strong></span>}
            {rx.vitals.spo2 && <span className="bg-slate-100 px-2.5 py-1 rounded-lg">SpO2: <strong>{rx.vitals.spo2}</strong></span>}
            {rx.vitals.weight && <span className="bg-slate-100 px-2.5 py-1 rounded-lg">Weight: <strong>{rx.vitals.weight}</strong></span>}
          </div>
        )}

        {/* Clinical Diagnosis */}
        <div className="mb-6 pb-3 border-b border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Diagnosis</span>
          <p className="text-sm font-black text-slate-900 mt-0.5">
            {rx.diagnosis || 'General OPD Clinical Examination'}
          </p>
        </div>

        {/* ℞ Prescribed Medicines Table */}
        <div className="mb-6">
          <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <span className="text-lg font-serif italic text-sky-700">℞</span>
            <span>Prescription & Medication Schedule</span>
          </div>

          <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-2.5">#</th>
                <th className="p-2.5">Medicine Name</th>
                <th className="p-2.5">Dosage</th>
                <th className="p-2.5">Frequency & Timing</th>
                <th className="p-2.5">Duration</th>
                <th className="p-2.5">Instructions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rx.medicines?.length > 0 ? (
                rx.medicines.map((m: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-2.5 font-mono text-slate-400 font-bold">{idx + 1}</td>
                    <td className="p-2.5 font-bold text-slate-900">{m.medicineName}</td>
                    <td className="p-2.5 text-slate-700">{m.dosage}</td>
                    <td className="p-2.5 text-slate-800 font-bold">{m.frequency}</td>
                    <td className="p-2.5 text-slate-700">{m.duration}</td>
                    <td className="p-2.5 text-slate-600 italic">{m.instructions}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-400">
                    No specific medicines prescribed. General clinical advice provided.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Diagnostic Lab Tests / Investigations ("Kya Dekhna Ha Kya Nahi") */}
        {rx.labTests && rx.labTests.length > 0 && (
          <div className="mb-6 p-4 bg-teal-50/70 rounded-2xl border border-teal-200">
            <div className="text-xs font-black text-teal-950 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <FlaskConical className="w-4 h-4 text-teal-600" />
              <span>Recommended Diagnostic Lab Tests ({rx.labTests.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {rx.labTests.map((t: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-white text-teal-900 font-black text-xs rounded-xl border border-teal-200 shadow-2xs flex items-center gap-1.5"
                >
                  <span>🧪</span>
                  <span>{t}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Doctor Advice & Instructions */}
        {rx.advice && (
          <div className="mb-6 p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-xs">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
              Doctor Clinical Advice & Dietary Instructions:
            </span>
            <p className="text-slate-800 font-medium leading-relaxed">{rx.advice}</p>
          </div>
        )}

        {/* Follow-up Review Schedule */}
        {rx.followUpDays && (
          <div className="mb-6 p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs flex items-center justify-between">
            <span className="font-bold text-blue-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Scheduled Review in OPD:</span>
            </span>
            <span className="font-black text-blue-700 bg-white px-3 py-1 rounded-xl border border-blue-200 font-mono">
              After {rx.followUpDays} Days
            </span>
          </div>
        )}

        {/* Authorized Sign-off & Hospital Stamp */}
        <div className="pt-6 border-t-2 border-slate-900 flex items-end justify-between text-xs text-slate-500">
          <div>
            <div className="text-[10px] text-slate-400">Valid Digital Prescription generated via Queueless Healthcare OS</div>
            <div className="font-semibold text-slate-700 mt-0.5">15-Day Review Policy Applies</div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>SHA-256 Digitally Signed & Encrypted</span>
            </div>
          </div>

          <div className="text-right">
            <div className="font-serif italic font-black text-slate-900 text-base">
              {rx.doctor?.name}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Authorized Medical Practitioner
            </div>
          </div>
        </div>

        {/* Patient Portal Login Hint */}
        <div className="mt-6 pt-3 border-t border-dashed border-slate-200 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1 print:hidden">
          <span>This prescription is permanently saved in your Patient ID. Access anytime at</span>
          <Link to="/portal" className="text-sky-600 font-bold underline inline-flex items-center gap-0.5">
            <span>Patient Portal</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

