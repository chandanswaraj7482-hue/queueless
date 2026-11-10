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
  Globe,
  Sparkles,
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
  { code: 'kn', flag: '🇮🇳', label: 'English + Kannada (ಕನ್ನಡ)', subhead: 'దయవిಟ್ಟು ಬನ್ನಿ' },
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  // References
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

  // Unlock audio context on user gesture
  useEffect(() => {
    const handleGesture = () => {
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

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      );
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

          // Automatic Call Announcement
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
    socket.on('queue_updated', () => fetchDisplayData());

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

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none relative font-sans">
      {/* Subtle soft ambient glow for high-end OLED display */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-sky-500/8 rounded-full blur-[180px] pointer-events-none"></div>

      {/* ========================================================================= */}
      {/* 1. CLEAN TOP HEADER (MINIMALIST & SPACIOUS) */}
      {/* ========================================================================= */}
      <header className="relative z-10 flex items-center justify-between gap-4 pb-4 border-b border-slate-800/60 shrink-0 w-full max-w-[1700px] mx-auto">
        {/* Left: Clean Brand */}
        <div className="flex items-center gap-3.5 min-w-0">
          {data.clinic?.logoUrl ? (
            <img
              src={data.clinic.logoUrl}
              alt={data.clinic.name}
              className="w-11 h-11 rounded-2xl shadow-md border border-slate-700/80 object-contain p-1.5 bg-white shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shadow-md shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white uppercase truncate">
                {data.clinic?.name || 'Caremax OPD'}
              </h1>
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium truncate">
              {data.clinic?.address || 'Suite 402, Metro Healthcare Towers, MG Road'}
            </p>
          </div>
        </div>

        {/* Right: Clean Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300">
            <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
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

          {/* Clock */}
          <div className="px-3.5 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-right">
            <div className="text-base font-mono font-bold text-white tracking-wider leading-none">
              {currentTime || '--:--'}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              {currentDate || 'Today'}
            </div>
          </div>

          {/* Test Chime */}
          <button
            onClick={handleTestVoice}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Test Chime Sound"
          >
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Test Sound</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playClinicChime();
            }}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-rose-400" />
            )}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN CENTER HERO (CLEAN, SPACIOUS, ZERO CLUTTER) */}
      {/* ========================================================================= */}
      <main className="flex-1 min-h-0 flex flex-col justify-center py-4 sm:py-6 relative z-10 w-full max-w-[1700px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 h-full items-stretch">
          
          {/* ===================================================================== */}
          {/* LEFT SECTION (8 COLS): HERO NOW CALLING (Clean & Breathable) */}
          {/* ===================================================================== */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden backdrop-blur-md">
            {/* Soft Green Top Stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500/80"></div>

            {/* Now Calling Status Pill */}
            <div className="flex items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider">
                <Bell className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span>NOW CALLING • {activeLangConfig.subhead}</span>
              </div>
            </div>

            {/* Giant Clean Token (Uncluttered, High Contrast) */}
            <div className="my-auto text-center py-6 sm:py-10">
              <div className="text-8xl sm:text-9xl md:text-[11rem] xl:text-[13.5rem] font-black font-mono tracking-tight text-emerald-400 drop-shadow-[0_0_80px_rgba(52,211,153,0.3)] leading-none select-all transition-transform hover:scale-102">
                {primaryServing.token}
              </div>
            </div>

            {/* Destination Suite & Doctor (Generous Padding, Clear Typography) */}
            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
                  Please Proceed To
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {primaryServing.doctor?.roomNumber || 'Cabin 2'}
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg sm:text-2xl font-bold text-white">
                  {primaryServing.doctor?.displayName || 'Dr. Rajiv Mehra, MD'}
                </div>
                {primaryServing.doctor?.specialty && (
                  <div className="text-sm sm:text-base text-emerald-400 font-medium mt-0.5">
                    {primaryServing.doctor.specialty}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* RIGHT SECTION (4 COLS): UP NEXT IN LINE (Simple, Clean, No Multiple Boxes) */}
          {/* ===================================================================== */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2 text-slate-200 font-bold text-sm tracking-wider uppercase">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>Next In Line</span>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  Please Prepare
                </span>
              </div>

              {/* Clean List of 4 Upcoming Tokens (Single Clean Column) */}
              <div className="space-y-3 mt-4">
                {data.nextWaiting.slice(0, 4).map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-950/60 border border-slate-800/70 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">
                          Pos #{idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-300">
                          {item.doctor?.roomNumber || `Cabin ${(idx % 4) + 1}`}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 truncate max-w-[150px]">
                        {item.doctor?.displayName ? item.doctor.displayName.split(',')[0] : 'Consultant'}
                      </div>
                    </div>

                    <div className="text-3xl sm:text-4xl font-black font-mono text-sky-400">
                      {item.token}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calm Footer Tip */}
            <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400 font-medium">
              Chime will announce when your token is called
            </div>
          </div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. CLEAN BOTTOM NOTICE (MINIMALIST SINGLE-LINE BANNER) */}
      {/* ========================================================================= */}
      <footer className="relative z-10 pt-3 shrink-0 w-full max-w-[1700px] mx-auto border-t border-slate-800/60">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center gap-2 truncate">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">
              Welcome to {data.clinic?.name || 'Caremax OPD'} • Please proceed to your designated cabin when called • Queueless Healthcare OS
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-500 font-mono text-[11px] shrink-0">
            <span>Standard OPD Hours: 08:30 AM – 08:30 PM</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
