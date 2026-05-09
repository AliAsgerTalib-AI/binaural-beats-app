# Binaural Beats Web Application

A production-ready Next.js web application for generating pure sine wave binaural beats with intelligent frequency optimization based on user age and preferences.

## Features

✅ **Pure Sine Wave Audio Synthesis** - Uses Web Audio API for mathematically perfect frequencies  
✅ **5 Frequency Bands** - Delta, Theta, Alpha, Beta, Gamma with evidence-based use cases  
✅ **Age-Based Optimization** - Carrier frequencies automatically adjusted for presbycusis (age-related hearing loss)  
✅ **Manual Frequency Control** - Adjust carrier frequency with intuitive slider controls  
✅ **4 Timer Options** - 15, 30, 45, 60 minute sessions with real-time progress tracking  
✅ **Local Storage** - All data persists in browser, no backend database needed  
✅ **Mobile Optimized** - Responsive design works perfectly on phones and tablets  
✅ **Binaural Effect** - Stereo panning creates proper left/right ear separation  
✅ **Volume Control** - Real-time volume adjustment with smooth fade in/out  
✅ **Session History** - Tracks completed sessions locally  

### Optional: Google Fit Integration

🔗 **Google Fit Integration** (Currently Disabled) - Can be enabled to automatically optimize frequencies based on:
- Resting heart rate (stress indicator)
- Sleep quality (recovery status)
- Heart rate variability (autonomic tone)
- Stress levels (real-time state)

See `GOOGLE_FIT_SETUP.md` to enable.

---

## Tech Stack

- **Framework**: Next.js 16.2.6 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS 4.3
- **Audio**: Web Audio API (client-side synthesis)
- **Storage**: Browser localStorage + optional Google Fit API
- **Auth**: NextAuth.js v4 (for Google Fit, optional)

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/binaural-beats-app.git
   cd binaural-beats-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3001
   ```

---

## Usage

### Starting a Session

1. **Select Frequency Band**
   - 😴 Delta (0.5-4 Hz) - Deep sleep, meditation
   - 🧘 Theta (4-8 Hz) - Creativity, relaxation
   - 🌊 Alpha (8-12 Hz) - Relaxation, focus
   - 🎯 Beta (12-30 Hz) - Alertness, concentration
   - ⚡ Gamma (30-100 Hz) - High cognition, perception

2. **Adjust Carrier Frequency** (Optional)
   - Default is age-optimized
   - Slide left/right to adjust
   - Range varies by frequency band
   - Green checkmark when at optimal

3. **Choose Session Duration**
   - 15, 30, 45, or 60 minutes

4. **Start Session**
   - Click "Start" button
   - Listen with headphones at 40-50% volume
   - Pause/resume anytime
   - Cancel without saving

5. **Session Completes**
   - Auto-saves to history
   - Shows session details

---

## Frequency Bands Explained

### Delta (0.5-4 Hz)
- **Use**: Deep sleep, rest, meditation
- **Best for**: Insomnia, sleep quality
- **Time**: Evening/bedtime
- **Evidence**: Moderate research support

### Theta (4-8 Hz)
- **Use**: Meditation, creativity, insight
- **Best for**: Creative work, meditation practice
- **Time**: Anytime
- **Evidence**: Moderate research support

### Alpha (8-12 Hz)
- **Use**: Relaxation, calm focus
- **Best for**: Anxiety relief, general relaxation
- **Time**: During the day
- **Evidence**: Strong research support

### Beta (12-30 Hz)
- **Use**: Concentration, alertness
- **Best for**: Work, studying, focus
- **Time**: During work hours
- **Evidence**: Limited research support

### Gamma (30-100 Hz)
- **Use**: Peak performance, high cognition
- **Best for**: Advanced meditation, peak states
- **Time**: Experimentation
- **Evidence**: Very limited research

---

## How It Works

### Audio Synthesis

1. **Two Oscillators** - One for each ear
2. **Stereo Separation** - Left ear at -1 pan, right ear at +1 pan
3. **Carrier Frequencies** - Base frequency for each ear
4. **Beat Frequency** - Difference between ears (e.g., 210 Hz - 200 Hz = 10 Hz beat)
5. **Pure Sine Waves** - Mathematically perfect waveforms from Web Audio API

### Age-Based Optimization

Carrier frequencies are automatically reduced for older users to account for age-related hearing loss:

```
Age 18-35: 100% of base carrier
Age 36-50: 95% of base carrier (5% reduction)
Age 51-65: 90% of base carrier (10% reduction)
Age 65+:   85% of base carrier (15% reduction)
```

---

## Settings

### Age
- Range: 18-120
- Affects carrier frequency optimization
- Default: 63

### Sex
- Options: Male, Female, Other
- Currently for display only
- Used in future for additional optimization

---

## Privacy & Data

✅ **No server storage** - All data stays on your device  
✅ **No tracking** - No analytics or user tracking  
✅ **No authentication required** - Works offline  
✅ **Completely private** - Audio stays in your device, never transmitted  

Optional Google Fit data:
- Only read permission (never write)
- Can disconnect anytime
- Data stays in Google ecosystem
- See GOOGLE_FIT_SETUP.md for details

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full support |
| Firefox | ✅ Full support |
| Safari | ✅ Full support |
| Edge | ✅ Full support |
| Mobile (iOS/Android) | ✅ Full support |

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

That's it! Your app is live at a Vercel URL.

### Deploy to Other Platforms

**Netlify:**
```bash
npm run build
# Deploy the .next folder
```

**Self-hosted:**
```bash
npm run build
npm start
```

---

## Building for Production

```bash
npm run build
npm start
```

This optimizes the app and runs in production mode.

---

## File Structure

```
binaural-beats-app/
├── app/
│   ├── page.tsx              # Main app component
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── api/
│       ├── auth/[...nextauth]/route.ts    # Auth endpoint (optional)
│       └── health/metrics/route.ts        # Health data endpoint (optional)
├── lib/
│   ├── types.ts              # TypeScript definitions
│   ├── frequencyData.ts      # Frequency bands and optimization
│   ├── audioSynthesis.ts     # Web Audio API implementation
│   ├── customizationAlgorithm.ts  # Health-based optimization (optional)
│   ├── auth.ts               # NextAuth config (optional)
│   └── useLocalStorage.ts    # localStorage hook
├── components/
│   ├── BandSelector.tsx      # Frequency band buttons
│   ├── CarrierFrequencyControl.tsx  # Frequency slider
│   ├── TimerSelector.tsx     # Duration selector
│   ├── SessionTimer.tsx      # Active session display
│   ├── SettingsPanel.tsx     # Settings and Google Fit
│   └── SessionProvider.tsx   # NextAuth provider (optional)
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── .gitignore

