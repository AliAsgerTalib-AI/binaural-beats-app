# Quick Start Guide - Binaural Beats App

## ⚡ 30-Second Setup

```bash
cd binaural-beats-app
npm run dev
```

Then open: **http://localhost:3000**

Done! 🎉

## 📱 What You Get

A beautiful, fast binaural beats web app on your phone/computer with:
- ✅ 5 frequency bands (Delta, Theta, Alpha, Beta, Gamma)
- ✅ Smart carrier frequency optimization for age 63
- ✅ 15/30/45/60 minute timer options
- ✅ Session history tracking
- ✅ 100% private (local storage, no auth)
- ✅ Works offline
- ✅ Mobile-optimized design

## 🎯 First Time Using It?

### Step 1: Select a Band
Click one of these:
- 😴 **Delta** - Sleep & recovery
- 🧘 **Theta** - Meditation & learning (default)
- 🌊 **Alpha** - Relaxed focus
- 🎯 **Beta** - Work & concentration
- ⚡ **Gamma** - Peak performance

### Step 2: Check Carrier Frequency
Default is automatically optimized for age 63. You'll see:
```
260 Hz
✓ Optimal for your age
```

**Want to adjust?** Use the slider or quick buttons (±5, ±20)

### Step 3: Pick Duration
Choose: **15 min** | **30 min** | **45 min** | **60 min**

### Step 4: Hit Start
Click the big gradient button: **"Start 30 Minute Session"**

### Step 5: Watch the Timer
- See countdown (MM:SS)
- Pause anytime
- Resume where you left off
- Cancel if needed

Session automatically saves when complete! ✓

## 🔧 Adjusting Your Age

Click the ⚙️ settings button in the header:
1. Drag age slider (18-120)
2. All carrier frequencies auto-update
3. That's it!

**Why?** Hearing changes with age. The app accounts for this (presbycusis).

## 📊 Checking Your History

Scroll down after any session to see:
- Date & time
- Frequency band used
- Carrier frequency
- Duration

History is automatically saved locally.

## 🎧 Using with Your Phone

### Best Practices:
1. **Use good earbuds** - Need stereo separation for binaural beats
2. **Secure fit** - Make sure they stay in place
3. **Volume 40-50%** - Binaural beats are subtle; don't max volume
4. **Quiet space** - Minimize background noise
5. **NO Noise Cancellation** - Turn ANC off (distorts binaural beats)
6. **Add to Home Screen** - Long-press → "Add to Home Screen"

### On Android:
```
Chrome → Menu → "Install app" → Use as standalone
```

### On iOS:
```
Safari → Share → "Add to Home Screen"
```

## 🧪 Testing the App

### Does it work on my phone?
1. Open app on phone: `http://[your-computer-ip]:3000`
2. (Find IP: `ipconfig getifaddr en0` on Mac, or `ipconfig` on Windows)
3. Or use mobile hotspot to test

### Does data save?
1. Start a session and complete it
2. Refresh the page
3. Scroll down - session should still be there

If not saved, check if browser blocks localStorage (private mode).

## 🎯 Carrier Frequency Explained (Simple Version)

**What's a carrier frequency?**
- Binaural beats need a "base tone" (carrier)
- Your brain hears the difference between left and right
- That difference is the beat frequency (what does the work)

**Why age matters?**
- As we age, we hear high frequencies less well
- Person age 25 optimal carrier: 280 Hz for Theta
- Person age 63 optimal carrier: 260 Hz for Theta
- Person age 80 optimal carrier: 240 Hz for Theta

**Can I change it?**
Yes! Use the slider. Range is safe within shown limits.

## 💾 Your Data is Always Private

✅ **Never sent anywhere** - All stored locally in browser  
✅ **No cloud** - Nothing synced to servers  
✅ **No tracking** - No analytics, no spy code  
✅ **Delete anytime** - Clear browser data to reset  

## 🆘 Troubleshooting

### "App not loading"
```bash
# Restart development server
npm run dev
```

### "Page won't refresh"
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or: DevTools → Network → Disable cache → Refresh

### "Data not saving"
- Private mode blocks localStorage
- Check browser privacy settings
- Try regular mode instead

### "Binaural beat sounds weird"
- Stereo check: Does each earbud sound different? (Left: 210 Hz, Right: 200 Hz)
- Try adjusting carrier ±50 Hz
- Make sure volume is 40-50% (not too loud)

### "Settings not updating"
- Refresh page after changing age
- Close settings panel completely
- Try clearing browser cache

## 📦 What's Inside

```
binaural-beats-app/
├── Components (5 UI pieces)
├── Library code (types, data, hooks)
├── Page (main app)
└── Styles (TailwindCSS + custom)

Total: ~200 lines of TypeScript per file
Very readable, well-organized code
```

## 🚀 Next: Use It Daily!

1. **Pick a band** based on your goal
2. **Set duration** (30 min is popular)
3. **Wear earbuds** properly
4. **Hit start** and relax
5. **Repeat** consistently (same time = better results)

## 📚 Learn More

**Want technical details?** Read: `README.md` and `IMPLEMENTATION_GUIDE.md`

**Want the science?** Check the Binaural Beats Library:
- `Individual_Alpha_Frequency_IBE_Personalization_Comprehensive_Report.html`
- `Carrier_Frequency_Selection_Optimization_Comprehensive_Report.html`

## 🎓 Frequency Band Quick Ref

| Band | Hz | Good For | Optimal Carrier (Age 63) |
|------|-------|----------|---------|
| Delta | 0.5-4 | Sleep, healing | **200 Hz** |
| Theta | 6-8 | Meditation, learning, stress | **260 Hz** |
| Alpha | 8-12 | Calm focus, creativity | **280 Hz** |
| Beta | 12-30 | Work, concentration | **340 Hz** |
| Gamma | 30-100 | Peak focus, coordination | **480 Hz** |

## ✅ Checklist Before Starting

- [ ] Dev server running (`npm run dev`)
- [ ] Can access `http://localhost:3000`
- [ ] Select a frequency band
- [ ] Carrier frequency shows (and is green ✓ if optimal)
- [ ] Pick session duration
- [ ] Click Start
- [ ] Timer counts down
- [ ] Pause/resume works
- [ ] Complete session
- [ ] Session appears in history

**All checked?** You're good to go! 🚀

## 🎉 That's It!

You now have a professional-grade binaural beats app that:
- Optimizes frequencies for your age
- Tracks your sessions
- Works completely offline
- Never tracks or sends data
- Runs on any device with a browser

**Enjoy your sessions!** 🎧

---

**Need help?** Check `README.md` for detailed documentation.

**Version**: 1.0 | **Status**: Production Ready | **Last Updated**: May 2026
