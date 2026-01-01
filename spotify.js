// Spotify Embed Player Management

class SpotifyManager {
    constructor() {
        this.player = null;
        this.currentTrackId = null;
        this.isPlaying = false;
        this.playerContainer = null;
    }

    // Initialize Spotify player
    async initialize() {
        this.playerContainer = document.getElementById('spotify-player');
        console.log('Spotify embed player ready');
        return Promise.resolve();
    }

    // Play a track using Spotify embed
    async playTrack(trackId) {
        if (!trackId) {
            console.warn('No Spotify track ID provided');
            return false;
        }

        this.currentTrackId = trackId;

        // Clear existing iframe
        this.playerContainer.innerHTML = '';

        // Create Spotify embed iframe
        const iframe = document.createElement('iframe');
        iframe.style.borderRadius = '12px';
        iframe.src = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
        iframe.width = '100%';
        iframe.height = '152';
        iframe.frameBorder = '0';
        iframe.allowFullscreen = '';
        iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        iframe.loading = 'lazy';

        this.playerContainer.appendChild(iframe);
        this.isPlaying = true;

        console.log('Playing Spotify track:', trackId);
        return true;
    }

    // Pause playback (limited control with iframe embeds)
    pause() {
        // Note: We can't control Spotify iframe playback via JavaScript
        // Users must use the controls in the embed player
        this.isPlaying = false;
    }

    // Resume playback
    resume() {
        this.isPlaying = true;
    }

    // Toggle play/pause (limited with iframe)
    togglePlayback() {
        // Limited control with iframe embeds
        console.log('Use player controls to play/pause');
    }

    // Set volume (not available with iframe embeds)
    setVolume(volume) {
        // Not available with Spotify iframe embeds
        console.log('Volume control not available with Spotify embeds');
    }

    // Get current state
    getPlayerState() {
        return this.isPlaying ? 'playing' : 'paused';
    }

    // Stop and clear player
    stop() {
        this.playerContainer.innerHTML = '';
        this.isPlaying = false;
        this.currentTrackId = null;
    }
}

// Create global instance
const spotifyManager = new SpotifyManager();
