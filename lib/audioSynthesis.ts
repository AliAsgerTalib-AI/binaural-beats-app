let audioContext: AudioContext | null = null;
let oscillators: OscillatorNode[] = [];
let gainNodes: GainNode[] = [];
let panners: StereoPannerNode[] = [];
let masterGain: GainNode | null = null;

const initAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

export const startBinauralBeats = (
  leftCarrier: number,
  rightCarrier: number,
  volume: number = 0.1
): (() => void) => {
  const ctx = initAudioContext();

  stopBinauralBeats();

  masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.5);
  masterGain.connect(ctx.destination);

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
      oscillators = [];
      gainNodes = [];
      panners = [];
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
