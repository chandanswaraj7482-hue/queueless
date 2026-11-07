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
        /* Collapsed Floating Action Button (FAB) */
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white shadow-[0_10px_35px_rgba(37,99,235,0.4)] hover:shadow-[0_14px_45px_rgba(37,99,235,0.6)] cursor-pointer transition-all hover:scale-105 active:scale-95 border border-white/20"
          aria-label="Open Queueless AI Assistant"
        >
          {/* Glowing Green Online Status Indicator */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-950 shadow-sm animate-pulse" />

          <div className="w-6 h-6 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
          </div>

          <div className="hidden sm:flex flex-col text-left pr-1">
            <span className="text-[11px] font-black tracking-wide leading-tight">AI Clinical Copilot</span>
            <span className="text-[9px] text-blue-100 font-medium leading-none">Instant OPD Help</span>
          </div>
        </button>
      )}
    </div>
  );
};

