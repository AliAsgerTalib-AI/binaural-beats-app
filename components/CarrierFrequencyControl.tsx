'use client';

interface CarrierFrequencyControlProps {
  carrierFrequency: number;
  onCarrierChange: (frequency: number) => void;
  min: number;
  max: number;
  optimal: number;
  disabled?: boolean;
}

export default function CarrierFrequencyControl({
  carrierFrequency,
  onCarrierChange,
  min,
  max,
  optimal,
  disabled = false,
}: CarrierFrequencyControlProps) {
  const isOptimal = Math.abs(carrierFrequency - optimal) <= 5;

  return (
    <div className="space-y-4">
      {/* Frequency Display */}
      <div className="p-4 rounded-xl bg-orange-100 border-2 border-orange-300 shadow-sm">
        <div className="text-center">
          <div className="text-4xl font-bold text-orange-700">{carrierFrequency}</div>
          <div className="text-xs text-orange-600 mt-1">Hz (Carrier Frequency)</div>
          {isOptimal && (
            <div className="text-xs text-green-700 mt-2 font-semibold">✓ Optimal for your age</div>
          )}
          <div className="text-xs text-amber-700 mt-1">Range: {min} - {max} Hz</div>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <input
          type="range"
          min={min}
          max={max}
          step={5}
          value={carrierFrequency}
          onChange={(e) => onCarrierChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #d97745 0%, #e89968 ${
              ((carrierFrequency - min) / (max - min)) * 100
            }%, #fed7aa ${((carrierFrequency - min) / (max - min)) * 100}%, #fed7aa 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-amber-700">
          <span>{min} Hz</span>
          <span className="text-orange-700 font-semibold">{optimal} Hz (Optimal)</span>
          <span>{max} Hz</span>
        </div>
      </div>

      {/* Quick Adjust Buttons */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => onCarrierChange(Math.max(min, carrierFrequency - 20))}
          disabled={disabled || carrierFrequency <= min}
          className="p-2 rounded-lg bg-orange-200 hover:bg-orange-300 text-sm font-semibold text-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          -20
        </button>
        <button
          onClick={() => onCarrierChange(Math.max(min, carrierFrequency - 5))}
          disabled={disabled || carrierFrequency <= min}
          className="p-2 rounded-lg bg-orange-200 hover:bg-orange-300 text-sm font-semibold text-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          -5
        </button>
        <button
          onClick={() => onCarrierChange(Math.min(max, carrierFrequency + 5))}
          disabled={disabled || carrierFrequency >= max}
          className="p-2 rounded-lg bg-orange-200 hover:bg-orange-300 text-sm font-semibold text-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          +5
        </button>
        <button
          onClick={() => onCarrierChange(Math.min(max, carrierFrequency + 20))}
          disabled={disabled || carrierFrequency >= max}
          className="p-2 rounded-lg bg-orange-200 hover:bg-orange-300 text-sm font-semibold text-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          +20
        </button>
      </div>

      {/* Reset to Optimal Button */}
      {!isOptimal && (
        <button
          onClick={() => onCarrierChange(optimal)}
          disabled={disabled}
          className="w-full p-2 rounded-lg bg-gradient-to-r from-orange-200 to-amber-200 hover:from-orange-300 hover:to-amber-300 text-orange-900 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset to Optimal ({optimal} Hz)
        </button>
      )}
    </div>
  );
}
