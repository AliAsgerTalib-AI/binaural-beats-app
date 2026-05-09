# Google Fit Integration - Implementation Complete

## What Was Implemented

Full integration of Google Fit API to automatically customize binaural beat frequencies based on your health data from Pixel Watch 2.

### Architecture Overview

```
Pixel Watch 2
    ↓
Google Fit (cloud sync)
    ↓
OAuth 2.0 (user grants permission)
    ↓
Google Fit API (fetch health data)
    ↓
Your App Backend
    ↓
Customization Algorithm
    ↓
Personalized Frequencies
```

---

## Files Created/Modified

### Backend Services

1. **lib/googleFitService.ts** (NEW)
   - Fetches health metrics from Google Fit API
   - Extracts: Resting heart rate, HRV, sleep quality, stress level
   - Handles token refresh automatically
   - Parses Google Fit API responses into usable metrics

2. **lib/customizationAlgorithm.ts** (NEW)
   - Takes health metrics + frequency band + age
   - Returns optimized beat and carrier frequencies
   - Provides human-readable recommendation
   - Logic:
     - High stress → lower frequencies (calming)
     - Poor sleep → delta frequencies (sleep support)
     - Low stress → standard/higher frequencies (balanced)

3. **lib/auth.ts** (NEW)
   - NextAuth OAuth configuration
   - Handles Google Provider setup
   - Stores access tokens securely in session
   - Manages token refresh automatically

4. **app/api/auth/[...nextauth]/route.ts** (NEW)
   - NextAuth API route for OAuth handling
   - Processes login/logout
   - Manages session state

5. **app/api/health/metrics/route.ts** (NEW)
   - Backend endpoint to fetch health data
   - Checks authentication (user must be logged in)
   - Refreshes tokens if expired
   - Returns health metrics as JSON

### Frontend Components

1. **components/SessionProvider.tsx** (NEW)
   - Wraps app with NextAuth SessionProvider
   - Enables useSession() hook throughout app

2. **components/SettingsPanel.tsx** (MODIFIED)
   - Added Google Fit connection section
   - Shows connection status
   - Displays current health metrics:
     - Resting heart rate
     - Sleep quality percentage
     - Stress level (0-100)
   - "Connect Google Fit" button for sign-in
   - "Disconnect" button to revoke access
   - Shows automatic sync explanation

3. **app/layout.tsx** (MODIFIED)
   - Wrapped with SessionProvider for NextAuth

4. **app/page.tsx** (MODIFIED)
   - Added useSession hook
   - Fetches health metrics every 5 minutes when logged in
   - Applies customization algorithm to frequencies
   - Shows customization notification with recommendation
   - Frequencies auto-update based on real-time health data

### Configuration

1. **.env.local** (NEEDS USER INPUT)
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   NEXTAUTH_SECRET=random_secret_here
   NEXTAUTH_URL=http://localhost:3001
   ```

2. **package.json** (MODIFIED)
   - Added: `next-auth@^4.24.0`
   - Already installed

---

## How It Works (User Flow)

### First Time Setup
1. User opens Settings
2. Sees "Connect Google Fit" button
3. Clicks button → redirected to Google sign-in
4. Grants permission to read health data
5. Returns to app, now connected
6. App immediately fetches health metrics

### Ongoing Use
1. User opens app
2. App automatically loads health data
3. Algorithm analyzes:
   - Resting heart rate (stress indicator)
   - Sleep quality (need for recovery)
   - Stress level (arousal level)
4. Customizes frequencies:
   - Carrier frequency: adjusted ±5-10% based on HR
   - Beat frequency: chosen from range based on stress
5. Shows green notification: "Frequencies Customized - [reason]"
6. Session uses personalized frequencies
7. Data refreshes every 5 minutes automatically

### Disconnecting
- User clicks "Disconnect Google Fit" in Settings
- Revokes Google permission
- Frequencies revert to standard age-based optimization
- No data is stored after disconnection

---

## Health Metrics Used

### Resting Heart Rate
- **Source**: Google Fit (daily average from last 7 days)
- **Impact**: 
  - Low HR (55-60) = calm → use standard/higher frequencies
  - High HR (75-85) = stressed → lower frequencies (theta instead of alpha)
- **Practical**: Reflects baseline stress level

### Heart Rate Variability (HRV)
- **Source**: Estimated from stress scores (if available)
- **Impact**: Low HRV indicates stressed system → use gentler frequencies
- **Practical**: Autonomic nervous system tone

### Sleep Quality
- **Source**: Google Fit sleep tracking
- **Impact**:
  - Poor sleep (< 40% good nights) → prioritize delta (sleep support)
  - Good sleep (> 70%) → can use relaxation frequencies
- **Practical**: Recovery status indicator

### Stress Level
- **Source**: Derived from heart rate data
- **Impact**: Directly influences frequency selection
- **Practical**: Real-time stress indicator

---

## Customization Logic (Simplified)

```
IF (stress_level > 70):
    beat_frequency = lower end of band range
    carrier_frequency = reduce by 5%
    recommendation = "High stress detected. Using calming frequencies."

