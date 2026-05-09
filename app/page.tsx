'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { UserSettings, SessionHistory } from '@/lib/types';
import { frequencyBands, getFrequenciesFromBeatFrequency } from '@/lib/frequencyData';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { customizeFrequencies } from '@/lib/customizationAlgorithm';
import BeatFrequencySelector from '@/components/BeatFrequencySelector';
import TimerSelector from '@/components/TimerSelector';
import SessionTimer from '@/components/SessionTimer';
import SettingsPanel from '@/components/SettingsPanel';

const DEFAULT_SETTINGS: UserSettings = {
  age: 63,
  sex: 'male',
};

interface HealthMetrics {
  restingHeartRate: number | null;
  heartRateVariability: number | null;
  sleepQuality: number | null;
  stressLevel: number | null;
}

export default function Home() {
  const { data: session } = useSession();
  const [settings, setSettings] = useLocalStorage<UserSettings>('binaural_settings', DEFAULT_SETTINGS);
  const [sessions, setSessions] = useLocalStorage<SessionHistory[]>('binaural_sessions', []);

  const [beatFrequency, setBeatFrequency] = useState<number>(7); // Default: 7 Hz (theta)
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
  const [customizationNote, setCustomizationNote] = useState<string | null>(null);

  // Derive frequencies from beat frequency
  const { leftFreq: carrierFrequency, rightFreq: rightFrequency, band: selectedBand } = getFrequenciesFromBeatFrequency(
    beatFrequency,
    settings.age,
    settings.sex
  );

  // Check for customization notes based on health metrics
  useEffect(() => {
    if (healthMetrics) {
      const customized = customizeFrequencies(
        selectedBand,
        settings.age,
        healthMetrics,
        carrierFrequency
      );
      setCustomizationNote(customized.recommendation);
    } else {
      setCustomizationNote(null);
    }
  }, [selectedBand, settings.age, healthMetrics, carrierFrequency]);

  // Fetch health metrics when session is available
  useEffect(() => {
    if (session?.user) {
      const fetchMetrics = async () => {
        try {
          const response = await fetch('/api/health/metrics');
          if (response.ok) {
            const data = await response.json();
            setHealthMetrics(data);
          }
        } catch (error) {
          console.error('Error fetching health metrics:', error);
        }
      };

      fetchMetrics();

      // Refresh metrics every 5 minutes
      const interval = setInterval(fetchMetrics, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const handleSessionComplete = () => {
    const newSession: SessionHistory = {
      id: `session_${Date.now()}`,
      band: selectedBand,
      carrierFrequency,
      duration: selectedDuration,
      timestamp: Date.now(),
      completed: true,
      beatFrequency, // Store beat frequency for future reference
    };
    setSessions([...sessions, newSession]);
    setIsSessionActive(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-orange-200/30 px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              Binaural Beats
            </h1>
            <p className="text-xs text-amber-700 mt-1">
              Age {settings.age} • {settings.sex === 'male' ? '♂' : '♀'}
            </p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 transition-colors"
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-2xl px-4 py-6 pb-20">
        {showSettings ? (
          <SettingsPanel
            settings={settings}
            onSettingsChange={setSettings}
            onClose={() => setShowSettings(false)}
          />
        ) : (
          <>
            {/* Beat Frequency Selector */}
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-amber-900 uppercase tracking-wider mb-4">
                Choose Your Beat Frequency
              </h2>
              <BeatFrequencySelector
                beatFrequency={beatFrequency}
                onBeatFrequencyChange={setBeatFrequency}
                settings={settings}
                disabled={isSessionActive}
              />
            </section>

            {/* Customization Notice */}
            {customizationNote && (
              <section className="mb-8 p-4 rounded-xl bg-green-100 border-2 border-green-300">
                <p className="text-sm text-green-800 font-semibold">✓ Frequencies Customized</p>
                <p className="text-xs text-green-700 mt-1">{customizationNote}</p>
              </section>
            )}

            {/* Timer Selection or Active Session */}
            {!isSessionActive ? (
              <>
                <section className="mb-8">
                  <h2 className="text-sm font-semibold text-amber-900 uppercase tracking-wider mb-4">
                    Session Duration
                  </h2>
                  <TimerSelector
                    selectedDuration={selectedDuration}
                    onDurationChange={setSelectedDuration}
                    disabled={isSessionActive}
                  />
                </section>

                {/* Start Button */}
                <button
                  onClick={() => setIsSessionActive(true)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold text-lg transition-all hover:shadow-lg hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start {selectedDuration} Minute Session
                </button>
              </>
            ) : (
              <SessionTimer
                band={selectedBand}
                carrierFrequency={carrierFrequency}
                beatFrequency={beatFrequency}
                duration={selectedDuration}
                onComplete={handleSessionComplete}
                onCancel={() => setIsSessionActive(false)}
                brownianNoiseEnabled={settings.brownianNoiseEnabled ?? true}
                pinkNoiseEnabled={settings.pinkNoiseEnabled ?? true}
              />
            )}

            {/* Session History */}
            {sessions.length > 0 && (
              <section className="mt-12">
                <h2 className="text-sm font-semibold text-amber-900 uppercase tracking-wider mb-4">
                  Recent Sessions ({sessions.length})
                </h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {[...sessions].reverse().slice(0, 10).map((session) => (
                    <div
                      key={session.id}
                      className="p-3 rounded-lg bg-orange-100/50 border border-orange-200 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-orange-700 font-semibold">
                            {frequencyBands[session.band].name}
                          </span>
                          <span className="text-amber-600 mx-2">•</span>
                          <span className="text-orange-600">{session.carrierFrequency} Hz</span>
                        </div>
                        <span className="text-amber-700">{session.duration} min</span>
                      </div>
                      <p className="text-xs text-amber-600 mt-1">
                        {new Date(session.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
