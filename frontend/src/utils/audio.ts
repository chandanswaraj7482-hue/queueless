// ============================================================================
// REALISTIC BROADCAST-GRADE HOSPITAL PUBLIC ADDRESS (PA) AUDIO ENGINE
// Features: 
// 1. Crystal 3-Tone Harmonic Hospital Chime (C5 -> E5 -> G5 Luxury Medical Chime)
// 2. Realistic, Natural, Warm Human Broadcast Cadence
// 3. High-Fidelity Voice Selection (Prioritizes Google Neural, Apple Enhanced, Microsoft Natural)
// 4. Clean Natural Phrasing (No robotic stutter or harsh pauses)
// ============================================================================

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioContextClass();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

/**
 * Plays an authentic, warm, broadcast-grade hospital 3-tone acoustic chime.
 * Major Triad: C5 (523.25 Hz) -> E5 (659.25 Hz) -> G5 (783.99 Hz).
 * Engineered with gentle physical bell overtones and exponential room decay.
 */
export function playClinicChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Warm acoustic ceiling filter (removes any harsh high-frequency piercing)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3800, now);
    filter.Q.setValueAtTime(0.65, now);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.45, now);

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    const playBellTone = (freq: number, start: number, duration: number, peakVol: number) => {
      // 1. Fundamental warm sine wave
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, start);

      gain1.gain.setValueAtTime(0.0001, start);
      gain1.gain.exponentialRampToValueAtTime(peakVol, start + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc1.connect(gain1);
      gain1.connect(filter);
      osc1.start(start);
      osc1.stop(start + duration);

      // 2. Gentle triangle overtone for physical bell resonance
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq, start);

      gain2.gain.setValueAtTime(0.0001, start);
      gain2.gain.exponentialRampToValueAtTime(peakVol * 0.12, start + 0.015);
      gain2.gain.exponentialRampToValueAtTime(0.0001, start + (duration * 0.65));

      osc2.connect(gain2);
      gain2.connect(filter);
      osc2.start(start);
      osc2.stop(start + (duration * 0.65));

      // 3. Subtle physical chime shimmer (2.76x physical overtone)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq * 2.76, start);

      gain3.gain.setValueAtTime(0.0001, start);
      gain3.gain.exponentialRampToValueAtTime(peakVol * 0.04, start + 0.01);
      gain3.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);

      osc3.connect(gain3);
      gain3.connect(filter);
      osc3.start(start);
      osc3.stop(start + 0.4);
    };

    // Authentic 3-Tone Hospital Chime (C5 -> E5 -> G5)
    // Note 1: C5 (523.25 Hz)
    playBellTone(523.25, now, 0.75, 0.35);

    // Note 2: E5 (659.25 Hz)
    playBellTone(659.25, now + 0.22, 0.75, 0.38);

    // Note 3: G5 (783.99 Hz) - resolving, long peaceful decay
    playBellTone(783.99, now + 0.44, 1.25, 0.42);

  } catch (err) {
    console.warn('Audio chime could not play due to browser policy', err);
  }
}

// Pre-cache voices so speech starts instantly without delay
let cachedVoices: SpeechSynthesisVoice[] = [];
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  return cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
}

/**
 * Selects the most realistic, natural, human broadcast voice available on the device.
 * Prioritizes Google Neural, Apple Enhanced / Siri Natural, and Microsoft Natural voices.
 */
