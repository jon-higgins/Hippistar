// Core Game Logic and State Management

class HitsterGame {
    constructor() {
        this.teams = [];
        this.currentTeamIndex = 0;
        this.difficulty = 'easy';
        this.winCount = 10;
        this.songDatabase = [];
        this.usedSongs = new Set();
        this.currentSong = null;
        this.gameState = 'setup'; // setup, playing, victory
        this.placementMode = false;
    }

    // Initialize game with settings
    async initialize(teamNames, difficulty, winCount) {
        // Create teams based on teamNames array
        this.teams = teamNames.map(name => ({
            name: name,
            score: 0,
            timeline: [],
            target: winCount
        }));

        this.difficulty = difficulty;
        this.winCount = winCount;
        this.currentTeamIndex = 0;
        this.usedSongs.clear();

        console.log(`Initializing game with ${this.teams.length} teams`);

        // Load song database
        await this.loadSongDatabase();

        // Give each team a starting anchor song
        await this.giveStartingSongs();

        this.gameState = 'playing';
    }

    // Load song database for selected difficulty
    async loadSongDatabase() {
        const dbPath = GameConfig.songDatabases[this.difficulty];
        console.log('Loading songs from:', dbPath);
        console.log('GameConfig:', GameConfig);

        try {
            const response = await fetch(dbPath);
            console.log('Fetch response:', response.status, response.ok);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const songs = await response.json();
            console.log('Raw songs loaded:', songs.length);

            this.songDatabase = this.shuffleArray(songs);
            console.log(`Loaded ${this.songDatabase.length} songs for ${this.difficulty} difficulty`);
        } catch (error) {
            console.error('Error loading song database:', error);
            alert('Error loading songs. Please refresh the page.');
        }
    }

    // Fisher-Yates shuffle
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Give each team a starting anchor song
    async giveStartingSongs() {
        const teamCount = this.teams.length;
        console.log('giveStartingSongs called. Database has', this.songDatabase.length, 'songs');
        console.log('Giving starting songs to', teamCount, 'teams');

        // Select enough songs for all teams
        const startingSongs = this.songDatabase.filter(song =>
            !this.usedSongs.has(song.track)
        ).slice(0, teamCount);

        console.log('Selected starting songs:', startingSongs.length);

        if (startingSongs.length < teamCount) {
            console.error('Not enough songs in database!');
            alert('Error: Not enough songs loaded. Please refresh the page.');
            return;
        }

        for (let i = 0; i < teamCount; i++) {
            const song = startingSongs[i];
            console.log(`Adding starting song ${i+1}:`, song.track, 'by', song.artist);
            this.usedSongs.add(song.track);

            // Search YouTube for the video (optional)
            let videoInfo = null;
            try {
                videoInfo = await youtubeManager.searchVideo(song.spotify_search);
            } catch (error) {
                console.warn('YouTube search failed for starting song:', error);
            }

            this.teams[i].timeline.push({
                ...song,
                videoId: videoInfo ? videoInfo.videoId : null,
                isAnchor: true
            });
        }

        console.log('Starting songs added. Used songs count:', this.usedSongs.size);
    }

    // Get current team
    getCurrentTeam() {
        return this.teams[this.currentTeamIndex];
    }

    // Get next available song
    getNextSong() {
        console.log('getNextSong called. Database size:', this.songDatabase.length);
        console.log('Used songs count:', this.usedSongs.size);
        console.log('Used songs:', Array.from(this.usedSongs));

        for (const song of this.songDatabase) {
            if (!this.usedSongs.has(song.track)) {
                console.log('Found next song:', song.track);
                return song;
            }
        }
        console.error('No more songs available! All songs used.');
        return null; // No more songs available
    }

    // Draw a new song for the current team
    async drawSong() {
        const song = this.getNextSong();

        if (!song) {
            alert('No more songs available!');
            return null;
        }

        // Mark song as used immediately to prevent re-drawing
        this.usedSongs.add(song.track);
        console.log('Drew song:', song.track, 'by', song.artist, '(', song.year, ')');

        // Search YouTube for the video (optional - game works without it)
        let videoInfo = null;
        try {
            videoInfo = await youtubeManager.searchVideo(song.spotify_search);
            if (videoInfo) {
                console.log('YouTube video found:', videoInfo.videoId);
                // Play the video
                await youtubeManager.playVideo(videoInfo.videoId);
            } else {
                console.warn('No YouTube video found for:', song.track, '- continuing without audio');
            }
        } catch (error) {
            console.error('YouTube search failed:', error);
            console.warn('Continuing without audio playback');
        }

        // Create current song (with or without YouTube video)
        this.currentSong = {
            ...song,
            videoId: videoInfo ? videoInfo.videoId : null,
            thumbnail: videoInfo ? videoInfo.thumbnail : null
        };

        this.placementMode = true;

        return this.currentSong;
    }

    // Place song in timeline at specified index
    placeSong(teamIndex, insertIndex) {
        if (!this.currentSong) return null;

        const team = this.teams[teamIndex];
        const timeline = team.timeline;

        // Check if placement is correct
        const isCorrect = this.checkPlacement(timeline, this.currentSong.year, insertIndex);

        if (isCorrect) {
            // Insert at the correct position
            timeline.splice(insertIndex, 0, this.currentSong);
            team.score = timeline.length - 1; // Subtract the anchor song
            
            // Check for victory
            if (team.score >= team.target) {
                this.gameState = 'victory';
                return {
                    correct: true,
                    victory: true,
                    team: team
                };
            }
        }

        this.placementMode = false;

        // Stop the music
        youtubeManager.pause();

        return {
            correct: isCorrect,
            victory: false,
            correctYear: this.currentSong.year
        };
    }

    // Check if placement is correct based on chronological order
    checkPlacement(timeline, year, insertIndex) {
        // Check the year before the insertion point
        if (insertIndex > 0) {
            const beforeYear = timeline[insertIndex - 1].year;
            if (year < beforeYear) {
                return false;
            }
        }

        // Check the year after the insertion point
        if (insertIndex < timeline.length) {
            const afterYear = timeline[insertIndex].year;
            if (year > afterYear) {
                return false;
            }
        }

        return true;
    }

    // Switch to next team
    nextTurn() {
        this.currentTeamIndex = (this.currentTeamIndex + 1) % this.teams.length;
        this.currentSong = null;
    }

    // Reset game
    reset() {
        this.teams = [];
        this.currentTeamIndex = 0;
        this.usedSongs.clear();
        this.currentSong = null;
        this.gameState = 'setup';
        this.placementMode = false;
    }

    // Get game state for UI
    getGameState() {
        return {
            teams: this.teams,
            currentTeamIndex: this.currentTeamIndex,
            currentTeam: this.getCurrentTeam(),
            currentSong: this.currentSong,
            gameState: this.gameState,
            placementMode: this.placementMode,
            difficulty: this.difficulty
        };
    }
}

// Create global game instance
const game = new HitsterGame();