Documentation:
├── README.md                 # This file
├── QUICK_START.md           # User guide
├── PROTOCOLS_EVIDENCE_BASED.md   # Scientific protocols
├── PROTOCOLS_EMERGING.md     # Latest research (2025-2026)
├── GOOGLE_FIT_SETUP.md      # Google Fit integration guide (optional)
└── IMPLEMENTATION_GUIDE.md   # Technical documentation
```

---

## Troubleshooting

### App Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Audio Not Playing
- Check browser volume
- Check app volume slider
- Use headphones for binaural effect
- Chrome/Firefox recommended

### Frequencies Not Customizing
- If Google Fit is enabled, wait 5 seconds for data fetch
- Check Settings to verify Google Fit is connected
- Manually adjust with slider if needed

### Performance Issues
- Clear browser cache
- Close unnecessary tabs
- Use modern browser (Chrome, Firefox, Safari, Edge)
- Check computer CPU usage

---

## Scientific Basis

This app is built on peer-reviewed research:

- **Binaural Beats Discovery**: Oster (1973)
- **Anxiety Reduction**: Chaieb et al. (2015), Bigdeli et al. (2021)
- **Sleep Support**: Huang & Charyton (2008), Shih et al. (2010)
- **Meditation Enhancement**: Jirakittayakorn & Wongsawat (2017)

See `PROTOCOLS_EVIDENCE_BASED.md` for detailed references.

---

## Limitations & Disclaimers

⚠️ **Not Medical Treatment**
- Binaural beats are a wellness tool, not medical treatment
- Consult healthcare providers for diagnosed conditions
- Not a replacement for medication or therapy

⚠️ **Individual Variation**
- Effects vary significantly between individuals
- Some people show no response
- Works best with regular use

⚠️ **Volume Safety**
- Start at 40-50% volume
- Don't use while driving or operating machinery
- Take breaks if discomfort occurs

---

## Contributing

This is a personal project. For questions or suggestions:
- Open an issue on GitHub
- Submit feature requests
- Share your experience and results

---

## License

MIT License - feel free to use, modify, and distribute.

---

## Credits

- **Next.js**: React framework with App Router
- **TailwindCSS**: Utility-first CSS framework
- **Web Audio API**: Browser native audio synthesis
- **NextAuth.js**: Authentication for OAuth integration
- **Research Community**: Neuroscience researchers advancing binaural beat science

---

## Future Enhancements

🔜 Real-time EEG-guided customization (requires hardware)  
🔜 Protocol recommendations based on health metrics  
🔜 Advanced session scheduling  
🔜 Progress tracking and analytics  
🔜 Multi-language support  
🔜 Offline PWA capabilities  

---

## Getting Help

- **Quick Start**: See `QUICK_START.md`
- **Science**: See `PROTOCOLS_EVIDENCE_BASED.md`
- **Latest Research**: See `PROTOCOLS_EMERGING.md`
- **Google Fit Setup**: See `GOOGLE_FIT_SETUP.md`
- **Technical Details**: See `IMPLEMENTATION_GUIDE.md`

---

## Version Info

- **App Version**: 0.1.0
- **Next.js**: 16.2.6
- **React**: 19.2.4
- **TailwindCSS**: 4.3
- **Last Updated**: May 2026

---

Made with ❤️ for better binaural beats.
