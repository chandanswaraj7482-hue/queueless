import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Stethoscope,
  Users,
  Bell,
  Sparkles,
  CheckCheck,
  AlertTriangle,
  User,
  Coffee,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { socket } from '../utils/socket';
import { playClinicChime } from '../utils/audio';

export interface IntercomMessage {
  id: string;
  clinicSlug: string;
  fromRole: 'RECEPTION' | 'DOCTOR' | 'PATIENT';
  fromName: string;
  toTarget: string; // 'ALL' | doctorId | 'RECEPTION' | token
  doctorCabin?: string;
  token?: string;
  patientName?: string;
  text: string;
  timestamp: string;
}

interface ClinicalIntercomProps {
  clinicSlug: string;
  clinicId?: string;
  currentRole: 'RECEPTION' | 'DOCTOR' | 'PATIENT';
  doctorInfo?: { id: string; name: string; cabinName?: string };
  patientInfo?: { token: string; patientName: string; publicToken?: string };
  doctorsList?: Array<{ id: string; name: string; roomNumber?: string }>;
}

export const ClinicalIntercomChatbot: React.FC<ClinicalIntercomProps> = ({
  clinicSlug,
  clinicId = clinicSlug,
  currentRole,
  doctorInfo,
  patientInfo,
  doctorsList = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'DOCTORS' | 'PATIENTS'>(
    currentRole === 'DOCTOR' ? 'DOCTORS' : 'DOCTORS'
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('ALL');
  const [replyingToToken, setReplyingToToken] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  const storageKey = `queueless_intercom_${clinicSlug}`;
  const [messages, setMessages] = useState<IntercomMessage[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // BroadcastChannel for 0ms cross-tab local real-time sync (even if backend is sleeping)
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      broadcastChannelRef.current = new BroadcastChannel(`queueless_intercom_${clinicSlug}`);
      broadcastChannelRef.current.onmessage = (event) => {
        if (event.data && event.data.type === 'NEW_INTERCOM_MSG') {
          handleIncomingMessage(event.data.message, false);
        }
      };
    }

    return () => {
      broadcastChannelRef.current?.close();
    };
  }, [clinicSlug]);

  // Connect to Socket.io room
  useEffect(() => {
    socket.emit('join_clinic', clinicId);

    const onSocketMessage = (msg: IntercomMessage) => {
      if (msg && msg.clinicSlug === clinicSlug) {
        handleIncomingMessage(msg, true);
      }
    };

    socket.on('intercom_message', onSocketMessage);

    return () => {
      socket.off('intercom_message', onSocketMessage);
    };
  }, [clinicId, clinicSlug]);

  const handleIncomingMessage = (newMsg: IntercomMessage, fromSocket = false) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === newMsg.id)) return prev;
      const updated = [...prev, newMsg];
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated.slice(-100)));
      } catch {}
      return updated;
    });

    // Sound chime if message is for this user and chatbot is minimized
    const isForMe =
      (currentRole === 'DOCTOR' && (newMsg.toTarget === 'ALL' || newMsg.toTarget === doctorInfo?.id)) ||
      (currentRole === 'RECEPTION' && (newMsg.toTarget === 'RECEPTION' || newMsg.toTarget === 'ALL')) ||
      (currentRole === 'PATIENT' && (newMsg.toTarget === patientInfo?.token || newMsg.toTarget === 'ALL'));

    if (isForMe && newMsg.fromRole !== currentRole) {
      playClinicChime();
      if (!isOpen) {
        setUnreadCount((c) => c + 1);
      }
    }

    // Also broadcast locally across browser tabs
    if (fromSocket && broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({ type: 'NEW_INTERCOM_MSG', message: newMsg });
      } catch {}
    }
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const sendMessage = (textToSend?: string, overrideTarget?: string, overrideToken?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content) return;

    let target = overrideTarget || 'ALL';
    let token = overrideToken;

    if (currentRole === 'DOCTOR') {
      target = 'RECEPTION';
    } else if (currentRole === 'PATIENT') {
      target = 'RECEPTION';
      token = patientInfo?.token;
    } else if (currentRole === 'RECEPTION') {
      if (activeTab === 'DOCTORS') {
        target = selectedDoctorId;
      } else {
        target = replyingToToken || 'ALL';
        token = replyingToToken || undefined;
      }
    }

    const newMsg: IntercomMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      clinicSlug,
      fromRole: currentRole,
      fromName:
        currentRole === 'DOCTOR'
          ? doctorInfo?.name || 'Doctor'
          : currentRole === 'RECEPTION'
          ? 'Reception Desk'
          : patientInfo?.patientName
          ? `${patientInfo.patientName} (${patientInfo.token})`
          : 'Patient',
      toTarget: target,
      doctorCabin: currentRole === 'DOCTOR' ? doctorInfo?.cabinName || 'Cabin 1' : undefined,
      token,
      patientName: patientInfo?.patientName,
      text: content,
      timestamp: new Date().toISOString(),
    };

    // Update state & localStorage
    setMessages((prev) => {
      const updated = [...prev, newMsg];
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated.slice(-100)));
      } catch {}
      return updated;
    });

    // Send through WebSocket
    socket.emit('send_intercom_message', {
      ...newMsg,
      clinicId,
    });

    // Send through local BroadcastChannel
    try {
      broadcastChannelRef.current?.postMessage({
        type: 'NEW_INTERCOM_MSG',
        message: newMsg,
      });
    } catch {}

    setInputText('');
  };

  // Filter messages based on active context
  const filteredMessages = messages.filter((m) => {
    if (currentRole === 'PATIENT') {
      // Patient sees broadcast messages and messages sent by/to their token
      return (
        m.fromRole === 'PATIENT' && m.token === patientInfo?.token ||
        m.fromRole === 'RECEPTION' && (m.toTarget === patientInfo?.token || m.toTarget === 'ALL')
      );
    }

    if (currentRole === 'DOCTOR') {
      // Doctor sees broadcast messages and messages between Reception & their Cabin
      return (
        m.fromRole === 'DOCTOR' && m.fromName === doctorInfo?.name ||
        m.toTarget === 'ALL' ||
        m.toTarget === doctorInfo?.id ||
        (m.fromRole === 'RECEPTION' && (m.toTarget === 'ALL' || m.toTarget === doctorInfo?.id))
      );
    }

    // Role is RECEPTION
    if (activeTab === 'DOCTORS') {
      return (
        m.fromRole === 'DOCTOR' ||
        (m.fromRole === 'RECEPTION' && m.toTarget !== patientInfo?.token && !m.token)
      );
    } else {
      // PATIENTS TAB
      return (
        m.fromRole === 'PATIENT' ||
        (m.fromRole === 'RECEPTION' && (m.token || m.toTarget.startsWith('TOKEN_') || m.toTarget === replyingToToken))
      );
    }
  });

  // Doctor Preset Quick Actions
  const doctorPresets = [
    { label: '☕ 10-Min Break', text: 'Doctor taking a 10-minute tea break. Please hold calling next.' },
    { label: '🚨 Emergency Next', text: 'Urgent: Please send emergency patient into cabin immediately.' },
    { label: '👩‍⚕️ Nurse Needed', text: 'Need a nursing attendant inside consultation cabin right now.' },
    { label: '💳 Collect Lab Fee', text: 'Please collect lab / diagnostic fee from previous patient at desk.' },
    { label: '⏩ Send Next Patient', text: 'Cabin is clear. Please admit next queued token.' },
  ];

  // Reception Preset Quick Actions for Doctors
  const receptionDoctorPresets = [
    { label: '🚨 VIP Patient', text: 'VIP / Post-op patient has arrived for consultation.' },
    { label: '⏳ 25+ Waiting', text: 'OPD queue is currently busy (25+ waiting in lobby).' },
    { label: '♿ Wheelchair Help', text: 'Patient needs wheelchair assistance for cabin entry.' },
    { label: '🧪 Reports In Cabin', text: 'Blood & pathology investigation reports sent to cabin.' },
  ];

  // Reception Preset Quick Actions for Patients
  const receptionPatientPresets = [
    { label: '📍 Cabin 1 Location', text: 'Cabin 1 is located on Ground Floor, straight down the hallway (Room 102).' },
    { label: '⏱️ ~10 Mins Wait', text: 'Doctor is with current patient. Your turn is expected in approximately 10 minutes.' },
    { label: '🚗 Wait in Cafe/Car', text: 'You may wait in cafeteria or car. Our loud TV chime and phone pass will alert you!' },
    { label: '💳 UPI / Cash', text: 'You can pay cash or scan UPI directly at our counter 1.' },
  ];

  // Patient Preset Questions
  const patientPresets = [
    { label: '📍 Where is my doctor cabin?', text: 'Where is my consulting doctor cabin located?' },
    { label: '⏱️ How much longer?', text: 'Could you give an estimated wait time for my token?' },
    { label: '☕ Can I wait in cafeteria?', text: 'Can I wait in the hospital cafeteria or car for 15 mins?' },
    { label: '♿ Need Wheelchair', text: 'I need wheelchair assistance to reach the doctor cabin.' },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-[9999] font-sans antialiased">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-full shadow-2xl shadow-blue-500/40 border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Open Clinical Intercom & Live Desk"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border border-white"></span>
            </span>
          </div>

          <div className="text-left pr-1 hidden sm:block">
            <span className="block text-xs font-black tracking-tight leading-tight">
              {currentRole === 'RECEPTION'
                ? 'Clinical Intercom'
                : currentRole === 'DOCTOR'
                ? 'Reception Intercom'
                : 'Ask Reception Desk'}
            </span>
            <span className="block text-[9px] text-blue-100 font-bold uppercase tracking-wider -mt-0.5">
              Real-time Desk
            </span>
          </div>

          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full shadow-md animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Expanded Chat Drawer / Widget */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[560px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center shrink-0">
                {currentRole === 'DOCTOR' ? (
                  <Stethoscope className="w-4 h-4" />
                ) : currentRole === 'RECEPTION' ? (
                  <Users className="w-4 h-4" />
                ) : (
                  <MessageCircle className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black tracking-tight text-white">
                    {currentRole === 'RECEPTION'
                      ? 'Hospital Clinical Intercom'
                      : currentRole === 'DOCTOR'
                      ? `${doctorInfo?.cabinName || 'Doctor Cabin'} ⇄ Reception`
                      : 'Live Reception Desk'}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-slate-300">
                  {currentRole === 'RECEPTION'
                    ? 'Silent 2-way doctor calling & patient helpdesk'
                    : currentRole === 'DOCTOR'
                    ? '1-tap doctor dispatch to front reception'
                    : 'Instant response from on-duty receptionist'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reception Multi-Channel Tabs */}
          {currentRole === 'RECEPTION' && (
            <div className="p-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('DOCTORS')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'DOCTORS'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Doctor Cabins</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('PATIENTS')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'PATIENTS'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Patient Inquiries</span>
              </button>
            </div>
          )}

          {/* Sub-Channel Doctor Selector (For Reception) */}
          {currentRole === 'RECEPTION' && activeTab === 'DOCTORS' && (
            <div className="px-3 py-1.5 bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] shrink-0">
              <span className="font-bold text-slate-500 dark:text-slate-400">Target Cabin:</span>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-0.5 text-slate-800 dark:text-slate-200 font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL">📢 All Doctor Cabins (Broadcast)</option>
                {doctorsList.length > 0 ? (
                  doctorsList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.roomNumber || 'Cabin'}: {d.name}
                    </option>
                  ))
                ) : (
                  <option value="cabin-1">Cabin 1 (Consulting Doctor)</option>
                )}
              </select>
            </div>
          )}

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/50">
            {filteredMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-slate-400">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Zero Noise • Real-time Channel Open
                </span>
                <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                  Send silent instant messages or click preset buttons below. No loud intercom rings or corridor shouting.
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isMine = msg.fromRole === currentRole;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} space-y-1 animate-in fade-in duration-150`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1 font-semibold">
                      <span>{msg.fromName}</span>
                      {msg.doctorCabin && (
                        <span className="bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 px-1.5 py-0.2 rounded-md font-bold">
                          {msg.doctorCabin}
                        </span>
                      )}
                      {msg.token && (
                        <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded-md font-mono font-bold">
                          Token {msg.token}
                        </span>
                      )}
                      <span>•</span>
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-xs ${
                        isMine
                          ? 'bg-blue-600 text-white rounded-tr-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-xs'
                      }`}
                    >
                      <p className="break-words font-medium">{msg.text}</p>
                    </div>

                    {/* Quick Reply Trigger for Reception replying to a patient */}
                    {currentRole === 'RECEPTION' && msg.fromRole === 'PATIENT' && msg.token && (
                      <button
                        onClick={() => setReplyingToToken(msg.token || null)}
                        className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline px-1 cursor-pointer"
                      >
                        ↳ Reply to Token {msg.token}
                      </button>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick 1-Tap Presets Carousel */}
          <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 shrink-0">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5 px-1">
              ⚡ 1-Tap Quick Presets:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(currentRole === 'DOCTOR'
                ? doctorPresets
                : currentRole === 'RECEPTION' && activeTab === 'DOCTORS'
                ? receptionDoctorPresets
                : currentRole === 'RECEPTION' && activeTab === 'PATIENTS'
                ? receptionPatientPresets
                : patientPresets
              ).map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendMessage(preset.text)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 text-[11px] font-bold border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
          >
            {replyingToToken && (
              <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-lg text-[10px] font-bold shrink-0 border border-emerald-200 dark:border-emerald-800">
                <span>To: Token {replyingToToken}</span>
                <button
                  type="button"
                  onClick={() => setReplyingToToken(null)}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                currentRole === 'DOCTOR'
                  ? 'Message Reception Desk...'
                  : currentRole === 'RECEPTION'
                  ? activeTab === 'DOCTORS'
                    ? 'Message doctor cabin...'
                    : 'Reply to patient query...'
                  : 'Type question for reception...'
              }
              className="flex-1 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition-all shadow-md shadow-blue-500/25 cursor-pointer shrink-0 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
