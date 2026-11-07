/**
 * Utilitas sintesis audio Web Audio API untuk notifikasi TeraDesk.
 * Menghasilkan suara bell chime kristal ("tinggg~~~") secara matematis tanpa dependensi file eksternal.
 */

let audioCtx = null;
let isSoundMuted = false;

// Periksa preferensi suara dari localStorage
try {
  const savedMute = localStorage.getItem('teradesk_sound_muted');
  if (savedMute !== null) {
    isSoundMuted = savedMute === 'true';
  }
} catch {
  // ignore
}

export const getSoundMuted = () => isSoundMuted;

export const setSoundMuted = (muted) => {
  isSoundMuted = Boolean(muted);
  try {
    localStorage.setItem('teradesk_sound_muted', String(isSoundMuted));
  } catch {
    // ignore
  }
  return isSoundMuted;
};

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

// Listen ke interaksi pengguna untuk membuka izin audio context di browser
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  };
  window.addEventListener('click', unlockAudio, { once: false, passive: true });
  window.addEventListener('keydown', unlockAudio, { once: false, passive: true });
}

/**
 * Memainkan bunyi notifikasi "tinggg" khas lonceng kristal yang jernih dan elegan.
 * @param {number} volume - Skala volume suara (0.0 sampai 1.0, default: 0.4)
 */
export const playNotificationChime = (volume = 0.45) => {
  if (isSoundMuted) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => playChimeWave(ctx, volume)).catch(() => {});
    } else {
      playChimeWave(ctx, volume);
    }
  } catch (err) {
    console.warn('⚠️ [TeraDesk Sound] Gagal memainkan bunyi notifikasi:', err);
  }
};

const playChimeWave = (ctx, volume) => {
  const now = ctx.currentTime;

  // Master Gain Node
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(volume, now);
  masterGain.connect(ctx.destination);

  // Kombinasi frekuensi harmonik untuk menghasilkan suara "tinggg" yang jernih dan berkilau (sparkling chime)
  const harmonics = [
    { freq: 1174.66, gain: 0.55, decay: 1.4 }, // D6 (Nada dasar jernih)
    { freq: 1760.00, gain: 0.45, decay: 1.6 }, // A6 (Overtone tinggg khas lonceng)
    { freq: 2349.32, gain: 0.25, decay: 1.0 }, // D7 (Kilau kristal)
    { freq: 3520.00, gain: 0.12, decay: 0.7 }, // A7 (Shimmer high-frequency)
  ];

  harmonics.forEach(({ freq, gain, decay }) => {
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Envelope: Serangan cepat (attack) dan peluruhan eksponensial halus (decay)
    oscGain.gain.setValueAtTime(0.0001, now);
    oscGain.gain.linearRampToValueAtTime(gain, now + 0.006);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    osc.connect(oscGain);
    oscGain.connect(masterGain);

    osc.start(now);
    osc.stop(now + decay + 0.05);
  });
};

