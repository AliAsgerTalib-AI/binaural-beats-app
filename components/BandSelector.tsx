'use client';

import { FrequencyBand } from '@/lib/types';
import { frequencyBands } from '@/lib/frequencyData';

interface BandSelectorProps {
  selectedBand: FrequencyBand;
  onBandChange: (band: FrequencyBand) => void;
  disabled?: boolean;
}

export default function BandSelector({ selectedBand, onBandChange, disabled = false }: BandSelectorProps) {
  const bands: FrequencyBand[] = ['delta', 'theta', 'alpha', 'beta', 'gamma'];

  return (
    <div className="grid grid-cols-5 gap-2">
      {bands.map((band) => (
        <button
          key={band}
          onClick={() => onBandChange(band)}
          disabled={disabled}
          className={`p-3 rounded-lg transition-all duration-200 flex flex-col items-center gap-1 ${
            selectedBand === band
              ? 'bg-gradient-to-br from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/50 scale-105'
              : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className="text-2xl">{frequencyBands[band].icon}</span>
          <span className="text-xs font-semibold uppercase tracking-wider">
            {frequencyBands[band].name}
          </span>
        </button>
      ))}
    </div>
  );
}
