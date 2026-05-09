export type FrequencyBand = 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';
export type Sex = 'male' | 'female' | 'other';

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
}

export interface SessionHistory {
  id: string;
  band: FrequencyBand;
  carrierFrequency: number;
  duration: number; // in minutes
  timestamp: number;
  completed: boolean;
}

export interface AppState {
  settings: UserSettings;
  sessions: SessionHistory[];
}