function getBestNaturalVoice(langPrefix: string = 'en'): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (!voices || voices.length === 0) return null;

  const scoreVoice = (v: SpeechSynthesisVoice): number => {
    let score = 0;
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();

    // Heavy penalty for mechanical / novelty / robotic legacy voices
    if (
      name.includes('bad news') ||
      name.includes('bells') ||
      name.includes('boing') ||
      name.includes('bubbles') ||
      name.includes('cellos') ||
      name.includes('deranged') ||
      name.includes('good news') ||
      name.includes('hysterical') ||
      name.includes('pipe organ') ||
      name.includes('trinoids') ||
      name.includes('whisper') ||
      name.includes('zarvox') ||
      name.includes('eddy') ||
      name.includes('fred') ||
      name.includes('albert') ||
      name.includes('junior') ||
      name.includes('ralph')
    ) {
      return -1000;
    }

    // Top tier: Google Chrome Neural and Apple Enhanced Studio Voices
    if (name.includes('google us english') || name.includes('google uk english female')) score += 600;
    if (name.includes('google हिन्दी') || name.includes('google hindi')) score += 600;
    if (name.includes('natural') || name.includes('neural') || name.includes('enhanced') || name.includes('premium')) {
      score += 400;
    }

    // High quality human broadcast voices
    if (name.includes('samantha')) score += 350;
    if (name.includes('siri')) score += 340;
    if (name.includes('karen')) score += 330;
    if (name.includes('ava')) score += 320;
    if (name.includes('serena')) score += 310;
    if (name.includes('jenny')) score += 300;
    if (name.includes('sonia')) score += 290;
    if (name.includes('veena')) score += 280;
    if (name.includes('lekha')) score += 320;
    if (name.includes('swara')) score += 310;
    if (name.includes('neerja')) score += 300;

    // Language matching
    if (langPrefix === 'hi') {
      if (name.includes('google हिन्दी') || name.includes('hindi') || name.includes('lekha') || name.includes('swara')) score += 500;
      if (lang.startsWith('hi')) score += 400;
    } else if (langPrefix === 'bn') {
      if (lang.startsWith('bn') || name.includes('bengali') || name.includes('bangla')) score += 500;
    } else if (langPrefix === 'ta') {
      if (lang.startsWith('ta') || name.includes('tamil')) score += 500;
    } else if (langPrefix === 'te') {
      if (lang.startsWith('te') || name.includes('telugu')) score += 500;
    } else if (langPrefix === 'kn') {
      if (lang.startsWith('kn') || name.includes('kannada')) score += 500;
    } else if (langPrefix === 'mr') {
      if (lang.startsWith('mr') || name.includes('marathi')) score += 500;
    } else if (langPrefix === 'gu') {
      if (lang.startsWith('gu') || name.includes('gujarati')) score += 500;
    } else if (langPrefix === 'pa') {
      if (lang.startsWith('pa') || name.includes('punjabi')) score += 500;
    } else if (langPrefix === 'ml') {
      if (lang.startsWith('ml') || name.includes('malayalam')) score += 500;
    } else if (langPrefix === 'es') {
      if (lang.startsWith('es') || name.includes('spanish')) score += 500;
    } else if (langPrefix === 'ar') {
      if (lang.startsWith('ar') || name.includes('arabic')) score += 500;
    } else if (langPrefix === 'fr') {
      if (lang.startsWith('fr') || name.includes('french')) score += 500;
    } else if (langPrefix === 'de') {
      if (lang.startsWith('de') || name.includes('german')) score += 500;
    } else if (langPrefix === 'ru') {
      if (lang.startsWith('ru') || name.includes('russian')) score += 500;
    } else {
      if (lang.includes('en-in')) score += 80;
      else if (lang.startsWith('en')) score += 50;
    }

    if (v.localService) score += 20;
    return score;
  };

  const sorted = [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
  return sorted[0] || voices[0] || null;
}

/**
 * Formats token so it is read with natural, dignified hospital cadence:
 * "A-101" -> "A, 1 0 1"
 */
function formatTokenForHumanSpeech(token: string): string {
  if (!token) return '';
  const clean = token.trim();

  const match = clean.match(/^([a-zA-Z]+)[-_ ]*(\d+)$/);
  if (match) {
    const letters = match[1].toUpperCase().split('').join(' ');
    const digits = match[2].split('').join(' ');
    return `${letters}, ${digits}`;
  }

  if (/^\d+$/.test(clean)) {
    return clean.split('').join(' ');
  }

  return clean.replace(/[-_]/g, ' ');
}

