import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Stethoscope,
  QrCode,
  Tv,
  CreditCard,
  CheckCircle2,
  Clock,
  Smartphone,
  Activity,
  ShieldCheck,
  Maximize2,
  RotateCcw,
  UserCheck,
  Building2,
  Bell,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { playClinicChime, playClinicVoiceAnnouncement } from '../utils/audio';

export interface ClinicalReelData {
  id: number;
  title: string;
  subtitle: string;
  doctor: string;
  hospital: string;
  badge: string;
  badgeColor: string;
  videoSrc: string;
}

export const CLINICAL_REELS_DATA: ClinicalReelData[] = [
  {
    id: 1,
    title: 'Doctor Cabin 1-Click Call',
    subtitle: 'Token A-116 called directly from iPad with 1 click',
    doctor: 'Dr. Rohan Sharma, MD',
    hospital: 'CareMax Superspecialty • Cabin 204',
    badge: 'Cabin Console',
    badgeColor: 'bg-blue-600',
    videoSrc: '/assets/videos/reel_doctor_cabin.mp4',
  },
  {
    id: 2,
    title: '20-Sec Entrance QR Admission',
    subtitle: 'Scanned QR at hospital gate, got live wait pass on phone',
    doctor: 'Dr. Priya S. Kulkarni',
    hospital: 'Rainbow Children Clinic • OPD Gate',
    badge: 'Mobile QR Pass',
    badgeColor: 'bg-emerald-600',
    videoSrc: '/assets/videos/reel_patient_checkin.mp4',
  },
  {
    id: 3,
    title: 'Silent Lobby & 55" TV Chime',
    subtitle: 'Waiting hall TV chimes in Hindi & English automatically',
    doctor: 'OPD Central Coordinator',
    hospital: 'Medanta Medicity • Central Hub',
    badge: '55" OLED TV Kiosk',
    badgeColor: 'bg-indigo-600',
    videoSrc: '/assets/videos/reel_hospital_lounge.mp4',
  },
  {
    id: 4,
    title: 'Direct UPI Hospital Bank Settlement',
    subtitle: 'Instant ₹500 UPI direct to hospital account • 0% platform fee',
    doctor: 'Col. R. K. Nair',
    hospital: 'Apex Surgical Daycare • Procedural Hub',
    badge: 'Direct Settlement',
    badgeColor: 'bg-purple-600',
    videoSrc: '/assets/videos/reel_daycare_surgery.mp4',
  },
];

