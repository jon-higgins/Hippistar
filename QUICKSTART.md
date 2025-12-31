# Hitster Clone - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Set Up YouTube Data API

1. Go to https://console.cloud.google.com/
2. Create a new project (click "Select Project" → "New Project")
   - Name: "Hitster Clone" (or any name you like)
   - Click "Create"
3. Enable YouTube Data API v3:
   - In the search bar, type "YouTube Data API v3"
   - Click on it and press "Enable"
4. Create API Key:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key
   - (Optional) Click "Restrict Key" → Select "YouTube Data API v3" for security

### Step 2: Configure the Game

1. Open `js/config.js`
2. Replace `YOUR_YOUTUBE_API_KEY_HERE` with your actual API Key from Step 1
3. That's it!

### Step 3: Run Locally

Open terminal in the project folder and run:

```bash
# Using Python 3 (most common)
python -m http.server 8000

# OR using Python 2
python -m SimpleHTTPServer 8000

# OR using Node.js
npx http-server -p 8000
```

Then open your browser to: **http://localhost:8000**

---

## 📤 Deploying to GitHub Pages

### 1. Create GitHub Repository

```bash
# In your project folder
git init
git add .
git commit -m "Initial commit - Hitster Clone"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/hitster-clone.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Settings → Pages
3. Source: Deploy from branch
4. Branch: `main` (or `master`)
5. Click Save
6. Your site will be at: `https://YOUR-USERNAME.github.io/hitster-clone/`

**Note:** YouTube API works the same for both local and GitHub Pages - no additional configuration needed!

---

## 🎮 How to Play

1. **Connect Spotify**: Click "Connect Spotify Premium" on the loading screen
2. **Setup Game**: 
   - Enter team names
   - Choose difficulty (Easy/Medium/Hard)
   - Set win condition (5-20 songs)
3. **Play**:
   - Click "Draw New Song" to play a random track
   - Listen and place it in your timeline
   - Click the correct position (before/after/between existing songs)
   - First team to correctly place 10 songs wins!

---

## 🎵 Song Databases

- **Easy**: ~150 massive global hits (Beatles, Queen, Beyoncé, etc.)
- **Medium**: ~150 well-known but less obvious timing
- **Hard**: ~100 deeper cuts and international hits

Total: **400 songs** spanning 1956-2021

---

## ⚙️ Game Features

- ✅ Spotify Premium integration
- ✅ Live music playback
- ✅ Three difficulty levels
- ✅ Glitzy, modern UI
- ✅ 2-team gameplay
- ✅ Customizable win conditions
- ✅ In-game settings
- ✅ Victory animations

---

## 🐛 Troubleshooting

**"Error: Please check your YouTube API key" message:**
- Verify your API key is correctly pasted in `js/config.js`
- Make sure YouTube Data API v3 is enabled in your Google Cloud project
- Check the browser console for specific error messages

**Videos not playing:**
- Some songs may not be available on YouTube
- Try refreshing the page
- Check your internet connection
- Verify the API key has proper permissions

**"Quota exceeded" error:**
- YouTube API has a daily quota (10,000 units/day for free tier)
- Each search uses ~100 units, so you can do ~100 searches per day
- Wait 24 hours for quota to reset, or upgrade your Google Cloud project

**Audio but no video showing:**
- This is normal! The video player is hidden - we only use the audio

**Localhost not working:**
- Make sure you're running a local server (not just opening the HTML file)
- Check that port 8000 isn't already in use

---

## 📁 Project Structure

```
hitster-clone/
├── index.html          # Main game page
├── README.md           # Full documentation
├── QUICKSTART.md       # This file
├── .gitignore          # Git ignore rules
├── data/
│   ├── songs-easy.json
│   ├── songs-medium.json
│   └── songs-hard.json
├── js/
│   ├── config.js       # ⚠️ UPDATE YOUR YOUTUBE API KEY HERE
│   ├── youtube.js
│   ├── game.js
│   └── ui.js
└── css/
    └── style.css
```

---

## 🔄 Next Steps with Claude Code

To continue development:

1. Push this project to GitHub
2. Open the repository in Claude Code
3. Continue building features like:
   - 3+ team support
   - Custom playlists
   - Mobile responsiveness
   - Achievement system
   - Statistics tracking

---

## 📝 Important Notes

- **Free to use!** YouTube Data API has a generous free tier
- Daily API quota: ~100 song searches per day (should be plenty for family games)
- All music rights belong to respective owners
- This is a fan-made project, not affiliated with Jumbo Games or YouTube
- Use for personal/family entertainment

---

## 💡 Tips

- Start with **Easy** difficulty to learn the game
- Songs are shuffled each game for variety
- Each team gets a different starting anchor song
- You can adjust volume in the settings during gameplay
- The game works best on desktop/laptop browsers

**Have fun! 🎵🎮**
