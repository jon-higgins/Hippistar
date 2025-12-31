// YouTube Player Management

class YouTubeManager {
    constructor() {
        this.player = null;
        this.currentVideoId = null;
        this.isPlaying = false;
        this.isPlayerReady = false;
    }

    // Initialize YouTube IFrame API
    async initialize() {
        return new Promise((resolve, reject) => {
            // Load YouTube IFrame API
            if (!window.YT) {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                window.onYouTubeIframeAPIReady = () => {
                    this.createPlayer();
                    resolve();
                };
            } else {
                this.createPlayer();
                resolve();
            }
        });
    }

    // Create the YouTube player
    createPlayer() {
        this.player = new YT.Player('youtube-player', {
            height: '0',
            width: '0',
            playerVars: {
                'playsinline': 1,
                'controls': 0,
                'modestbranding': 1,
                'rel': 0
            },
            events: {
                'onReady': () => {
                    this.isPlayerReady = true;
                    console.log('YouTube player ready');
                },
                'onStateChange': (event) => {
                    this.handleStateChange(event);
                }
            }
        });

        // Start progress tracking
        this.startProgressTracking();
    }

    // Search for a video on YouTube
    async searchVideo(query) {
        const url = `${YouTubeConfig.apiBaseUrl}/search?` + new URLSearchParams({
            part: 'snippet',
            q: query,
            type: 'video',
            maxResults: YouTubeConfig.maxResults,
            key: YouTubeConfig.apiKey,
            videoCategoryId: '10' // Music category
        });

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                return {
                    videoId: data.items[0].id.videoId,
                    title: data.items[0].snippet.title,
                    thumbnail: data.items[0].snippet.thumbnails.medium.url
                };
            }
            return null;
        } catch (error) {
            console.error('YouTube search error:', error);
            return null;
        }
    }

    // Play a video
    async playVideo(videoId) {
        if (!this.isPlayerReady) {
            console.error('Player not ready yet');
            return false;
        }

        this.currentVideoId = videoId;
        
        try {
            this.player.loadVideoById(videoId);
            this.isPlaying = true;
            return true;
        } catch (error) {
            console.error('Error playing video:', error);
            return false;
        }
    }

    // Pause playback
    pause() {
        if (this.player && this.isPlayerReady) {
            this.player.pauseVideo();
            this.isPlaying = false;
        }
    }

    // Resume playback
    resume() {
        if (this.player && this.isPlayerReady) {
            this.player.playVideo();
            this.isPlaying = true;
        }
    }

    // Toggle play/pause
    togglePlayback() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.resume();
        }
    }

    // Set volume (0-100)
    setVolume(volume) {
        if (this.player && this.isPlayerReady) {
            this.player.setVolume(volume);
        }
    }

    // Handle player state changes
    handleStateChange(event) {
        switch(event.data) {
            case YT.PlayerState.PLAYING:
                this.isPlaying = true;
                break;
            case YT.PlayerState.PAUSED:
                this.isPlaying = false;
                break;
            case YT.PlayerState.ENDED:
                this.isPlaying = false;
                break;
        }
        
        // Update UI
        if (window.gameUI) {
            window.gameUI.updatePlaybackButton(this.isPlaying);
        }
    }

    // Track playback progress
    startProgressTracking() {
        setInterval(() => {
            if (this.player && this.isPlayerReady && this.isPlaying) {
                try {
                    const currentTime = this.player.getCurrentTime();
                    const duration = this.player.getDuration();
                    
                    if (duration > 0) {
                        const progress = (currentTime / duration) * 100;
                        if (window.gameUI) {
                            window.gameUI.updateProgress(progress);
                        }

                        // Auto-stop after preview length (default 30 seconds)
                        const previewLength = parseInt(document.getElementById('preview-length')?.value || 30);
                        if (currentTime >= previewLength) {
                            this.pause();
                        }
                    }
                } catch (error) {
                    // Player might not be ready, ignore
                }
            }
        }, 100);
    }

    // Get current state
    getPlayerState() {
        if (this.player && this.isPlayerReady) {
            return this.player.getPlayerState();
        }
        return null;
    }
}

// Create global instance
const youtubeManager = new YouTubeManager();
