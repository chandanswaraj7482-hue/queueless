import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../utils/socket';
import { playClinicVoiceAnnouncement, playClinicChime, SpeechLanguageMode } from '../utils/audio';
import { API_BASE_URL } from '../config/api';
import {
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Clock,
  Bell,
  Building2,
  Sparkles,
  Radio,
  Activity,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Globe,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Tv,
} from 'lucide-react';

interface DisplayData {
  clinic?: {
    id: string;
    name: string;
    slug: string;
    address: string;
    logoUrl?: string;
    openingHours?: string;
  };
  nowServing: Array<{
    id: string;
    token: string;
    status: string;
    calledAt?: string;
    doctor?: { displayName: string; roomNumber: string };
    patient?: { name: string };
  }>;
  nextWaiting: Array<{
    id: string;
    token: string;
    doctor?: { displayName: string };
  }>;
}

const WORLDWIDE_LANGUAGES: { code: SpeechLanguageMode; flag: string; label: string; subhead: string }[] = [
  { code: 'en', flag: '🌐', label: 'Global English', subhead: 'PLEASE PROCEED' },
  { code: 'hi', flag: '🇮🇳', label: 'English + Hindi (हिंदी)', subhead: 'कृपया ध्यान दें' },
  { code: 'bn', flag: '🇮🇳', label: 'English + Bengali (বাংলা)', subhead: 'দয়া করে এগিয়ে যান' },
  { code: 'ta', flag: '🇮🇳', label: 'English + Tamil (தமிழ்)', subhead: 'தயவுசெய்து வரவும்' },
  { code: 'te', flag: '🇮🇳', label: 'English + Telugu (తెలుగు)', subhead: 'దయచేసి రండి' },
  { code: 'kn', flag: '🇮🇳', label: 'English + Kannada (ಕನ್ನಡ)', subhead: 'ದಯವಿಟ್ಟು ಬನ್ನಿ' },
  { code: 'mr', flag: '🇮🇳', label: 'English + Marathi (मराठी)', subhead: 'कृपया आत यावे' },
  { code: 'gu', flag: '🇮🇳', label: 'English + Gujarati (ગુજરાતી)', subhead: 'કૃપા કરીને પધારો' },
  { code: 'pa', flag: '🇮🇳', label: 'English + Punjabi (ਪੰਜਾਬੀ)', subhead: 'ਕਿਰਪਾ ਕਰਕੇ ਆਓ' },
  { code: 'ml', flag: '🇮🇳', label: 'English + Malayalam (മലയാളം)', subhead: 'ദയവായി വരിക' },
  { code: 'es', flag: '🇪🇸', label: 'English + Spanish', subhead: 'FAVOR PASAR' },
  { code: 'ar', flag: '🇦🇪', label: 'English + Arabic', subhead: 'يرجى التوجه' },
  { code: 'fr', flag: '🇫🇷', label: 'English + French', subhead: 'VEUILLEZ ENTRER' },
  { code: 'de', flag: '🇩🇪', label: 'English + German', subhead: 'BITTE EINTRETEN' },
  { code: 'ru', flag: '🇷🇺', label: 'English + Russian', subhead: 'ПРОХОДИТЕ' },
];

