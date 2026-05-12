export type FrequencyBand = 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';
export type Sex = 'male' | 'female' | 'other';
export type AudioMode = 'binaural' | 'isochronic';

export interface FadeConfig {
  enabled: boolean;
  beatFreq: number; // 0 | 1.5 | 3 | 6
  duration: number; // in minutes
}

export interface FrequencyBandConfig {
  name: string;
  beatFreq: { min: number; max: number };
  description: string;
  benefits: string[];
  icon: string;
  optimalCarrier: number; // For age 63+
}

export interface UserSettings {
  age: number;
  sex: Sex;
  brownianNoiseEnabled?: boolean;
  pinkNoiseEnabled?: boolean;
}

export interface SessionHistory {
  id: string;
  band: FrequencyBand;
  carrierFrequency: number;
  duration: number; // in minutes
  timestamp: number;
  completed: boolean;
  beatFrequency?: number; // Added for beat frequency tracking
  audioMode?: AudioMode; // 'binaural' or 'isochronic'
}

export interface AppState {
  settings: UserSettings;
  sessions: SessionHistory[];
}
