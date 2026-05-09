# Google Fit Integration Setup Guide

## Step 1: Create Google Cloud Project (You Do This - 5 minutes)

### 1.1 Go to Google Cloud Console
```
https://console.cloud.google.com
```
- Sign in with your Google account (the one with your Pixel phone)

### 1.2 Create a New Project
- Click "Select a Project" (top left)
- Click "New Project"
- Name: `binaural-beats` (or whatever you want)
- Click "Create"
- Wait ~1-2 minutes for project creation

### 1.3 Enable Fitness API
- In the search bar at top, search: `Fitness API`
- Click on "Fitness API" result
- Click "Enable"
- Wait for it to enable (~30 seconds)

### 1.4 Create OAuth Credentials
- Go to "Credentials" (left sidebar under "APIs & Services")
- Click "Create Credentials" (blue button)
- Choose "OAuth Client ID"
- If prompted to configure OAuth consent screen:
  - Click "Configure Consent Screen"
  - Choose "External" user type
  - Click "Create"
  - Fill form:
    - App name: `Binaural Beats`
    - User support email: `aliasgertalib@gmail.com` (your email)
    - Developer contact: `aliasgertalib@gmail.com`
    - Click "Save and Continue"
  - Skip scopes
  - Skip test users
  - Click "Back to Dashboard"

### 1.5 Now Create the OAuth Client ID
- Go back to "Credentials"
- Click "Create Credentials" → "OAuth Client ID"
- Application type: **Web application**
- Name: `binaural-beats-web`
- Authorized JavaScript origins: Add both:
  ```
  http://localhost:3001
  https://yourdomain.com  (if you deploy)
  ```
  (For now just `http://localhost:3001`)
- Authorized redirect URIs: Add:
  ```
  http://localhost:3001/api/auth/callback/google
  https://yourdomain.com/api/auth/callback/google  (if you deploy)
  ```
- Click "Create"
- You'll see Client ID and Client Secret
- **COPY BOTH** - you'll need them next

### 1.6 Add Fitness API Scopes (Important!)
- Stay in Credentials page
- Click the OAuth client ID you just created
- In "Scopes" section, you may need to configure which scopes are requested
- The app will request:
  - `https://www.googleapis.com/auth/fitness.heart_rate.read`
  - `https://www.googleapis.com/auth/fitness.sleep.read`
  - `https://www.googleapis.com/auth/fitness.body.read`

---

## Step 2: Add Credentials to Your App (I Do This)

Create `.env.local` file in your project root:

```bash
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3001
```

Replace:
- `YOUR_CLIENT_ID_HERE` with the Client ID from Step 1.5
- `YOUR_CLIENT_SECRET_HERE` with the Client Secret from Step 1.5
- `your-secret-key-here` with any random string (for session encryption)

You can generate a random secret with:
```bash
openssl rand -base64 32
```

---

## Step 3: App Integration (I Handle This)

I will implement:

1. **OAuth Login with Google** - adds Google sign-in to Settings
2. **Google Fit API Client** - fetches health data
3. **Customization Algorithm** - uses health data to optimize frequencies
4. **Secure Token Storage** - stores refresh tokens safely
5. **Data Display** - shows in Settings what data we're reading

---

## What Happens After Setup

```
FIRST TIME:
1. User goes to Settings
2. Clicks "Connect Google Fit"
3. Redirected to Google sign-in
4. Grants permission to read health data
5. Returns to app with access token
6. App fetches:
   ├─ Last 7 days average heart rate
   ├─ HRV (if available)
   ├─ Last night's sleep quality
   └─ Current stress level

CUSTOMIZATION APPLIES:
├─ Algorithm analyzes your health data
├─ Determines optimal frequencies for YOU
├─ Creates personalized session recommendations
└─ Automatically uses them when you start session

ONGOING:
├─ Each time app opens, refreshes health data
├─ Continuously optimizes based on latest metrics
├─ You don't see the technical part—just works
```

---

## Security & Privacy

**What we store:**
- Refresh token (encrypted, for getting new access tokens)
- Basic health metrics (just numbers, cached locally)
- User email for identification

**What we DON'T store:**
- Password
- Personal health data (not stored in our database)
- Detailed medical information

**What Google stores:**
- All your health data (Google Fit ecosystem)
- You can revoke access anytime

**Your data:**
- Only you can see your personal metrics
- We only read what you grant permission for
- You can disconnect at any time

---

## Testing the Connection

Once implemented, you can test:

```
1. Start the app: npm run dev
2. Go to Settings
3. Click "Connect Google Fit"
4. You'll be redirected to Google
5. Grant permission
6. See your health metrics displayed
7. Start a session and it should be customized
```

---

## Troubleshooting

**"Invalid client ID"**
- Double-check you copied the ID correctly from Google Cloud Console
- Make sure it's in `.env.local` with correct variable name

**"Redirect URI mismatch"**
- Make sure `http://localhost:3001/api/auth/callback/google` is in authorized URIs
- Check exact spelling and protocol (http not https for localhost)

**"Permission denied"**
- Make sure you granted permission to read health data
- Check you're signed in with the same Google account as your Pixel phone

**"No health data showing"**
- Google Fit data syncs automatically; may take a few minutes
- Make sure your Pixel Watch has synced to Google Fit
- Check Google Fit app on phone to confirm data is there

---

## That's It!

Once you complete Step 1 (5 minutes of manual Google Cloud setup), I'll implement everything else. The app will automatically:
- Request permission
- Fetch your health data
- Customize frequencies
- Keep everything updated

**Ready?** After you complete Step 1, send me:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

And I'll implement the rest.
