import { FrequencyBand } from './types';
import { frequencyBands } from './frequencyData';

interface HealthMetrics {
  restingHeartRate: number | null;
  heartRateVariability: number | null;
  sleepQuality: number | null;
  stressLevel: number | null;
}

interface OptimizedFrequencies {
  beatFrequency: number;
  carrierFrequency: number;
  recommendation: string;
}

/**
 * Customize binaural beat frequencies based on user's health metrics from Google Fit
 * Returns optimized beat and carrier frequencies
 */
export const customizeFrequencies = (
  band: FrequencyBand,
  age: number,
  healthMetrics: HealthMetrics,
  baseCarrierFrequency: number
): OptimizedFrequencies => {
  // If no health data available, use defaults
  if (!healthMetrics || Object.values(healthMetrics).every((v) => v === null)) {
    const bandConfig = frequencyBands[band];
    const midBeat = Math.round((bandConfig.beatFreq.min + bandConfig.beatFreq.max) / 2);
    return {
      beatFrequency: midBeat,
      carrierFrequency: baseCarrierFrequency,
      recommendation: 'No health data available; using standard frequencies',
    };
  }

  // Determine baseline stress/arousal level
  const stressLevel = healthMetrics.stressLevel ?? 50;
  const restingHeartRate = healthMetrics.restingHeartRate ?? 70;
  const sleepQuality = healthMetrics.sleepQuality ?? 50;

  // Logic: High stress/arousal → use lower frequencies; Low stress → can use higher
  let frequencyShift = 0; // -1 = lower freq, 0 = normal, +1 = higher freq

  if (stressLevel > 70) {
    frequencyShift = -1; // Very stressed: use lower frequencies
  } else if (stressLevel > 55) {
    frequencyShift = -0.5; // Moderately stressed
  } else if (stressLevel < 30) {
    frequencyShift = 1; // Very calm: can handle higher frequencies
  }

  // Special logic for insomnia (sleep quality < 40%)
  if (sleepQuality !== null && sleepQuality < 40 && band === 'theta') {
    // Shift down for insomnia support
    frequencyShift = -1;
  }

  // Calculate beat frequency with adjustment
  const bandConfig = frequencyBands[band];
  const baseRange = bandConfig.beatFreq.max - bandConfig.beatFreq.min;
  let beatFrequency = Math.round((bandConfig.beatFreq.min + bandConfig.beatFreq.max) / 2);

  // Adjust beat frequency based on stress
  if (frequencyShift < 0) {
    beatFrequency = Math.round(bandConfig.beatFreq.min + baseRange * 0.25);
  } else if (frequencyShift > 0) {
    beatFrequency = Math.round(bandConfig.beatFreq.min + baseRange * 0.75);
  }

  // Adjust carrier frequency based on health data
  let adjustedCarrier = baseCarrierFrequency;

  // High resting heart rate suggests sympathetic dominance: lower carrier
  if (restingHeartRate > 85) {
    adjustedCarrier = Math.round(baseCarrierFrequency * 0.95);
  }
  // Low resting heart rate suggests parasympathetic tone: can use slightly higher
  else if (restingHeartRate < 60) {
    adjustedCarrier = Math.round(baseCarrierFrequency * 1.05);
  }

  // Generate recommendation text
  let recommendation = '';
  if (stressLevel > 70) {
    recommendation = `High stress detected (HR: ${restingHeartRate} bpm). Using calming frequencies.`;
  } else if (sleepQuality !== null && sleepQuality < 40) {
    recommendation = `Poor sleep detected (${sleepQuality}% good nights). Using delta frequencies for deep sleep support.`;
  } else if (stressLevel < 30) {
    recommendation = `Low stress detected. Using balanced frequencies for relaxation.`;
  } else {
    recommendation = 'Frequencies optimized based on your health metrics.';
  }

  return {
    beatFrequency,
    carrierFrequency: adjustedCarrier,
    recommendation,
  };
};

/**
 * Generate protocol recommendation based on health metrics
 * Returns suggested frequency band to use
 */
export const recommendProtocol = (healthMetrics: HealthMetrics): FrequencyBand => {
  if (!healthMetrics || Object.values(healthMetrics).every((v) => v === null)) {
    return 'theta'; // Default to theta
  }

  const stressLevel = healthMetrics.stressLevel ?? 50;
  const sleepQuality = healthMetrics.sleepQuality ?? 50;

  // If poor sleep, prioritize delta
  if (sleepQuality !== null && sleepQuality < 40) {
    return 'delta';
  }

  // If high stress, use theta or alpha
  if (stressLevel > 70) {
    return 'theta';
  }

  // If moderate stress, use alpha
  if (stressLevel > 40) {
    return 'alpha';
  }

  // If low stress, can use beta or gamma
  return 'alpha'; // Still alpha is safest for general use
};

/**
 * Get session duration recommendation based on health
 */
export const recommendSessionDuration = (healthMetrics: HealthMetrics): number => {
  if (!healthMetrics || Object.values(healthMetrics).every((v) => v === null)) {
    return 30; // Default 30 min
  }

  const sleepQuality = healthMetrics.sleepQuality ?? 50;

  // Poor sleep: longer sessions (45+ min)
  if (sleepQuality < 40) {
    return 45;
  }

  // Average sleep: standard 30 min
  if (sleepQuality < 70) {
    return 30;
  }

  // Good sleep: shorter, maintenance session (15-20 min)
  return 20;
};

/**
 * Format health metrics for display
 */
export const formatHealthMetrics = (metrics: HealthMetrics): string[] => {
  const lines: string[] = [];

  if (metrics.restingHeartRate !== null) {
    lines.push(`Resting HR: ${metrics.restingHeartRate} bpm`);
  }

  if (metrics.heartRateVariability !== null) {
    lines.push(`HRV: ${metrics.heartRateVariability} ms`);
  }

  if (metrics.sleepQuality !== null) {
    lines.push(`Sleep quality: ${metrics.sleepQuality}%`);
  }

  if (metrics.stressLevel !== null) {
    lines.push(`Stress level: ${Math.round(metrics.stressLevel)}/100`);
  }

  return lines;
};
