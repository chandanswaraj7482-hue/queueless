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
  Stethoscope,
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

  const [selectedHeroCabin, setSelectedHeroCabin] = useState<string | null>(null);

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
    setTimeout(() => setIsAnnouncing(false), 14000); // 14 seconds for 2 voice announcement rounds

    if (soundEnabledRef.current) {
      playClinicVoiceAnnouncement(
        token,
        cabin || 'Cabin 1',
        doctorName,
        speechLangRef.current,
        2
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

          // Automatic Call Announcement and Cabin Switching
          if (topCalled && topCalled.token) {
            const calledCabin = topCalled.doctor?.roomNumber || 'Cabin 1';
            if (initialLoadDoneRef.current && topCalled.token !== lastAnnouncedTokenRef.current) {
              lastAnnouncedTokenRef.current = topCalled.token;
              setSelectedHeroCabin(calledCabin);
              triggerCallAnnouncement(
                topCalled.token,
                calledCabin,
                topCalled.doctor?.displayName
              );
            } else if (!initialLoadDoneRef.current) {
              lastAnnouncedTokenRef.current = topCalled.token;
              setSelectedHeroCabin(calledCabin);
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
      setSelectedHeroCabin(callData.roomNumber);
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

  const defaultCabins = [
    {
      id: 'cabin-1',
      cabinNumber: 'Cabin 1',
      displayName: 'Dr. Rohan Sharma, MD',
      specialty: 'Orthopedics & Joint Care',
      defaultToken: 'A-101',
    },
    {
      id: 'cabin-2',
      cabinNumber: 'Cabin 2',
      displayName: 'Dr. Rajiv Mehra, MD',
      specialty: 'Cardiology',
      defaultToken: 'B-104',
    },
    {
      id: 'cabin-3',
      cabinNumber: 'Cabin 3',
      displayName: 'Dr. Priya Patel, MBBS',
      specialty: 'Pediatrics',
      defaultToken: 'C-201',
    },
    {
      id: 'cabin-4',
      cabinNumber: 'Cabin 4',
      displayName: 'Dr. Amit Roy, MS',
      specialty: 'General Medicine',
      defaultToken: 'D-302',
    },
  ];

  const activeCabinsList = defaultCabins.map((cab, idx) => {
    const clinicDoc = data.clinic?.doctors?.find((d) => {
      const rn = (d.roomNumber || '').toLowerCase();
      const cn = cab.cabinNumber.toLowerCase();
      return rn === cn || rn.includes(String(idx + 1));
    });

    const matchingServing = data.nowServing.find((item) => {
      const rn = (item.doctor?.roomNumber || '').toLowerCase();
      const cn = cab.cabinNumber.toLowerCase();
      return (
        rn === cn ||
        rn.includes(String(idx + 1)) ||
        (item.doctor?.displayName && item.doctor.displayName.includes(cab.displayName.split(' ')[1]))
      );
    });

    const token = matchingServing?.token || cab.defaultToken;
    const isCalling = selectedHeroCabin
      ? selectedHeroCabin.toLowerCase() === cab.cabinNumber.toLowerCase()
      : matchingServing?.status === 'CALLED' || idx === 0;
    const doctorName = clinicDoc?.displayName || matchingServing?.doctor?.displayName || cab.displayName;
    const specialty = clinicDoc?.specialty || matchingServing?.doctor?.specialty || cab.specialty;

    return {
      id: cab.id,
      cabinNumber: cab.cabinNumber,
      token,
      doctorName,
      specialty,
      status: isCalling ? ('CALLING' as const) : ('READY' as const),
      patientName: matchingServing?.patient?.name,
    };
  });

  const heroCabin =
    activeCabinsList.find((c) => selectedHeroCabin && c.cabinNumber.toLowerCase() === selectedHeroCabin.toLowerCase()) ||
    activeCabinsList.find((c) => c.status === 'CALLING') ||
    activeCabinsList[0];

  const handleTestVoice = (targetCabinNumber?: string) => {
    const target = targetCabinNumber
      ? activeCabinsList.find((c) => c.cabinNumber === targetCabinNumber)
      : heroCabin;
    const testToken = target?.token || 'B-104';
    const testCabin = target?.cabinNumber || 'Cabin 2';
    setSelectedHeroCabin(testCabin);
    triggerCallAnnouncement(testToken, testCabin, target?.doctorName);
  };

  const primaryServing = {
    token: heroCabin.token,
    doctor: {
      roomNumber: heroCabin.cabinNumber,
      displayName: heroCabin.doctorName,
      specialty: heroCabin.specialty,
    },
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

          {/* Quick Cabin Test Announcements */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-xl p-1 text-[11px] font-bold">
            <span className="text-slate-400 px-2 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> Test Sound:
            </span>
            {activeCabinsList.map((c) => (
              <button
                key={c.id}
                onClick={() => handleTestVoice(c.cabinNumber)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  heroCabin.cabinNumber === c.cabinNumber
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title={`Announce ${c.cabinNumber} (${c.token}) in English + Hindi`}
              >
                {c.cabinNumber}
              </button>
            ))}
          </div>

          {/* Test Sound Button (for smaller screens) */}
          <button
            onClick={() => handleTestVoice()}
            className="xl:hidden px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Test Current Cabin Sound"
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
      {/* 2. MAIN CENTER HERO & 4-CABIN GRID (CLEAN, SPACIOUS, REAL-TIME MULTI-CABIN) */}
      {/* ========================================================================= */}
      <main className="flex-1 min-h-0 flex flex-col justify-center py-3 sm:py-5 relative z-10 w-full max-w-[1700px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 h-full items-stretch">
          
          {/* ===================================================================== */}
          {/* LEFT SECTION (7 COLS): HERO NOW CALLING (Clean, High Contrast) */}
          {/* ===================================================================== */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
            {/* Soft Green Top Stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500/80"></div>

            {/* Now Calling Status Pill */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider">
                <Bell className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span>NOW CALLING • {activeLangConfig.subhead}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 font-bold uppercase">
                Patient: Verified
              </span>
            </div>

            {/* Giant Clean Token (Uncluttered, High Contrast) */}
            <div className="my-auto text-center py-4 sm:py-8">
              <div className="text-8xl sm:text-9xl md:text-[10rem] xl:text-[11.5rem] font-black font-mono tracking-tight text-emerald-400 drop-shadow-[0_0_80px_rgba(52,211,153,0.3)] leading-none select-all transition-transform hover:scale-102">
                {primaryServing.token}
              </div>
            </div>

            {/* Destination Suite & Doctor (Generous Padding, Clear Typography) */}
            <div className="pt-5 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
                  Please Proceed To
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                  <span>{primaryServing.doctor.roomNumber}</span>
                  <span className="text-xs font-bold uppercase px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full">
                    Door Open
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg sm:text-2xl font-bold text-white">
                  {primaryServing.doctor.displayName}
                </div>
                {primaryServing.doctor.specialty && (
                  <div className="text-sm sm:text-base text-emerald-400 font-medium mt-0.5">
                    {primaryServing.doctor.specialty}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* RIGHT SECTION (5 COLS): 4-CABIN GRID + UP NEXT QUEUE */}
          {/* ===================================================================== */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4 h-full">
            
            {/* 1. OPD CONSULTATION CABINS (Live 4-Cabin Grid) */}
            <div className="flex-1 min-h-0 bg-slate-900/50 border border-slate-800/80 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/70">
                <div className="flex items-center gap-2 text-slate-200 font-bold text-xs sm:text-sm tracking-wider uppercase">
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  <span>OPD Consultation Cabins</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full">
                  Live 4-Cabin Grid
                </span>
              </div>

              {/* 2x2 Grid of Cabins */}
              <div className="grid grid-cols-2 gap-3 my-auto py-2">
                {activeCabinsList.map((c) => {
                  const isCurrentHero = heroCabin.cabinNumber === c.cabinNumber;
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleTestVoice(c.cabinNumber)}
                      className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                        isCurrentHero
                          ? 'bg-emerald-950/40 border-emerald-500/80 shadow-[0_0_25px_rgba(16,185,129,0.18)] scale-102 ring-1 ring-emerald-500/40'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                      title={`Click to switch & announce ${c.cabinNumber}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                          {c.cabinNumber}
                        </span>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isCurrentHero
                              ? 'bg-emerald-500 text-slate-950 animate-pulse font-black'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {isCurrentHero && <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>}
                          {isCurrentHero ? 'Calling' : 'Active'}
                        </span>
                      </div>

                      <div className="my-1.5 text-2xl sm:text-3xl font-black font-mono text-emerald-400 tracking-tight leading-none">
                        {c.token}
                      </div>

                      <div className="text-xs font-bold text-white truncate">
                        {c.doctorName.split(',')[0]}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                        {c.specialty}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-sky-400" /> Click any cabin to speak & view
                </span>
                <span className="text-emerald-400 font-bold">Bilingual Voice ON</span>
              </div>
            </div>

            {/* 2. UPCOMING PATIENTS (NEXT IN LINE) */}
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/70">
                <div className="flex items-center gap-2 text-slate-200 font-bold text-xs sm:text-sm tracking-wider uppercase">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>Upcoming Patients (Next In Line)</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Please Prepare
                </span>
              </div>

              {/* 4 Cards in clean 4-column horizontal grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
                {data.nextWaiting.slice(0, 4).map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-slate-950/60 border border-slate-800/70 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-500 uppercase">#{idx + 1}</span>
                      <span className="font-bold text-slate-300">
                        {item.doctor?.roomNumber || `Cabin ${(idx % 4) + 1}`}
                      </span>
                    </div>

                    <div className="my-1 text-xl sm:text-2xl font-black font-mono text-sky-400 leading-tight">
                      {item.token}
                    </div>

                    <div className="text-[10px] text-slate-400 truncate">
                      {item.doctor?.displayName ? item.doctor.displayName.split(',')[0] : 'Consultant'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/70 text-center text-[11px] text-slate-400 font-medium">
                Tokens called in sequence with chime • Estimated wait: ~4-8 mins
              </div>
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
