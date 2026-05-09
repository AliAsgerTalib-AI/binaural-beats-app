'use client';

import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { UserSettings, Sex } from '@/lib/types';

interface SettingsPanelProps {
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
  onClose: () => void;
}

interface HealthMetrics {
  restingHeartRate: number | null;
  heartRateVariability: number | null;
  sleepQuality: number | null;
  stressLevel: number | null;
  lastUpdated: number;
}

export default function SettingsPanel({ settings, onSettingsChange, onClose }: SettingsPanelProps) {
  const { data: session } = useSession();
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const age = Math.max(18, Math.min(120, Number(e.target.value)));
    onSettingsChange({ ...settings, age });
  };

  const handleSexChange = (sex: Sex) => {
    onSettingsChange({ ...settings, sex });
  };

  const handleBrownianNoiseChange = (enabled: boolean) => {
    onSettingsChange({ ...settings, brownianNoiseEnabled: enabled });
  };

  const handlePinkNoiseChange = (enabled: boolean) => {
    onSettingsChange({ ...settings, pinkNoiseEnabled: enabled });
  };

  useEffect(() => {
    if (session?.user) {
      fetchHealthMetrics();
    }
  }, [session]);

  const fetchHealthMetrics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health/metrics');
      if (response.ok) {
        const data = await response.json();
        setHealthMetrics(data);
      }
    } catch (error) {
      console.error('Error fetching health metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-orange-700">Settings</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-orange-200 hover:bg-orange-300 text-orange-800 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Google Fit Integration */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-amber-900 uppercase tracking-wider">
          Google Fit Integration
        </label>
        {session?.user ? (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-green-100 border-2 border-green-300">
              <p className="text-sm font-semibold text-green-800">
                ✓ Connected as {session.user.email}
              </p>
              <p className="text-xs text-green-700 mt-1">
                Your health data is syncing automatically for frequency optimization.
              </p>
            </div>

            {loading ? (
              <div className="p-3 rounded-lg bg-orange-100 text-center">
                <p className="text-sm text-orange-700">Loading health metrics...</p>
              </div>
            ) : healthMetrics ? (
              <div className="p-3 rounded-lg bg-blue-100 border-2 border-blue-300 space-y-2">
                <p className="text-xs font-semibold text-blue-900">Current Health Metrics:</p>
                {healthMetrics.restingHeartRate && (
                  <p className="text-xs text-blue-800">
                    Resting HR: {healthMetrics.restingHeartRate} bpm
                  </p>
                )}
                {healthMetrics.sleepQuality !== null && (
                  <p className="text-xs text-blue-800">
                    Sleep Quality: {healthMetrics.sleepQuality}%
                  </p>
                )}
                {healthMetrics.stressLevel !== null && (
                  <p className="text-xs text-blue-800">
                    Stress Level: {Math.round(healthMetrics.stressLevel)}/100
                  </p>
                )}
                <p className="text-xs text-blue-700 mt-2">
                  These metrics are used to optimize your binaural beat frequencies.
                </p>
              </div>
            ) : null}

            <button
              onClick={() => signOut()}
              className="w-full py-2 rounded-lg bg-red-200 hover:bg-red-300 text-red-900 text-sm font-semibold transition-colors"
            >
              Disconnect Google Fit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-amber-700">
              Connect your Google Pixel Watch to automatically optimize binaural beat frequencies based on your heart rate, sleep quality, and stress levels.
            </p>
            <button
              onClick={() => signIn('google')}
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
            >
              Connect Google Fit
            </button>
          </div>
        )}
      </div>

      {/* Age Setting */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-amber-900 uppercase tracking-wider">
          Age
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="18"
            max="120"
            step="1"
            value={settings.age}
            onChange={handleAgeChange}
            className="flex-1 h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #d97745 0%, #e89968 ${
                ((settings.age - 18) / 102) * 100
              }%, #fed7aa ${((settings.age - 18) / 102) * 100}%, #fed7aa 100%)`,
            }}
          />
          <div className="w-16 px-3 py-2 rounded-lg bg-orange-100 border-2 border-orange-300 text-center">
            <span className="text-xl font-bold text-orange-700">{settings.age}</span>
          </div>
        </div>
        <p className="text-xs text-amber-700">
          Age affects carrier frequency optimization for presbycusis (age-related hearing loss).
        </p>
      </div>

      {/* Sex Setting */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-amber-900 uppercase tracking-wider">
          Sex
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['male', 'female', 'other'] as Sex[]).map((sex) => (
            <button
              key={sex}
              onClick={() => handleSexChange(sex)}
              className={`p-3 rounded-lg transition-all ${
                settings.sex === sex
                  ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold'
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              }`}
            >
              {sex === 'male' ? '♂ Male' : sex === 'female' ? '♀ Female' : 'Other'}
            </button>
          ))}
        </div>
        <p className="text-xs text-amber-700">
          Note: Currently used for display only. Carrier recommendations are age-based.
        </p>
      </div>

      {/* Noise Settings */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-amber-900 uppercase tracking-wider">
          Masking Noise
        </label>

        {/* Brownian Noise Checkbox */}
        <div className="p-4 rounded-lg bg-blue-50 border-2 border-blue-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.brownianNoiseEnabled ?? true}
              onChange={(e) => handleBrownianNoiseChange(e.target.checked)}
              className="w-5 h-5 rounded accent-blue-600"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-800">Enable Brownian Noise</p>
              <p className="text-xs text-blue-600 mt-0.5">
                For Delta band (0.5–4 Hz) • Deep, low-frequency emphasis (-6dB/octave)
              </p>
            </div>
          </label>
        </div>

        {/* Pink Noise Checkbox */}
        <div className="p-4 rounded-lg bg-pink-50 border-2 border-pink-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.pinkNoiseEnabled ?? true}
              onChange={(e) => handlePinkNoiseChange(e.target.checked)}
              className="w-5 h-5 rounded accent-pink-600"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-pink-800">Enable Pink Noise</p>
              <p className="text-xs text-pink-600 mt-0.5">
                For Alpha band (8–12 Hz) • Balanced natural sound (wind, rain)
              </p>
            </div>
          </label>
        </div>

        <p className="text-xs text-amber-700 mt-3">
          <strong>Note:</strong> When enabled, noise will automatically activate for optimized frequency bands. Disable to use binaural beats alone.
        </p>
      </div>

      {/* Info Section */}
      <div className="p-4 rounded-xl bg-orange-100 border-2 border-orange-300 space-y-2">
        <h3 className="font-semibold text-orange-800">Optimal Carrier Frequencies</h3>
        <p className="text-xs text-amber-800">
          Your carrier frequencies are optimized based on age {settings.age}. Older individuals typically benefit
          from slightly lower carriers due to age-related high-frequency hearing loss (presbycusis).
        </p>
        {session?.user && (
          <p className="text-xs text-amber-700 mt-2">
            <strong>Enhanced:</strong> Google Fit data further personalizes your frequencies based on real-time health metrics.
          </p>
        )}
        <p className="text-xs text-amber-700 mt-3">
          <strong>Current Profile:</strong> Age {settings.age}, {settings.sex} {settings.sex === 'male' ? '♂' : '♀'}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold transition-all"
      >
        Done
      </button>
    </div>
  );
}