export function stopClinicVoice() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export type SpeechLanguageMode =
  | 'en'
  | 'hi'
  | 'bn'
  | 'ta'
  | 'te'
  | 'kn'
  | 'mr'
  | 'gu'
  | 'pa'
  | 'ml'
  | 'es'
  | 'ar'
  | 'fr'
  | 'de'
  | 'ru';

/**
 * Plays a realistic, studio broadcast-grade hospital PA announcement.
 * Sequence:
 * 1. Warm 3-Tone Hospital Chime (C5 -> E5 -> G5)
 * 2. Gentle natural breath pause (~850ms)
 * 3. Clear, dignified, broadcast-grade announcement (pitch 1.0, cadence 0.96)
 * 4. Localized polite secondary announcement (e.g. Hindi, Spanish, etc.)
 */
let activeUtterances: SpeechSynthesisUtterance[] = [];

// Chrome workaround: keep speech synthesis alive if it gets paused
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  setInterval(() => {
    try {
      if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {}
  }, 3500);
}

export function playClinicVoiceAnnouncement(
  token: string,
  cabin: string = 'Cabin 1',
  doctorName?: string,
  bilingual: boolean | SpeechLanguageMode = false,
  repeatTimes: number = 1
) {
  // Immediately resume AudioContext & SpeechSynthesis while click event is hot
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }
  } catch {}

  // First play the authentic hospital 3-tone chime
  playClinicChime();

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Cancel any lingering speech
    activeUtterances = [];

    const spokenToken = formatTokenForHumanSpeech(token);
    const cleanCabin = cabin.replace(/\(.*\)/, '').trim() || 'Cabin 1';
    const cleanDoctor = doctorName ? `with ${doctorName.replace(/,.*$/, '').trim()}` : '';
    const langMode = typeof bilingual === 'string' ? bilingual : (bilingual ? 'hi' : 'en');

    const englishText = `Attention please. Token number ${spokenToken}. Please proceed to ${cleanCabin}${cleanDoctor ? `, ${cleanDoctor}` : ''}.`;

    // Secondary translation
    let secondaryText = '';
    let secondaryLang = 'hi-IN';
    const hindiCabin = cleanCabin
      .replace(/cabin\s*(\d+)/i, 'केबिन नंबर $1')
      .replace(/room\s*(\d+)/i, 'कमरा नंबर $1')
      .replace(/consultation\s*room\s*(\d+)/i, 'केबिन $1');

    if (langMode === 'hi') {
      secondaryText = `कृपया ध्यान दें। टोकन नंबर ${spokenToken}। कृपया ${hindiCabin} में जाएं।`;
      secondaryLang = 'hi-IN';
    } else if (langMode === 'bn') {
      secondaryText = `দয়া করে লক্ষ্য করুন। টোকেন নম্বর ${spokenToken}। অনুগ্রহ করে ${cleanCabin} এ যান।`;
      secondaryLang = 'bn-IN';
    } else if (langMode === 'ta') {
      secondaryText = `தயவுசெய்து கவனிக்கவும். டோக்கன் எண் ${spokenToken}. தயவுசெய்து ${cleanCabin}க்கு செல்லவும்.`;
      secondaryLang = 'ta-IN';
    } else if (langMode === 'te') {
      secondaryText = `దయచేసి వినండి. టੋకెన్ ನಂಬರ್ ${spokenToken}. దయచేసి ${cleanCabin}కు వెళ్లండి.`;
      secondaryLang = 'te-IN';
    } else if (langMode === 'kn') {
      secondaryText = `ದಯವಿಟ್ಟು ಗಮನಿಸಿ. ಟೋಕನ್ ಸಂಖ್ಯೆ ${spokenToken}. ದಯವಿಟ್ಟು ${cleanCabin}ಗೆ ಬನ್ನಿ.`;
      secondaryLang = 'kn-IN';
    } else if (langMode === 'mr') {
      secondaryText = `कृपया लक्ष द्या. टोकन क्रमांक ${spokenToken}. कृपया ${cleanCabin} मध्ये यावे.`;
      secondaryLang = 'mr-IN';
    } else if (langMode === 'gu') {
      secondaryText = `કૃપા કરીને ध्यान આપો. ટોકન નંબર ${spokenToken}. કૃપા કરીને ${cleanCabin}માં પધારો.`;
      secondaryLang = 'gu-IN';
    } else if (langMode === 'pa') {
      secondaryText = `ਕਿਰਪਾ ਕਰਕੇ ਧਿਆਨ ਦਿਓ। ਟੋਕਨ ਨੰਬਰ ${spokenToken}। ਕਿਰਪਾ ਕਰਕੇ ${cleanCabin} ਵਿੱਚ ਆਓ।`;
      secondaryLang = 'pa-IN';
    } else if (langMode === 'ml') {
      secondaryText = `ദയവായി ശ്രദ്ധിക്കുക. ടോക്കൺ നമ്പർ ${spokenToken}. ദയവായി ${cleanCabin}ലേക്ക് പോകുക.`;
      secondaryLang = 'ml-IN';
    } else if (langMode === 'es') {
      secondaryText = `Atención por favor. Turno ${spokenToken}. Por favor pasar al ${cleanCabin}.`;
      secondaryLang = 'es-ES';
    } else if (langMode === 'ar') {
      secondaryText = `يرجى الانتباه. التذكرة رقم ${spokenToken}. يرجى التوجه إلى ${cleanCabin}.`;
      secondaryLang = 'ar-SA';
    } else if (langMode === 'fr') {
      secondaryText = `Votre attention s'il vous plaît. Ticket ${spokenToken}. Veuillez vous présenter au ${cleanCabin}.`;
      secondaryLang = 'fr-FR';
    } else if (langMode === 'de') {
      secondaryText = `Achtung bitte. Nummer ${spokenToken}. Bitte begeben Sie sich in ${cleanCabin}.`;
      secondaryLang = 'de-DE';
    } else if (langMode === 'ru') {
      secondaryText = `Внимание пожалуйста. Талон ${spokenToken}. Пожалуйста пройдите в ${cleanCabin}.`;
      secondaryLang = 'ru-RU';
    }

    const playRound = (roundNum: number) => {
      // Refresh available voices in case browser populated them asynchronously
      if (cachedVoices.length === 0) {
        cachedVoices = window.speechSynthesis.getVoices();
      }

      const uttEn = new SpeechSynthesisUtterance(englishText);
      const enVoice = getBestNaturalVoice('en');
      if (enVoice) {
        uttEn.voice = enVoice;
        uttEn.lang = enVoice.lang || 'en-US';
      } else {
        uttEn.lang = navigator.language || 'en-US';
      }
      uttEn.rate = 0.94;
      uttEn.pitch = 1.0;
      uttEn.volume = 1.0;

      activeUtterances.push(uttEn);

      const finishEn = () => {
        const idx = activeUtterances.indexOf(uttEn);
        if (idx !== -1) activeUtterances.splice(idx, 1);

        if (langMode !== 'en' && secondaryText) {
          const uttSec = new SpeechSynthesisUtterance(secondaryText);
          const secVoice = getBestNaturalVoice(langMode);
          if (secVoice) {
            uttSec.voice = secVoice;
            uttSec.lang = secVoice.lang || secondaryLang;
          } else {
            uttSec.lang = secondaryLang;
          }
          uttSec.rate = 0.94;
          uttSec.pitch = 1.0;
          uttSec.volume = 1.0;

          activeUtterances.push(uttSec);

          const finishSec = () => {
            const secIdx = activeUtterances.indexOf(uttSec);
            if (secIdx !== -1) activeUtterances.splice(secIdx, 1);

            if (roundNum < repeatTimes) {
              setTimeout(() => {
                playClinicChime();
                setTimeout(() => playRound(roundNum + 1), 350);
              }, 600);
            }
          };

          uttSec.onend = finishSec;
          uttSec.onerror = finishSec;

          window.speechSynthesis.resume();
          window.speechSynthesis.speak(uttSec);
        } else {
          if (roundNum < repeatTimes) {
            setTimeout(() => {
              playClinicChime();
              setTimeout(() => playRound(roundNum + 1), 350);
            }, 600);
          }
        }
      };

      uttEn.onend = finishEn;
      uttEn.onerror = finishEn;

      window.speechSynthesis.resume();
      window.speechSynthesis.speak(uttEn);
    };

    // Immediate dispatch while user click activation is active (200ms after chime trigger)
    setTimeout(() => {
      playRound(1);
    }, 200);
  } catch (err) {
    console.warn('Speech synthesis unavailable or blocked by browser', err);
  }
}

