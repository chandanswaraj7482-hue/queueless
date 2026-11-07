// ============================================================================
// WARM & PLEASANT CLINICAL HOSPITAL PUBLIC ADDRESS (PA) AUDIO ENGINE
// Features: 
// 1. Sweet 4-Tone Melodic Celesta / Crystal Marimba Chime (Boutique Healthcare Sanctuary Grade)
// 2. Sweet, Cute, Friendly Female Voice Synthesis (Natural high-clarity pronunciation)
// 3. Human Respiratory Pauses & Polite Receptionist Cadence
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
 * Plays a warm, melodic, cheerful 4-tone celesta chime (E5 -> G#5 -> B5 -> E6).
 * Gives patients a calm, pleasant, sweet auditory cue without harsh industrial alarms.
 */
export function playClinicChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Acoustic soft ceiling filter
    const masterFilter = ctx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(4200, now);
    masterFilter.Q.setValueAtTime(0.9, now);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.65, now);

    masterFilter.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Play a crystal bell tone with harmonic sparkle
    const playBellTone = (freq: number, startTime: number, duration: number, gainLevel: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Sweet bell attack and natural exponential decay
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(gainLevel, startTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(masterFilter);
      osc.start(startTime);
      osc.stop(startTime + duration);

      // Delicate 2nd Harmonic sparkle (octave up, very soft)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, startTime);

      gain2.gain.setValueAtTime(0.0001, startTime);
      gain2.gain.exponentialRampToValueAtTime(gainLevel * 0.18, startTime + 0.008);
      gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + (duration * 0.65));

      osc2.connect(gain2);
      gain2.connect(masterFilter);
      osc2.start(startTime);
      osc2.stop(startTime + (duration * 0.65));
    };

    // 4-Tone Melodic Sequence: E5 (659.25Hz) -> G#5 (830.61Hz) -> B5 (987.77Hz) -> E6 (1318.51Hz)
    playBellTone(659.25, now, 0.40, 0.30);          // Tone 1: E5
    playBellTone(830.61, now + 0.14, 0.45, 0.35);   // Tone 2: G#5
    playBellTone(987.77, now + 0.28, 0.55, 0.40);   // Tone 3: B5
    playBellTone(1318.51, now + 0.44, 0.95, 0.45);  // Tone 4: E6 (Sparkling resolution bell)

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
 * Selects the sweetest, most pleasant, cute natural female voice available.
 * Prioritizes Tara, Samantha, Ava, Victoria, Zoe, Lekha, Swara, Neerja, and Google/Microsoft Natural voices.
 */
function getBestCuteVoice(langPrefix: string = 'en'): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (!voices || voices.length === 0) return null;

  const scoreVoice = (v: SpeechSynthesisVoice): number => {
    let score = 0;
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();

    // Disqualify deep, robotic, or harsh male voices
    if (
      (name.includes('male') && !name.includes('female')) ||
      name.includes('daniel') ||
      name.includes('david') ||
      name.includes('george') ||
      name.includes('rishi') ||
      name.includes('aman') ||
      name.includes('alex') ||
      name.includes('fred') ||
      name.includes('albert') ||
      name.includes('bruce') ||
      name.includes('bad news') ||
      name.includes('eddy')
    ) {
      return -100;
    }

    // Top tier: Sweet, cute, warm, friendly female voices
    if (name.includes('tara')) score += 200;       // Apple en_IN sweet female
    if (name.includes('samantha')) score += 180;   // Apple en_US pleasant female
    if (name.includes('neerja')) score += 175;     // Microsoft en_IN natural female
    if (name.includes('lekha')) score += 170;      // Apple hi_IN natural female
    if (name.includes('swara')) score += 165;      // Microsoft hi_IN natural female
    if (name.includes('zoe')) score += 150;        // macOS cute premium female
    if (name.includes('ava')) score += 145;        // Siri natural female
    if (name.includes('victoria')) score += 140;   // Soft pleasant female
    if (name.includes('karen')) score += 130;      // Australian friendly female
    if (name.includes('tessa')) score += 125;      // Clear gentle female
    if (name.includes('serena')) score += 120;     // UK gentle female
    if (name.includes('jenny')) score += 115;      // Microsoft Natural female
    if (name.includes('aria')) score += 110;       // Microsoft Natural female

    // Explicit female indicators
    if (name.includes('female')) score += 60;
    if (name.includes('natural') || name.includes('enhanced') || name.includes('neural') || name.includes('premium')) {
      score += 40;
    }

    // Language prefix preference
    if (langPrefix === 'hi') {
      if (lang.startsWith('hi') || name.includes('hindi') || name.includes('lekha') || name.includes('swara')) {
        score += 250;
      }
    } else {
      if (lang.includes('en-in')) score += 40;
      else if (lang.startsWith('en')) score += 20;
    }

    if (v.localService) score += 10;
    return score;
  };

  const sorted = [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
  return sorted[0] || voices[0] || null;
}

