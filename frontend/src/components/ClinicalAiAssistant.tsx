import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  X,
  Send,
  ArrowRight,
  Tv,
  QrCode,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  links?: { label: string; url: string }[];
}

const PRESET_FAQS = [
  {
    chip: '⚡ 20-Sec QR Pass',
    question: 'How does the 20-second QR check-in work?',
    answer:
      'Patients scan the vector QR pass at your entrance or reception with their smartphone camera. A live mobile token pass opens instantly in their browser with zero app download, displaying their live queue position, estimated wait time, and exact cabin directions.',
    links: [{ label: 'Try Live Simulator', url: '/#interactive-demo' }],
  },
  {
    chip: '🏥 15-Day Free Follow-Up',
    question: 'How is the 15-day free follow-up policy handled?',
    answer:
      'In Indian healthcare, revisit consultations within 15 days for the same ailment are marked as "Free Follow-Up" directly in the hospital admin & doctor console. Rebooking is automatic using the patient’s phone ref ID — eliminating counter re-queueing and billing disputes.',
    links: [{ label: 'Explore Admin Console', url: '/features' }],
  },
  {
    chip: '📺 Zero-Capex 55" TV Kiosk',
    question: 'Can we use our existing hospital TVs?',
    answer:
      'Yes, 100%! Queueless eliminates expensive proprietary hardware kiosks. Any existing Sony, Samsung, LG, or Android TV opens our web display or Android APK in under 30 seconds, broadcasting synchronized Hindi & English token chimes automatically.',
    links: [{ label: 'View Display Specs', url: '/features' }],
  },
  {
    chip: '💰 Calculate OPD Savings',
    question: 'How much revenue does Queueless recover?',
    answer:
      'Crowded waiting halls cause an average 8.5% to 14% patient walkout rate. Queueless reduces walkout attrition by up to 85% on Day 1. A typical 6-cabin clinic recovers ₹1.8L to ₹3.4L per month while eliminating kiosk AMC fees.',
    links: [{ label: 'Open ROI Calculator', url: '/roi-calculator' }],
  },
];

