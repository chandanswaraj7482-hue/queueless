// ============================================================================
// REALISTIC BROADCAST-GRADE HOSPITAL PUBLIC ADDRESS (PA) AUDIO ENGINE
// Features: 
// 1. Crystal 2-Tone Melodic Hospital Chime (G4 -> C5 Ding-Dong / Airport-Hospital PA Grade)
// 2. Realistic, Natural, Calm Broadcast Voice (Natural human pitch 1.0 & clear cadence)
// 3. High-Fidelity Voice Selection (Prioritizes Apple Enhanced / Google Neural / Microsoft Natural)
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
 * Plays an authentic, warm, broadcast-grade hospital 2-tone acoustic chime (Ding-Dong: G4 392Hz -> C5 523.25Hz).
 * Engineered with gentle harmonic overtones and natural exponential room decay.
 */
export function playClinicChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Acoustic soft ceiling filter (simulates hospital acoustic ceiling tiles)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3600, now);
    filter.Q.setValueAtTime(0.7, now);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.55, now);

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    const playChimeTone = (freq: number, start: number, duration: number, peakVol: number) => {
      // Fundamental sine wave
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, start);

      gain1.gain.setValueAtTime(0.0001, start);
      gain1.gain.exponentialRampToValueAtTime(peakVol, start + 0.015);
      gain1.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc1.connect(gain1);
      gain1.connect(filter);
      osc1.start(start);
      osc1.stop(start + duration);

      // Warm 2nd harmonic overtone for natural hospital chime resonance
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, start);

      gain2.gain.setValueAtTime(0.0001, start);
      gain2.gain.exponentialRampToValueAtTime(peakVol * 0.15, start + 0.012);
      gain2.gain.exponentialRampToValueAtTime(0.0001, start + (duration * 0.7));

      osc2.connect(gain2);
      gain2.connect(filter);
      osc2.start(start);
      osc2.stop(start + (duration * 0.7));
    };

    // Authentic Hospital PA Ding-Dong Chime:
    // Tone 1 ("Ding"): G4 (392.00 Hz)
    playChimeTone(392.00, now, 0.65, 0.40);

    // Tone 2 ("Dong"): C5 (523.25 Hz) - bright, resolving
    playChimeTone(523.25, now + 0.28, 1.10, 0.45);

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
 * Prioritizes Apple Enhanced / Siri Natural, Google Neural, Microsoft Natural, and clear Indian English voices.
 */
function getBestNaturalVoice(langPrefix: string = 'en'): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (!voices || voices.length === 0) return null;

  const scoreVoice = (v: SpeechSynthesisVoice): number => {
    let score = 0;
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();

    // Heavy penalty for mechanical / robotic legacy novelty voices
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
      name.includes('albert')
    ) {
      return -500;
    }

    // Top tier: Broadcast-grade, high-definition natural human voices
    if (name.includes('enhanced') || name.includes('natural') || name.includes('neural') || name.includes('premium')) {
      score += 300;
    }

    // High quality Apple / Siri / Google / Microsoft voices
    if (name.includes('samantha')) score += 220;
    if (name.includes('ava')) score += 210;
    if (name.includes('karen')) score += 190;
    if (name.includes('serena')) score += 185;
    if (name.includes('veena')) score += 180;
    if (name.includes('lekha')) score += 180;
    if (name.includes('neerja')) score += 175;
    if (name.includes('swara')) score += 170;
    if (name.includes('zoe')) score += 160;
    if (name.includes('moira')) score += 155;
    if (name.includes('tara')) score += 150;
    if (name.includes('aria')) score += 140;
    if (name.includes('jenny')) score += 140;
    if (name.includes('google')) score += 130;

    // Language prefix preference
    if (langPrefix === 'hi') {
      if (lang.startsWith('hi') || name.includes('hindi') || name.includes('lekha') || name.includes('swara')) {
        score += 400;
      }
    } else {
      if (lang.includes('en-in')) score += 60; // Natural Indian English for Indian hospitals
      else if (lang.startsWith('en')) score += 30;
    }

    if (v.localService) score += 20;
    return score;
  };

  const sorted = [...voices].sort((a, b) => scoreVoice(b) - scoreVoice(a));
  return sorted[0] || voices[0] || null;
}

