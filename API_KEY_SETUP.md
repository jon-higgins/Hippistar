# 🔐 API Key Setup (IMPORTANT - Keep Your Key Private!)

**⚠️ NEVER commit your API key to git!**

## Quick Setup

### Option 1: Local Development Only
If you're just running the game locally:

1. Copy the example config:
   ```bash
   cp config.example.js config.js
   ```

2. Edit `config.js` and add your API key:
   ```javascript
   apiKey: 'YOUR_ACTUAL_API_KEY_HERE',
   ```

3. **DO NOT commit `config.js`!** (It's already in .gitignore)

### Option 2: GitHub Pages (Public Site)

**Problem:** You can't hide API keys on GitHub Pages - the JavaScript is public!

**Solutions:**

#### A) Use Without Music (Recommended for Public Sites)
- The game works perfectly without the YouTube API
- Players see artist/title and place songs without audio
- Keep `apiKey: 'YOUR_YOUTUBE_API_KEY_HERE'` as placeholder
- No security risk!

#### B) Use a Backend Proxy (Advanced)
- Set up a backend server (Netlify Functions, Vercel, etc.)
- Server holds the API key securely
- Frontend calls your server, server calls YouTube
- More complex but fully secure

#### C) Accept the Risk (Not Recommended)
- Add your key to config.js for GitHub Pages
- Set API quotas/restrictions in Google Cloud Console
- Monitor usage regularly
- Anyone can see and use your key!

## Getting a YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or select existing)
3. Enable "YouTube Data API v3"
4. Go to Credentials → Create Credentials → API Key
5. **Restrict your API key:**
   - Application restrictions: HTTP referrers
   - Add your website URL (e.g., `https://yourusername.github.io/*`)
   - API restrictions: Select "YouTube Data API v3"

## Security Best Practices

✅ **DO:**
- Keep `config.js` in `.gitignore` (already done!)
- Use `config.example.js` as a template
- Restrict API key to specific websites/IPs
- Monitor your API usage in Google Cloud Console
- Set quota limits

❌ **DON'T:**
- Commit `config.js` with real keys
- Share your API key publicly
- Use same key for multiple projects
- Skip API restrictions

## What's Already Protected

- `.gitignore` includes `config.js` ✅
- `config.example.js` is the safe template ✅
- Current `config.js` has placeholder (not a real key) ✅

## If You Already Committed a Real Key

1. **Regenerate the key immediately** in Google Cloud Console
2. Delete the old key
3. Never commit the new key
4. Clear git history (advanced):
   ```bash
   # WARNING: This rewrites history!
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch config.js" \
     --prune-empty --tag-name-filter cat -- --all
   git push --force --all
   ```

## For GitHub Pages Users

**Recommendation:** Run the game **without** the YouTube API key. The game is fully functional and the music is optional. This keeps your game completely secure!

To play with music locally during family game night:
1. Clone the repo
2. Add your API key to `config.js` locally
3. Run with a local server
4. Never push `config.js`!