export const ClinicalAiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Namaste! 👋 I am your Queueless Clinical Copilot. How can I help optimize your hospital OPD or answer questions about our zero-hardware setup?',
      time: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      // Find matching preset or default
      const matchedFaq = PRESET_FAQS.find(
        (faq) =>
          query.toLowerCase().includes(faq.chip.toLowerCase().replace(/[^a-z0-9]/g, '')) ||
          faq.question.toLowerCase().includes(query.toLowerCase()) ||
          query.toLowerCase().includes(faq.question.toLowerCase().slice(0, 15))
      );

      let replyText = '';
      let replyLinks: { label: string; url: string }[] | undefined;

      if (matchedFaq) {
        replyText = matchedFaq.answer;
        replyLinks = matchedFaq.links;
      } else if (query.toLowerCase().includes('price') || query.toLowerCase().includes('cost') || query.toLowerCase().includes('plan')) {
        replyText =
          'Queueless plans start at straightforward monthly or discounted annual subscriptions with zero hardware fees. Includes doctor consoles, reception desk, TV display kiosk, and unlimited patient admissions.';
        replyLinks = [
          { label: 'View Pricing Plans', url: '/pricing' },
          { label: 'Start 14-Day Trial', url: '/signup' },
        ];
      } else if (query.toLowerCase().includes('demo') || query.toLowerCase().includes('call') || query.toLowerCase().includes('contact')) {
        replyText =
          'You can experience our live OPD simulator right on this page, or book a personalized 15-minute clinical walkthrough with our deployment team!';
        replyLinks = [
          { label: 'Try Live Simulator', url: '/#interactive-demo' },
          { label: 'Instant Onboarding', url: '/signup' },
        ];
      } else {
        replyText =
          'Thank you for asking! Queueless is an ABDM & HIPAA-certified clinical operating system that replaces reception chaos with instant vector QR check-ins, multi-screen 55" TV chimes, and 1-click doctor cabin calls.';
        replyLinks = [
          { label: 'Explore All Features', url: '/features' },
          { label: 'Calculate ROI', url: '/roi-calculator' },
        ];
      }

      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        links: replyLinks,
      };

      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="fixed bottom-5 sm:bottom-6 right-4 sm:right-6 z-50 select-none">
      {/* Expanded Interactive Chat Modal */}
      {isOpen ? (
        <div className="w-[calc(100vw-32px)] sm:w-[380px] max-w-[420px] h-[520px] max-h-[80vh] rounded-[28px] bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 ring-1 ring-slate-900/10 dark:ring-white/10">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black text-white tracking-wide">Queueless Copilot</h3>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-blue-500/25 text-blue-300 border border-blue-400/30 px-1.5 py-0.2 rounded-full">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Clinical OPD Specialist • Online
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick FAQ Suggestion Chips */}
          <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-2">
            {PRESET_FAQS.map((faq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(faq.question)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                {faq.chip}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs text-left">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-sm font-medium'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/80 dark:border-slate-800 shadow-2xs'
                  }`}
                >
                  <p className="text-[11px] sm:text-xs">{msg.text}</p>

                  {/* Optional Action Links inside AI reply */}
                  {msg.links && msg.links.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap gap-1.5">
                      {msg.links.map((link, lIdx) => (
                        <Link
                          key={lIdx}
                          to={link.url}
                          onClick={() => {
                            if (link.url.startsWith('/#')) setIsOpen(false);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold text-[10px] hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors border border-blue-200 dark:border-blue-800"
                        >
                          <span>{link.label}</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 w-fit rounded-bl-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Form */}
          <div className="p-3 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about QR passes, follow-up, TVs..."
                className="flex-1 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-sm active:scale-95"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[9px] text-slate-400 px-1">
              <span>Ayushman Bharat & HIPAA Compliant</span>
              <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                Set up OPD in 3 Mins ➔
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Collapsed Omni-Style Floating Action Button & Tooltip */
        <div className="flex items-center gap-3">
          {/* Omni-Style Speech Bubble Tooltip - Always Crisp Snow White & High Contrast */}
          {showTooltip && (
            <div
              onClick={() => setIsOpen(true)}
              className="relative cursor-pointer bg-white border border-[#FFCCD5] rounded-[22px] px-3.5 py-3 shadow-[0_12px_36px_rgba(0,0,0,0.18)] flex items-center gap-3 max-w-[310px] animate-in fade-in slide-in-from-right-3 duration-300 group hover:shadow-[0_16px_45px_rgba(0,0,0,0.25)] transition-all select-none"
            >
              {/* Outer Triangle border */}
              <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-y-[7px] border-y-transparent border-l-[9px] border-l-[#FFCCD5] pointer-events-none" />
              {/* Inner Triangle white fill */}
              <div className="absolute top-1/2 -right-[7px] -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-l-[8px] border-l-white pointer-events-none" />

              {/* Cute Omni Robot Avatar with Pastel Pink Background */}
              <div className="w-11 h-11 rounded-2xl bg-[#FFF0F3] border border-[#FFD5DC] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                <img
                  src="/omni-robot-avatar.png"
                  alt="AI Assistant"
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    // Fallback to SVG if image not available
                    (e.target as HTMLElement).style.display = 'none';
                    const parent = (e.target as HTMLElement).parentElement;
                    if (parent) {
                      const svg = parent.querySelector('svg');
                      if (svg) svg.classList.remove('hidden');
                    }
                  }}
                />
                <svg className="w-7 h-7 hidden" viewBox="0 0 36 36" fill="none">
                  <line x1="18" y1="5" x2="18" y2="9" stroke="#EAB308" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="18" cy="4" r="2.5" fill="#FACC15" />
                  <rect x="5" y="9" width="26" height="21" rx="6" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
                  <rect x="2" y="16" width="3" height="7" rx="1.5" fill="#F43F5E" />
                  <rect x="31" y="16" width="3" height="7" rx="1.5" fill="#F43F5E" />
                  <rect x="8" y="12" width="20" height="15" rx="4" fill="#0C4A6E" />
                  <circle cx="13" cy="18" r="2.5" fill="#38BDF8" />
                  <circle cx="13.8" cy="17.2" r="0.9" fill="#FFFFFF" />
                  <circle cx="23" cy="18" r="2.5" fill="#38BDF8" />
                  <circle cx="23.8" cy="17.2" r="0.9" fill="#FFFFFF" />
                  <circle cx="10" cy="22.5" r="1.6" fill="#FB7185" opacity="0.9" />
                  <circle cx="26" cy="22.5" r="1.6" fill="#FB7185" opacity="0.9" />
                  <path d="M15 22.5C16 23.5 20 23.5 21 22.5" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>

              {/* Message */}
              <div className="flex-1 min-w-0 pr-1 text-left">
                <strong className="block text-[13px] font-extrabold text-[#0F172A] leading-tight tracking-tight">
                  I'm your AI Assistant!
                </strong>
                <p className="text-[11.5px] text-[#475569] mt-0.5 leading-snug font-medium">
                  Need help finding or using tools? Ask me 👋
                </p>
              </div>

              {/* Dismiss X button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-full hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                aria-label="Dismiss tooltip"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Omni-Style Circular Floating Action Button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF2B56] via-[#FF3B5C] to-[#8B5CF6] hover:from-[#f41e4a] hover:to-[#7c3aed] text-white shadow-[0_8px_30px_rgba(255,43,86,0.55)] hover:shadow-[0_12px_40px_rgba(255,43,86,0.75)] cursor-pointer transition-all hover:scale-105 active:scale-95 border-2 border-white flex items-center justify-center shrink-0"
            aria-label="Open Queueless AI Assistant"
          >
            {/* Glowing Green Online Status Indicator */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-white shadow-sm animate-pulse" />

            {/* Omni White Line Robot Icon */}
            <svg
              className="w-7 h-7 text-white stroke-white stroke-[2.2] group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Top Antenna stem and horizontal bar */}
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="10" y1="2" x2="14" y2="2" />
              {/* Rounded Head Rectangle */}
              <rect x="4" y="5" width="16" height="15" rx="4" />
              {/* Ear tabs on left and right */}
              <line x1="1.5" y1="12.5" x2="4" y2="12.5" />
              <line x1="20" y1="12.5" x2="22.5" y2="12.5" />
              {/* Two capsule eyes */}
              <line x1="8.5" y1="11" x2="8.5" y2="14.5" strokeWidth="2.6" />
              <line x1="15.5" y1="11" x2="15.5" y2="14.5" strokeWidth="2.6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