ELSE IF (sleep_quality < 40%):
    band = delta (force to sleep mode)
    beat_frequency = 2-3 Hz
    recommendation = "Poor sleep detected. Using delta frequencies..."

ELSE IF (stress_level < 30):
    beat_frequency = higher end of band range
    recommendation = "Low stress detected. Using balanced frequencies."

ELSE:
    beat_frequency = middle of range
    recommendation = "Frequencies optimized based on health metrics."
```

---

## Privacy & Security

### Data Handling
- **What we access**: Heart rate, sleep, stress (no personal data)
- **What we store**: Only tokens (encrypted in session)
- **What you keep**: All health data stays in Google ecosystem
- **Revocation**: Can disconnect anytime; all access revoked

### OAuth Security
- Industry standard (Google's official implementation)
- No passwords stored
- Tokens automatically refreshed
- User can revoke at any time via Google Account settings

### Local Data
- No health data stored on device
- Only frequencies stored (localStorage, already did this)
- Sessions still saved locally

---

## Setup Instructions

### Step 1: Create Google Cloud Project (5 minutes - USER DOES THIS)

See **GOOGLE_FIT_SETUP.md** for detailed instructions:

1. Go to https://console.cloud.google.com
2. Create new project: "binaural-beats"
3. Enable Fitness API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized URIs:
   - `http://localhost:3001/api/auth/callback/google`
6. Get Client ID and Client Secret

### Step 2: Configure App (User provides credentials)

Create `.env.local` file:
```
GOOGLE_CLIENT_ID=YOUR_ID
GOOGLE_CLIENT_SECRET=YOUR_SECRET
NEXTAUTH_SECRET=generated-random-secret
NEXTAUTH_URL=http://localhost:3001
```

### Step 3: Install Dependencies

```bash
npm install
```

(Already done)

### Step 4: Start App

```bash
npm run dev
```

Navigate to http://localhost:3001

### Step 5: Connect in Settings

1. Click Settings (⚙️)
2. Click "Connect Google Fit"
3. Sign in with Google
4. Grant permission
5. You're done! Frequencies now personalized

---

## Testing Checklist

- [ ] Environment variables configured (.env.local)
- [ ] App starts without errors
- [ ] Settings panel loads
- [ ] "Connect Google Fit" button visible
- [ ] Click button redirects to Google login
- [ ] Permission dialog appears
- [ ] After approval, shows "Connected as [email]"
- [ ] Health metrics display (if available)
- [ ] Start a session - see customization notice (if metrics fetched)
- [ ] Frequencies are different from default
- [ ] "Disconnect" button works
- [ ] Can reconnect

---

## Troubleshooting

### "Invalid client ID"
- Verify Client ID copied correctly from Google Cloud Console
- Check `.env.local` spelling: `GOOGLE_CLIENT_ID`
- Restart server after changing .env.local

### "Redirect URI mismatch"
- Make sure `http://localhost:3001/api/auth/callback/google` is in authorized URIs
- No typos, exact spelling with http (not https for localhost)

### "No health metrics showing"
- Data syncs from watch every few minutes
- Check Google Fit app on phone to confirm data
- May take 5-10 minutes after session connects

### "Customization notice not showing"
- Verify health metrics actually fetched (check console)
- Algorithm might determine standard frequencies are optimal
- Check that stress level/HR data is available

### "Session times out"
- `.env.local` might have wrong `NEXTAUTH_SECRET`
- Regenerate: `openssl rand -base64 32`
- Restart server

---

## Performance Impact

- **Startup**: Minimal (loads session silently)
- **Per session**: Fetches health data once at app open
- **Refresh**: Every 5 minutes in background
- **Computation**: Customization algorithm is O(1) - instant
- **Network**: One API call per 5 minutes (2-3 KB each)
- **Overall**: Negligible impact

---

## Future Enhancements

1. **EEG Integration**: Add real-time brain feedback
2. **Protocol Recommendations**: "Based on your metrics, try delta protocol"
3. **Historical Tracking**: Show how metrics change over time
4. **Wearable Alerts**: Notify user when stress detected
5. **Multiple Profiles**: Different customization strategies
6. **A/B Testing**: Auto-test frequencies, learn what works best

---

## Status

✅ **Implementation Complete**
- All code written and integrated
- Dependencies installed
- Ready for testing once user provides Google credentials

⏳ **Waiting For**
- User to set up Google Cloud project
- Client ID and Client Secret
- Testing and feedback

---

## Next Steps

1. **User**: Complete Google Cloud setup (GOOGLE_FIT_SETUP.md)
2. **User**: Provide Client ID and Secret
3. **Test**: Start app and verify connection
4. **Use**: Sessions will be automatically customized
