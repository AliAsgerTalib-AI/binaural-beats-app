/**
 * Audio utility functions for dB and linear gain conversion
 */

export const dbToLinearGain = (dB: number): number => {
  return Math.pow(10, dB / 20);
};

export const linearGainToDb = (gain: number): number => {
  return 20 * Math.log10(Math.max(gain, 0.00001)); // Prevent log(0)
};

// Min and max dB values for the application
export const VOLUME_DB_MIN = -60; // Very quiet
export const VOLUME_DB_MAX = 0;   // Full volume
export const VOLUME_DB_DEFAULT = -20; // Default -20 dB (10% linear gain)
