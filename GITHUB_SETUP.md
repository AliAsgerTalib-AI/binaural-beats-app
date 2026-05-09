# GitHub Setup Instructions

Your binaural beats app is ready to push to GitHub. Follow these steps to create a repository and push your code.

---

## Step 1: Create GitHub Repository

Go to [github.com](https://github.com) and sign in with your account.

**Top right corner** → Click **+** → **New repository**

### Fill in:
- **Repository name**: `binaural-beats-app`
- **Description**: `Production-ready binaural beats web application with audio synthesis`
- **Visibility**: Public (so others can see it) or Private (only you)
- **Initialize**: Leave unchecked (we already have git initialized)

Click **"Create repository"**

---

## Step 2: Get Your Repository URL

After creating, you'll see a page with your repository URL. It looks like:

```
https://github.com/yourusername/binaural-beats-app.git
```

**Copy this URL** - you'll need it next.

---

## Step 3: Add Remote to Local Git

In your terminal, run:

```bash
cd "C:\Users\alias\OneDrive\AI Projects\Bianural\binaural-beats-app"
git remote add origin https://github.com/yourusername/binaural-beats-app.git
```

Replace `yourusername` with your actual GitHub username.

---

## Step 4: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

This will push all your code to GitHub. If prompted for credentials, use:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (see troubleshooting below)

Wait for upload to complete (~1 minute depending on internet speed).

---

## Step 5: Verify on GitHub

Refresh your GitHub repository page in the browser. You should see:
- All your files listed
- The commit message you created
- A nice README display

---

## Done! 🎉

Your app is now on GitHub. Anyone can:
- View your code
- Clone it
- Deploy it to Vercel or other platforms

---

## Next: Deploy to Vercel (Optional)

If you want your app live on the internet:

1. Go to [vercel.com](https://vercel.com)
2. Sign up (can use GitHub account)
3. Click "New Project"
4. Select your GitHub repository
5. Click "Deploy"

Your app will be live in ~2 minutes at a Vercel URL!

---

## Troubleshooting

### "fatal: Could not read Username"

Create a Personal Access Token:

1. GitHub → Settings (top right) → Developer settings → Personal access tokens
2. Click "Tokens (classic)"
3. Click "Generate new token"
4. Check `repo` scope
5. Click "Generate token"
6. Copy the token
7. When prompted for password in git, paste this token

### "Permission denied (publickey)"

Make sure you've set up SSH keys or use HTTPS with Personal Access Token.

### "Repository already exists"

The remote is already set:
```bash
git remote -v
```

If origin already points to GitHub, just push:
```bash
git push -u origin main
```

### "Branch 'main' does not exist"

Your branch might be named 'master'. Rename it:
```bash
git branch -M main
```

---

## What Gets Uploaded

✅ All source code  
✅ Configuration files  
✅ Documentation  
✅ package.json and package-lock.json  

❌ NOT uploaded (ignored by .gitignore):
- node_modules (too large, installed fresh)
- .env.local (contains secrets)
- .next (build artifacts)
- .vercel (deployment info)

---

## Your GitHub Repository Structure

After pushing, your repo will look like:

```
binaural-beats-app/
├── README.md (main documentation)
├── README_GITHUB.md (GitHub-specific readme)
├── app/
├── components/
├── lib/
├── public/
├── Documentation files (QUICK_START.md, etc)
└── .gitignore
```

---

## Sharing Your Repository

You can now share the GitHub URL with others:

```
https://github.com/yourusername/binaural-beats-app
```

They can:
- See your code
- Click "Use this template" to create their own copy
- Deploy directly to Vercel
- Fork to contribute

---

## Making Updates

Whenever you make changes locally:

```bash
git add .
git commit -m "Your commit message"
git push
```

Your changes will automatically sync to GitHub.

---

## Next Steps

1. **Optional**: Deploy to Vercel for live URL
2. **Optional**: Enable Google Fit integration (see GOOGLE_FIT_SETUP.md)
3. **Share**: Spread the word about your binaural beats app!

---

Questions? Check README_GITHUB.md for full documentation.
