# Hitster Clone - Browser-Based Music Timeline Game

A browser-based implementation of the popular music timeline game Hitster, where teams compete to arrange songs in chronological order.

## 🎮 Game Overview

**Objective:** Be the first team to correctly place 10 songs in chronological order on your timeline.

**How to Play:**
1. Each team starts with one "anchor" song (a known year to start their timeline)
2. Teams take turns having a random song played from Spotify
3. The active team must place the new song in the correct position on their timeline (before, after, or between existing songs)
4. The song's year is revealed - if placed correctly, the card stays; if wrong, it's discarded
5. First team to reach 10 correctly placed songs wins!

## 🎵 Features

- **Three Difficulty Levels:**
  - **Easy** (~150 songs): Massive global hits with very distinctive eras
  - **Medium** (~150 songs): Well-known songs with less obvious timing
  - **Hard** (~100 songs): Deeper cuts, international hits, and similar-sounding eras

- **YouTube Integration:** Play real music using YouTube Data API (no premium account needed!)
- **2-Team Gameplay:** Compete head-to-head with visual timelines
- **Curated Song Database:** 400 songs spanning 1956-2021 across all genres
- **Glitzy Interface:** Modern, polished UI design
- **Free to Use:** YouTube API has generous free tier for personal use

## 🚀 Setup Instructions

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- YouTube Data API key (free, no premium account needed)
- Internet connection

### YouTube API Setup

1. **Create a Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (e.g., "Hitster Clone")

2. **Enable YouTube Data API v3:**
   - In your project, go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click Enable

3. **Create API Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key
   - (Optional) Restrict the key to YouTube Data API v3 for security

4. **Update the Game Configuration:**
   - Open `js/config.js`
   - Replace `YOUR_YOUTUBE_API_KEY_HERE` with your actual API key

### Running Locally

Because of Spotify authentication requirements, you need to serve the files from a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have http-server installed)
npx http-server -p 8000
```

Then navigate to `http://localhost:8000` in your browser.

### Deploying to GitHub Pages

1. Create a new repository on GitHub
2. Push all files to the repository
3. Go to repository Settings → Pages
4. Select "Deploy from a branch" and choose your main branch
5. Update `js/config.js` with your GitHub Pages URL as the redirect URI
6. Add this URL to your Spotify App's redirect URIs in the Developer Dashboard

## 📁 Project Structure

```
hitster-clone/
├── index.html              # Main game interface
├── README.md              # This file
├── data/                  # Song databases
│   ├── songs-easy.json    # Easy difficulty songs
│   ├── songs-medium.json  # Medium difficulty songs
│   └── songs-hard.json    # Hard difficulty songs
├── js/                    # JavaScript game logic
│   ├── config.js          # YouTube API configuration
│   ├── youtube.js         # YouTube player integration
│   ├── game.js            # Core game mechanics
│   └── ui.js              # User interface handling
├── css/                   # Stylesheets
│   └── style.css          # Main styles
└── images/                # Game assets (optional)
```

## 🎯 Roadmap / Future Enhancements

- [ ] 3+ team support
- [ ] Custom song lists
- [ ] "Hitster cards" (wild cards/power-ups)
- [ ] Mobile-responsive design
- [ ] Statistics tracking
- [ ] Multiplayer online mode
- [ ] Custom difficulty mixing
- [ ] Achievement system

## 🛠️ Technology Stack

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Audio:** YouTube IFrame Player API
- **Hosting:** GitHub Pages compatible
- **No backend required** (client-side only)
- **No premium accounts needed** (free YouTube API tier)

## 📝 Song Database Format

Each song entry contains:
```json
{
  "artist": "Artist Name",
  "track": "Song Title",
  "year": 1984,
  "difficulty": "easy|medium|hard",
  "spotify_search": "Search query for YouTube API"
}
```

Note: The `spotify_search` field is named for compatibility but is used to search YouTube.

## 🎵 Credits

- Original game concept: [Hitster by Jumbo Games](https://www.jumbo.eu/en-gb/products/hitster)
- Song curation: Custom curated for this implementation
- Music playback: YouTube IFrame Player API
- Built with ❤️ for family game nights

## 📄 License

This is a fan-made clone for personal/family use. All music rights belong to their respective owners and YouTube/Google.

## 🐛 Known Issues / Limitations

- YouTube API has daily quota limits (10,000 units/day free tier)
- Each song search uses ~100 units (approximately 100 songs per day)
- Some songs may not be available on YouTube
- Internet connection required
- No premium subscription needed!

## 🤝 Contributing

Feel free to fork and enhance! Ideas welcome for additional features or song additions.

---

**Note:** This project is not affiliated with or endorsed by Jumbo Games or YouTube/Google.
