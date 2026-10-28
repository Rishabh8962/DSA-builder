import { AppNotification } from '../types';

// Web Audio API Synthesizer for alerts and focus timer chimes
export function playNotificationChime(type: 'beep' | 'success' | 'focus_done' = 'beep') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'focus_done') {
      // 3 ascending chime tones
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.15); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.3); // G5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.start(now);
      osc.stop(now + 0.8);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.setValueAtTime(880, now + 0.12); // A5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else {
      // Soft gentle reminder beep
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch {
    // Audio context may be restricted by autoplay policy before user gesture
  }
}

// Ambient Noise Generator (Rain, Deep Brown Noise, White Noise) using Web Audio API
let ambientAudioCtx: AudioContext | null = null;
let ambientSourceNode: AudioNode | null = null;
let ambientGainNode: GainNode | null = null;

export function stopAmbientSound() {
  if (ambientSourceNode) {
    try {
      if ('stop' in ambientSourceNode && typeof (ambientSourceNode as AudioScheduledSourceNode).stop === 'function') {
        (ambientSourceNode as AudioScheduledSourceNode).stop();
      }
      ambientSourceNode.disconnect();
    } catch {}
    ambientSourceNode = null;
  }
  if (ambientAudioCtx && ambientAudioCtx.state !== 'closed') {
    try {
      ambientAudioCtx.close();
    } catch {}
    ambientAudioCtx = null;
  }
}

export function startAmbientSound(type: 'brown' | 'white' | 'rain' = 'brown', volume = 0.15) {
  stopAmbientSound();

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    ambientAudioCtx = new AudioContextClass();
    const bufferSize = 2 * ambientAudioCtx.sampleRate;
    const noiseBuffer = ambientAudioCtx.createBuffer(1, bufferSize, ambientAudioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'brown') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain compensation
      }
    } else {
      // Gentle rain: pink-filtered noise with random droplet impulses
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }
    }

    const whiteNoise = ambientAudioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    ambientGainNode = ambientAudioCtx.createGain();
    ambientGainNode.gain.setValueAtTime(volume, ambientAudioCtx.currentTime);

    whiteNoise.connect(ambientGainNode);
    ambientGainNode.connect(ambientAudioCtx.destination);
    whiteNoise.start(0);

    ambientSourceNode = whiteNoise;
  } catch (e) {
    console.error('Ambient audio error', e);
  }
}

export async function requestWebPushPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
}

export function sendBrowserNotification(title: string, body: string, icon = '/favicon.ico') {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon,
        badge: icon,
        vibrate: [200, 100, 200]
      } as NotificationOptions);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export function createInAppNotification(
  title: string,
  message: string,
  type: 'reminder' | 'recovery' | 'milestone' | 'info' = 'reminder'
): AppNotification {
  return {
    id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    title,
    message,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: false,
    type
  };
}
