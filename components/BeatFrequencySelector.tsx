'use client';

import { useState } from 'react';
import { FrequencyBand, UserSettings } from '@/lib/types';
import {
  getFrequenciesFromBeatFrequency,
  getRecommendedBeatFrequencies,
  frequencyBands,
} from '@/lib/frequencyData';

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

  const { leftFreq, rightFreq, band } = getFrequenciesFromBeatFrequency(
    beatFrequency,
    settings.age,
    settings.sex
  );

  const recommendations = getRecommendedBeatFrequencies();
  const currentBand = frequencyBands[band];

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

      {/* Combined Presets and All Options */}
      <div>
        <label className="block text-xs font-semibold text-amber-900 uppercase tracking-wider mb-3">
          Frequency Presets
        </label>
        <div className="grid grid-cols-3 gap-2">
          {recommendations.map((rec) => (
            <button
              key={rec.beatFreq}
              onClick={() => {
                handleCustomChange(rec.beatFreq);
              }}
              disabled={disabled}
              className={`p-3 rounded-lg transition-all border-2 text-center ${
                beatFrequency === rec.beatFreq
                  ? 'bg-orange-500 border-orange-600 text-white shadow-lg'
                  : 'bg-white border-orange-200 hover:border-orange-400 text-orange-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="font-bold text-sm">{rec.label}</div>
              <div className="text-xs mt-1 opacity-75">{rec.use.split(',')[0]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Frequency Slider */}
      <div className="p-4 rounded-lg bg-orange-50 border-2 border-orange-200 space-y-3">
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

        <div className="text-xs text-orange-700 space-y-1">
          <p>δ Delta: 0.5-4 Hz | θ Theta: 6-8 Hz | α Alpha: 8-12 Hz</p>
          <p>β Beta: 12-30 Hz | γ Gamma: 30-100 Hz</p>
        </div>
      </div>

      {/* Frequency Display Card */}
      <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-300 shadow-md space-y-4">
        {/* Band Info */}
        <div className="text-center pb-4 border-b-2 border-orange-200">
          <div className="text-3xl mb-2">{currentBand.icon}</div>
          <h3 className="text-lg font-bold text-orange-700">{currentBand.name} Band</h3>
          <p className="text-xs text-amber-700 mt-1">{currentBand.description}</p>
        </div>

        {/* Frequency Details */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-white border-2 border-orange-200">
              <div className="text-xs text-amber-700 font-semibold mb-1">Beat</div>
              <div className="text-2xl font-bold text-orange-600">{beatFrequency.toFixed(1)}</div>
              <div className="text-xs text-amber-600">Hz</div>
            </div>
            <div className="p-3 rounded-lg bg-white border-2 border-blue-200">
              <div className="text-xs text-blue-700 font-semibold mb-1">Left</div>
              <div className="text-2xl font-bold text-blue-600">{leftFreq}</div>
              <div className="text-xs text-blue-600">Hz</div>
            </div>
            <div className="p-3 rounded-lg bg-white border-2 border-purple-200">
              <div className="text-xs text-purple-700 font-semibold mb-1">Right</div>
              <div className="text-2xl font-bold text-purple-600">{rightFreq}</div>
              <div className="text-xs text-purple-600">Hz</div>
            </div>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap gap-2 justify-center">
            {currentBand.benefits.map((benefit) => (
              <span
                key={benefit}
                className="px-3 py-1 rounded-full bg-orange-200 text-orange-900 text-xs font-medium"
              >
                {benefit}
              </span>
            ))}
          </div>

          {/* Scientific Note */}
          <div className="p-3 rounded-lg bg-blue-50 border-l-4 border-blue-400 text-xs text-blue-800">
            <p className="font-semibold mb-1">📊 Optimized for you:</p>
            <p>
              Age {settings.age} • {settings.sex === 'male' ? '♂' : '♀'} •
              Based on presbycusis adjustments for hearing sensitivity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
