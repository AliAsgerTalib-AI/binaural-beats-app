'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur border-b border-orange-200/30 px-4 py-6 shadow-sm">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
            Brainwave Entrainment
          </h1>
          <p className="text-sm text-amber-700 mt-2">
            Choose your audio mode to get started
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto max-w-2xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Binaural Beats Card */}
          <Link
            href="/binaural"
            className="group p-8 rounded-2xl bg-white border-2 border-orange-200 hover:border-orange-400 shadow-sm hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">🎧</div>
            <h2 className="text-2xl font-bold text-orange-700 group-hover:text-orange-800 mb-2">
              Binaural Beats
            </h2>
            <p className="text-sm text-amber-700 mb-4">
              Two tones, one per ear. Creates a perceived beat frequency. Requires stereo headphones.
            </p>
            <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm group-hover:text-orange-700">
              Start Session →
            </div>
            <div className="mt-4 pt-4 border-t border-orange-100">
              <p className="text-xs text-amber-600">
                ✓ Customized for your age<br/>
                ✓ Fade in / fade out options<br/>
                ✓ Background noise control
              </p>
            </div>
          </Link>

          {/* Isochronic Tones Card */}
          <Link
            href="/isochronic"
            className="group p-8 rounded-2xl bg-white border-2 border-green-200 hover:border-green-400 shadow-sm hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">🔊</div>
            <h2 className="text-2xl font-bold text-green-700 group-hover:text-green-800 mb-2">
              Isochronic Tones
            </h2>
            <p className="text-sm text-green-700 mb-4">
              Single pulsed tone. Creates sharp, audible beats. Works with any audio device.
            </p>
            <div className="flex items-center gap-2 text-green-600 font-semibold text-sm group-hover:text-green-700">
              Start Session →
            </div>
            <div className="mt-4 pt-4 border-t border-green-100">
              <p className="text-xs text-green-600">
                ✓ No headphones required<br/>
                ✓ Sharper, distinct pulses<br/>
                ✓ Easy to perceive
              </p>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
          >
            📚 Learn about frequency bands
          </Link>
        </div>
      </main>

      {/* Bottom note */}
      <footer className="bg-white/50 border-t border-orange-200/30 px-4 py-4 text-center text-xs text-amber-700">
        <p>Binaural beats and isochronic tones are not proven treatments. See <Link href="/learn" className="underline">Learn</Link> for more.</p>
      </footer>
    </div>
  );
}
