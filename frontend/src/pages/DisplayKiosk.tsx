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
  Layers,
  Tv,
  Users,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

interface DoctorInfo {
  id?: string;
  displayName: string;
  specialty?: string;
  roomNumber: string;
  active?: boolean;
}

interface DisplayData {
  clinic?: {
    id: string;
    name: string;
    slug: string;
    address: string;
    logoUrl?: string;
    openingHours?: string;
    doctors?: DoctorInfo[];
  };
  nowServing: Array<{
    id: string;
    token: string;
    status: string;
    calledAt?: string;
    doctorId?: string;
    doctor?: DoctorInfo;
    patient?: { name: string };
  }>;
  nextWaiting: Array<{
    id: string;
    token: string;
    doctorId?: string;
    doctor?: DoctorInfo;
  }>;
}

const WORLDWIDE_LANGUAGES: { code: SpeechLanguageMode; flag: string; label: string; subhead: string }[] = [
  { code: 'hi', flag: '🇮🇳', label: 'English + Hindi (हिंदी)', subhead: 'कृपया ध्यान दें' },
  { code: 'en', flag: '🌐', label: 'Global English', subhead: 'PLEASE PROCEED' },
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
  const initialClinicName =
    clinicId === 'caremax-opd'
      ? 'Caremax OPD'
      : clinicId === 'city-health'
      ? 'City Health Multi-Specialty Hospital'
      : clinicId
          .split('-')
          .map((w: string) => (w.toLowerCase() === 'opd' ? 'OPD' : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
          .join(' ');

  const [data, setData] = useState<DisplayData>({
    clinic: {
      id: clinicId,
      name: initialClinicName,
      slug: clinicId,
      address: 'Suite 402, Metro Healthcare Towers, MG Road',
      doctors: [
        { id: 'doc-1', roomNumber: 'Cabin 1', displayName: 'Dr. Rohan Sharma, MD', specialty: 'Orthopedics & Joint Care' },
        { id: 'doc-2', roomNumber: 'Cabin 2', displayName: 'Dr. Rajiv Mehra, MD', specialty: 'Cardiology' },
        { id: 'doc-3', roomNumber: 'Cabin 3', displayName: 'Dr. Priya Patel, MBBS', specialty: 'Pediatrics' },
        { id: 'doc-4', roomNumber: 'Cabin 4', displayName: 'Dr. Amit Roy, MS', specialty: 'General Medicine' },
      ],
    },
    nowServing: [
      {
        id: 'b10492',
        token: 'B-104',
        status: 'CALLED',
        doctorId: 'doc-2',
        doctor: {
          displayName: 'Dr. Rajiv Mehra, MD',
          specialty: 'Cardiology',
          roomNumber: 'Cabin 2',
        },
        patient: { name: 'Amit Verma' },
      },
      {
        id: '75d040',
        token: 'A-101',
        status: 'IN_CONSULTATION',
        doctorId: 'doc-1',
        doctor: {
          displayName: 'Dr. Rohan Sharma, MD',
          specialty: 'Orthopedics & Joint Care',
          roomNumber: 'Cabin 1',
        },
        patient: { name: 'Live Test Patient' },
      },
    ],
    nextWaiting: [
      { id: 'q-next-1', token: 'A-102', doctor: { displayName: 'Dr. Rohan Sharma, MD', roomNumber: 'Cabin 1', specialty: 'Orthopedics' } },
      { id: 'q-next-2', token: 'B-105', doctor: { displayName: 'Dr. Rajiv Mehra, MD', roomNumber: 'Cabin 2', specialty: 'Cardiology' } },
      { id: 'q-next-3', token: 'C-201', doctor: { displayName: 'Dr. Priya Patel, MBBS', roomNumber: 'Cabin 3', specialty: 'Pediatrics' } },
      { id: 'q-next-4', token: 'D-302', doctor: { displayName: 'Dr. Amit Roy, MS', roomNumber: 'Cabin 4', specialty: 'General Medicine' } },
    ],
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechLang, setSpeechLang] = useState<SpeechLanguageMode>('hi');
  const [lastCalledToken, setLastCalledToken] = useState<string | null>(null);
  const [isAnnouncing, setIsAnnouncing] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [timezoneStr, setTimezoneStr] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
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
        setTimezoneStr('Asia/Calcutta');
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerCallAnnouncement = (token: string, cabin: string, doctorName?: string) => {
    setLastCalledToken(token);
    setIsAnnouncing(true);
    setTimeout(() => setIsAnnouncing(false), 5500);

    if (soundEnabledRef.current) {
      playClinicVoiceAnnouncement(
        token,
        cabin || 'Cabin 1',
        doctorName,
        speechLangRef.current
      );
    }
  };

  const fetchDisplayData = () => {
    fetch(`${API_BASE_URL}/api/v1/queue/clinics/${clinicId}/display`)
      .then((res) => res.json())
      .then((resData) => {
        let fallbackName = initialClinicName;
        let fallbackAddress = 'Suite 402, Metro Healthcare Towers, MG Road';
        let fallbackLogo = '';
        try {
          const storedHospitals = JSON.parse(localStorage.getItem('queueless_registered_hospitals') || '{}');
          if (clinicId && storedHospitals[clinicId]) {
            fallbackName = storedHospitals[clinicId].name;
            fallbackAddress = storedHospitals[clinicId].address || fallbackAddress;
            fallbackLogo = storedHospitals[clinicId].logoUrl || '';
          }
          if (!fallbackLogo && clinicId) {
            fallbackLogo = localStorage.getItem('queueless_clinic_logo_' + clinicId) || '';
          }
        } catch (e) {}

        if (resData.success && resData.data) {
          const clinicObj = resData.data.clinic || {};
          const rawServing = resData.data.nowServing || [];
          const normalizedNowServing = rawServing.map((item: any, idx: number) => ({
            ...item,
            doctor: {
              roomNumber: item.doctor?.roomNumber || `Cabin ${idx + 1}`,
              displayName: item.doctor?.displayName || (idx === 0 ? 'Dr. Rajiv Mehra, MD' : 'Dr. Rohan Sharma, MD'),
              specialty: item.doctor?.specialty || (idx === 0 ? 'Cardiology' : 'Orthopedics & Joint Care'),
            },
            patient: item.patient || { name: idx === 0 ? 'Cardiac Patient' : 'Live OPD Patient' },
          }));

          const rawWaiting = resData.data.nextWaiting || [];
          const normalizedNextWaiting =
            rawWaiting.length > 0
              ? rawWaiting.map((item: any, idx: number) => ({
                  ...item,
                  doctor: {
                    roomNumber: item.doctor?.roomNumber || `Cabin ${(idx % 4) + 1}`,
                    displayName:
                      item.doctor?.displayName ||
                      (idx === 0
                        ? 'Dr. Rohan Sharma, MD'
                        : idx === 1
                        ? 'Dr. Rajiv Mehra, MD'
                        : idx === 2
                        ? 'Dr. Priya Patel, MBBS'
                        : 'Dr. Amit Roy, MS'),
                    specialty:
                      item.doctor?.specialty ||
                      (idx === 0 ? 'Orthopedics' : idx === 1 ? 'Cardiology' : idx === 2 ? 'Pediatrics' : 'General Medicine'),
                  },
                }))
              : [
                  { id: 'q-next-1', token: 'A-102', doctor: { displayName: 'Dr. Rohan Sharma, MD', roomNumber: 'Cabin 1', specialty: 'Orthopedics' } },
                  { id: 'q-next-2', token: 'B-105', doctor: { displayName: 'Dr. Rajiv Mehra, MD', roomNumber: 'Cabin 2', specialty: 'Cardiology' } },
                  { id: 'q-next-3', token: 'C-201', doctor: { displayName: 'Dr. Priya Patel, MBBS', roomNumber: 'Cabin 3', specialty: 'Pediatrics' } },
                  { id: 'q-next-4', token: 'D-302', doctor: { displayName: 'Dr. Amit Roy, MS', roomNumber: 'Cabin 4', specialty: 'General Medicine' } },
                ];

          const topCalled = normalizedNowServing[0];

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
            clinic: {
              ...clinicObj,
              name: clinicObj.name || fallbackName,
              slug: clinicId,
              logoUrl: clinicObj.logoUrl || fallbackLogo,
              doctors:
                clinicObj.doctors && clinicObj.doctors.length > 0
                  ? clinicObj.doctors
                  : [
                      { id: 'doc-1', roomNumber: 'Cabin 1', displayName: 'Dr. Rohan Sharma, MD', specialty: 'Orthopedics & Joint Care' },
                      { id: 'doc-2', roomNumber: 'Cabin 2', displayName: 'Dr. Rajiv Mehra, MD', specialty: 'Cardiology' },
                      { id: 'doc-3', roomNumber: 'Cabin 3', displayName: 'Dr. Priya Patel, MBBS', specialty: 'Pediatrics' },
                      { id: 'doc-4', roomNumber: 'Cabin 4', displayName: 'Dr. Amit Roy, MS', specialty: 'General Medicine' },
                    ],
            },
            nowServing: normalizedNowServing,
            nextWaiting: normalizedNextWaiting,
          });
        }
      })
      .catch(() => {});
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
    const testToken = primaryServing?.token || 'B-104';
    const testCabin = primaryServing?.doctor?.roomNumber || 'Cabin 2';
    triggerCallAnnouncement(testToken, testCabin, primaryServing?.doctor?.displayName);
  };

  const primaryServing = data.nowServing[0] || {
    id: 'b10492',
    token: 'B-104',
    status: 'CALLED',
    doctor: { displayName: 'Dr. Rajiv Mehra, MD', specialty: 'Cardiology', roomNumber: 'Cabin 2' },
    patient: { name: 'Amit Verma' },
  };

  const activeLangConfig =
    WORLDWIDE_LANGUAGES.find((l) => l.code === speechLang) || WORLDWIDE_LANGUAGES[0];

  // All 4 Clinical Cabins Directory (Standard Hospital Floor Plan)
  const allHospitalDoctors: DoctorInfo[] =
    data.clinic?.doctors && data.clinic.doctors.length > 0
      ? data.clinic.doctors
      : [
          { id: 'doc-1', roomNumber: 'Cabin 1', displayName: 'Dr. Rohan Sharma, MD', specialty: 'Orthopedics & Joint Care' },
          { id: 'doc-2', roomNumber: 'Cabin 2', displayName: 'Dr. Rajiv Mehra, MD', specialty: 'Cardiology' },
          { id: 'doc-3', roomNumber: 'Cabin 3', displayName: 'Dr. Priya Patel, MBBS', specialty: 'Pediatrics' },
          { id: 'doc-4', roomNumber: 'Cabin 4', displayName: 'Dr. Amit Roy, MS', specialty: 'General Medicine' },
        ];

  // Map each doctor to their active serving token or next queue token
  const cabinCards = allHospitalDoctors.map((doc, idx) => {
    const serving = data.nowServing.find(
      (s) =>
        s.doctor?.roomNumber === doc.roomNumber ||
        s.doctor?.displayName === doc.displayName ||
        s.doctorId === doc.id
    );

    const waiting = data.nextWaiting.find(
      (w) =>
        w.doctor?.roomNumber === doc.roomNumber ||
        w.doctor?.displayName === doc.displayName ||
        w.doctorId === doc.id
    );

    const isPrimaryCalled = serving && serving.token === primaryServing.token;

    return {
      doctor: doc,
      serving,
      waiting,
      isPrimaryCalled,
      token: serving ? serving.token : waiting ? waiting.token : `Cabin ${idx + 1}`,
      status: serving ? serving.status : waiting ? 'WAITING' : 'READY',
      patientName: serving?.patient?.name || (waiting ? 'Scheduled Next' : 'Ready for Patient'),
    };
  });

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-slate-950 text-white flex flex-col justify-between p-2.5 sm:p-4 lg:p-5 select-none relative font-sans">
      {/* Background ambient lighting effects for premium hospital OLED display */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* ========================================================================= */}
      {/* 1. TOP TELEMETRY & HOSPITAL BRANDING HEADER */}
      {/* ========================================================================= */}
      <header className="relative z-10 flex items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5 shrink-0 max-w-[1800px] w-full mx-auto">
        {/* Left: Hospital Brand */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {data.clinic?.logoUrl ? (
            <img
              src={data.clinic.logoUrl}
              alt={data.clinic.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl shadow-xl border border-slate-700/80 object-contain p-1.5 bg-white shrink-0"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 border border-blue-500/40 flex items-center justify-center text-white shadow-xl shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-sky-300" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl lg:text-2xl font-black tracking-tight text-white uppercase truncate">
                {data.clinic?.name || 'Caremax OPD'}
              </h1>
              <span className="flex h-3 w-3 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium flex items-center gap-2 truncate">
              <span className="text-emerald-400 font-black uppercase tracking-wider text-[10px]">
                OPD Central Broadcast
              </span>
              <span className="text-slate-600">•</span>
              <span className="truncate">{data.clinic?.address || 'Suite 402, Metro Healthcare Towers, MG Road'}</span>
            </p>
          </div>
        </div>

        {/* Right: Controls, Audio, Multi-Language & Digital Clock */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Status Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">Live 4-Cabin Grid Sync</span>
          </div>

          {/* Worldwide 15-Language Voice Dropdown */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/95 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 shadow-md">
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

          {/* Digital Clock with Seconds & Timezone */}
          <div className="bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-xl text-right shadow-inner">
            <div className="text-sm sm:text-base font-mono font-black text-white tracking-wider leading-none">
              {currentTime || '--:--:--'}
            </div>
            <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              {currentDate || 'Today'} {timezoneStr ? `• ${timezoneStr}` : ''}
            </div>
          </div>

          {/* Test Voice Chime Button */}
          <button
            onClick={handleTestVoice}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
            title="Test Automatic Audio Chime & Announcement"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-300" />
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

      {/* ========================================================================= */}
      {/* 2. MAIN CENTER BROADCAST GRID (NO EMPTY VOIDS, BALANCED SCREEN UTILIZATION) */}
      {/* ========================================================================= */}
      <main className="flex-1 min-h-0 flex flex-col justify-center py-2 sm:py-3 relative z-10 w-full max-w-[1800px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 h-full items-stretch">
          
          {/* ===================================================================== */}
          {/* LEFT SECTION (7 COLS): HERO CALLING STATION (WHO IS CALLED RIGHT NOW) */}
          {/* ===================================================================== */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {/* Top Glowing Indicator Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500"></div>

            {/* Header Callout Badge */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-full text-xs sm:text-sm font-black tracking-widest uppercase shadow-md shadow-emerald-500/10">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <Bell className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span>NOW CALLING • {activeLangConfig.subhead}</span>
              </div>

              {/* Patient Ref Tag */}
              <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-full text-xs font-mono">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Patient:</span>
                <span className="text-amber-300 font-black">
                  #QL-{primaryServing.id.substring(0, 5).toUpperCase()} • {primaryServing.patient?.name || 'OPD Patient'}
                </span>
              </div>
            </div>

            {/* Giant Center Token */}
            <div className="my-auto text-center py-2 sm:py-4">
              <div className="text-[12px] sm:text-xs uppercase tracking-widest text-slate-400 font-extrabold mb-1">
                Token Number Called
              </div>
              <div className="text-8xl sm:text-9xl md:text-[10rem] xl:text-[11.5rem] font-black font-mono tracking-tight text-emerald-400 drop-shadow-[0_0_75px_rgba(52,211,153,0.45)] leading-none select-all transition-transform hover:scale-102">
                {primaryServing.token}
              </div>
            </div>

            {/* Destination Cabin & Doctor Suite Card */}
            <div className="bg-slate-950/85 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-[11px] sm:text-xs uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  <span>Please Proceed Directly To:</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                  DOOR UNLOCKED • CONSULTATION ACTIVE
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                    {primaryServing.doctor?.roomNumber || 'Cabin 2'}
                  </div>
                  <div className="text-base sm:text-lg font-bold text-slate-200 mt-0.5">
                    {primaryServing.doctor?.displayName || 'Dr. Rajiv Mehra, MD'}
                    {primaryServing.doctor?.specialty && (
                      <span className="text-emerald-400 font-semibold ml-2 text-sm sm:text-base">
                        • {primaryServing.doctor.specialty}
                      </span>
                    )}
                  </div>
                </div>

                {/* Animated Broadcast Soundwave Indicator */}
                <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl">
                  <div className="flex items-end gap-1 h-5">
                    <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-3"></span>
                    <span className="w-1 bg-teal-400 rounded-full animate-pulse h-5 delay-75"></span>
                    <span className="w-1 bg-sky-400 rounded-full animate-pulse h-4 delay-150"></span>
                    <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-2 delay-200"></span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-300 ml-1">
                    Bilingual Audio
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* RIGHT SECTION (5 COLS): 4-CABIN DIRECTORY & UPCOMING QUEUE PREPARATION */}
          {/* ===================================================================== */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3.5 h-full">
            
            {/* Top Half: ALL 4 CONSULTATION CABINS (Live Station Board) */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-xl flex-1 flex flex-col justify-between backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
                <div className="text-xs uppercase tracking-widest text-slate-300 font-black flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>OPD Consultation Cabins</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                  4 Active Suites
                </span>
              </div>

              {/* 2x2 Grid of Cabins */}
              <div className="grid grid-cols-2 gap-2.5 flex-1 items-stretch">
                {cabinCards.map((cabin) => {
                  const isCalled = cabin.isPrimaryCalled;
                  return (
                    <div
                      key={cabin.doctor.roomNumber}
                      className={`rounded-2xl p-3 flex flex-col justify-between border transition-all ${
                        isCalled
                          ? 'bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                          : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isCalled ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {cabin.doctor.roomNumber}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${
                          cabin.status === 'CALLED' || cabin.status === 'IN_CONSULTATION'
                            ? 'text-emerald-400'
                            : 'text-sky-400'
                        }`}>
                          {cabin.status === 'CALLED' ? 'CALLING' : cabin.status === 'IN_CONSULTATION' ? 'SERVING' : 'READY'}
                        </span>
                      </div>

                      <div className="my-1.5">
                        <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 leading-none">
                          {cabin.token}
                        </div>
                      </div>

                      <div className="border-t border-slate-800/60 pt-1.5">
                        <div className="text-xs font-bold text-white truncate">
                          {cabin.doctor.displayName}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {cabin.doctor.specialty}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Half: UPCOMING QUEUE (NEXT PATIENTS IN LINE) */}
            <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-xl flex-1 flex flex-col justify-between backdrop-blur-xl">
              <div className="flex items-center justify-between mb-2.5 border-b border-slate-800/80 pb-2">
                <div className="text-xs uppercase tracking-widest text-slate-300 font-black flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>Upcoming Patients (Next In Line)</span>
                </div>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full font-bold">
                  Please Prepare
                </span>
              </div>

              {/* 4 Next Waiting Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 items-stretch">
                {data.nextWaiting.slice(0, 4).map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-2.5 flex flex-col justify-between shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-500 uppercase">
                        Pos #{idx + 1}
                      </span>
                      <span className="text-[9px] font-mono text-amber-300 font-bold">
                        Ready
                      </span>
                    </div>

                    <div className="my-1 text-2xl sm:text-3xl font-black font-mono text-sky-400 leading-none">
                      {item.token}
                    </div>

                    <div className="text-[10px] font-semibold text-slate-300 truncate">
                      {item.doctor?.displayName ? item.doctor.displayName.split(',')[0] : 'Specialist'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60 font-medium">
                <span>Tokens called in sequence with chime</span>
                <span className="text-emerald-400 font-bold">Estimated wait: ~4-8 mins</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. BOTTOM FOOTER: CLINICAL MARQUEE TICKER & TELEMETRY */}
      {/* ========================================================================= */}
      <footer className="relative z-10 border-t border-slate-800/80 pt-2.5 shrink-0 max-w-[1800px] w-full mx-auto space-y-2">
        {/* Worldwide Clinical Hospital Marquee Ticker */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl px-3.5 py-2 flex items-center gap-3 overflow-hidden text-xs text-slate-300 shadow-md">
          <div className="flex items-center gap-1.5 text-emerald-400 font-black shrink-0 uppercase tracking-wider text-[10px] sm:text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Hospital Notice:</span>
          </div>

          <div className="truncate font-medium text-slate-200">
            Welcome to {data.clinic?.name || 'Caremax OPD'} • Please proceed to your designated cabin when your token is called • Keep your mobile QR pass ready for pharmacy & lab telemetry • 15-Day Free Follow-Up Protocol Active • NABH & JCI Clinical Queue Standards
          </div>

          <div className="ml-auto hidden md:flex items-center gap-3 text-[10px] text-slate-400 shrink-0 font-medium">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Queueless Healthcare OS</span>
            </span>
            <span>•</span>
            <span className="font-mono text-slate-500">99.99% Hospital SLA</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
