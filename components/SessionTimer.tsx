'use client';

import { useEffect, useState } from 'react';
import { FrequencyBand, AudioMode, FadeConfig, Sex } from '@/lib/types';
import { frequencyBands, getFrequenciesFromBeatFrequency } from '@/lib/frequencyData';
import { startBinauralBeats, stopBinauralBeats, startIsochronicTones, stopIsochronicTones, setVolume } from '@/lib/audioSynthesis';
import { VOLUME_DB_MIN, VOLUME_DB_MAX, VOLUME_DB_DEFAULT } from '@/lib/audioUtils';

interface SessionTimerProps {
  band: FrequencyBand;
  carrierFrequency: number;
  beatFrequency: number;
  duration: number; // in minutes
  onComplete: () => void;
  onCancel: () => void;
  brownianNoiseEnabled: boolean;
  pinkNoiseEnabled: boolean;
  audioMode: AudioMode;
  fadeIn: FadeConfig;
  fadeOut: FadeConfig;
  age: number;
  sex: Sex;
}

export default function SessionTimer({
  band,
  carrierFrequency,
  beatFrequency,
  duration,
  onComplete,
  onCancel,
  brownianNoiseEnabled,
  pinkNoiseEnabled,
  audioMode,
  fadeIn,
  fadeOut,
  age,
  sex,
}: SessionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // in seconds
  const [isPaused, setIsPaused] = useState(false);
  const [volumeDb, setVolumeDb] = useState(VOLUME_DB_DEFAULT); // -20 dB default
  const [useNoise, setUseNoise] = useState(false);
  const [noiseType, setNoiseType] = useState<'pink' | 'brownian'>('pink');

  const totalSeconds = duration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Frequency band thresholds for noise recommendations
  const FREQUENCY_BANDS = {
    DELTA: { min: 0.5, max: 4 },
    ALPHA: { min: 8, max: 12 },
  } as const;

  // Determine frequency band and applicable noise type
  const isDeltaFrequency = beatFrequency >= FREQUENCY_BANDS.DELTA.min && beatFrequency < FREQUENCY_BANDS.DELTA.max;
  const isAlphaFrequency = beatFrequency >= FREQUENCY_BANDS.ALPHA.min && beatFrequency <= FREQUENCY_BANDS.ALPHA.max;

  // Check if noise type is enabled in settings
  const isBrownianAllowed = isDeltaFrequency && brownianNoiseEnabled;
  const isPinkAllowed = isAlphaFrequency && pinkNoiseEnabled;
  const noiseApplicable = isBrownianAllowed || isPinkAllowed;

  // Auto-select and enable appropriate noise type
  useEffect(() => {
    if (isBrownianAllowed) {
      setNoiseType('brownian');
      setUseNoise(true);
    } else if (isPinkAllowed) {
      setNoiseType('pink');
      setUseNoise(true);
    } else {
      setUseNoise(false);
    }
  }, [isBrownianAllowed, isPinkAllowed]);

  // Effect: Handle pause/resume
  useEffect(() => {
    if (isPaused) {
      if (audioMode === 'binaural') {
        stopBinauralBeats();
      } else {
        stopIsochronicTones();
      }
    }
  }, [isPaused, audioMode]);

  // Effect: Start audio when not paused
  useEffect(() => {
    if (isPaused) return;

    if (audioMode === 'binaural') {
      // Calculate fade in frequencies
      let fadeInAudio;
      if (fadeIn.enabled) {
        const startLeft = fadeIn.beatFreq === 0
          ? carrierFrequency
          : getFrequenciesFromBeatFrequency(fadeIn.beatFreq, age, sex).leftFreq;
        const startRight = fadeIn.beatFreq === 0
          ? carrierFrequency
          : startLeft + fadeIn.beatFreq;
        fadeInAudio = { startLeft, startRight, duration: fadeIn.duration * 60 };
      }

      // Calculate fade out frequencies
      let fadeOutAudio;
      if (fadeOut.enabled) {
        const endLeft = fadeOut.beatFreq === 0
          ? carrierFrequency
          : getFrequenciesFromBeatFrequency(fadeOut.beatFreq, age, sex).leftFreq;
        const endRight = fadeOut.beatFreq === 0
          ? carrierFrequency
          : endLeft + fadeOut.beatFreq;
        fadeOutAudio = { endLeft, endRight, duration: fadeOut.duration * 60, sessionDuration: duration * 60 };
      }

      startBinauralBeats(carrierFrequency, carrierFrequency + beatFrequency, volumeDb, useNoise, noiseType, fadeInAudio, fadeOutAudio);
    } else {
      startIsochronicTones(carrierFrequency, beatFrequency, duration * 60, volumeDb, useNoise, noiseType);
    }

    return () => {
      if (audioMode === 'binaural') {
        stopBinauralBeats();
      } else {
        stopIsochronicTones();
      }
    };
  }, [isPaused, carrierFrequency, beatFrequency, volumeDb, useNoise, noiseType, audioMode, duration, fadeIn, fadeOut, age, sex]);

  // Effect: Handle volume changes
  useEffect(() => {
    setVolume(volumeDb);
  }, [volumeDb]);

  // Effect: Manage timer countdown
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (audioMode === 'binaural') {
            stopBinauralBeats();
          } else {
            stopIsochronicTones();
          }
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isPaused, audioMode, onComplete]);

  const handleVolumeChange = (newVolumeDb: number) => {
    setVolumeDb(newVolumeDb);
    setVolume(newVolumeDb);
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
          Volume: {volumeDb} dB
        </label>
        <input
          type="range"
          min={VOLUME_DB_MIN}
          max={VOLUME_DB_MAX}
          step="1"
          value={volumeDb}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          disabled={isPaused}
          className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #d97745 0%, #e89968 ${
              ((volumeDb - VOLUME_DB_MIN) / (VOLUME_DB_MAX - VOLUME_DB_MIN)) * 100
            }%, #fed7aa ${
              ((volumeDb - VOLUME_DB_MIN) / (VOLUME_DB_MAX - VOLUME_DB_MIN)) * 100
            }%, #fed7aa 100%)`,
          }}
        />
        <p className="text-xs text-amber-700">
          Recommended: -20 to -10 dB for comfort. Range: -60 to 0 dB
        </p>
      </div>

      {/* Noise Toggle - Settings & Frequency-Specific */}
      {noiseApplicable ? (
        <div className="p-4 rounded-lg bg-green-50 border-2 border-green-300">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useNoise}
              onChange={(e) => setUseNoise(e.target.checked)}
              disabled={isPaused}
              className="w-5 h-5 rounded accent-green-600"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-800">
                ✓ {noiseType === 'brownian' ? 'Brownian Noise' : 'Pink Noise'} (Recommended)
              </p>
              <p className="text-xs text-green-700 mt-0.5">
                {noiseType === 'brownian'
                  ? 'Supports delta entrainment • Deep, low-frequency emphasis (-6dB/octave)'
                  : 'Enhances alpha synchronization • Balanced natural sound (wind, rain)'}
              </p>
            </div>
          </label>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-amber-50 border-2 border-amber-300">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={useNoise}
              disabled={true}
              className="w-5 h-5 rounded cursor-not-allowed opacity-50"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">Noise Not Available</p>
              <p className="text-xs text-amber-700 mt-0.5">
                {isDeltaFrequency && !brownianNoiseEnabled && (
                  <>Brownian Noise is disabled in settings</>
                )}
                {isAlphaFrequency && !pinkNoiseEnabled && (
                  <>Pink Noise is disabled in settings</>
                )}
                {!isDeltaFrequency && !isAlphaFrequency && (
                  <>Noise support is optimized for Delta (0.5-4 Hz) and Alpha (8-12 Hz). Current: {beatFrequency} Hz</>
                )}
              </p>
              <p className="text-xs text-amber-600 mt-2">
                Enable noise in Settings to use it for this frequency.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Message */}
      <div className="p-3 rounded-lg bg-orange-100 border-2 border-orange-300 text-center">
        <p className="text-xs text-orange-700 font-medium">
          {isPaused ? '⏸ Session paused (audio stopped)' : `🔊 Audio playing - ${audioMode === 'binaural' ? 'binaural beats' : 'isochronic tones'} active`}
        </p>
        <p className="text-xs text-amber-700 mt-2">
          {audioMode === 'binaural'
            ? `Beat: ${beatFrequency} Hz | L: ${carrierFrequency} Hz | R: ${carrierFrequency + beatFrequency} Hz`
            : `Pulse: ${beatFrequency} Hz | Carrier: ${carrierFrequency} Hz`}
        </p>
      </div>
    </div>
  );
}
