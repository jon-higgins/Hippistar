// YouTube API Configuration
const YouTubeConfig = {
    // Replace with your YouTube Data API v3 key from https://console.cloud.google.com/
    apiKey: 'AIzaSyBk2zZTSDTsWgxOviyUOfDBZu_wHgTAgck',
    
    // API endpoints
    apiBaseUrl: 'https://www.googleapis.com/youtube/v3',
    
    // Maximum results per search
    maxResults: 1
};

// Game Configuration
const GameConfig = {
    // Default game settings
    defaultWinCount: 10,
    minWinCount: 5,
    maxWinCount: 20,
    
    // Playback settings
    defaultVolume: 0.8,
    previewLength: 30, // seconds
    
    // Song database paths
    songDatabases: {
        easy: 'songs-easy.json',
        medium: 'songs-medium.json',
        hard: 'songs-hard.json'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { YouTubeConfig, GameConfig };
}