export interface ClinicalVoiceoverItem {
  id: number;
  doctor: string;
  facility: string;
  enText: string;
  hiText: string;
}

export const CLINICAL_REEL_VOICEOVERS: Record<number, ClinicalVoiceoverItem> = {
  1: {
    id: 1,
    doctor: 'Dr. Rohan Sharma, MD',
    facility: 'CareMax Superspecialty • Cabin 204',
    enText: "Hello, I'm Dr. Rohan Sharma from CareMax Cardiology. Before Queueless, corridors were packed with 40-minute wait times. With Queueless Cabin Console on my iPad, I call the next patient in one tap. The TV chimes automatically and alerts the patient on mobile. Our OPD is now completely quiet, seamless, and zero-wait.",
    hiText: "नमस्ते, मैं डॉक्टर रोहन शर्मा, केयरमैक्स कार्डियोलॉजी से। पहले ओपीडी में पेशेंट्स को चालीस मिनट लाइन में खड़े रहना पड़ता था। क्यूलेस केबिन कंसोल से अब मैं आईपैड पर एक क्लिक में अगला पेशेंट बुला लेता हूँ। टीवी पर बेल बजती है और पेशेंट के फोन पर अलर्ट जाता है। क्लिनिक एकदम शांत और ज़ीरो-वेट हो गया है।"
  },
  2: {
    id: 2,
    doctor: 'Dr. Priya S. Kulkarni',
    facility: 'Rainbow Children Clinic • OPD Gate',
    enText: "I'm Dr. Priya Kulkarni from Rainbow Clinic. Standing in counter lines with sick children was stressful for parents. With Queueless Mobile QR Pass, families simply scan the hospital entrance standee, get a live WhatsApp token pass, and wait comfortably in the cafeteria while tracking their turn. It has transformed our patient satisfaction!",
    hiText: "मैं डॉक्टर प्रिया कुलकर्णी, रेनबो क्लिनिक से। बीमार बच्चों के साथ रिसेप्शन लाइन में खड़े रहना पैरेंट्स के लिए बहुत तकलीफदेह था। क्यूलेस क्यूआर पास से पैरेंट्स गेट पर क्यूआर कोड स्कैन करके सीधे व्हाट्सएप पर लाइव टोकन ले लेते हैं और कैफे में आराम से बैठकर अपनी बारी ट्रैक करते हैं। पेशेंट बहुत खुश हैं!"
  },
  3: {
    id: 3,
    doctor: 'OPD Central Coordinator',
    facility: 'Medanta Medicity • Central Hub',
    enText: "Greetings from Medanta Central OPD Desk. Queueless turns any standard 55-inch smart TV into an autonomous waiting hall display with zero hardware cost. It chimes studio acoustic bells and announces patient tokens in Hindi and English. Waiting hall congestion dropped by 80%, and our staff no longer need to shout names!",
    hiText: "मेदांता सेंट्रल ओपीडी डेस्क से। क्यूलेस ओएस किसी भी नॉर्मल 55 इंच स्मार्ट टीवी को लाइव कियोस्क में बदल देता है, बिना किसी नए हार्डवेयर के। यह 3-टोन साउंड के साथ हिंदी और अंग्रेजी दोनों में टोकन अनाउंस करता है। वेटिंग हॉल की भीड़ अस्सी परसेंट खत्म हो गई है और स्टाफ को नाम नहीं चिल्लाना पड़ता।"
  },
  4: {
    id: 4,
    doctor: 'Col. R. K. Nair',
    facility: 'Apex Surgical Daycare • Procedural Hub',
    enText: "I'm Col. R. K. Nair from Apex Surgical Daycare. With Queueless Direct Settlement, consultation fees are paid via instant QR UPI and credited 100% directly into our hospital HDFC account. Zero platform fee, zero payout hold, and patients receive an instant digital receipt. It is by far the most reliable healthcare software we've used.",
    hiText: "मैं कर्नल आर. के. नायर, अपेक्स सर्जिकल से। क्यूलेस डायरेक्ट सेटलमेंट से पेशेंट की कंसल्टेशन फीस इंस्टेंट यूपीआई के ज़रिये सीधे हमारे हॉस्पिटल एचडीएफसी खाते में जमा हो जाती है। कोई कमीशन नहीं, कोई पेमेंट होल्ड नहीं, और पेशेंट को तुरंत डिजिटल जीएसटी इनवॉइस मिल जाती है। यह बेहद प्रॉफिटेबल और रिलायबल सिस्टम है।"
  }
};

