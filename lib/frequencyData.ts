import { FrequencyBand, FrequencyBandConfig, Sex } from './types';

export const frequencyBands: Record<FrequencyBand, FrequencyBandConfig> = {
  delta: {
    name: 'Delta',
    beatFreq: { min: 0.5, max: 4 },
    description: 'Deep Sleep & Recovery',
    benefits: ['Deep sleep', 'Physical healing', 'Pain relief', 'Restoration'],
    icon: '😴',
    optimalCarrier: 200, // Age 63+: prefer lower-mid (presbycusis)
  },
  theta: {
    name: 'Theta',
    beatFreq: { min: 6, max: 8 },
    description: 'Meditation & Learning',
    benefits: ['Stress reduction', 'Meditation', 'Learning enhancement', 'Creativity'],
    icon: '🧘',
    optimalCarrier: 260, // Age 63+: balanced, natural
  },
  alpha: {
    name: 'Alpha',
    beatFreq: { min: 8, max: 12 },
    description: 'Relaxed Focus',
    benefits: ['Light meditation', 'Relaxed attention', 'Creativity', 'Calm focus'],
    icon: '🌊',
    optimalCarrier: 280, // Age 63+: versatile
  },
  beta: {
    name: 'Beta',
    beatFreq: { min: 12, max: 30 },
    description: 'Cognitive Performance',
    benefits: ['Focus & alertness', 'Problem-solving', 'Productivity', 'Mental clarity'],
    icon: '🎯',
    optimalCarrier: 340, // Age 63+: clear focus tone
  },
  gamma: {
    name: 'Gamma',
    beatFreq: { min: 30, max: 100 },
    description: 'Peak Performance',
    benefits: ['Peak focus', 'Rapid coordination', 'Advanced processing', 'Intense cognition'],
    icon: '⚡',
    optimalCarrier: 480, // Age 63+: bright, precise (lower than young due to presbycusis)
  },
};

// Carrier frequency recommendations based on age
export const getOptimalCarrier = (age: number, band: FrequencyBand): number => {
  let ageMultiplier = 1.0;

  if (age >= 65) {
    // Significant presbycusis; prefer lower carriers
    ageMultiplier = 0.85;
  } else if (age >= 51) {
    // Moderate presbycusis
    ageMultiplier = 0.9;
  } else if (age >= 36) {
    // Early presbycusis beginning
    ageMultiplier = 0.95;
  }

  const baseCarrier = frequencyBands[band].optimalCarrier;
  return Math.round(baseCarrier * ageMultiplier);
};

// Get carrier range for user adjustments
export const getCarrierRange = (band: FrequencyBand): { min: number; max: number } => {
  const ranges: Record<FrequencyBand, { min: number; max: number }> = {
    delta: { min: 150, max: 250 },
    theta: { min: 180, max: 320 },
    alpha: { min: 200, max: 350 },
    beta: { min: 250, max: 500 },
    gamma: { min: 350, max: 750 },
  };
  return ranges[band];
};

// Determine which band a beat frequency falls into
export const getBandFromBeatFrequency = (beatFreq: number): FrequencyBand => {
  if (beatFreq <= 4) return 'delta';
  if (beatFreq <= 8) return 'theta';
  if (beatFreq <= 12) return 'alpha';
  if (beatFreq <= 30) return 'beta';
  return 'gamma';
};

// Calculate optimal left and right frequencies from beat frequency
export const getFrequenciesFromBeatFrequency = (
  beatFrequency: number,
  age: number,
  sex: Sex
): { leftFreq: number; rightFreq: number; band: FrequencyBand } => {
  const band = getBandFromBeatFrequency(beatFrequency);

  // Get optimal carrier based on age and sex
  let baseCarrier = frequencyBands[band].optimalCarrier;

  // Age adjustment (presbycusis)
  if (age >= 65) {
    baseCarrier *= 0.85;
  } else if (age >= 51) {
    baseCarrier *= 0.9;
  } else if (age >= 36) {
    baseCarrier *= 0.95;
  }

  // Sex adjustment (research shows women typically have slightly higher hearing sensitivity)
  // but this is subtle and individual variation is large; keep it minimal
  if (sex === 'female') {
    baseCarrier *= 0.98; // Slight adjustment
  }

  // Ensure frequencies are in human hearing range (20-20000 Hz)
  const leftFreq = Math.max(20, Math.min(20000, Math.round(baseCarrier)));
  const rightFreq = Math.max(20, Math.min(20000, Math.round(baseCarrier + beatFrequency)));

  return { leftFreq, rightFreq, band };
};

// Get recommended beat frequencies for common use cases
export const getRecommendedBeatFrequencies = (): Array<{
  beatFreq: number;
  label: string;
  use: string;
}> => [
  { beatFreq: 1.5, label: '1.5 Hz', use: 'Deep sleep, pain relief' },
  { beatFreq: 3, label: '3 Hz', use: 'Sleep onset, memory consolidation' },
  { beatFreq: 6, label: '6 Hz', use: 'Meditation, stress relief' },
  { beatFreq: 7, label: '7 Hz', use: 'Creative flow, learning' },
  { beatFreq: 10, label: '10 Hz', use: 'Relaxed focus, light meditation' },
  { beatFreq: 15, label: '15 Hz', use: 'Problem-solving, alertness' },
  { beatFreq: 20, label: '20 Hz', use: 'Mental clarity, focus' },
  { beatFreq: 40, label: '40 Hz', use: 'Peak cognition, intense focus' },
];
