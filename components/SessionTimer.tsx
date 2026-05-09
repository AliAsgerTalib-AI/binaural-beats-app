'use client';

import { useEffect, useState } from 'react';
import { FrequencyBand } from '@/lib/types';
import { frequencyBands } from '@/lib/frequencyData';
import { startBinauralBeats, stopBinauralBeats, setVolume } from '@/lib/audioSynthesis';

interface SessionTimerProps {
  band: FrequencyBand;
  carrierFrequency: number;
  beatFrequency: number;
  duration: number; // in minutes
  onComplete: () => void;
  onCancel: () => void;
}

export default function SessionTimer({
  band,
  carrierFrequency,
  beatFrequency,
  duration,
  onComplete,
  onCancel,
}: SessionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // in seconds
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolumeState] = useState(0.3); // 30% default

  const totalSeconds = duration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    if (isPaused) {
      stopBinauralBeats();
      return;
    }

    startBinauralBeats(carrierFrequency, carrierFrequency + beatFrequency, volume);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          stopBinauralBeats();
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      stopBinauralBeats();
    };
  }, [isPaused, carrierFrequency, beatFrequency, volume, onComplete]);

  const handleVolumeChange = (newVolume: number) => {
    setVolumeState(newVolume);
    setVolume(newVolume);
  };

  return (
    <div className="space-y-8">
      {/* Session Info */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-300 shadow-md">
        <div className="text-center">
          <div className="text-3xl mb-2">{frequencyBands[band].icon}</div>
          <h3 className="text-lg font-bold text-orange-700">{frequencyBands[band].name}</h3>
          <p className="text-sm text-amber-800 mt-1">{carrierFrequency} Hz Carrier</p>
        </div>
      </div>

      {/* Timer Display */}
      <div className="relative w-full aspect-square max-w-xs mx-auto">
        {/* Circular Progress Background */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(15, 23, 42, 0.5)"
            strokeWidth="3"
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="3"
            strokeDasharray={`${(progress / 100) * 2 * Math.PI * 45} ${2 * Math.PI * 45}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s linear' }}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97745" />
              <stop offset="100%" stopColor="#e89968" />
            </linearGradient>
          </defs>
        </svg>

        {/* Timer Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="text-sm text-amber-700 mt-2">
            {Math.round(progress)}% Complete
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="py-3 rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold transition-all"
        >
          {isPaused ? '▶ Resume' : '⏸ Pause'}
        </button>
        <button
          onClick={onCancel}
          className="py-3 rounded-lg bg-orange-300 hover:bg-orange-400 text-orange-900 font-bold transition-all"
        >
          ✕ Cancel
        </button>
      </div>

      {/* Volume Control */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-amber-900 uppercase tracking-wider">
          Volume: {Math.round(volume * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          disabled={isPaused}
          className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #d97745 0%, #e89968 ${
              volume * 100
            }%, #fed7aa ${volume * 100}%, #fed7aa 100%)`,
          }}
        />
        <p className="text-xs text-amber-700">
          Recommended: 40-50% for comfort. Range: 0-100%
        </p>
      </div>

      {/* Info Message */}
      <div className="p-3 rounded-lg bg-orange-100 border-2 border-orange-300 text-center">
        <p className="text-xs text-orange-700 font-medium">
          {isPaused ? '⏸ Session paused (audio stopped)' : '🔊 Audio playing - binaural beats active'}
        </p>
        <p className="text-xs text-amber-700 mt-2">
          Beat frequency: {beatFrequency} Hz | Left: {carrierFrequency} Hz | Right: {carrierFrequency + beatFrequency} Hz
        </p>
      </div>
    </div>
  );
}
