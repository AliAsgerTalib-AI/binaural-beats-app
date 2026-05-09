'use client';

interface TimerSelectorProps {
  selectedDuration: number;
  onDurationChange: (duration: number) => void;
  disabled?: boolean;
}

const DURATIONS = [15, 30, 45, 60];

export default function TimerSelector({ selectedDuration, onDurationChange, disabled = false }: TimerSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {DURATIONS.map((duration) => (
        <button
          key={duration}
          onClick={() => onDurationChange(duration)}
          disabled={disabled}
          className={`p-4 rounded-lg transition-all duration-200 font-semibold text-center ${
            selectedDuration === duration
              ? 'bg-gradient-to-br from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/50 scale-105'
              : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="text-lg font-bold">{duration}</div>
          <div className="text-xs text-slate-400 mt-1">min</div>
        </button>
      ))}
    </div>
  );
}
