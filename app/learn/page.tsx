'use client';

import Link from 'next/link';
import { frequencyBands } from '@/lib/frequencyData';
import { FrequencyBand } from '@/lib/types';

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-orange-200/30 px-4 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 transition-colors font-semibold"
            title="Back to setup"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
            Learn
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-3xl px-4 py-6 pb-20">
        {/* Frequency Bands */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-orange-700 mb-6">Frequency Bands</h2>
          <div className="space-y-4">
            {(Object.keys(frequencyBands) as FrequencyBand[]).map((bandKey) => {
              const band = frequencyBands[bandKey];
              return (
                <div
                  key={bandKey}
                  className="p-5 rounded-xl bg-white border-2 border-orange-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{band.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <h3 className="text-lg font-bold text-orange-700">{band.name}</h3>
                        <span className="text-xs text-amber-600 font-semibold">
                          {band.beatFreq.min.toFixed(1)}–{band.beatFreq.max.toFixed(1)} Hz
                        </span>
                      </div>
                      <p className="text-sm text-amber-800 mb-3">{band.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {band.benefits.map((benefit) => (
                          <span
                            key={benefit}
                            className="px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-orange-700 mb-6">How It Works</h2>

          {/* Binaural Beats */}
          <div className="mb-6 p-5 rounded-xl bg-blue-50 border-2 border-blue-200">
            <h3 className="text-lg font-bold text-blue-700 mb-3">🎧 Binaural Beats</h3>
            <div className="space-y-3 text-sm text-blue-900">
              <p>
                <span className="font-semibold">Mechanism:</span> Two sine wave tones are played simultaneously—one frequency to each ear via stereo headphones. Your brain perceives the <em>difference</em> between these frequencies as an audible beat.
              </p>
              <p className="example">
                <span className="font-semibold">Example:</span> Left ear: 200 Hz | Right ear: 210 Hz → perceived beat frequency: 10 Hz
              </p>
              <p>
                <span className="font-semibold">Requires:</span> Stereo headphones (the two frequencies must be isolated per ear)
              </p>
              <p className="p-3 rounded-lg bg-blue-100 border-l-4 border-blue-400 text-xs">
                <span className="font-semibold">Evidence:</span> Small, preliminary studies suggest binaural beats correlate with brainwave activity. However, evidence for therapeutic claims (sleep, focus, healing) is limited. No proven mechanism beyond auditory steady-state response (ASSR).
              </p>
            </div>
          </div>

          {/* Isochronic Tones */}
          <div className="p-5 rounded-xl bg-green-50 border-2 border-green-200">
            <h3 className="text-lg font-bold text-green-700 mb-3">🔊 Isochronic Tones</h3>
            <div className="space-y-3 text-sm text-green-900">
              <p>
                <span className="font-semibold">Mechanism:</span> A single carrier frequency is pulsed (amplitude-modulated) on and off at a target frequency. This creates audible, discrete pulses that don't require stereo separation.
              </p>
              <p className="example">
                <span className="font-semibold">Example:</span> 200 Hz carrier pulsed at 10 Hz → 10 audible pulses per second
              </p>
              <p>
                <span className="font-semibold">Works:</span> On any audio playback device (speakers, mono, headphones—no stereo required)
              </p>
              <p className="p-3 rounded-lg bg-green-100 border-l-4 border-green-400 text-xs">
                <span className="font-semibold">Evidence:</span> Even more preliminary than binaural beats. Some studies suggest isochronic tones may entrain brainwaves, but evidence for therapeutic benefit is minimal. Like binaural beats, the mechanism is not fully understood.
              </p>
            </div>
          </div>
        </section>

        {/* Carrier Frequencies */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-orange-700 mb-6">Carrier Frequencies</h2>
          <div className="p-5 rounded-xl bg-white border-2 border-orange-200 space-y-3 text-sm text-amber-900">
            <p>
              <span className="font-semibold">What are they?</span> The base tone (in Hz) that carries the beat frequency. For binaural beats, you get two carriers (one per ear); for isochronic tones, a single centered carrier.
            </p>
            <p>
              <span className="font-semibold">Why does age matter?</span> As we age, high-frequency hearing sensitivity decreases (presbycusis). This app adjusts the carrier frequency based on your age to ensure the tones are perceptible and comfortable. Older users get slightly lower carriers; younger users get brighter, higher carriers.
            </p>
            <p>
              <span className="font-semibold">Human hearing range:</span> 20 Hz (lowest) to 20,000 Hz (highest). The app keeps all frequencies within this range.
            </p>
            <p className="p-3 rounded-lg bg-orange-100 border-l-4 border-orange-400 text-xs">
              <span className="font-semibold">Note:</span> Individual hearing varies widely. If a frequency feels uncomfortable or inaudible, try adjusting the carrier or beat frequency.
            </p>
          </div>
        </section>

        {/* Emerging Research */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-orange-700 mb-6">Emerging Research</h2>
          <div className="p-5 rounded-xl bg-purple-50 border-2 border-purple-200 space-y-4 text-sm text-purple-900">
            <div>
              <h3 className="font-semibold text-purple-700 mb-2">🔬 Connectome Harmonics</h3>
              <p>
                Recent computational neuroscience research (Atasoy et al., 2023-2024) suggests that combining a fundamental frequency with harmonic layers (multiples of the base frequency) may resonate with the brain's intrinsic connectome structure. Examples include:
              </p>
              <ul className="mt-2 ml-4 space-y-1 text-xs">
                <li>• <span className="font-semibold">Deep Restoration:</span> 0.5–2 Hz + 40 Hz (sleep, recovery)</li>
                <li>• <span className="font-semibold">Focused Integration:</span> 12 Hz + 24 Hz + 36 Hz (learning, deep work)</li>
                <li>• <span className="font-semibold">40 Hz Neuroprotection:</span> 40 Hz + 80 Hz + 120 Hz (cognition, brain health)</li>
              </ul>
              <p className="mt-3 italic">
                <span className="font-semibold">Status:</span> Preliminary. Evidence is computational and theoretical, not yet clinically validated in humans.
              </p>
            </div>
            <div className="pt-4 border-t border-purple-300">
              <h3 className="font-semibold text-purple-700 mb-2">🚀 Future: Pro Mode</h3>
              <p>
                Once harmonic preset benefits are better understood, we plan to offer a "Pro Mode" with curated harmonic combinations. For now, the app uses single-frequency fundamentals (proven, simple, evidence-grounded).
              </p>
            </div>
          </div>
        </section>

        {/* Scientific Disclaimer */}
        <section className="p-5 rounded-xl bg-red-50 border-2 border-red-200">
          <h3 className="text-sm font-bold text-red-700 mb-3">⚠️ Scientific Disclaimer</h3>
          <p className="text-xs text-red-900 leading-relaxed">
            Binaural beats and isochronic tones are <span className="font-semibold">not proven treatments</span> for any medical condition. Claims of healing, therapeutic benefit, or brainwave entrainment are speculative and not supported by mainstream neuroscience. This app generates audio tones based on frequency—nothing more. If you have a medical condition, consult a healthcare provider. This tool is for educational and experimental use only.
          </p>
        </section>
      </main>
    </div>
  );
}