/**
 * Formats token so it is read with clear, dignified hospital cadence:
 * "A-102" -> "A... 1 0 2"
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

export type SpeechLanguageMode = 'en' | 'hi' | 'es' | 'ar' | 'fr';

/**
 * Plays a realistic, studio broadcast-grade hospital PA announcement.
 * Sequence:
 * 1. Authentic 2-Tone Ding-Dong hospital chime (0 - 0.75s)
 * 2. Natural human respiratory silence (~750ms)
 * 3. Clear, dignified, broadcast-grade announcement (pitch 1.0, steady natural cadence 0.93)
 * 4. (Optional) Localized polite secondary announcement (Hindi, Spanish, Arabic, French)
 */
export function playClinicVoiceAnnouncement(
  token: string,
  cabin: string = 'Cabin 1',
  doctorName?: string,
  bilingual: boolean | SpeechLanguageMode = false
) {
  // First play the authentic hospital 2-tone chime
  playClinicChime();

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Cancel any lingering speech

    const spokenToken = formatTokenForHumanSpeech(token);
    const cleanCabin = cabin.replace(/\(.*\)/, '').trim() || 'Cabin 1';
    const cleanDoctor = doctorName ? `for ${doctorName.replace(/,.*$/, '').trim()}` : '';

    // Realistic hospital public address announcement phrasing
    const enText = `Attention please. Token ${spokenToken}. Please proceed to ${cleanCabin}${cleanDoctor ? ', ' + cleanDoctor : ''}. Thank you.`;
    const utteranceEn = new SpeechSynthesisUtterance(enText);

    // Realistic human broadcast tuning: natural pitch 1.0, calm clear rate 0.93
    utteranceEn.rate = 0.93;
    utteranceEn.pitch = 1.0;
    utteranceEn.volume = 1.0;

    const enVoice = getBestNaturalVoice('en');
    if (enVoice) {
      utteranceEn.voice = enVoice;
    }

    const langMode = typeof bilingual === 'string' ? bilingual : (bilingual ? 'hi' : 'en');

    // Wait for the hospital chime to ring cleanly before speaking (~750ms)
    setTimeout(() => {
      window.speechSynthesis.speak(utteranceEn);

      if (langMode !== 'en') {
        utteranceEn.onend = () => {
          try {
            let secondaryText = '';
            let secondaryLang = 'hi-IN';

            if (langMode === 'hi') {
              secondaryText = `कृपया ध्यान दें। टोकन नंबर ${spokenToken}। कृपया ${cleanCabin} में पधारें। धन्यवाद।`;
              secondaryLang = 'hi-IN';
            } else if (langMode === 'es') {
              secondaryText = `Atención por favor. Turno ${spokenToken}. Por favor pasar al ${cleanCabin}. Gracias.`;
              secondaryLang = 'es-ES';
            } else if (langMode === 'ar') {
              secondaryText = `يرجى الانتباه. التذكرة رقم ${spokenToken}. يرجى التوجه إلى ${cleanCabin}. شكراً لكم.`;
              secondaryLang = 'ar-SA';
            } else if (langMode === 'fr') {
              secondaryText = `Votre attention s'il vous plaît. Ticket ${spokenToken}. Veuillez vous présenter au ${cleanCabin}. Merci.`;
              secondaryLang = 'fr-FR';
            }

            if (secondaryText) {
              const utteranceSec = new SpeechSynthesisUtterance(secondaryText);
              utteranceSec.lang = secondaryLang;
              utteranceSec.rate = 0.92;
              utteranceSec.pitch = 1.0;
              utteranceSec.volume = 1.0;

              const secVoice = getBestNaturalVoice(langMode);
              if (secVoice) {
                utteranceSec.voice = secVoice;
              }
              window.speechSynthesis.speak(utteranceSec);
            }
          } catch {
            // Ignore if secondary speech fails
          }
        };
      }
    }, 750);
  } catch (err) {
    console.warn('Speech synthesis unavailable or blocked by browser', err);
  }
}
