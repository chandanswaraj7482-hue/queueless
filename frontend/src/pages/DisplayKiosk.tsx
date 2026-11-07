import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../utils/socket';
import { playClinicVoiceAnnouncement, playClinicChime } from '../utils/audio';
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
  HeartPulse,
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

export const DisplayKiosk: React.FC = () => {
  const { clinicId: routeClinicId } = useParams<{ clinicId?: string }>();
  const clinicId = routeClinicId || 'city-health';
  const [data, setData] = useState<DisplayData>({ nowServing: [], nextWaiting: [] });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bilingualVoice, setBilingualVoice] = useState(true);
  const [lastCalledToken, setLastCalledToken] = useState<string | null>(null);
  const [isAnnouncing, setIsAnnouncing] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  // Live ticking clock
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
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDisplayData = () => {
    fetch(`${API_BASE_URL}/api/v1/queue/clinics/${clinicId}/display`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData.data);
        }
      })
      .catch((err) => console.error(err));
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
          callData.roomNumber || 'Cabin 1',
          callData.doctorName,
          bilingualVoice
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
  }, [clinicId, soundEnabled, bilingualVoice, data.clinic?.id]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleTestVoice = () => {
    const testToken = primaryServing?.token || 'A-108';
    const testCabin = primaryServing?.doctor?.roomNumber || 'Cabin 1';
    setIsAnnouncing(true);
    setTimeout(() => setIsAnnouncing(false), 5500);
    playClinicVoiceAnnouncement(testToken, testCabin, primaryServing?.doctor?.displayName, bilingualVoice);
  };

  const primaryServing = data.nowServing[0];
  const otherServing = data.nowServing.slice(1);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 lg:p-10 select-none overflow-x-hidden relative font-sans">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Telemetry & Hospital Branding Header */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-4">
          {data.clinic?.logoUrl ? (
            <img
              src={data.clinic.logoUrl}
              alt={data.clinic.name}
              className="w-14 h-14 rounded-2xl shadow-xl border border-slate-700/80 object-contain p-1.5 bg-white shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 border border-blue-700/50 flex items-center justify-center text-blue-400 shadow-xl shrink-0">
              <Building2 className="w-8 h-8" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white uppercase flex items-center gap-2.5">
                <span>{data.clinic?.name || 'City Health Multispecialty'}</span>
              </h1>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5 flex items-center gap-2">
              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">OPD Central Broadcast</span>
              <span className="text-slate-600">•</span>
              <span>{data.clinic?.address || 'Main Reception & Waiting Lounge'}</span>
            </p>
          </div>
        </div>

        {/* Live Clock & Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Real-time Digital Clock */}
          <div className="bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-2xl text-right shadow-inner">
            <div className="text-lg sm:text-xl font-mono font-black text-white tracking-wider">
              {currentTime || '--:--:--'}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {currentDate || 'Today'}
            </div>
          </div>

          {/* Bilingual Voice Switch */}
          <button
            onClick={() => setBilingualVoice(!bilingualVoice)}
            className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl border text-xs font-bold transition-all ${
              bilingualVoice
                ? 'bg-blue-950/80 text-blue-300 border-blue-800'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
            title="Toggle Bilingual Hindi + English Speech"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{bilingualVoice ? '🇮🇳 Hindi + English' : '🇬🇧 English Only'}</span>
          </button>

          {/* Test Voice Announcement */}
          <button
            onClick={handleTestVoice}
            className="px-3.5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5 active:scale-95"
            title="Trigger Test Voice Announcement"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Test Voice</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playClinicChime();
            }}
            className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl text-slate-300 transition-colors shadow-sm"
            title={soundEnabled ? 'Mute Chime' : 'Enable Sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-rose-400" />
            )}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl text-slate-300 hover:text-white transition-colors shadow-sm"
            title="Toggle TV Fullscreen (F11)"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Center Display Section: Primary Serving Token */}
      <main className="my-auto py-8 sm:py-12 relative z-10 flex flex-col items-center justify-center">
        {primaryServing ? (
          <div className="w-full max-w-5xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Pulsing "NOW SERVING" Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-full text-sm sm:text-base font-black tracking-widest uppercase shadow-lg shadow-emerald-500/10">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <Bell className="w-5 h-5 text-emerald-400 animate-bounce" />
              <span>NOW SERVING • कृपया ध्यान दें</span>
              {isAnnouncing && (
                <div className="flex items-center gap-1 ml-2 text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  <span className="w-1 h-3 bg-emerald-400 animate-pulse"></span>
                  <span className="w-1 h-4 bg-emerald-400 animate-pulse delay-75"></span>
                  <span className="w-1 h-2 bg-emerald-400 animate-pulse delay-150"></span>
                  <span>CALLING</span>
                </div>
              )}
            </div>

            {/* Giant Monospace Token Display */}
            <div className="relative py-2">
              <div className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black font-mono tracking-tight text-emerald-400 drop-shadow-[0_0_60px_rgba(52,211,153,0.35)] leading-none select-all transition-all duration-300 whitespace-nowrap inline-block">
                {primaryServing.token}
              </div>
            </div>

            {/* Destination Cabin & Doctor Info */}
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl backdrop-blur-md space-y-3">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                  Destination Consultation Cabin
                </span>
              </div>
              <div className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center justify-center gap-3">
                <Stethoscope className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
                <span>{primaryServing.doctor?.roomNumber || 'Cabin 1'}</span>
              </div>

              {primaryServing.doctor?.displayName && (
                <div className="text-lg sm:text-2xl font-bold text-slate-300">
                  {primaryServing.doctor.displayName}
                </div>
              )}

              {/* Reference ID Pill */}
              <div className="pt-2 flex items-center justify-center gap-2">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Patient Token Ref:
                </span>
                <span className="text-sm font-mono font-black text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                  #QL-{primaryServing.id.substring(0, 6).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 max-w-lg mx-auto space-y-4">
            <Clock className="w-20 h-20 mx-auto opacity-30 text-slate-400" />
            <h2 className="text-3xl sm:text-4xl font-black text-slate-300 tracking-tight">
              Please Relax & Be Seated
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-medium">
              Consulting doctors are completing active reviews. Your token number will chime and display here automatically.
            </p>
          </div>
        )}

        {/* Other Active Cabins Grid (Multi-Doctor Parallel Consulting) */}
        {otherServing.length > 0 && (
          <div className="w-full max-w-5xl mt-10">
            <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3 flex items-center gap-2 justify-center">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Other Active Consultation Cabins</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {otherServing.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center shadow-lg hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
                    <span>{item.doctor?.roomNumber || 'Cabin'}</span>
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded">
                      #QL-{item.id.substring(0, 5).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-4xl sm:text-5xl font-black font-mono text-emerald-400 my-1">
                    {item.token}
                  </div>
                  <div className="text-xs font-bold text-slate-300 truncate">
                    {item.doctor?.displayName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Footer: Next In Queue Ticker & Bilingual Instructions */}
      <footer className="relative z-10 border-t border-slate-800/80 pt-5 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2 shrink-0">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Next In Queue (Please prepare to proceed):</span>
          </div>

          {/* Bilingual Live Audio Ticker */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 border border-slate-800/80 px-3.5 py-1.5 rounded-full">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dual Hindi & English Voice Enabled • 20-Sec Prior Audio Chime</span>
          </div>
        </div>

        {data.nextWaiting.length === 0 ? (
          <p className="text-xs text-slate-600">No other patients currently queued in the waiting list.</p>
        ) : (
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {data.nextWaiting.slice(0, 8).map((item, idx) => (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800/90 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-sm"
              >
                <span className="text-[10px] font-bold text-slate-500 uppercase">#{idx + 1}</span>
                <span className="text-lg font-black font-mono text-sky-400">{item.token}</span>
                {item.doctor?.displayName && (
                  <span className="text-[11px] text-slate-400 max-w-[120px] truncate">
                    ({item.doctor.displayName})
                  </span>
                )}
              </div>
            ))}
            {data.nextWaiting.length > 8 && (
              <div className="text-xs font-bold text-slate-500 px-3 py-2">
                +{data.nextWaiting.length - 8} more waiting
              </div>
            )}
          </div>
        )}

        {/* Bottom Scrolling Marquee for Clinic Announcements */}
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl px-4 py-2 flex items-center gap-3 overflow-hidden text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-black shrink-0 uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Notice:</span>
          </div>
          <div className="truncate">
            Please watch this screen for your token announcement. For tea, coffee, or prescription inquiries, please scan the QR standee on your mobile phone.
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2 text-[10px] text-slate-500 shrink-0 font-medium">
            <span>Powered by Queueless Hospital OS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
