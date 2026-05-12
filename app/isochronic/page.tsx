'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BeatFrequencySelector from '@/components/BeatFrequencySelector';
import TimerSelector from '@/components/TimerSelector';
import SessionTimer from '@/components/SessionTimer';
import SettingsPanel from '@/components/SettingsPanel';
import { frequencyBands, getFrequenciesFromBeatFrequency } from '@/lib/frequencyData';
import { UserSettings, SessionHistory, FadeConfig } from '@/lib/types';

export default function IsochronicPage() {
  const [beatFrequency, setBeatFrequency] = useState(10);
  const [duration, setDuration] = useState(20);
  const [sessionActive, setSessionActive] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({ age: 30, sex: 'other' });
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const disabledFade: FadeConfig = { enabled: false, beatFreq: 0, duration: 3 };

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

  const freqData = getFrequenciesFromBeatFrequency(beatFrequency, settings.age, settings.sex);

  const handleSessionComplete = () => {
    const newSession: SessionHistory = {
      id: Date.now().toString(),
      band: freqData.band,
      carrierFrequency: freqData.leftFreq,
      duration,
      timestamp: Date.now(),
      completed: true,
      beatFrequency,
      audioMode: 'isochronic',
    };
    const updated = [newSession, ...sessionHistory];
    setSessionHistory(updated);
    localStorage.setItem('binaural_sessions', JSON.stringify(updated));
    setSessionActive(false);
  };

  const handleSessionCancel = () => {
    setSessionActive(false);
  };

  const carrierFreq = freqData.leftFreq;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-green-200/30 px-4 py-4 shadow-sm">
        <div className="container mx-auto max-w-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 transition-colors font-semibold"
              title="Back to mode selection"
            >
              ← Back
            </Link>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              🔊 Isochronic Tones
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/learn"
              className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 transition-colors font-semibold"
              title="Learn about frequency bands"
            >
              📚
            </Link>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 transition-colors font-semibold"
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
            audioMode="isochronic"
            fadeIn={disabledFade}
            fadeOut={disabledFade}
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
            <div className="p-6 rounded-xl bg-white border-2 border-green-200 shadow-sm">
              <BeatFrequencySelector
                beatFrequency={beatFrequency}
                onBeatFrequencyChange={setBeatFrequency}
                settings={settings}
              />
            </div>

            {/* Duration Selector */}
            <div className="p-6 rounded-xl bg-white border-2 border-green-200 shadow-sm">
              <TimerSelector duration={duration} onDurationChange={setDuration} />
            </div>

            {/* Info Note */}
            <div className="p-4 rounded-lg bg-green-100 border-2 border-green-300">
              <p className="text-sm text-green-800 font-medium">
                ✓ Works with any audio device — headphones or speakers
              </p>
              <p className="text-xs text-green-700 mt-2">
                Isochronic tones create sharp, audible pulses. No stereo separation needed.
              </p>
            </div>

            {/* Start Button */}
            <button
              onClick={() => setSessionActive(true)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg font-bold transition-all shadow-lg hover:shadow-xl"
            >
              🔊 Start Session
            </button>

            {/* Session History */}
            {sessionHistory.length > 0 && (
              <div className="p-6 rounded-xl bg-white border-2 border-green-200 shadow-sm">
                <h3 className="text-lg font-bold text-green-700 mb-4">Session History</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {sessionHistory.map((session) => (
                    <div key={session.id} className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-green-700">
                            {frequencyBands[session.band].icon} {frequencyBands[session.band].name}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            {session.beatFrequency} Hz pulse • {session.carrierFrequency} Hz carrier • {session.duration} min
                            {session.audioMode === 'binaural' && ' • Binaural'}
                          </p>
                        </div>
                        <p className="text-xs text-green-600">
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
