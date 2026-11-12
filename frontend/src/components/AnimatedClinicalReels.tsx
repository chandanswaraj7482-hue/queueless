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
  Youtube,
  Video,
  Zap,
} from 'lucide-react';
import { playClinicChime, playClinicVoiceAnnouncement } from '../utils/audio';

export interface HospitalYouTubeVideo {
  id: string;
  title: string;
  subtitle: string;
  hospital: string;
  badge: string;
  badgeColor: string;
  duration: string;
  source: string;
}

export const HOSPITAL_YOUTUBE_VIDEOS: HospitalYouTubeVideo[] = [
  {
    id: 'Kq_zVB05H3o',
    title: 'ABDM Scan & Share: QR Code se OPD Registration & Live Token Flow',
    subtitle: 'Real product tutorial: Patient scans hospital QR code, instantly shares demographic data via ABHA / Scan & Share, and receives a digital OPD token on phone without standing in queue.',
    hospital: 'HospitalEasy Clinical Demo • Smart OPD',
    badge: 'Real Software Demo',
    badgeColor: 'bg-emerald-600',
    duration: 'Live Tutorial',
    source: 'ABDM Scan & Share System',
  },
  {
    id: 'Q1ppsSQsuLM',
    title: 'NextGen eHospital OPD Registration & Token Workflow (Hindi)',
    subtitle: 'Comprehensive hospital walkthrough in Hindi: Digital patient registration, doctor department assignment, and instant token generation.',
    hospital: 'NextGen eHospital Platform',
    badge: 'eHospital Clinical Flow',
    badgeColor: 'bg-blue-600',
    duration: 'Hospital Walkthrough',
    source: 'eHospital Clinical Network',
  },
  {
    id: 'HLBvlg64rOk',
    title: 'Doctor Cabin Calling & Lobby TV Acoustic Chime Synchronizer',
    subtitle: 'How doctors 1-tap call next patient from their cabin console, instantly triggering waiting room TV acoustic chime and multilingual voice announcement.',
    hospital: 'CareMax Multi-Specialty • 450+ Beds',
    badge: 'Doctor Cabin Calling',
    badgeColor: 'bg-indigo-600',
    duration: '3:40 mins',
    source: 'Clinical Systems Case Study',
  },
];

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
  const [selectedVideo, setSelectedVideo] = useState<HospitalYouTubeVideo>(HOSPITAL_YOUTUBE_VIDEOS[0]);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(true);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleVideoSound = () => {
    if (isVideoMuted) {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'unMute', args: [] }),
        '*'
      );
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }),
        '*'
      );
      setIsVideoMuted(false);
    } else {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'mute', args: [] }),
        '*'
      );
      setIsVideoMuted(true);
    }
  };

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
          <span>Live OPD Workflow Simulation & Ground Videos</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Watch Queueless Come Alive
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
          Real-world clinical workflows captured in active OPDs. Zero waiting hall crowding, instant phone QR passes, and silent 1-tap doctor calls.
        </p>
      </div>

      {/* ============================================================== */}
      {/* FEATURED REAL HOSPITAL YOUTUBE VIDEO & CASE STUDY SHOWCASE     */}
      {/* ============================================================== */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-7 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors">
        {/* Top Header of the Player */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 flex items-center justify-center shrink-0 shadow-2xs">
              <Youtube className="w-5 h-5 fill-rose-600 dark:fill-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  Ground Clinical Reality • Hospital Review
                </span>
                <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                  {selectedVideo.badge}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5 leading-snug">
                {selectedVideo.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Interactive Sound Toggle Pill */}
            <button
              type="button"
              onClick={toggleVideoSound}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black shadow-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isVideoMuted
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 ring-2 ring-amber-400/20'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 ring-2 ring-emerald-500/20'
              }`}
              title={isVideoMuted ? 'Click to Unmute / आवाज चालू करें' : 'Click to Mute / आवाज बंद करें'}
            >
              {isVideoMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>🔇 Sound Muted • Click to Unmute (आवाज चालू करें)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                  <span>🔊 Sound Active (आवाज चालू है) • Click to Mute</span>
                </>
              )}
            </button>
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold shadow-2xs hidden sm:inline-flex items-center">
              ✓ ABDM M1/M2 Certified Flow
            </span>
          </div>
        </div>

        {/* 16:9 Cinema Frame Embed with Autoloop + Muted Autoplay */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-200/60 dark:border-slate-800 group">
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&mute=${isVideoMuted ? '1' : '0'}&loop=1&playlist=${selectedVideo.id}&controls=1&enablejsapi=1&rel=0&playsinline=1&modestbranding=1`}
            title={selectedVideo.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          {/* Floating Tap to Unmute Overlay Button */}
          {isVideoMuted && (
            <button
              type="button"
              onClick={toggleVideoSound}
              className="absolute top-3 right-3 z-20 px-3.5 py-2 bg-black/80 hover:bg-black text-white border border-white/25 rounded-full text-xs font-black flex items-center gap-2 shadow-2xl backdrop-blur-md cursor-pointer transition-all hover:scale-105"
            >
              <VolumeX className="w-4 h-4 text-amber-400" />
              <span>Tap for Sound (आवाज खोलें) 🔊</span>
            </button>
          )}
        </div>

        {/* Subtitle / Description Bar */}
        <div className="mt-3.5 p-3 sm:p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            {selectedVideo.subtitle}
          </p>
          <div className="shrink-0 text-right text-[11px] text-slate-400 font-mono">
            Source: <strong className="text-slate-700 dark:text-slate-300">{selectedVideo.source}</strong>
          </div>
        </div>

        {/* Playlist Selector Buttons */}
        <div className="mt-4 pt-4 border-t border-slate-200/70 dark:border-slate-800">
          <div className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
            <span>Select Hospital Video Review & Walkthrough:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {HOSPITAL_YOUTUBE_VIDEOS.map((vid) => {
              const isCurrent = vid.id === selectedVideo.id;
              return (
                <button
                  key={vid.id}
                  type="button"
                  onClick={() => {
                    setSelectedVideo(vid);
                    setIsPlayingVideo(true);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    isCurrent
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 text-slate-900 dark:text-white shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="relative w-16 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <img
                      src={`https://i.ytimg.com/vi/${vid.id}/mqdefault.jpg`}
                      alt={vid.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-400">
                      <span className={isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}>
                        {vid.badge}
                      </span>
                      <span>• {vid.duration}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                      {vid.title}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {vid.hospital}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subheader for 4 Interactive Simulators */}
      <div className="text-center pt-4">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-center gap-2">
          <span className="h-px w-12 bg-slate-300 dark:bg-slate-700"></span>
          <span>Or Explore Interactive 9:16 Clinical Studio Simulators Below</span>
          <span className="h-px w-12 bg-slate-300 dark:bg-slate-700"></span>
        </span>
      </div>

      {/* 4 Vertical (9:16) Animated Reel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* ============================================================== */}
        {/* REEL 1: DOCTOR CABIN 1-CLICK CALL                              */}
        {/* ============================================================== */}
        <div className="relative aspect-[9/16] rounded-3xl sm:rounded-[32px] overflow-hidden bg-slate-950 shadow-2xl group border border-slate-800 hover:border-blue-500/80 transition-all duration-300 flex flex-col justify-between">
          {/* Animated Background Canvas Layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-3.5 sm:p-4 flex flex-col justify-center items-center overflow-hidden">
            {/* Background Medical Ambient Grid & Glowing Nebula */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

            {/* Simulated iPad Doctor Console */}
            <div className="relative z-10 w-full max-w-[245px] bg-slate-900/95 backdrop-blur-2xl border border-blue-500/40 rounded-2xl p-3.5 shadow-2xl flex flex-col gap-2.5">
              {/* Doctor Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-400 font-bold text-sm shadow-inner">
                    👨‍⚕️
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-white leading-tight">Dr. Rohan Sharma, MD</p>
                    <p className="text-[9px] text-blue-400 font-medium">Cabin 204 • Cardiology Hub</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[8px] font-bold text-emerald-400">ONLINE</span>
                </div>
              </div>

              {/* Pulsing Live ECG Vitals Line */}
              <div className="h-5 w-full flex items-center justify-center overflow-hidden opacity-80">
                <svg className="w-full h-full text-blue-400 stroke-current fill-none stroke-[1.8]" viewBox="0 0 200 30">
                  <path
                    d="M0,15 L40,15 L50,5 L60,25 L70,10 L80,20 L90,15 L140,15 L150,5 L160,25 L170,10 L180,20 L190,15 L200,15"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              {/* Patient Token Display with Calling Shockwave */}
              <div className="bg-slate-950/90 rounded-xl p-3 text-center border border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between text-[9px] text-slate-400 uppercase font-semibold mb-1">
                  <span>Current Patient</span>
                  <span className="text-blue-400 font-mono">OPD #824</span>
                </div>
                
                <div className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
                  <span className={cabinStep >= 2 ? 'text-emerald-400 transition-all scale-105 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]' : 'text-slate-100'}>
                    {cabinStep >= 2 ? 'A-116' : 'A-115'}
                  </span>
                  {cabinStep >= 2 && (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-black animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      CALLING
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-300 font-semibold mt-1">Suresh Verma (Age 42) • Follow-up</p>

                {/* Animated Ripple Shockwave on Call */}
                {cabinStep === 1 && (
                  <>
                    <div className="absolute inset-0 bg-blue-500/30 rounded-xl animate-ping pointer-events-none" />
                    <div className="absolute inset-0 border-2 border-emerald-400 rounded-xl animate-ping pointer-events-none" style={{ animationDuration: '1.2s' }} />
                  </>
                )}
              </div>

              {/* Simulated 1-Tap Next Patient Button */}
              <button
                type="button"
                onClick={() => handleToggleSound(1)}
                className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer ${
                  cabinStep === 1
                    ? 'bg-emerald-500 text-white scale-95 shadow-emerald-500/50 ring-4 ring-emerald-400/30'
                    : cabinStep === 2
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ring-2 ring-blue-400'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110 active:scale-95'
                }`}
              >
                <Bell className={`w-3.5 h-3.5 ${cabinStep >= 2 ? 'animate-bounce text-amber-300' : ''}`} />
                <span>{cabinStep >= 2 ? '🔔 Calling Cabin 204...' : 'Call Next Patient ➔'}</span>
              </button>

              {/* Status Ticker & Waiting Room Count */}
              <div className="flex items-center justify-between text-[9px] text-slate-400 px-1 pt-0.5">
                <span>Waiting in Lobby: <strong className="text-slate-200">{cabinStep >= 2 ? '2 Patients' : '3 Patients'}</strong></span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Zero-Wait
                </span>
              </div>
            </div>

            {/* Pulse Indicator Pill */}
            <div className="mt-3 flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] text-blue-300 backdrop-blur-md">
              <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>1-Tap Silent Call • Zero Loudspeaker Noise</span>
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
        <div className="relative aspect-[9/16] rounded-3xl sm:rounded-[32px] overflow-hidden bg-slate-950 shadow-2xl group border border-slate-800 hover:border-emerald-500/80 transition-all duration-300 flex flex-col justify-between">
          {/* Animated Background Canvas Layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-emerald-950/40 to-black p-3.5 sm:p-4 flex flex-col justify-center items-center overflow-hidden">
            {/* Ambient Depth Elements */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

            {/* Smartphone Mockup */}
            <div className="relative z-10 w-full max-w-[240px] bg-slate-900 border-2 border-slate-700 rounded-[30px] p-2.5 shadow-2xl flex flex-col gap-2">
              {/* Phone Speaker Notch & Dynamic Island */}
              <div className="flex items-center justify-between px-3 pt-1">
                <span className="text-[9px] font-mono font-bold text-slate-400">9:41</span>
                <div className="w-14 h-3 bg-black rounded-full border border-slate-800 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <span className="text-[9px] font-bold text-slate-400">5G</span>
              </div>

              {/* Screen Content */}
              <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 relative overflow-hidden flex flex-col items-center min-h-[220px] justify-center">
                {/* QR Code Scanner Viewfinder with Sweeping Laser */}
                {qrStep <= 1 && (
                  <div className="relative w-32 h-32 border-2 border-emerald-500/70 rounded-2xl flex items-center justify-center bg-emerald-500/5 my-1">
                    {/* Corner Reticles */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

                    <QrCode className="w-20 h-20 text-emerald-400 opacity-80" />
                    {/* Animated Sweeping Laser Beam with Glow */}
                    <div
                      className="absolute left-1 right-1 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] transition-all duration-700 ease-in-out"
                      style={{
                        top: qrStep === 0 ? '12%' : '88%',
                      }}
                    />
                    <div className="absolute -bottom-6 text-[9px] font-black text-emerald-400 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-500/40 shadow-md">
                      ⚡ Scanning Hospital Standee...
                    </div>
                  </div>
                )}

                {/* Patient Pass Generated State */}
                {qrStep >= 2 && (
                  <div className="w-full text-center py-1 animate-fade-in flex flex-col items-center gap-1.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
                    </div>
                    <p className="text-[10px] font-black text-emerald-300 uppercase tracking-wide">Live Digital OPD Pass</p>
                    
                    <div className="bg-slate-900/90 border border-emerald-500/50 rounded-xl px-3 py-2 w-full mt-0.5 shadow-xl">
                      <p className="text-[9px] text-slate-400 uppercase font-semibold">Assigned Token</p>
                      <p className="text-3xl font-black text-emerald-400 tracking-tight drop-shadow">A-117</p>
                      <div className="flex items-center justify-between text-[8px] text-slate-300 mt-1 border-t border-slate-800 pt-1 font-semibold">
                        <span>Ahead: <strong className="text-white">1 Patient</strong></span>
                        <span className="text-amber-300 font-bold flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          ETA: ~05:42 min
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[8px] text-slate-400 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Zero App Download • Opens in Browser</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Caption Pill */}
            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-300 backdrop-blur-md">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant WhatsApp & Live Web Token Pass</span>
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
        <div className="relative aspect-[9/16] rounded-3xl sm:rounded-[32px] overflow-hidden bg-slate-950 shadow-2xl group border border-slate-800 hover:border-indigo-500/80 transition-all duration-300 flex flex-col justify-between">
          {/* Animated Background Canvas Layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950/40 to-black p-3.5 sm:p-4 flex flex-col justify-center items-center overflow-hidden">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
            <div className="absolute top-1/2 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

            {/* 55" Smart TV Display Frame */}
            <div className="relative z-10 w-full max-w-[245px] bg-slate-900/95 border-2 border-slate-700 rounded-2xl p-3 shadow-2xl flex flex-col gap-2 ring-1 ring-white/10">
              {/* TV Top Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[10px] font-black text-white tracking-wide">CAREMAX CENTRAL OPD</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 font-bold">11:34 AM</span>
              </div>

              {/* Active Multi-Cabin Grid */}
              <div className="space-y-1.5">
                {/* Cabin 1 */}
                <div className="flex items-center justify-between bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-300 font-bold">Cabin 1 • Pediatrics</span>
                  <span className="text-xs font-black font-mono text-slate-400">B-108</span>
                </div>

                {/* Cabin 2 - CALLING / BLINKING / STROBE */}
                <div className={`flex items-center justify-between px-2.5 py-2 rounded-lg border transition-all ${
                  tvStep >= 1
                    ? 'bg-emerald-950/80 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] ring-2 ring-emerald-500/40'
                    : 'bg-slate-950/80 border-slate-800'
                }`}>
                  <div>
                    <span className="text-[10px] text-emerald-300 font-black block">Cabin 2 • Cardiology</span>
                    <span className="text-[8px] text-emerald-400 uppercase font-bold flex items-center gap-1">
                      {tvStep >= 1 ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span>🔔 Calling Patient Now</span>
                        </>
                      ) : (
                        'In Consultation'
                      )}
                    </span>
                  </div>
                  <span className={`text-lg font-black font-mono tracking-tight ${
                    tvStep >= 1 ? 'text-emerald-300 animate-pulse drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'text-slate-300'
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

              {/* Dynamic Sound Equalizer Spectrum Visualizer */}
              <div className="flex items-center justify-center gap-1 pt-1.5 pb-0.5">
                {[14, 26, 18, 30, 16, 28, 20, 32, 18, 24].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-full transition-all duration-200"
                    style={{
                      height: tvStep >= 1 ? `${Math.max(4, (h * 0.7) + (Math.sin(tvStep * 2 + i) * 8))}px` : '4px',
                      opacity: tvStep >= 1 ? 1 : 0.3,
                    }}
                  />
                ))}
              </div>

              {/* Marquee Ticker with Dual Languages */}
              <div className="bg-slate-950/90 px-2 py-1 rounded-lg border border-slate-800 text-[8px] text-amber-300 truncate font-bold text-center flex items-center justify-center gap-1">
                <span>📢 टोकन CMX-101 कृपया कैबिन 2 में पधारें</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">Please Proceed</span>
              </div>
            </div>

            {/* TV Badge */}
            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] text-indigo-300 backdrop-blur-md">
              <Tv className="w-3.5 h-3.5 text-indigo-400" />
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
        <div className="relative aspect-[9/16] rounded-3xl sm:rounded-[32px] overflow-hidden bg-slate-950 shadow-2xl group border border-slate-800 hover:border-purple-500/80 transition-all duration-300 flex flex-col justify-between">
          {/* Animated Background Canvas Layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-950/40 to-black p-3.5 sm:p-4 flex flex-col justify-center items-center overflow-hidden">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#a855f7_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

            {/* UPI Payment Flow Simulation Card */}
            <div className="relative z-10 w-full max-w-[245px] bg-slate-900/95 border-2 border-slate-700 rounded-2xl p-3 shadow-2xl flex flex-col gap-2.5">
              {/* Payment Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="text-[10px] font-black text-white flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                  <span>OPD Fast Checkout</span>
                </span>
                <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-black">
                  Instant UPI
                </span>
              </div>

              {/* Consultation Fee Card */}
              <div className="bg-slate-950/90 rounded-xl p-2.5 text-center border border-slate-800">
                <p className="text-[9px] text-slate-400 uppercase font-semibold">Total Consultation Fee</p>
                <div className="text-3xl font-black text-white mt-0.5 tracking-tight flex items-center justify-center gap-1">
                  <span className="text-emerald-400 drop-shadow">₹500</span>
                  <span className="text-[9px] font-bold text-slate-400 font-mono">.00</span>
                </div>
                <p className="text-[9px] text-purple-400 font-bold mt-0.5">Dr. Rohan Sharma • OPD Pass</p>
              </div>

              {/* Step 1 & 2: Instant UPI Payment Simulation */}
              {paymentStep <= 1 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-slate-200 font-bold">GPay / PhonePe / Paytm</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSound(4)}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-xl shadow-purple-600/30 active:scale-95 transition-all cursor-pointer ring-2 ring-purple-400/20"
                  >
                    <span>⚡ Pay ₹500 (Instant Settlement)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Step 2 & 3: Direct Bank Settlement Invoice */}
              {paymentStep >= 2 && (
                <div className="bg-emerald-950/80 border border-emerald-400/80 rounded-xl p-2.5 text-center flex flex-col items-center gap-1 animate-fade-in shadow-xl shadow-emerald-950">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
                  </div>
                  <p className="text-[10px] font-black text-emerald-300 uppercase">100% Direct Bank Settlement</p>
                  <p className="text-[8px] text-slate-300 font-mono">
                    HDFC Bank •••• 5678 (Hospital Main A/C)
                  </p>
                  <div className="bg-slate-900/90 text-emerald-400 px-2.5 py-0.5 rounded-full text-[8px] font-black border border-emerald-500/40 mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>0% Platform Commission • Direct Payout</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Caption Pill */}
            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] text-purple-300 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
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