export const AnimatedClinicalReels: React.FC = () => {
  const [unmutedReelId, setUnmutedReelId] = useState<number | null>(null);
  const [activeModalReel, setActiveModalReel] = useState<ClinicalReelData | null>(null);

  // Animation ticks for each reel
  const [cabinStep, setCabinStep] = useState<number>(0);
  const [qrStep, setQrStep] = useState<number>(0);
  const [tvStep, setTvStep] = useState<number>(0);
  const [paymentStep, setPaymentStep] = useState<number>(0);

  // Continuous animation loops
  useEffect(() => {
    // Cabin loop: 0 = idle, 1 = finger tap, 2 = calling, 3 = called
    const cabinTimer = setInterval(() => {
      setCabinStep((prev) => (prev + 1) % 4);
    }, 2800);

    // QR loop: 0 = laser top, 1 = laser bottom, 2 = scanned check, 3 = pass generated
    const qrTimer = setInterval(() => {
      setQrStep((prev) => (prev + 1) % 4);
    }, 2600);

    // TV loop: 0 = normal queue, 1 = chime ding & blink, 2 = voice marquee, 3 = called
    const tvTimer = setInterval(() => {
      setTvStep((prev) => (prev + 1) % 4);
    }, 3200);

    // Payment loop: 0 = bill view, 1 = UPI tap, 2 = bank settlement, 3 = receipt
    const payTimer = setInterval(() => {
      setPaymentStep((prev) => (prev + 1) % 4);
    }, 3000);

    return () => {
      clearInterval(cabinTimer);
      clearInterval(qrTimer);
      clearInterval(tvTimer);
      clearInterval(payTimer);
    };
  }, []);

  const handleToggleSound = (reelId: number) => {
    if (unmutedReelId === reelId) {
      setUnmutedReelId(null);
    } else {
      setUnmutedReelId(reelId);
      // Play real hospital acoustic chime
      playClinicChime();

      // Speak realistic clinical announcement
      if (reelId === 1) {
        playClinicVoiceAnnouncement('Token A, 1 1 6, please proceed to Cabin 204', 'en');
      } else if (reelId === 2) {
        playClinicVoiceAnnouncement('Welcome to Caremax. Your digital token is A, 1 1 7', 'en');
      } else if (reelId === 3) {
        playClinicVoiceAnnouncement('टोकन CMX, 1 0 1, कृपया कैबिन 2 में पधारें', 'hi');
      } else if (reelId === 4) {
        playClinicVoiceAnnouncement('Payment successful. Consultation fee settled to hospital account', 'en');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Live OPD Workflow Simulation</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Watch Queueless Come Alive
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
          Real-world clinical workflows captured in active OPDs. Zero waiting hall crowding, instant phone QR passes, and silent 1-tap doctor calls.
        </p>
      </div>

      {/* 4 Vertical (9:16) Animated Reel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* ============================================================== */}
        {/* REEL 1: DOCTOR CABIN 1-CLICK CALL                              */}
        {/* ============================================================== */}
        <div className="relative aspect-[9/16] rounded-3xl sm:rounded-[32px] overflow-hidden bg-slate-950 shadow-2xl group border border-slate-800 hover:border-blue-500/60 transition-all duration-300 flex flex-col justify-between">
          {/* Animated Background Canvas Layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-4 flex flex-col justify-center items-center overflow-hidden">
            {/* Background Medical Ambient Grid */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Simulated iPad Doctor Console */}
            <div className="relative z-10 w-full max-w-[240px] bg-slate-900/90 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-3.5 shadow-2xl flex flex-col gap-3">
              {/* Doctor Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 font-bold text-xs">
                    👨‍⚕️
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white leading-tight">Dr. Rohan Sharma</p>
                    <p className="text-[9px] text-blue-400 font-medium">Cabin 204 • Cardiology</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>

              {/* Patient Token Display */}
              <div className="bg-slate-950/80 rounded-xl p-3 text-center border border-slate-800 relative overflow-hidden">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Currently Consulting</p>
                <div className="text-3xl font-black tracking-tight text-white mt-0.5 flex items-center justify-center gap-1.5">
                  <span className={cabinStep >= 2 ? 'text-emerald-400 transition-colors' : 'text-slate-200'}>
                    {cabinStep >= 2 ? 'A-116' : 'A-115'}
                  </span>
                  {cabinStep === 2 && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold animate-pulse">
                      CALLING
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Suresh Verma (Age 42)</p>

                {/* Animated Ripple Shockwave on Call */}
                {cabinStep === 1 && (
                  <div className="absolute inset-0 bg-blue-500/20 rounded-xl animate-ping pointer-events-none" />
                )}
              </div>

              {/* Simulated 1-Tap Next Patient Button */}
              <button
                type="button"
                onClick={() => handleToggleSound(1)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                  cabinStep === 1
                    ? 'bg-emerald-500 text-white scale-95 shadow-emerald-500/40'
                    : cabinStep === 2
                    ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110'
                }`}
              >
                <Bell className={`w-3.5 h-3.5 ${cabinStep === 2 ? 'animate-bounce text-amber-300' : ''}`} />
                <span>{cabinStep === 2 ? 'Calling Patient ➔' : 'Call Next Patient'}</span>
              </button>

              {/* Status Ticker */}
              <div className="flex items-center justify-between text-[9px] text-slate-400 px-1">
                <span>Waiting in Hall: <strong>3 Patients</strong></span>
                <span className="text-emerald-400 font-semibold">Zero-Wait Active</span>
              </div>
            </div>

            {/* Pulse Indicator */}
            <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] text-blue-300">
              <Activity className="w-3 h-3 text-blue-400 animate-pulse" />
              <span>1-Tap Silent Call • No Intercom Noise</span>
            </div>
          </div>

          {/* Top Gradient & Badge */}
          <div className="relative z-10 p-4 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-start justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md backdrop-blur-md bg-blue-600/85 border border-white/20">
              Cabin Console
            </span>
            <button
              type="button"
              onClick={() => setActiveModalReel(CLINICAL_REELS_DATA[0])}
              className="p-1.5 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 transition-all border border-white/10"
              title="Expand Reel"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Gradient, Subtitle & Audio Toggle */}
          <div className="relative z-10 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-2">
            <div className="pr-10">
              <p className="text-white text-[11px] sm:text-xs font-semibold leading-snug drop-shadow bg-black/50 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10">
                "Token A-116 called directly from iPad with 1 click"
              </p>
              <div className="mt-2 text-[10px] text-white/90 font-bold drop-shadow flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                <span className="truncate">Dr. Rohan Sharma, MD</span>
              </div>
              <span className="text-[9px] text-white/70 block truncate font-medium">
                CareMax Superspecialty • Cabin 204
              </span>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => handleToggleSound(1)}
              className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white backdrop-blur-md flex items-center justify-center transition-all border border-white/25 shadow-xl active:scale-90"
              title={unmutedReelId === 1 ? 'Mute Audio' : 'Play Hospital Chime & Announcement'}
            >
              {unmutedReelId === 1 ? (
                <Volume2 className="w-4 h-4 text-white animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-white/90" />
              )}
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* REEL 2: 20-SEC ENTRANCE QR ADMISSION                           */}
        {/* ============================================================== */}
        <div className="relative aspect-[9/16] rounded-3xl sm:rounded-[32px] overflow-hidden bg-slate-950 shadow-2xl group border border-slate-800 hover:border-emerald-500/60 transition-all duration-300 flex flex-col justify-between">
          {/* Animated Background Canvas Layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-emerald-950/40 to-black p-4 flex flex-col justify-center items-center overflow-hidden">
            {/* Ambient Depth Elements */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Smartphone Mockup */}
            <div className="relative z-10 w-full max-w-[230px] bg-slate-900 border-2 border-slate-700 rounded-[28px] p-2.5 shadow-2xl flex flex-col gap-2">
              {/* Phone Speaker Notch */}
              <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto" />

              {/* Screen Content */}
              <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 relative overflow-hidden flex flex-col items-center">
                {/* QR Code Scanner Viewfinder with Sweeping Laser */}
                {qrStep <= 1 && (
                  <div className="relative w-28 h-28 border-2 border-emerald-500/60 rounded-xl flex items-center justify-center bg-emerald-500/5 my-2">
                    <QrCode className="w-16 h-16 text-emerald-400 opacity-70" />
                    {/* Animated Scanning Laser Beam */}
                    <div
                      className="absolute left-1 right-1 h-0.5 bg-emerald-400 shadow-[0_0_12px_#10b981] transition-all duration-700"
                      style={{
                        top: qrStep === 0 ? '15%' : '85%',
                      }}
                    />
                    <div className="absolute -bottom-5 text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Scanning Gate QR...
                    </div>
                  </div>
                )}

                {/* Patient Pass Generated State */}
                {qrStep >= 2 && (
                  <div className="w-full text-center py-2 animate-fade-in flex flex-col items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-[10px] font-bold text-emerald-300">Live Queue Pass Issued</p>
                    <div className="bg-slate-900 border border-emerald-500/40 rounded-xl px-3 py-2 w-full mt-1">
                      <p className="text-[9px] text-slate-400 uppercase">Your Token</p>
                      <p className="text-2xl font-black text-white text-emerald-400">A-117</p>
                      <div className="flex items-center justify-between text-[8px] text-slate-300 mt-1 border-t border-slate-800 pt-1">
                        <span>Ahead: <strong>1 Patient</strong></span>
                        <span className="text-amber-300 font-bold">ETA: ~6 Mins</span>
                      </div>
                    </div>
                    <span className="text-[8px] text-slate-400 mt-0.5">No App Download Needed</span>
                  </div>
                )}
              </div>
            </div>

            {/* Caption Pill */}
            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-300">
              <Smartphone className="w-3 h-3 text-emerald-400" />
              <span>Instant WhatsApp & Web Token</span>
            </div>
          </div>

          {/* Top Gradient & Badge */}
          <div className="relative z-10 p-4 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-start justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md backdrop-blur-md bg-emerald-600/85 border border-white/20">
              Mobile QR Pass
            </span>
            <button
              type="button"
              onClick={() => setActiveModalReel(CLINICAL_REELS_DATA[1])}
              className="p-1.5 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 transition-all border border-white/10"
              title="Expand Reel"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Gradient, Subtitle & Audio Toggle */}
          <div className="relative z-10 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-2">
            <div className="pr-10">
              <p className="text-white text-[11px] sm:text-xs font-semibold leading-snug drop-shadow bg-black/50 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10">
                "Scanned QR at hospital gate, got live wait pass on phone"
              </p>
              <div className="mt-2 text-[10px] text-white/90 font-bold drop-shadow flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                <span className="truncate">Dr. Priya S. Kulkarni</span>
              </div>
              <span className="text-[9px] text-white/70 block truncate font-medium">
                Rainbow Children Clinic • OPD Gate
              </span>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => handleToggleSound(2)}
              className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-emerald-600/90 hover:bg-emerald-600 text-white backdrop-blur-md flex items-center justify-center transition-all border border-white/25 shadow-xl active:scale-90"
              title={unmutedReelId === 2 ? 'Mute Audio' : 'Play Sound'}
            >
              {unmutedReelId === 2 ? (
                <Volume2 className="w-4 h-4 text-white animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-white/90" />
              )}
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* REEL 3: SILENT LOBBY & 55" SMART TV CHIME                      */}
        {/* ============================================================== */}
        <div className="relative aspect-[9/16] rounded-3xl sm:rounded-[32px] overflow-hidden bg-slate-950 shadow-2xl group border border-slate-800 hover:border-indigo-500/60 transition-all duration-300 flex flex-col justify-between">
          {/* Animated Background Canvas Layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950/40 to-black p-4 flex flex-col justify-center items-center overflow-hidden">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* 55" Smart TV Display Frame */}
            <div className="relative z-10 w-full max-w-[240px] bg-slate-900/95 border-2 border-slate-700 rounded-2xl p-3 shadow-2xl flex flex-col gap-2">
              {/* TV Top Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[10px] font-black text-white tracking-wide">CAREMAX CENTRAL OPD</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400">11:34 AM</span>
              </div>

              {/* Active Multi-Cabin Grid */}
              <div className="space-y-1.5">
                {/* Cabin 1 */}
                <div className="flex items-center justify-between bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-300 font-bold">Cabin 1 • Pediatrics</span>
                  <span className="text-xs font-black font-mono text-slate-400">B-108</span>
                </div>

                {/* Cabin 2 - CALLING / BLINKING */}
                <div className={`flex items-center justify-between px-2.5 py-2 rounded-lg border transition-all ${
                  tvStep >= 1
                    ? 'bg-emerald-950/70 border-emerald-500/70 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-950/80 border-slate-800'
                }`}>
                  <div>
                    <span className="text-[10px] text-emerald-300 font-bold block">Cabin 2 • Cardiology</span>
                    <span className="text-[8px] text-emerald-400 uppercase font-semibold">
                      {tvStep >= 1 ? '🔔 Calling Now' : 'Consulting'}
                    </span>
                  </div>
                  <span className={`text-base font-black font-mono tracking-tight ${
                    tvStep >= 1 ? 'text-emerald-300 animate-pulse' : 'text-slate-300'
                  }`}>
                    CMX-101
                  </span>
                </div>

                {/* Cabin 3 */}
                <div className="flex items-center justify-between bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-300 font-bold">Cabin 3 • Orthopedics</span>
                  <span className="text-xs font-black font-mono text-slate-400">D-204</span>
                </div>
              </div>

              {/* Equalizer Sound Wave Visualizer */}
              <div className="flex items-center justify-center gap-1 pt-1">
                {[12, 24, 16, 28, 14, 22, 18, 26, 15].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-indigo-400 rounded-full transition-all duration-200"
                    style={{
                      height: tvStep >= 1 ? `${(h * 0.8) + (Math.sin(tvStep + i) * 6)}px` : '4px',
                      opacity: tvStep >= 1 ? 0.9 : 0.3,
                    }}
                  />
                ))}
              </div>

              {/* Marquee Ticker */}
              <div className="bg-slate-950 px-2 py-1 rounded text-[8px] text-amber-300 truncate font-medium text-center">
                📢 टोकन CMX-101 कृपया कैबिन 2 में पधारें
              </div>
            </div>

            {/* TV Badge */}
            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] text-indigo-300">
              <Tv className="w-3 h-3 text-indigo-400" />
              <span>Full HD TV Display with Studio Chime</span>
            </div>
          </div>

          {/* Top Gradient & Badge */}
          <div className="relative z-10 p-4 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-start justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md backdrop-blur-md bg-indigo-600/85 border border-white/20">
              55" OLED TV Kiosk
            </span>
            <button
              type="button"
              onClick={() => setActiveModalReel(CLINICAL_REELS_DATA[2])}
              className="p-1.5 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 transition-all border border-white/10"
              title="Expand Reel"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Gradient, Subtitle & Audio Toggle */}
          <div className="relative z-10 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-2">
            <div className="pr-10">
              <p className="text-white text-[11px] sm:text-xs font-semibold leading-snug drop-shadow bg-black/50 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10">
                "Waiting hall TV chimes in Hindi & English automatically"
              </p>
              <div className="mt-2 text-[10px] text-white/90 font-bold drop-shadow flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                <span className="truncate">OPD Central Coordinator</span>
              </div>
              <span className="text-[9px] text-white/70 block truncate font-medium">
                Medanta Medicity • Central Hub
              </span>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => handleToggleSound(3)}
              className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-indigo-600/90 hover:bg-indigo-600 text-white backdrop-blur-md flex items-center justify-center transition-all border border-white/25 shadow-xl active:scale-90"
              title={unmutedReelId === 3 ? 'Mute Audio' : 'Play Sound'}
            >
              {unmutedReelId === 3 ? (
                <Volume2 className="w-4 h-4 text-white animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-white/90" />
              )}
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* REEL 4: DIRECT UPI HOSPITAL BANK SETTLEMENT                    */}
        {/* ============================================================== */}
        <div className="relative aspect-[9/16] rounded-3xl sm:rounded-[32px] overflow-hidden bg-slate-950 shadow-2xl group border border-slate-800 hover:border-purple-500/60 transition-all duration-300 flex flex-col justify-between">
          {/* Animated Background Canvas Layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-950/40 to-black p-4 flex flex-col justify-center items-center overflow-hidden">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* UPI Payment Flow Simulation Card */}
            <div className="relative z-10 w-full max-w-[230px] bg-slate-900 border-2 border-slate-700 rounded-2xl p-3 shadow-2xl flex flex-col gap-2.5">
              {/* Payment Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="text-[10px] font-bold text-white flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                  <span>OPD Fee Checkout</span>
                </span>
                <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold">
                  Direct UPI
                </span>
              </div>

              {/* Consultation Fee Card */}
              <div className="bg-slate-950 rounded-xl p-2.5 text-center border border-slate-800">
                <p className="text-[9px] text-slate-400">Total Consultation Fee</p>
                <p className="text-2xl font-black text-white mt-0.5">₹500</p>
                <p className="text-[9px] text-purple-400 font-medium">Dr. Rohan Sharma • OPD Pass</p>
              </div>

              {/* Step 1 & 2: Instant UPI Payment Simulation */}
              {paymentStep <= 1 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between bg-slate-950 px-2 py-1.5 rounded-lg border border-slate-800 text-[10px]">
                    <span className="text-slate-300 font-semibold">Google Pay / PhonePe</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSound(4)}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
                  >
                    <span>Pay ₹500 via UPI</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Step 2 & 3: Direct Bank Settlement Invoice */}
              {paymentStep >= 2 && (
                <div className="bg-emerald-950/70 border border-emerald-500/60 rounded-xl p-2.5 text-center flex flex-col items-center gap-1 animate-fade-in">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-[10px] font-bold text-emerald-300">100% Settled Direct to Bank</p>
                  <p className="text-[8px] text-slate-300">
                    Direct Hospital A/c • HDFC Bank •••• 5678
                  </p>
                  <div className="bg-slate-900/90 text-emerald-400 px-2 py-0.5 rounded text-[8px] font-bold border border-emerald-500/30 mt-0.5">
                    0% Platform Commission
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Caption Pill */}
            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] text-purple-300">
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              <span>Zero-Custody Direct Bank Settlement</span>
            </div>
          </div>

          {/* Top Gradient & Badge */}
          <div className="relative z-10 p-4 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-start justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md backdrop-blur-md bg-purple-600/85 border border-white/20">
              Direct Settlement
            </span>
            <button
              type="button"
              onClick={() => setActiveModalReel(CLINICAL_REELS_DATA[3])}
              className="p-1.5 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 transition-all border border-white/10"
              title="Expand Reel"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Gradient, Subtitle & Audio Toggle */}
          <div className="relative z-10 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-2">
            <div className="pr-10">
              <p className="text-white text-[11px] sm:text-xs font-semibold leading-snug drop-shadow bg-black/50 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10">
                "Instant ₹500 UPI direct to hospital account • 0% platform fee"
              </p>
              <div className="mt-2 text-[10px] text-white/90 font-bold drop-shadow flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                <span className="truncate">Col. R. K. Nair</span>
              </div>
              <span className="text-[9px] text-white/70 block truncate font-medium">
                Apex Surgical Daycare • Procedural Hub
              </span>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => handleToggleSound(4)}
              className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-purple-600/90 hover:bg-purple-600 text-white backdrop-blur-md flex items-center justify-center transition-all border border-white/25 shadow-xl active:scale-90"
              title={unmutedReelId === 4 ? 'Mute Audio' : 'Play Sound'}
            >
              {unmutedReelId === 4 ? (
                <Volume2 className="w-4 h-4 text-white animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-white/90" />
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Subtitle / Instruction */}
      <div className="text-center pt-2 max-w-xl mx-auto space-y-2">
        <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
          Every counter has an instant vector QR pass. Patients scan it, receive live queue updates, and doctors call with one tap.
        </p>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Click any speaker icon to test realistic hospital chime and announcements live</span>
        </p>
      </div>

      {/* Expanded Interactive Simulation Modal */}
      {activeModalReel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white ${activeModalReel.badgeColor}`}>
                  {activeModalReel.badge}
                </span>
                <h3 className="font-bold text-sm text-white">{activeModalReel.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalReel(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeModalReel.subtitle}
            </p>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Clinician:</span>
                <span className="font-bold text-white">{activeModalReel.doctor}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Facility:</span>
                <span className="font-bold text-white">{activeModalReel.hospital}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Audio Broadcast:</span>
                <span className="font-bold text-emerald-400">3-Tone Harmonic Chime</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleToggleSound(activeModalReel.id)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg text-white"
              >
                <Volume2 className="w-4 h-4" />
                <span>Test Studio Audio Broadcast</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModalReel(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

