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
    async initialize(team1Name, team2Name, difficulty, winCount) {
        this.teams = [
            {
                name: team1Name,
                score: 0,
                timeline: [],
                target: winCount
            },
            {
                name: team2Name,
                score: 0,
                timeline: [],
                target: winCount
            }
        ];

        this.difficulty = difficulty;
        this.winCount = winCount;
        this.currentTeamIndex = 0;
        this.usedSongs.clear();

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
        console.log('giveStartingSongs called. Database has', this.songDatabase.length, 'songs');

        // Select two well-known songs from different decades as starting points
        const startingSongs = this.songDatabase.filter(song =>
            !this.usedSongs.has(song.track)
        ).slice(0, 2);

        console.log('Selected starting songs:', startingSongs.length);

        if (startingSongs.length < 2) {
            console.error('Not enough songs in database!');
            alert('Error: Not enough songs loaded. Please refresh the page.');
            return;
        }

        for (let i = 0; i < 2; i++) {
            const song = startingSongs[i];
            console.log(`Adding starting song ${i+1}:`, song.track, 'by', song.artist);
            this.usedSongs.add(song.track);

            this.teams[i].timeline.push({
                ...song,
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

        // Play on Spotify if track ID is available
        if (song.spotify_track_id) {
            try {
                console.log('Playing Spotify track:', song.spotify_track_id);
                await spotifyManager.playTrack(song.spotify_track_id);
            } catch (error) {
                console.error('Spotify playback failed:', error);
                console.warn('Continuing without audio playback');
            }
        } else {
            console.warn('No Spotify track ID for:', song.track, '- continuing without audio');
        }

        // Create current song
        this.currentSong = song;
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
        spotifyManager.stop();

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