export const DisplayKiosk: React.FC = () => {
  const { clinicId: routeClinicId } = useParams<{ clinicId?: string }>();
  const clinicId = routeClinicId || 'city-health';
  const [data, setData] = useState<DisplayData>({ nowServing: [], nextWaiting: [] });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechLang, setSpeechLang] = useState<SpeechLanguageMode>('hi'); // Default to English + Hindi for natural Indian hospital context
  const [lastCalledToken, setLastCalledToken] = useState<string | null>(null);
  const [isAnnouncing, setIsAnnouncing] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [timezoneStr, setTimezoneStr] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // References to track changes without resetting timers
  const lastAnnouncedTokenRef = useRef<string | null>(null);
  const initialLoadDoneRef = useRef(false);
  const soundEnabledRef = useRef(soundEnabled);
  const speechLangRef = useRef(speechLang);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    speechLangRef.current = speechLang;
  }, [speechLang]);

  // Fullscreen state listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Unlock browser audio context on any user touch/click
  useEffect(() => {
    const handleGesture = () => {
      setAudioUnlocked(true);
      try {
        playClinicChime();
      } catch {}
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
    window.addEventListener('click', handleGesture);
    window.addEventListener('keydown', handleGesture);
    window.addEventListener('touchstart', handleGesture);
    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
    };
  }, []);

  // Live ticking clock with local time & timezone
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezoneStr(tz.replace(/_/g, ' '));
      } catch {
        setTimezoneStr('UTC');
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Slides array calculation for Windowed Mode (Slide between active rooms and queue overview)
  const totalSlides = Math.max(1, (data.nowServing.length || 1) + (data.nextWaiting.length > 0 ? 1 : 0));

  // Automatic slide rotation in non-fullscreen windowed mode
  useEffect(() => {
    if (isFullscreen) return; // In fullscreen, no sliding! (User requested: ek hi page me dekhenga slide nhi hoga)

    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % totalSlides);
    }, 5500); // Rotate every 5.5s

    return () => clearInterval(timer);
  }, [isFullscreen, totalSlides]);

  const triggerCallAnnouncement = (token: string, cabin: string, doctorName?: string) => {
    setLastCalledToken(token);
    setIsAnnouncing(true);
    setTimeout(() => setIsAnnouncing(false), 5500);

    // In windowed mode, immediately snap slide to 0 so the called room is visible
    setActiveSlideIndex(0);

    if (soundEnabledRef.current) {
      playClinicVoiceAnnouncement(
        token,
        cabin || 'Consultation Room 1',
        doctorName,
        speechLangRef.current
      );
    }
  };

  const fetchDisplayData = () => {
    fetch(`${API_BASE_URL}/api/v1/queue/clinics/${clinicId}/display`)
      .then((res) => res.json())
      .then((resData) => {
        let fallbackName = 'City Health Multi-Specialty Hospital';
        let fallbackAddress = 'Suite 402, Metro Healthcare Towers, MG Road';
        let fallbackLogo = '';
        try {
          const storedHospitals = JSON.parse(localStorage.getItem('queueless_registered_hospitals') || '{}');
          if (clinicId && storedHospitals[clinicId]) {
            fallbackName = storedHospitals[clinicId].name;
            fallbackAddress = storedHospitals[clinicId].address || fallbackAddress;
            fallbackLogo = storedHospitals[clinicId].logoUrl || '';
          } else if (clinicId && clinicId !== 'city-health') {
            const cleanWords = clinicId
              .split('-')
              .map((w: string) => (w.toLowerCase() === 'opd' ? 'OPD' : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
              .join(' ');
            fallbackName = cleanWords.toLowerCase().endsWith('opd') ||
              cleanWords.toLowerCase().endsWith('clinic') ||
              cleanWords.toLowerCase().endsWith('hospital') ||
              cleanWords.toLowerCase().endsWith('center')
              ? cleanWords
              : cleanWords + ' OPD';
          }
          if (!fallbackLogo && clinicId) {
            fallbackLogo = localStorage.getItem('queueless_clinic_logo_' + clinicId) || '';
          }
        } catch (e) {}

        if (resData.success && resData.data && (resData.data.nowServing?.length > 0 || resData.data.nextWaiting?.length > 0)) {
          const serverNowServing = resData.data.nowServing || [];
          const topCalled = serverNowServing[0];

          // AUTOMATIC CALL DETECTION (No manual interaction needed!)
          if (topCalled && topCalled.token) {
            if (initialLoadDoneRef.current && topCalled.token !== lastAnnouncedTokenRef.current) {
              lastAnnouncedTokenRef.current = topCalled.token;
              triggerCallAnnouncement(
                topCalled.token,
                topCalled.doctor?.roomNumber || 'Cabin 1',
                topCalled.doctor?.displayName
              );
            } else if (!initialLoadDoneRef.current) {
              lastAnnouncedTokenRef.current = topCalled.token;
              initialLoadDoneRef.current = true;
            }
          }

          setData({
            ...resData.data,
            clinic: {
              ...resData.data.clinic,
              name: resData.data.clinic?.name || fallbackName,
              slug: clinicId,
              logoUrl: resData.data.clinic?.logoUrl || fallbackLogo,
            },
          });
        } else {
          // Default initial demo state
          const defaultNowServing = [
            {
              id: 'q-now-1',
              token: 'A-102',
              status: 'CALLED',
              doctor: { displayName: 'Dr. Rohan Sharma, MD (Orthopedic & Joint Care)', roomNumber: 'Cabin 1' },
            },
            {
              id: 'q-now-2',
              token: 'B-104',
              status: 'IN_CONSULTATION',
              doctor: { displayName: 'Dr. Rajiv Mehra, MD (Cardiology)', roomNumber: 'Cabin 2' },
            },
          ];

          if (!initialLoadDoneRef.current) {
            lastAnnouncedTokenRef.current = 'A-102';
            initialLoadDoneRef.current = true;
          }

          setData({
            clinic: {
              id: clinicId,
              name: fallbackName,
              slug: clinicId,
              address: fallbackAddress,
              logoUrl: fallbackLogo,
            },
            nowServing: defaultNowServing,
            nextWaiting: [
              { id: 'q-next-1', token: 'A-103', doctor: { displayName: 'Dr. Rohan Sharma, MD' } },
              { id: 'q-next-2', token: 'B-105', doctor: { displayName: 'Dr. Rajiv Mehra, MD' } },
              { id: 'q-next-3', token: 'C-201', doctor: { displayName: 'Dr. Priya Patel, MBBS' } },
              { id: 'q-next-4', token: 'D-302', doctor: { displayName: 'Dr. Amit Roy, MS' } },
            ],
          });
        }
      })
      .catch(() => {
        let fallbackName = 'City Health Multi-Specialty Hospital';
        let fallbackAddress = 'Suite 402, Metro Healthcare Towers, MG Road';
        try {
          const storedHospitals = JSON.parse(localStorage.getItem('queueless_registered_hospitals') || '{}');
          if (clinicId && storedHospitals[clinicId]) {
            fallbackName = storedHospitals[clinicId].name;
            fallbackAddress = storedHospitals[clinicId].address || fallbackAddress;
          } else if (clinicId && clinicId !== 'city-health') {
            const cleanWords = clinicId
              .split('-')
              .map((w: string) => (w.toLowerCase() === 'opd' ? 'OPD' : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
              .join(' ');
            fallbackName = cleanWords.toLowerCase().endsWith('opd') ||
              cleanWords.toLowerCase().endsWith('clinic') ||
              cleanWords.toLowerCase().endsWith('hospital') ||
              cleanWords.toLowerCase().endsWith('center')
              ? cleanWords
              : cleanWords + ' OPD';
          }
        } catch (e) {}

        setData((prev) => ({
          clinic: {
            id: clinicId,
            name: fallbackName,
            slug: clinicId,
            address: fallbackAddress,
          },
          nowServing: prev.nowServing.length > 0 ? prev.nowServing : [
            {
              id: 'q-now-1',
              token: 'A-102',
              status: 'CALLED',
              doctor: { displayName: 'Dr. Rohan Sharma, MD (Orthopedic & Joint Care)', roomNumber: 'Cabin 1' },
            },
            {
              id: 'q-now-2',
              token: 'B-104',
              status: 'IN_CONSULTATION',
              doctor: { displayName: 'Dr. Rajiv Mehra, MD (Cardiology)', roomNumber: 'Cabin 2' },
            },
          ],
          nextWaiting: prev.nextWaiting.length > 0 ? prev.nextWaiting : [
            { id: 'q-next-1', token: 'A-103', doctor: { displayName: 'Dr. Rohan Sharma, MD' } },
            { id: 'q-next-2', token: 'B-105', doctor: { displayName: 'Dr. Rajiv Mehra, MD' } },
            { id: 'q-next-3', token: 'C-201', doctor: { displayName: 'Dr. Priya Patel, MBBS' } },
            { id: 'q-next-4', token: 'D-302', doctor: { displayName: 'Dr. Amit Roy, MS' } },
          ],
        }));
      });
  };

  useEffect(() => {
    fetchDisplayData();

    socket.emit('join_clinic', data.clinic?.id || clinicId);

    const onCalled = (callData: { token: string; roomNumber: string; doctorName?: string; patientName?: string }) => {
      lastAnnouncedTokenRef.current = callData.token;
      triggerCallAnnouncement(callData.token, callData.roomNumber, callData.doctorName);
      fetchDisplayData();
    };

    socket.on('patient_called', onCalled);

    socket.on('queue_updated', () => {
      fetchDisplayData();
    });

    // Fast 2.5 second polling for instant automatic call pickup across Vercel serverless
    const interval = setInterval(fetchDisplayData, 2500);
    return () => {
      socket.off('patient_called', onCalled);
      socket.off('queue_updated');
      clearInterval(interval);
    };
  }, [clinicId, data.clinic?.id]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleTestVoice = () => {
    const testToken = primaryServing?.token || 'A-102';
    const testCabin = primaryServing?.doctor?.roomNumber || 'Cabin 1';
    triggerCallAnnouncement(testToken, testCabin, primaryServing?.doctor?.displayName);
  };

  const primaryServing = data.nowServing[0];
  const otherServing = data.nowServing.slice(1, 4);

  const activeLangConfig =
    WORLDWIDE_LANGUAGES.find((l) => l.code === speechLang) || WORLDWIDE_LANGUAGES[0];

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-slate-950 text-white flex flex-col justify-between p-3 sm:p-4 lg:p-5 select-none relative font-sans">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* 1. TOP TELEMETRY & HOSPITAL BRANDING HEADER (SHRINK-0) */}
      <header className="relative z-10 flex items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5 shrink-0">
        {/* Left: Hospital Brand */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {data.clinic?.logoUrl ? (
            <img
              src={data.clinic.logoUrl}
              alt={data.clinic.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl shadow-xl border border-slate-700/80 object-contain p-1 bg-white shrink-0"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-900 to-slate-900 border border-blue-700/50 flex items-center justify-center text-blue-400 shadow-xl shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-black tracking-tight text-white uppercase truncate">
                {data.clinic?.name || 'City Health Multi-Specialty Hospital'}
              </h1>
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium flex items-center gap-2 truncate">
              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[9px] sm:text-[10px]">
                OPD Central Broadcast
              </span>
              <span className="text-slate-600">•</span>
              <span className="truncate">{data.clinic?.address || 'Main Reception & Waiting Lounge'}</span>
            </p>
          </div>
        </div>

        {/* Right: Multi-Language Selector, Mode Pill, Clock & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* View Mode Indicator Badge */}
          <div
            onClick={toggleFullscreen}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-300 cursor-pointer hover:border-slate-700 transition-colors shadow-xs"
            title="Click to toggle Fullscreen"
          >
            {isFullscreen ? (
              <>
                <Tv className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">TV Wall: Static View</span>
              </>
            ) : (
              <>
                <Layers className="w-3 h-3 text-sky-400 animate-pulse" />
                <span className="text-sky-300">Windowed: Auto-Slide ({activeSlideIndex + 1}/{totalSlides})</span>
              </>
            )}
          </div>

          {/* Worldwide 15-Language Voice Dropdown */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/95 border border-slate-700/80 rounded-xl text-xs font-bold text-slate-200 shadow-md">
            <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <select
              aria-label="Speech Language Mode"
              value={speechLang}
              onChange={(e) => setSpeechLang(e.target.value as SpeechLanguageMode)}
              className="bg-transparent text-white font-bold cursor-pointer focus:outline-none text-xs pr-1"
            >
              {WORLDWIDE_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white font-semibold">
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Digital Clock with Timezone */}
          <div className="bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-xl text-right shadow-inner">
            <div className="text-sm sm:text-base font-mono font-black text-white tracking-wider leading-none">
              {currentTime || '--:--:--'}
            </div>
            <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              {currentDate || 'Today'} {timezoneStr ? `• ${timezoneStr}` : ''}
            </div>
          </div>

          {/* Test Voice Button */}
          <button
            onClick={handleTestVoice}
            className="px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
            title="Test Automatic Audio Chime & Announcement"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Test Chime</span>
          </button>

          {/* Mute/Unmute */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playClinicChime();
            }}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition-colors shadow-xs cursor-pointer shrink-0"
            title={soundEnabled ? 'Mute Chime' : 'Enable Sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-rose-400" />
            )}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-xl transition-all shadow-xs cursor-pointer shrink-0 border ${
              isFullscreen
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter TV Fullscreen (F11)'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. MAIN CENTER DISPLAY SECTION (FLEX-1, OVERFLOW-HIDDEN, 0 SCROLL) */}
      <main className="flex-1 min-h-0 flex flex-col items-center justify-center py-1 sm:py-2 relative z-10 w-full max-w-6xl mx-auto overflow-hidden">
        {data.nowServing.length === 0 ? (
          <div className="text-center py-10 text-slate-500 max-w-lg mx-auto space-y-3">
            <Clock className="w-16 h-16 mx-auto opacity-30 text-slate-400" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-300 tracking-tight">
              Please Relax & Be Seated
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
              Consulting specialists are reviewing patient charts. Your token number will chime and display on this screen automatically.
            </p>
          </div>
        ) : isFullscreen ? (
          /* ========================================================================= */
          /* FULLSCREEN TV MODE: "jab full screen karega toh ek hi page me dekhenga slide nhi hoga" */
          /* All active consultation rooms & primary called patient on ONE unified wall grid */
          /* ========================================================================= */
          <div className="w-full h-full flex flex-col justify-center animate-in fade-in duration-300">
            {otherServing.length === 0 ? (
              // Single Cabin Serving (Expansive Layout)
              <div className="text-center flex flex-col items-center justify-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2.5 px-6 py-2 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-full text-sm font-black tracking-widest uppercase shadow-lg shadow-emerald-500/10">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <Bell className="w-4 h-4 text-emerald-400 animate-bounce" />
                  <span>NOW SERVING • {activeLangConfig.subhead}</span>
                  {isAnnouncing && (
                    <span className="bg-emerald-950 px-2 py-0.5 rounded text-emerald-400 font-mono text-xs border border-emerald-500/40 animate-pulse">
                      CALLING
                    </span>
                  )}
                </div>

                <div className="text-8xl sm:text-9xl md:text-[11rem] font-black font-mono tracking-tight text-emerald-400 drop-shadow-[0_0_65px_rgba(52,211,153,0.4)] leading-none select-all">
                  {primaryServing.token}
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 max-w-xl w-full shadow-2xl backdrop-blur-md space-y-1.5">
                  <div className="flex items-center justify-center gap-2 text-slate-400 text-xs uppercase tracking-widest font-bold">
                    <Stethoscope className="w-4 h-4 text-emerald-400" />
                    <span>Destination Consultation Suite</span>
                  </div>
                  <div className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                    {primaryServing.doctor?.roomNumber || 'Cabin 1'}
                  </div>
                  {primaryServing.doctor?.displayName && (
                    <div className="text-lg sm:text-xl font-bold text-slate-300">
                      {primaryServing.doctor.displayName}
                    </div>
                  )}
                  <div className="pt-1 flex items-center justify-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Patient Ref:</span>
                    <span className="text-xs font-mono font-black text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                      #QL-{primaryServing.id.substring(0, 6).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              // Multi-Cabin Serving (Side-by-Side Dual Wall Grid - Zero Sliding, Zero Overflow)
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center w-full max-h-full">
                {/* Left 60%: Giant Primary Called Token */}
                <div className="lg:col-span-7 flex flex-col items-center justify-center text-center bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500"></div>
                  
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-full text-xs font-black tracking-widest uppercase mb-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <Bell className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                    <span>NOW CALLING • {activeLangConfig.subhead}</span>
                  </div>

                  <div className="text-7xl sm:text-8xl md:text-9xl font-black font-mono tracking-tight text-emerald-400 drop-shadow-[0_0_55px_rgba(52,211,153,0.35)] leading-none my-1 select-all">
                    {primaryServing.token}
                  </div>

                  <div className="w-full max-w-md mt-2 space-y-1 bg-slate-950/70 border border-slate-800/80 rounded-2xl py-3 px-4">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center justify-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Proceed to</span>
                    </div>
                    <div className="text-2xl sm:text-4xl font-black text-white">
                      {primaryServing.doctor?.roomNumber || 'Cabin 1'}
                    </div>
                    {primaryServing.doctor?.displayName && (
                      <div className="text-sm font-bold text-slate-300 truncate">
                        {primaryServing.doctor.displayName}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right 40%: All Other Active Consultation Rooms */}
                <div className="lg:col-span-5 flex flex-col justify-center space-y-2.5">
                  <div className="text-xs uppercase tracking-widest text-slate-400 font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Also Serving Now ({otherServing.length} Rooms)</span>
                  </div>
                  <div className="space-y-2.5">
                    {otherServing.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between shadow-lg hover:border-slate-700 transition-colors"
                      >
                        <div className="min-w-0 pr-3">
                          <div className="text-xs uppercase tracking-wider font-extrabold text-blue-400">
                            {item.doctor?.roomNumber || 'Consultation Room'}
                          </div>
                          <div className="text-sm font-bold text-white truncate">
                            {item.doctor?.displayName || 'Attending Doctor'}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                            REF: #QL-{item.id.substring(0, 5).toUpperCase()}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 leading-none">
                            {item.token}
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            IN SESSION
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* WINDOWED STARTING MODE: "starting me slide wala add kar de na" */
          /* Smooth, beautifully scaled carousel cycling between cabins & waiting queue */
          /* ========================================================================= */
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300 relative">
            {/* Carousel Slide Card Container */}
            <div className="w-full max-w-xl mx-auto">
              {activeSlideIndex < data.nowServing.length ? (
                // Cabin Serving Slide Card
                (() => {
                  const currentSlideItem = data.nowServing[activeSlideIndex] || primaryServing;
                  const isPrimary = activeSlideIndex === 0;

                  return (
                    <div className="bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 rounded-3xl p-4 sm:p-6 text-center shadow-2xl relative overflow-hidden backdrop-blur-md">
                      {/* Top Glowing Indicator */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-1.5 ${
                          isPrimary
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-400'
                        }`}
                      ></div>

                      {/* Header Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-bold">
                          Cabin {activeSlideIndex + 1} of {data.nowServing.length}
                        </span>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-black tracking-widest uppercase">
                          <Bell className="w-3 h-3 text-emerald-400 animate-bounce" />
                          <span>{isPrimary ? 'NOW SERVING' : 'IN CONSULTATION'} • {activeLangConfig.subhead}</span>
                        </div>

                        <span className="text-[10px] font-mono text-amber-400 font-bold">
                          #QL-{currentSlideItem.id.substring(0, 5).toUpperCase()}
                        </span>
                      </div>

                      {/* Giant Token */}
                      <div className="text-7xl sm:text-8xl md:text-9xl font-black font-mono tracking-tight text-emerald-400 drop-shadow-[0_0_45px_rgba(52,211,153,0.35)] leading-none my-1 select-all">
                        {currentSlideItem.token}
                      </div>

                      {/* Destination Room */}
                      <div className="mt-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 space-y-1">
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center justify-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Please Proceed To</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-white">
                          {currentSlideItem.doctor?.roomNumber || `Consultation Room ${activeSlideIndex + 1}`}
                        </div>
                        {currentSlideItem.doctor?.displayName && (
                          <div className="text-xs sm:text-sm font-bold text-slate-300 truncate">
                            {currentSlideItem.doctor.displayName}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()
              ) : (
                // Upcoming Queue Overview Slide
                <div className="bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 rounded-3xl p-5 text-center shadow-2xl relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 to-blue-500"></div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-bold">
                      Queue Overview
                    </span>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/15 border border-sky-500/30 text-sky-300 rounded-full text-xs font-black tracking-widest uppercase">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      <span>Next Patients to Prepare</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {data.nextWaiting.length} In Line
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 my-2">
                    {data.nextWaiting.slice(0, 4).map((item, idx) => (
                      <div
                        key={item.id}
                        className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-left shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Queue #{idx + 1}</span>
                          <span className="text-xs font-mono text-amber-300">Prepare</span>
                        </div>
                        <div className="text-2xl font-black font-mono text-sky-400 my-0.5">
                          {item.token}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-300 truncate">
                          {item.doctor?.displayName || 'Specialist OPD'}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 font-medium">
                    Tokens are called in sequence. Please watch for your number announcement chime.
                  </p>
                </div>
              )}
            </div>

            {/* Slider Navigation Pills & Prev/Next Arrows */}
            <div className="flex items-center justify-center gap-3 mt-3">
              <button
                onClick={() => setActiveSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides)}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeSlideIndex === idx
                        ? 'w-7 bg-emerald-400 shadow-xs shadow-emerald-400/50'
                        : 'w-2 bg-slate-700 hover:bg-slate-600'
                    }`}
                    title={`Jump to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveSlideIndex((prev) => (prev + 1) % totalSlides)}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Fullscreen Prompt Badge */}
              <button
                onClick={toggleFullscreen}
                className="ml-2 text-[10px] font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1 bg-slate-900/90 border border-slate-800/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <Maximize className="w-3 h-3 text-emerald-400" />
                <span>Fullscreen Wall View (Static)</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 3. BOTTOM FOOTER: NEXT IN QUEUE TICKER & CLINICAL MARQUEE (SHRINK-0) */}
      <footer className="relative z-10 border-t border-slate-800/80 pt-2 space-y-1.5 shrink-0">
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5 shrink-0 text-[10px] sm:text-[11px]">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Next In Queue (Please prepare to proceed):</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 bg-slate-900/80 border border-slate-800/80 px-2.5 py-0.5 rounded-full">
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>
              {activeLangConfig.flag} {activeLangConfig.label} • Auto-Chime Broadcast Active
            </span>
          </div>
        </div>

        {/* Horizontal Next In Queue Badges */}
        {data.nextWaiting.length === 0 ? (
          <p className="text-[11px] text-slate-600">No other patients currently queued in waiting list.</p>
        ) : (
          <div className="flex items-center gap-2 overflow-hidden flex-nowrap">
            {data.nextWaiting.slice(0, 7).map((item, idx) => (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800/90 px-3 py-1 rounded-xl flex items-center gap-2 shadow-xs shrink-0"
              >
                <span className="text-[9px] font-bold text-slate-500 uppercase">#{idx + 1}</span>
                <span className="text-sm font-black font-mono text-sky-400">{item.token}</span>
                {item.doctor?.displayName && (
                  <span className="text-[10px] text-slate-400 max-w-[110px] truncate">
                    ({item.doctor.displayName})
                  </span>
                )}
              </div>
            ))}
            {data.nextWaiting.length > 7 && (
              <div className="text-[10px] font-bold text-slate-500 px-2 py-1 shrink-0">
                +{data.nextWaiting.length - 7} more
              </div>
            )}
          </div>
        )}

        {/* Worldwide Clinical Hospital Marquee Ticker */}
        <div className="bg-slate-900/70 border border-slate-800/70 rounded-xl px-3 py-1 flex items-center gap-2 overflow-hidden text-[10px] sm:text-[11px] text-slate-400">
          <div className="flex items-center gap-1 text-emerald-400 font-black shrink-0 uppercase tracking-wider text-[9px] sm:text-[10px]">
            <Sparkles className="w-3 h-3" />
            <span>Notice:</span>
          </div>
          <div className="truncate font-medium">
            Welcome to {data.clinic?.name || 'Queueless Hospital'} • Please proceed to your consultation room when your token is called • Keep your mobile QR pass ready for pharmacy & lab telemetry • NABH & JCI Clinical Queue Standards
          </div>
          <div className="ml-auto hidden lg:flex items-center gap-1 text-[9px] text-slate-500 shrink-0 font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Queueless OS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
