# Spotify Setup Guide

This game now uses **Spotify embeds** instead of YouTube, which means:
- ✅ No API key needed during gameplay
- ✅ Much easier setup than Google Cloud
- ✅ One-time mapping process
- ✅ Free to use forever

## One-Time Setup (Takes ~10 minutes)

### Step 1: Get Spotify API Credentials

1. Go to https://developer.spotify.com/dashboard
2. Log in with your Spotify account (free account is fine)
3. Click **"Create app"**
4. Fill in:
   - **App name:** Hitster Clone
   - **App description:** Music timeline game
   - **Redirect URI:** http://localhost (doesn't matter for this)
   - Accept terms and click **Create**
5. On your app page, click **Settings**
6. Copy your **Client ID** and **Client Secret**

### Step 2: Run the Mapping Script

This script will automatically find Spotify track IDs for all your songs:

```bash
# Make sure you have Node.js installed
node --version  # Should show v14 or higher

# Run the mapping script
node map-spotify-tracks.js YOUR_CLIENT_ID YOUR_CLIENT_SECRET
```

**What it does:**
- Searches Spotify for each song (artist + track name)
- Adds `spotify_track_id` to each song in the JSON files
- Takes about 5-10 minutes to process all 400+ songs
- Shows progress as it goes

**Example output:**
```
Processing songs-easy.json...
  [1/141] Elvis Presley - Hound Dog... ✓ 3qe0bkF1fqxdcC2L4vZ6kV
  [2/141] Chuck Berry - Johnny B. Goode... ✓ 1BklRHAua0vXHa8MtwZPYs
  ...
✓ songs-easy.json updated: 138 found, 3 not found
```

### Step 3: Deploy to GitHub Pages

After the script completes:

```bash
# Commit the updated song files
git add songs-*.json spotify.js map-spotify-tracks.js SPOTIFY_SETUP.md
git commit -m "Add Spotify track IDs and switch to Spotify embeds"
git push
```

### Step 4: Play!

That's it! Your game now works with Spotify embeds. No API keys needed during gameplay.

## How It Works

**Before (YouTube):**
- Required Google Cloud account
- Required YouTube Data API key
- API key needed for every game session
- Rate limits on searches

**After (Spotify):**
- One-time API setup to get track IDs
- Track IDs stored in JSON files
- No API needed during gameplay
- No rate limits
- Works forever

## Notes

- **Song previews:** Users without Spotify Premium get 30-second previews (plenty for gameplay!)
- **Not found songs:** A few songs might not be found on Spotify. The game works fine without them.
- **Manual additions:** If you want to add more songs later, run the script again

## Troubleshooting

**"node: command not found"**
- Install Node.js from https://nodejs.org/

**"Auth failed: 400"**
- Double-check your Client ID and Client Secret
- Make sure there are no extra spaces when copying

**"Many songs not found"**
- This is normal - some older or obscure songs might not be on Spotify
- The game will work fine with the songs that are found

## Want to Add More Songs?

1. Add songs to the JSON files (without spotify_track_id)
2. Run the mapping script again
3. It will only process songs without track IDs (fast!)

Enjoy your game! 🎮🎵
