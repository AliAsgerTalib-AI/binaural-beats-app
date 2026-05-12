/**
 * audioSynthesis: Public API for audio synthesis
 * Uses AudioSynthesizer class for state management (encapsulated)
 * Maintains backward-compatible function-based interface
 */

import { synthesizer } from './AudioSynthesizer';

export const startBinauralBeats = (
  leftCarrier: number,
  rightCarrier: number,
  volume: number = 0.1,
  useNoise: boolean = false,
  noiseType: 'pink' | 'brownian' = 'pink',
  fadeIn?: { startLeft: number; startRight: number; duration: number },
  fadeOut?: { endLeft: number; endRight: number; duration: number; sessionDuration: number }
): (() => void) => {
  synthesizer.startBinauralBeats(leftCarrier, rightCarrier, volume, useNoise, noiseType, fadeIn, fadeOut);
  return stopBinauralBeats;
};

export const startIsochronicTones = (
  carrierFreq: number,
  beatFrequency: number,
  duration: number,
  volume: number = 0.1,
  useNoise: boolean = false,
  noiseType: 'pink' | 'brownian' = 'pink'
): (() => void) => {
  synthesizer.startIsochronicTones(carrierFreq, beatFrequency, duration, volume, useNoise, noiseType);
  return stopIsochronicTones;
};

export const stopBinauralBeats = (): void => {
  synthesizer.stopBinauralBeats();
};

export const stopIsochronicTones = (): void => {
  synthesizer.stopIsochronicTones();
};

export const setVolume = (volume: number): void => {
  synthesizer.setVolume(volume);
};

export const getAudioContext = (): AudioContext | null => {
  return synthesizer.getAudioContext();
};

export const isAudioPlaying = (): boolean => {
  return synthesizer.isAudioPlaying();
};
