'use client';

import { useState } from 'react';
import { FrequencyBand, UserSettings } from '@/lib/types';
import {
  getFrequenciesFromBeatFrequency,
  getRecommendedBeatFrequencies,
  frequencyBands,
} from '@/lib/frequencyData';

// Threshold for detecting when user is near 40 Hz (neuroprotection frequency)
const NEUROPROTECTION_FREQUENCY = 40;
const FREQUENCY_MATCH_THRESHOLD = 0.5;

interface BeatFrequencySelectorProps {
  beatFrequency: number;
  onBeatFrequencyChange: (frequency: number) => void;
  settings: UserSettings;
  disabled?: boolean;
}

export default function BeatFrequencySelector({
  beatFrequency,
  onBeatFrequencyChange,
  settings,
  disabled = false,
}: BeatFrequencySelectorProps) {
  const [customValue, setCustomValue] = useState(beatFrequency);

  const { band } = getFrequenciesFromBeatFrequency(
    beatFrequency,
    settings.age,
    settings.sex
  );

  const recommendations = getRecommendedBeatFrequencies();

  const handleCustomChange = (value: number) => {
    setCustomValue(value);
    onBeatFrequencyChange(value);
  };

  const handleBandButtonClick = (bandName: FrequencyBand) => {
    const bandConfig = frequencyBands[bandName];
    const midFrequency = (bandConfig.beatFreq.min + bandConfig.beatFreq.max) / 2;
    handleCustomChange(midFrequency);
  };

  return (
    <div className="space-y-6">
      {/* Standard Frequency Bands - Top Row */}
      <div>
        <label className="block text-xs font-semibold text-amber-900 uppercase tracking-wider mb-3">
          Frequency Bands
        </label>
        <div className="grid grid-cols-5 gap-2">
          {(Object.keys(frequencyBands) as FrequencyBand[]).map((bandKey) => {
            const bandData = frequencyBands[bandKey];
            const midFreq = (bandData.beatFreq.min + bandData.beatFreq.max) / 2;
            return (
              <button
                key={bandKey}
                onClick={() => handleBandButtonClick(bandKey)}
                disabled={disabled}
                className={`p-3 rounded-lg transition-all border-2 text-center ${
                  band === bandKey
                    ? 'bg-orange-500 border-orange-600 text-white shadow-lg'
                    : 'bg-white border-orange-200 hover:border-orange-400 text-orange-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="text-xl mb-1">{bandData.icon}</div>
                <div className="font-bold text-xs">{bandData.name}</div>
                <div className="text-xs opacity-75 mt-1">{midFreq.toFixed(1)} Hz</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Frequency Preset Dropdown */}
      <div>
        <label className="block text-xs font-semibold text-amber-900 uppercase tracking-wider mb-3">
          Frequency Preset
        </label>
        <select
          value={recommendations.find(r => r.beatFreq === beatFrequency)?.beatFreq ?? ''}
          onChange={(e) => {
            if (e.target.value) handleCustomChange(parseFloat(e.target.value));
          }}
          disabled={disabled}
          className="w-full px-3 py-2 rounded-lg border-2 border-orange-300 bg-white text-orange-700 font-semibold appearance-none cursor-pointer focus:outline-none focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Custom ({beatFrequency.toFixed(1)} Hz)</option>
          {recommendations.map((rec) => (
            <option key={rec.beatFreq} value={rec.beatFreq}>
              {rec.label} — {rec.use.split(',')[0]}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Frequency Slider */}
      <div className={`p-4 rounded-lg space-y-3 ${
        Math.abs(customValue - NEUROPROTECTION_FREQUENCY) < FREQUENCY_MATCH_THRESHOLD
          ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-400'
          : 'bg-orange-50 border-2 border-orange-200'
      }`}>
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-orange-700">
            Beat Frequency (Hz)
          </label>
          <input
            type="number"
            value={customValue}
            onChange={(e) => handleCustomChange(parseFloat(e.target.value) || 0)}
            min="0.1"
            max="100"
            step="0.1"
            disabled={disabled}
            className="w-20 px-2 py-1 rounded border-2 border-orange-300 text-orange-700 font-bold text-right"
          />
        </div>

        <input
          type="range"
          min="0.1"
          max="100"
          step="0.1"
          value={customValue}
          onChange={(e) => handleCustomChange(parseFloat(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #d97745 0%, #f97316 ${
              ((customValue - 0.1) / (100 - 0.1)) * 100
            }%, #fcd5ce ${((customValue - 0.1) / (100 - 0.1)) * 100}%, #fcd5ce 100%)`,
          }}
        />

        {Math.abs(customValue - NEUROPROTECTION_FREQUENCY) < FREQUENCY_MATCH_THRESHOLD && (
          <div className="p-3 rounded-lg bg-white border-2 border-amber-400">
            <p className="text-xs font-semibold text-amber-900 mb-1">
              🧠 40 Hz Neuroprotection Focus
            </p>
            <p className="text-xs text-amber-800">
              40 Hz has the strongest clinical evidence for cognitive support, attention, and neuroprotection. Well-studied across multiple neuroscience research domains.
            </p>
          </div>
        )}

        <div className="text-xs text-orange-700 space-y-1">
          <p>δ Delta: 0.5-4 Hz | θ Theta: 6-8 Hz | α Alpha: 8-12 Hz</p>
          <p>β Beta: 12-30 Hz | γ Gamma: 30-100 Hz (40 Hz ⭐ recommended)</p>
        </div>
      </div>

    </div>
  );
}
