/**
 * AudioSynthesizer: Encapsulates Web Audio API state and operations
 * Replaces module-level globals with class-based state management
 */

import { dbToLinearGain } from './audioUtils';

export class AudioSynthesizer {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private panners: StereoPannerNode[] = [];
  private masterGain: GainNode | null = null;
  private pinkNoiseSource: AudioBufferSourceNode | null = null;
  private pinkNoiseGain: GainNode | null = null;
  private pinkNoiseFilter: BiquadFilterNode | null = null;
  private brownianNoiseSource: AudioBufferSourceNode | null = null;
  private brownianNoiseGain: GainNode | null = null;
  private isochronicCarrierOsc: OscillatorNode | null = null;
  private isochronicPulseGain: GainNode | null = null;

  private initAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  private generatePinkNoiseBuffer(duration: number = 2): AudioBuffer {
    const ctx = this.initAudioContext();
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

      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6) * 0.6;
    }

    return buffer;
  }

  private generateBrownianNoiseBuffer(duration: number = 2): AudioBuffer {
    const ctx = this.initAudioContext();
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    let lastValue = 0;

    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      lastValue += white;
      data[i] = (lastValue / Math.sqrt(i + 1)) * 0.1;
    }

    return buffer;
  }

  public startBinauralBeats(
    leftCarrier: number,
    rightCarrier: number,
    volumeDb: number = -20,
    useNoise: boolean = false,
    noiseType: 'pink' | 'brownian' = 'pink',
    fadeIn?: { startLeft: number; startRight: number; duration: number },
    fadeOut?: { endLeft: number; endRight: number; duration: number; sessionDuration: number }
  ): void {
    const ctx = this.initAudioContext();
    this.stopBinauralBeats();

    const linearGain = dbToLinearGain(volumeDb);
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(linearGain, ctx.currentTime + 0.5);
    this.masterGain.connect(ctx.destination);

    // Add pink noise if enabled
    if (useNoise && noiseType === 'pink') {
      this.pinkNoiseGain = ctx.createGain();
      this.pinkNoiseGain.gain.setValueAtTime(0.15, ctx.currentTime);
      this.pinkNoiseGain.connect(this.masterGain);

      this.pinkNoiseFilter = ctx.createBiquadFilter();
      this.pinkNoiseFilter.type = 'lowpass';
      this.pinkNoiseFilter.frequency.setValueAtTime(10000, ctx.currentTime);
      this.pinkNoiseFilter.connect(this.pinkNoiseGain);

      const pinkBuffer = this.generatePinkNoiseBuffer(30);
      this.pinkNoiseSource = ctx.createBufferSource();
      this.pinkNoiseSource.buffer = pinkBuffer;
      this.pinkNoiseSource.loop = true;
      this.pinkNoiseSource.connect(this.pinkNoiseFilter);
      this.pinkNoiseSource.start();
    }

    // Add brownian noise if enabled
    if (useNoise && noiseType === 'brownian') {
      this.brownianNoiseGain = ctx.createGain();
      this.brownianNoiseGain.gain.setValueAtTime(0.12, ctx.currentTime);
      this.brownianNoiseGain.connect(this.masterGain);

      const brownianBuffer = this.generateBrownianNoiseBuffer(30);
      this.brownianNoiseSource = ctx.createBufferSource();
      this.brownianNoiseSource.buffer = brownianBuffer;
      this.brownianNoiseSource.loop = true;
      this.brownianNoiseSource.connect(this.brownianNoiseGain);
      this.brownianNoiseSource.start();
    }

    for (let i = 0; i < 2; i++) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(i === 0 ? leftCarrier : rightCarrier, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);

      const panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime(i === 0 ? -1 : 1, ctx.currentTime);

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.masterGain);

      osc.start();

      this.oscillators.push(osc);
      this.gainNodes.push(gain);
      this.panners.push(panner);
    }

    // Apply fade in if enabled
    if (fadeIn) {
      this.oscillators[0].frequency.setValueAtTime(fadeIn.startLeft, ctx.currentTime);
      this.oscillators[1].frequency.setValueAtTime(fadeIn.startRight, ctx.currentTime);
      this.oscillators[0].frequency.linearRampToValueAtTime(leftCarrier, ctx.currentTime + fadeIn.duration);
      this.oscillators[1].frequency.linearRampToValueAtTime(rightCarrier, ctx.currentTime + fadeIn.duration);
    }

    // Apply fade out if enabled
    if (fadeOut) {
      const fadeOutStart = ctx.currentTime + fadeOut.sessionDuration - fadeOut.duration;
      this.oscillators[0].frequency.setValueAtTime(leftCarrier, fadeOutStart);
      this.oscillators[1].frequency.setValueAtTime(rightCarrier, fadeOutStart);
      this.oscillators[0].frequency.linearRampToValueAtTime(fadeOut.endLeft, ctx.currentTime + fadeOut.sessionDuration);
      this.oscillators[1].frequency.linearRampToValueAtTime(fadeOut.endRight, ctx.currentTime + fadeOut.sessionDuration);
    }
  }

  public startIsochronicTones(
    carrierFreq: number,
    beatFrequency: number,
    duration: number,
    volumeDb: number = -20,
    useNoise: boolean = false,
    noiseType: 'pink' | 'brownian' = 'pink'
  ): void {
    const ctx = this.initAudioContext();
    this.stopIsochronicTones();

    const linearGain = dbToLinearGain(volumeDb);
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(linearGain, ctx.currentTime + 0.5);
    this.masterGain.connect(ctx.destination);

    // Add pink noise if enabled
    if (useNoise && noiseType === 'pink') {
      this.pinkNoiseGain = ctx.createGain();
      this.pinkNoiseGain.gain.setValueAtTime(0.15, ctx.currentTime);
      this.pinkNoiseGain.connect(this.masterGain);

      this.pinkNoiseFilter = ctx.createBiquadFilter();
      this.pinkNoiseFilter.type = 'lowpass';
      this.pinkNoiseFilter.frequency.setValueAtTime(10000, ctx.currentTime);
      this.pinkNoiseFilter.connect(this.pinkNoiseGain);

      const pinkBuffer = this.generatePinkNoiseBuffer(30);
      this.pinkNoiseSource = ctx.createBufferSource();
      this.pinkNoiseSource.buffer = pinkBuffer;
      this.pinkNoiseSource.loop = true;
      this.pinkNoiseSource.connect(this.pinkNoiseFilter);
      this.pinkNoiseSource.start();
    }

    // Add brownian noise if enabled
    if (useNoise && noiseType === 'brownian') {
      this.brownianNoiseGain = ctx.createGain();
      this.brownianNoiseGain.gain.setValueAtTime(0.12, ctx.currentTime);
      this.brownianNoiseGain.connect(this.masterGain);

      const brownianBuffer = this.generateBrownianNoiseBuffer(30);
      this.brownianNoiseSource = ctx.createBufferSource();
      this.brownianNoiseSource.buffer = brownianBuffer;
      this.brownianNoiseSource.loop = true;
      this.brownianNoiseSource.connect(this.brownianNoiseGain);
      this.brownianNoiseSource.start();
    }

    // Create isochronic pulse envelope
    this.isochronicCarrierOsc = ctx.createOscillator();
    this.isochronicCarrierOsc.type = 'square';
    this.isochronicCarrierOsc.frequency.setValueAtTime(carrierFreq, ctx.currentTime);

    this.isochronicPulseGain = ctx.createGain();
    this.isochronicPulseGain.gain.setValueAtTime(0, ctx.currentTime);

    this.isochronicCarrierOsc.connect(this.isochronicPulseGain);
    this.isochronicPulseGain.connect(this.masterGain);

    // Pre-schedule pulses (50% duty cycle) with anti-click ramps
    const period = 1 / beatFrequency;
    const dutyCycle = 0.5;
    const startTime = ctx.currentTime;
    const rampTime = 0.005; // 5ms smooth ramp to avoid clicks

    for (let t = 0; t < duration; t += period) {
      const pulseStart = startTime + t;
      const pulseEnd = pulseStart + period * dutyCycle;

      // Smooth ramp up
      this.isochronicPulseGain.gain.linearRampToValueAtTime(0.3, pulseStart + rampTime);
      // Smooth ramp down
      this.isochronicPulseGain.gain.linearRampToValueAtTime(0, pulseEnd + rampTime);
    }

    this.isochronicCarrierOsc.start();
  }

  public stopBinauralBeats(): void {
    if (!this.masterGain || !this.audioContext) return;

    const fadeOutTime = 0.05;
    this.gainNodes.forEach((gain) => {
      gain.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + fadeOutTime);
    });

    this.masterGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);

    setTimeout(() => {
      this.oscillators.forEach((osc) => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });

      if (this.pinkNoiseSource) {
        try {
          this.pinkNoiseSource.stop();
        } catch (e) {
          // Already stopped
        }
        this.pinkNoiseSource = null;
      }

      if (this.brownianNoiseSource) {
        try {
          this.brownianNoiseSource.stop();
        } catch (e) {
          // Already stopped
        }
        this.brownianNoiseSource = null;
      }

      this.oscillators = [];
      this.gainNodes = [];
      this.panners = [];
      this.pinkNoiseGain = null;
      this.pinkNoiseFilter = null;
      this.brownianNoiseGain = null;
      this.masterGain = null;
    }, 500);
  }

  public stopIsochronicTones(): void {
    if (!this.masterGain || !this.audioContext) return;

    const fadeOutTime = 0.05;
    if (this.isochronicPulseGain) {
      this.isochronicPulseGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + fadeOutTime);
    }

    this.masterGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);

    setTimeout(() => {
      if (this.isochronicCarrierOsc) {
        try {
          this.isochronicCarrierOsc.stop();
        } catch (e) {
          // Already stopped
        }
        this.isochronicCarrierOsc = null;
      }

      if (this.pinkNoiseSource) {
        try {
          this.pinkNoiseSource.stop();
        } catch (e) {
          // Already stopped
        }
        this.pinkNoiseSource = null;
      }

      if (this.brownianNoiseSource) {
        try {
          this.brownianNoiseSource.stop();
        } catch (e) {
          // Already stopped
        }
        this.brownianNoiseSource = null;
      }

      this.isochronicPulseGain = null;
      this.pinkNoiseGain = null;
      this.pinkNoiseFilter = null;
      this.brownianNoiseGain = null;
      this.masterGain = null;
    }, 500);
  }

  public setVolume(volumeDb: number): void {
    if (!this.masterGain || !this.audioContext) return;
    const linearGain = dbToLinearGain(volumeDb);
    this.masterGain.gain.linearRampToValueAtTime(
      linearGain,
      this.audioContext.currentTime + 0.1
    );
  }

  public getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  public isAudioPlaying(): boolean {
    return this.oscillators.length > 0;
  }

  public dispose(): void {
    this.stopBinauralBeats();
    this.stopIsochronicTones();
    this.audioContext = null;
  }
}

// Export singleton instance
export const synthesizer = new AudioSynthesizer();
