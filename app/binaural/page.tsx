'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BeatFrequencySelector from '@/components/BeatFrequencySelector';
import TimerSelector from '@/components/TimerSelector';
import SessionTimer from '@/components/SessionTimer';
import SettingsPanel from '@/components/SettingsPanel';
import { frequencyBands, getFrequenciesFromBeatFrequency } from '@/lib/frequencyData';
import { UserSettings, SessionHistory, FadeConfig } from '@/lib/types';

export default function BinauralPage() {
  const [beatFrequency, setBeatFrequency] = useState(10);
  const [duration, setDuration] = useState(20);
  const [sessionActive, setSessionActive] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({ age: 30, sex: 'other' });
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [fadeIn, setFadeIn] = useState<FadeConfig>({ enabled: false, beatFreq: 0, duration: 3 });
  const [fadeOut, setFadeOut] = useState<FadeConfig>({ enabled: false, beatFreq: 0, duration: 3 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('binaural_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate structure before using
        if (parsed && typeof parsed.age === 'number' && typeof parsed.sex === 'string') {
          setSettings(parsed);
        }
      }
    } catch (err) {
      console.warn('Failed to load settings from storage:', err);
      // Fallback to defaults (already set via useState)
    }

    try {
      const savedHistory = localStorage.getItem('binaural_sessions');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setSessionHistory(parsed);
        }
      }
    } catch (err) {
      console.warn('Failed to load session history from storage:', err);
      // Fallback to empty history (already set via useState)
    }
  }, []);

  const handleSettingsChange = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem('binaural_settings', JSON.stringify(newSettings));
  };

  const handleSessionComplete = () => {
    const freqData = getFrequenciesFromBeatFrequency(beatFrequency, settings.age, settings.sex);
    const newSession: SessionHistory = {
      id: Date.now().toString(),
      band: freqData.band,
      carrierFrequency: freqData.leftFreq,
      duration,
      timestamp: Date.now(),
      completed: true,
      beatFrequency,
      audioMode: 'binaural',
    };
    const updated = [newSession, ...sessionHistory];
    setSessionHistory(updated);
    localStorage.setItem('binaural_sessions', JSON.stringify(updated));
    setSessionActive(false);
  };

  const handleSessionCancel = () => {
    setSessionActive(false);
  };

  const freqData = getFrequenciesFromBeatFrequency(beatFrequency, settings.age, settings.sex);
  const carrierFreq = freqData.leftFreq;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-blue-200/30 px-4 py-4 shadow-sm">
        <div className="container mx-auto max-w-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors font-semibold"
              title="Back to mode selection"
            >
              ← Back
            </Link>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              🎧 Binaural Beats
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/learn"
              className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors font-semibold"
              title="Learn about frequency bands"
            >
              📚
            </Link>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors font-semibold"
              title="Settings"
            >
              ⚙️
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-2xl px-4 py-8">
        {sessionActive ? (
          <SessionTimer
            band={freqData.band}
            carrierFrequency={carrierFreq}
            beatFrequency={beatFrequency}
            duration={duration}
            onComplete={handleSessionComplete}
            onCancel={handleSessionCancel}
            brownianNoiseEnabled={settings.brownianNoiseEnabled ?? false}
            pinkNoiseEnabled={settings.pinkNoiseEnabled ?? true}
            audioMode="binaural"
            fadeIn={fadeIn}
            fadeOut={fadeOut}
            age={settings.age}
            sex={settings.sex}
          />
        ) : (
          <div className="space-y-8">
            {/* Settings Panel */}
            {showSettings && (
              <SettingsPanel settings={settings} onSettingsChange={handleSettingsChange} />
            )}

            {/* Beat Frequency Selector */}
            <div className="p-6 rounded-xl bg-white border-2 border-blue-200 shadow-sm">
              <BeatFrequencySelector
                beatFrequency={beatFrequency}
                onBeatFrequencyChange={setBeatFrequency}
                settings={settings}
              />
            </div>

            {/* Duration Selector */}
            <div className="p-6 rounded-xl bg-white border-2 border-blue-200 shadow-sm">
              <TimerSelector duration={duration} onDurationChange={setDuration} />
            </div>

            {/* Advanced Options - Fade In/Out */}
            <div className="p-6 rounded-xl bg-white border-2 border-blue-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-blue-700">Advanced Options</h3>

              {/* Fade In */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fadeIn.enabled}
                    onChange={(e) => setFadeIn({ ...fadeIn, enabled: e.target.checked })}
                    className="w-5 h-5 rounded accent-blue-600"
                  />
                  <span className="text-sm font-semibold text-blue-700">Fade In (Gentle Start)</span>
                </label>
                {fadeIn.enabled && (
                  <div className="ml-8 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-blue-700 uppercase mb-2">
                        Start Beat Frequency
                      </label>
                      <select
                        value={fadeIn.beatFreq}
                        onChange={(e) => setFadeIn({ ...fadeIn, beatFreq: Number(e.target.value) })}
                        className="w-full p-2 border border-blue-300 rounded-lg text-sm"
                      >
                        <option value="0">Carrier Only (No Beat)</option>
                        <option value="1.5">1.5 Hz (Delta)</option>
                        <option value="3">3 Hz (Theta)</option>
                        <option value="6">6 Hz (Theta-Alpha)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-blue-700 uppercase mb-2">
                        Fade In Duration: {fadeIn.duration} min
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={fadeIn.duration}
                        onChange={(e) => setFadeIn({ ...fadeIn, duration: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Fade Out */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fadeOut.enabled}
                    onChange={(e) => setFadeOut({ ...fadeOut, enabled: e.target.checked })}
                    className="w-5 h-5 rounded accent-blue-600"
                  />
                  <span className="text-sm font-semibold text-blue-700">Fade Out (Gentle End)</span>
                </label>
                {fadeOut.enabled && (
                  <div className="ml-8 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-blue-700 uppercase mb-2">
                        End Beat Frequency
                      </label>
                      <select
                        value={fadeOut.beatFreq}
                        onChange={(e) => setFadeOut({ ...fadeOut, beatFreq: Number(e.target.value) })}
                        className="w-full p-2 border border-blue-300 rounded-lg text-sm"
                      >
                        <option value="0">Carrier Only (No Beat)</option>
                        <option value="1.5">1.5 Hz (Delta)</option>
                        <option value="3">3 Hz (Theta)</option>
                        <option value="6">6 Hz (Theta-Alpha)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-blue-700 uppercase mb-2">
                        Fade Out Duration: {fadeOut.duration} min
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={fadeOut.duration}
                        onChange={(e) => setFadeOut({ ...fadeOut, duration: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => setSessionActive(true)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold transition-all shadow-lg hover:shadow-xl"
            >
              🎧 Start Session
            </button>

            {/* Session History */}
            {sessionHistory.length > 0 && (
              <div className="p-6 rounded-xl bg-white border-2 border-blue-200 shadow-sm">
                <h3 className="text-lg font-bold text-blue-700 mb-4">Session History</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {sessionHistory.map((session) => (
                    <div key={session.id} className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-blue-700">
                            {frequencyBands[session.band].icon} {frequencyBands[session.band].name}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            {session.beatFrequency} Hz beat • {session.carrierFrequency} Hz carrier • {session.duration} min
                            {session.audioMode === 'isochronic' && ' • Isochronic'}
                          </p>
                        </div>
                        <p className="text-xs text-blue-600">
                          {new Date(session.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