let currentVoiceoverUtterance: SpeechSynthesisUtterance | null = null;
let currentVoiceoverAudio: HTMLAudioElement | null = null;

export function stopClinicalReviewVoiceover() {
  if (currentVoiceoverAudio) {
    try {
      currentVoiceoverAudio.pause();
      currentVoiceoverAudio.currentTime = 0;
    } catch {}
    currentVoiceoverAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      currentVoiceoverUtterance = null;
    } catch {}
  }
}

export function playClinicalReviewVoiceover(
  reelId: number,
  language: 'hi' | 'en' = 'hi',
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const voiceover = CLINICAL_REEL_VOICEOVERS[reelId];
  if (!voiceover) return false;

  stopClinicalReviewVoiceover();
  playClinicChime();

  // 1. Primary: High-fidelity natural studio audio file
  const audioPath = `/assets/audio/voiceover_reel${reelId}_${language}.m4a`;
  try {
    const audio = new Audio(audioPath);
    audio.volume = 1.0;

    let hasStarted = false;
    audio.onplay = () => {
      hasStarted = true;
      if (onStart) onStart();
    };

    audio.onended = () => {
      currentVoiceoverAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      // Fallback to Web Speech API if audio file fails to load
      if (!hasStarted) {
        currentVoiceoverAudio = null;
        playWebSpeechFallback(voiceover, language, onStart, onEnd);
      }
    };

    currentVoiceoverAudio = audio;
    setTimeout(() => {
      audio.play().catch(() => {
        // Fallback to Web Speech API if browser blocks audio autoplay
        currentVoiceoverAudio = null;
        playWebSpeechFallback(voiceover, language, onStart, onEnd);
      });
    }, 350);

    return true;
  } catch {
    return playWebSpeechFallback(voiceover, language, onStart, onEnd);
  }
}