/**
 * Formats token so it is read clearly:
 * "A-116" -> "A... 1 1 6"
 */
function formatTokenForHumanSpeech(token: string): string {
  if (!token) return '';
  const clean = token.trim();

  const match = clean.match(/^([a-zA-Z]+)[-_ ]*(\d+)$/);
  if (match) {
    const letters = match[1].toUpperCase().split('').join(' ');
    const digits = match[2].split('').join(' ');
    return `${letters}... ${digits}`;
  }

  if (/^\d+$/.test(clean)) {
    return clean.split('').join(' ');
  }

  return clean.replace(/[-_]/g, ' ').split('').join(' ');
}

export function stopClinicVoice() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Plays a sweet, cute, broadcast-grade hospital PA announcement.
 * Sequence:
 * 1. Sweet 4-Tone Celesta chime (0 - 0.9s)
 * 2. Natural human breathing silence (0.9s - 1.0s)
 * 3. Warm, cute, pleasant female announcement:
 *    "Attention please... Token A 1 1 6... Please proceed to Cabin 204 for Dr. Rohan Sharma. Thank you!"
 * 4. (Optional) Soft polite Hindi broadcast.
 */
export function playClinicVoiceAnnouncement(
  token: string,
  cabin: string = 'Cabin 1',
  doctorName?: string,
  bilingual: boolean = false
) {
  // First play the sweet 4-tone melodic celesta chime
  playClinicChime();

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Cancel any lingering speech

    const spokenToken = formatTokenForHumanSpeech(token);
    const cleanCabin = cabin.replace(/\(.*\)/, '').trim() || 'Cabin 1';
    const cleanDoctor = doctorName ? `for ${doctorName.replace(/,.*$/, '').trim()}` : '';

    // Warm, welcoming, cute announcement phrasing with polite closing
    const enText = `Attention please... Token ${spokenToken}... Please proceed to ${cleanCabin}${cleanDoctor ? ', ' + cleanDoctor : ''}. Thank you!`;
    const utteranceEn = new SpeechSynthesisUtterance(enText);

    // Cute, friendly, sweet vocal tuning
    // Pitch 1.16 gives it that cheerful, warm, sweet receptionist lift!
    utteranceEn.rate = 0.98;
    utteranceEn.pitch = 1.16;
    utteranceEn.volume = 1.0;

    const enVoice = getBestCuteVoice('en');
    if (enVoice) {
      utteranceEn.voice = enVoice;
    }

    // Delay speech until chime's melodic tail finishes (~900ms)
    setTimeout(() => {
      window.speechSynthesis.speak(utteranceEn);

      if (bilingual) {
        utteranceEn.onend = () => {
          try {
            // Polite, sweet Hindi announcement
            const hiText = `कृपया ध्यान दें... टोकन नंबर ${spokenToken}... ${cleanCabin} में पधारें। धन्यवाद!`;
            const utteranceHi = new SpeechSynthesisUtterance(hiText);
            utteranceHi.lang = 'hi-IN';
            utteranceHi.rate = 0.94;
            utteranceHi.pitch = 1.14;
            utteranceHi.volume = 1.0;

            const hiVoice = getBestCuteVoice('hi');
            if (hiVoice) {
              utteranceHi.voice = hiVoice;
            }
            window.speechSynthesis.speak(utteranceHi);
          } catch {
            // Ignore if language not installed
          }
        };
      }
    }, 900);
  } catch (err) {
    console.warn('Speech synthesis unavailable or blocked by browser', err);
  }
}
