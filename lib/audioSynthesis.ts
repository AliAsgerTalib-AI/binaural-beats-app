let audioContext: AudioContext | null = null;
let oscillators: OscillatorNode[] = [];
let gainNodes: GainNode[] = [];
let panners: StereoPannerNode[] = [];
let masterGain: GainNode | null = null;
let pinkNoiseSource: AudioBufferSourceNode | null = null;
let pinkNoiseGain: GainNode | null = null;
let pinkNoiseFilter: BiquadFilterNode | null = null;

const initAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

const generatePinkNoiseBuffer = (ctx: AudioContext, duration: number = 2): AudioBuffer => {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.049922035 * white + 0.95009905 * b0;
    b1 = 0.95113062 * white + 0.75002399 * b1;
    b2 = 0.55110626 * white + 0.33773141 * b2;
    b3 = 0.34555027 * white + 0.02167615 * b3;
    b4 = 0.10091514 * white + 0.27886807 * b4;
    b5 = 0.03305122 * white + 0.26559766 * b5;
    b6 = 0.01735206 * white + 0.00684674 * b6;

    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6) * 0.6; // Scale for loudness
  }

  return buffer;
};

export const startBinauralBeats = (
  leftCarrier: number,
  rightCarrier: number,
  volume: number = 0.1,
  usePinkNoise: boolean = false
): (() => void) => {
  const ctx = initAudioContext();

  stopBinauralBeats();

  masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.5);
  masterGain.connect(ctx.destination);

  // Add pink noise if enabled
  if (usePinkNoise) {
    pinkNoiseGain = ctx.createGain();
    pinkNoiseGain.gain.setValueAtTime(0.15, ctx.currentTime);
    pinkNoiseGain.connect(masterGain);

    pinkNoiseFilter = ctx.createBiquadFilter();
    pinkNoiseFilter.type = 'lowpass';
    pinkNoiseFilter.frequency.setValueAtTime(10000, ctx.currentTime);
    pinkNoiseFilter.connect(pinkNoiseGain);

    const pinkBuffer = generatePinkNoiseBuffer(ctx, 30);
    pinkNoiseSource = ctx.createBufferSource();
    pinkNoiseSource.buffer = pinkBuffer;
    pinkNoiseSource.loop = true;
    pinkNoiseSource.connect(pinkNoiseFilter);
    pinkNoiseSource.start();
  }

  for (let i = 0; i < 2; i++) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(i === 0 ? leftCarrier : rightCarrier, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);

    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(i === 0 ? -1 : 1, ctx.currentTime);

    osc.connect(gain);
    gain.connect(panner);
    panner.connect(masterGain);

    osc.start();

    oscillators.push(osc);
    gainNodes.push(gain);
    panners.push(panner);
  }

  return stopBinauralBeats;
};

export const stopBinauralBeats = (): void => {
  if (masterGain && audioContext) {
    masterGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);

    setTimeout(() => {
      oscillators.forEach((osc) => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });

      if (pinkNoiseSource) {
        try {
          pinkNoiseSource.stop();
        } catch (e) {
          // Already stopped
        }
        pinkNoiseSource = null;
      }

      oscillators = [];
      gainNodes = [];
      panners = [];
      pinkNoiseGain = null;
      pinkNoiseFilter = null;
      masterGain = null;
    }, 500);
  }
};

export const setVolume = (volume: number): void => {
  if (masterGain) {
    const ctx = audioContext!;
    masterGain.gain.linearRampToValueAtTime(
      Math.max(0, Math.min(1, volume)),
      ctx.currentTime + 0.1
    );
  }
};

export const getAudioContext = (): AudioContext | null => audioContext;

export const isAudioPlaying = (): boolean => oscillators.length > 0;