function playWebSpeechFallback(
  voiceover: ClinicalVoiceoverItem,
  language: 'hi' | 'en',
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return false;
  }

  const text = language === 'hi' ? voiceover.hiText : voiceover.enText;

  try {
    if (cachedVoices.length === 0) {
      cachedVoices = window.speechSynthesis.getVoices();
    }

    const utt = new SpeechSynthesisUtterance(text);
    const chosenVoice = getBestNaturalVoice(language);
    if (chosenVoice) {
      utt.voice = chosenVoice;
      utt.lang = chosenVoice.lang || (language === 'hi' ? 'hi-IN' : 'en-US');
    } else {
      utt.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    }

    utt.rate = language === 'hi' ? 0.95 : 0.98;
    utt.pitch = 1.0;
    utt.volume = 1.0;

    utt.onstart = () => {
      if (onStart) onStart();
    };

    utt.onend = () => {
      currentVoiceoverUtterance = null;
      if (onEnd) onEnd();
    };

    utt.onerror = () => {
      currentVoiceoverUtterance = null;
      if (onEnd) onEnd();
    };

    currentVoiceoverUtterance = utt;
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utt);
    return true;
  } catch (err) {
    console.warn('Fallback speech error', err);
    if (onEnd) onEnd();
    return false;
  }
}
