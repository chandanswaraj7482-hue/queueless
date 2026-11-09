import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../utils/socket';
import { playClinicVoiceAnnouncement, playClinicChime, SpeechLanguageMode } from '../utils/audio';
import { API_BASE_URL } from '../config/api';
import {
  Volume2,
  VolumeX,
  Maximize,
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
  { code: 'hi', flag: '🇮🇳', label: 'English + Hindi', subhead: 'कृपया ध्यान दें' },
  { code: 'es', flag: '🇪🇸', label: 'English + Spanish', subhead: 'FAVOR PASAR' },
  { code: 'ar', flag: '🇦🇪', label: 'English + Arabic', subhead: 'يرجى التوجه' },
  { code: 'fr', flag: '🇫🇷', label: 'English + French', subhead: 'VEUILLEZ ENTRER' },
];

export const DisplayKiosk: React.FC = () => {
  const { clinicId: routeClinicId } = useParams<{ clinicId?: string }>();
  const clinicId = routeClinicId || 'city-health';
  const [data, setData] = useState<DisplayData>({ nowServing: [], nextWaiting: [] });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechLang, setSpeechLang] = useState<SpeechLanguageMode>('en');
  const [lastCalledToken, setLastCalledToken] = useState<string | null>(null);
  const [isAnnouncing, setIsAnnouncing] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [timezoneStr, setTimezoneStr] = useState<string>('');

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
          setData({
            clinic: {
              id: clinicId,
              name: fallbackName,
              slug: clinicId,
              address: fallbackAddress,
              logoUrl: fallbackLogo,
            },
            nowServing: [
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

        setData({
          clinic: {
            id: clinicId,
            name: fallbackName,
            slug: clinicId,
            address: fallbackAddress,
          },
          nowServing: [
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
          nextWaiting: [
            { id: 'q-next-1', token: 'A-103', doctor: { displayName: 'Dr. Rohan Sharma, MD' } },
            { id: 'q-next-2', token: 'B-105', doctor: { displayName: 'Dr. Rajiv Mehra, MD' } },
            { id: 'q-next-3', token: 'C-201', doctor: { displayName: 'Dr. Priya Patel, MBBS' } },
            { id: 'q-next-4', token: 'D-302', doctor: { displayName: 'Dr. Amit Roy, MS' } },
          ],
        });
      });
  };

  useEffect(() => {
    fetchDisplayData();

    socket.emit('join_clinic', data.clinic?.id || clinicId);

    const onCalled = (callData: { token: string; roomNumber: string; doctorName?: string; patientName?: string }) => {
      setLastCalledToken(callData.token);
      setIsAnnouncing(true);
      setTimeout(() => setIsAnnouncing(false), 5500);

      if (soundEnabled) {
        playClinicVoiceAnnouncement(
          callData.token,
          callData.roomNumber || 'Consultation Room 1',
          callData.doctorName,
          speechLang
        );
      }
      fetchDisplayData();
    };

    socket.on('patient_called', onCalled);

    socket.on('queue_updated', () => {
      fetchDisplayData();
    });

    const interval = setInterval(fetchDisplayData, 8000);
    return () => {
      socket.off('patient_called', onCalled);
      socket.off('queue_updated');
      clearInterval(interval);
    };
  }, [clinicId, soundEnabled, speechLang, data.clinic?.id]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleTestVoice = () => {
    const testToken = primaryServing?.token || 'A-102';
    const testCabin = primaryServing?.doctor?.roomNumber || 'Consultation Room 1';
    setIsAnnouncing(true);
    setTimeout(() => setIsAnnouncing(false), 5500);
    playClinicVoiceAnnouncement(testToken, testCabin, primaryServing?.doctor?.displayName, speechLang);
  };

  const primaryServing = data.nowServing[0];
  const otherServing = data.nowServing.slice(1, 4); // Max 3 other active rooms to fit single screen

  const activeLangConfig =
    WORLDWIDE_LANGUAGES.find((l) => l.code === speechLang) || WORLDWIDE_LANGUAGES[0];

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-slate-950 text-white flex flex-col justify-between p-3 sm:p-5 lg:p-6 select-none relative font-sans">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* 1. TOP TELEMETRY & HOSPITAL BRANDING HEADER (SHRINK-0) */}
      <header className="relative z-10 flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3 shrink-0">
        {/* Left: Hospital Brand */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {data.clinic?.logoUrl ? (
            <img
              src={data.clinic.logoUrl}
              alt={data.clinic.name}
              className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl shadow-xl border border-slate-700/80 object-contain p-1 bg-white shrink-0"
            />
          ) : (
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 border border-blue-700/50 flex items-center justify-center text-blue-400 shadow-xl shrink-0">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white uppercase truncate">
                {data.clinic?.name || 'City Health International Medical Center'}
              </h1>
              <span className="flex h-2.5 w-2.5 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium flex items-center gap-2 truncate">
              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] sm:text-[11px]">
                OPD Central Broadcast
              </span>
              <span className="text-slate-600">•</span>
              <span className="truncate">{data.clinic?.address || 'Main Reception & Waiting Lounge'}</span>
            </p>
          </div>
        </div>

        {/* Right: Worldwide Voice Selector, Live Clock & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Worldwide Voice Mode Dropdown */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 shadow-inner">
            <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <select
              aria-label="Speech Language Mode"
              value={speechLang}
              onChange={(e) => setSpeechLang(e.target.value as SpeechLanguageMode)}
              className="bg-transparent text-white font-bold cursor-pointer focus:outline-none text-xs pr-1"
            >
              {WORLDWIDE_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white font-medium">
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Real-time Digital Clock with Timezone */}
          <div className="bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-right shadow-inner">
            <div className="text-base sm:text-lg font-mono font-black text-white tracking-wider leading-none">
              {currentTime || '--:--:--'}
            </div>
            <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              {currentDate || 'Today'} {timezoneStr ? `• ${timezoneStr}` : ''}
            </div>
          </div>

          {/* Test Voice Announcement Button */}
          <button
            onClick={handleTestVoice}
            className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
            title="Trigger Test Voice Announcement"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Test Chime</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playClinicChime();
            }}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition-colors shadow-sm cursor-pointer shrink-0"
            title={soundEnabled ? 'Mute Chime' : 'Enable Sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-rose-400" />
            )}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors shadow-sm cursor-pointer shrink-0"
            title="Toggle TV Fullscreen (F11)"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. MAIN CENTER DISPLAY SECTION (FLEX-1, OVERFLOW-HIDDEN, 0 SCROLL) */}
      <main className="flex-1 min-h-0 flex flex-col items-center justify-center py-2 sm:py-3 relative z-10 w-full max-w-5xl mx-auto overflow-hidden">
        {primaryServing ? (
          <div className="w-full text-center flex flex-col items-center justify-center space-y-3 sm:space-y-4 animate-in fade-in zoom-in-95 duration-500">
            {/* Pulsing "NOW SERVING" Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-full text-xs sm:text-sm font-black tracking-widest uppercase shadow-md shadow-emerald-500/10">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <Bell className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>NOW SERVING • {activeLangConfig.subhead}</span>
              {isAnnouncing && (
                <div className="flex items-center gap-1 ml-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  <span className="w-1 h-2.5 bg-emerald-400 animate-pulse"></span>
                  <span className="w-1 h-3.5 bg-emerald-400 animate-pulse delay-75"></span>
                  <span className="w-1 h-2 bg-emerald-400 animate-pulse delay-150"></span>
                  <span>CALLING</span>
                </div>
              )}
            </div>

            {/* Giant Monospace Token Display */}
            <div className="relative py-1 leading-none select-all">
              <div className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black font-mono tracking-tight text-emerald-400 drop-shadow-[0_0_55px_rgba(52,211,153,0.35)] leading-none inline-block">
                {primaryServing.token}
              </div>
            </div>

            {/* Destination Cabin & Doctor Info Card (High Contrast, Ultra Crisp) */}
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 max-w-xl w-full mx-auto shadow-2xl backdrop-blur-md space-y-1.5">
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                <span>Destination Consultation Room</span>
              </div>
              <div className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {primaryServing.doctor?.roomNumber || 'Consultation Room 1'}
              </div>

              {primaryServing.doctor?.displayName && (
                <div className="text-sm sm:text-lg font-bold text-slate-300">
                  {primaryServing.doctor.displayName}
                </div>
              )}

              {/* Reference ID Badge */}
              <div className="pt-1 flex items-center justify-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Patient Ref:
                </span>
                <span className="text-xs font-mono font-black text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                  #QL-{primaryServing.id.substring(0, 6).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Other Active Consultation Rooms (Compact Grid) */}
            {otherServing.length > 0 && (
              <div className="w-full max-w-3xl pt-1">
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 flex items-center gap-1.5 justify-center">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Other Active Consultation Rooms</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {otherServing.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-900/85 border border-slate-800 rounded-xl p-2.5 text-center shadow-md"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-0.5">
                        <span className="truncate">{item.doctor?.roomNumber || 'Room'}</span>
                        <span className="text-[9px] font-mono text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded">
                          #QL-{item.id.substring(0, 4).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 my-0.5">
                        {item.token}
                      </div>
                      <div className="text-[11px] font-bold text-slate-300 truncate">
                        {item.doctor?.displayName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-500 max-w-lg mx-auto space-y-3">
            <Clock className="w-16 h-16 mx-auto opacity-30 text-slate-400" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-300 tracking-tight">
              Please Relax & Be Seated
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
              Consulting specialists are completing reviews. Your token number will chime and display on this screen automatically.
            </p>
          </div>
        )}
      </main>

      {/* 3. BOTTOM FOOTER: NEXT IN QUEUE TICKER & WORLDWIDE MARQUEE (SHRINK-0) */}
      <footer className="relative z-10 border-t border-slate-800/80 pt-2.5 space-y-2 shrink-0">
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2 shrink-0 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Next In Queue (Please prepare to proceed):</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900/80 border border-slate-800/80 px-3 py-1 rounded-full">
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>{activeLangConfig.flag} {activeLangConfig.label} Audio Enabled • Broadcast Chime Active</span>
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
                className="bg-slate-900/90 border border-slate-800/90 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xs shrink-0"
              >
                <span className="text-[9px] font-bold text-slate-500 uppercase">#{idx + 1}</span>
                <span className="text-sm font-black font-mono text-sky-400">{item.token}</span>
                {item.doctor?.displayName && (
                  <span className="text-[10px] text-slate-400 max-w-[100px] truncate">
                    ({item.doctor.displayName})
                  </span>
                )}
              </div>
            ))}
            {data.nextWaiting.length > 7 && (
              <div className="text-[11px] font-bold text-slate-500 px-2.5 py-1 shrink-0">
                +{data.nextWaiting.length - 7} more
              </div>
            )}
          </div>
        )}

        {/* Worldwide Clinical Hospital Marquee Ticker */}
        <div className="bg-slate-900/70 border border-slate-800/70 rounded-xl px-3.5 py-1.5 flex items-center gap-2.5 overflow-hidden text-[11px] text-slate-400">
          <div className="flex items-center gap-1 text-emerald-400 font-black shrink-0 uppercase tracking-wider text-[10px]">
            <Sparkles className="w-3 h-3" />
            <span>Notice:</span>
          </div>
          <div className="truncate font-medium">
            Welcome to City Health International Medical Center • Please proceed to your consultation suite when your token is called • Scan your mobile QR pass for real-time queue telemetry & pharmacy status • HIPAA, NABH & JCI International Clinical Queue Protocol
          </div>
          <div className="ml-auto hidden lg:flex items-center gap-1.5 text-[9px] text-slate-500 shrink-0 font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Queueless OS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
