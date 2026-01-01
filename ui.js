// UI Management and Event Handling

class GameUI {
    constructor() {
        this.screens = {
            loading: document.getElementById('loading-screen'),
            setup: document.getElementById('setup-screen'),
            game: document.getElementById('game-screen'),
            victory: document.getElementById('victory-screen')
        };

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Start game
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });

        // Draw card
        document.getElementById('draw-card-btn').addEventListener('click', () => {
            this.drawCard();
        });

        // Settings
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showSettings();
        });

        document.getElementById('close-settings').addEventListener('click', () => {
            this.hideSettings();
        });

        // Volume control
        document.getElementById('volume-slider').addEventListener('input', (e) => {
            const volume = parseInt(e.target.value);
            youtubeManager.setVolume(volume);
            document.getElementById('volume-display').textContent = `${e.target.value}%`;
        });

        // End game
        document.getElementById('end-game-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to end the current game?')) {
                this.endGame();
            }
        });

        // Victory screen buttons
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.playAgain();
        });

        document.getElementById('new-setup-btn').addEventListener('click', () => {
            this.showScreen('setup');
        });

        // Play/pause button
        document.getElementById('play-pause-btn').addEventListener('click', () => {
            youtubeManager.togglePlayback();
        });
    }

    // Show specific screen
    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        this.screens[screenName].classList.add('active');
    }

    // Initialize app
    async initialize() {
        try {
            const loadingStatus = document.getElementById('loading-status');
            loadingStatus.textContent = 'Loading YouTube Player...';

            await youtubeManager.initialize();

            loadingStatus.textContent = 'Ready!';

            setTimeout(() => {
                this.showScreen('setup');
            }, 500);
        } catch (error) {
            console.error('YouTube initialization failed:', error);
            document.getElementById('loading-status').textContent =
                'Error: YouTube player failed to load. Check console for details.';
        }
    }

    // Start the game
    async startGame() {
        const team1Name = document.getElementById('team1-name').value || 'Team 1';
        const team2Name = document.getElementById('team2-name').value || 'Team 2';
        const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        const winCount = parseInt(document.getElementById('win-count').value);

        // Initialize game
        await game.initialize(team1Name, team2Name, difficulty, winCount);

        // Update UI
        document.getElementById('team1-display-name').textContent = team1Name;
        document.getElementById('team2-display-name').textContent = team2Name;
        document.getElementById('team1-target').textContent = winCount;
        document.getElementById('team2-target').textContent = winCount;

        // Render initial timelines
        this.renderTimelines();
        this.updateTurnIndicator();

        this.showScreen('game');
    }

    // Draw a new card
    async drawCard() {
        const drawBtn = document.getElementById('draw-card-btn');
        drawBtn.disabled = true;
        drawBtn.textContent = '🎵 Loading...';

        const song = await game.drawSong();

        if (song) {
            // Update current song display
            document.getElementById('current-artist').textContent = song.artist;
            document.getElementById('current-title').textContent = song.track;
            document.getElementById('play-pause-btn').disabled = false;

            // Show placement instructions
            document.getElementById('placement-instructions').classList.remove('hidden');

            // Show placement zones for current team
            this.showPlacementZones(game.currentTeamIndex);
        }

        drawBtn.textContent = '🎲 Draw New Song';
    }

    // Show placement zones for a team
    showPlacementZones(teamIndex) {
        const team = game.teams[teamIndex];
        const timeline = team.timeline;
        const timelineElement = document.getElementById(`team${teamIndex + 1}-timeline`);

        // Clear timeline and rebuild with placement zones interleaved
        timelineElement.innerHTML = '';

        // Create placement zones interleaved with song cards
        for (let i = 0; i <= timeline.length; i++) {
            // Add a placement zone
            const zone = document.createElement('div');
            zone.className = 'placement-zone';
            zone.dataset.index = i;
            zone.innerHTML = '<span class="zone-label">📍 Place here</span>';

            zone.addEventListener('click', () => {
                this.handlePlacement(teamIndex, i);
            });

            timelineElement.appendChild(zone);

            // Add the song card after the zone (except after the last zone)
            if (i < timeline.length) {
                const song = timeline[i];
                const card = this.createSongCard(song, song.isAnchor);
                timelineElement.appendChild(card);
            }
        }
    }

    // Handle song placement
    async handlePlacement(teamIndex, insertIndex) {
        const result = game.placeSong(teamIndex, insertIndex);

        // Show result
        this.showResult(result);

        // Update timelines (this will remove placement zones)
        this.renderTimelines();

        // Check for victory
        if (result.victory) {
            setTimeout(() => {
                this.showVictory(result.team);
            }, 2000);
        } else {
            // Next turn after showing result
            setTimeout(() => {
                game.nextTurn();
                this.updateTurnIndicator();
                this.hideResult();
                document.getElementById('draw-card-btn').disabled = false;
            }, 3000);
        }

        // Hide placement instructions
        document.getElementById('placement-instructions').classList.add('hidden');
    }

    // Show placement result
    showResult(result) {
        const resultDisplay = document.getElementById('result-display');
        resultDisplay.classList.remove('hidden');

        if (result.correct) {
            resultDisplay.className = 'result-display correct';
            resultDisplay.innerHTML = `
                <h3>✅ Correct!</h3>
                <p>The song was placed correctly in the timeline.</p>
            `;
        } else {
            resultDisplay.className = 'result-display incorrect';
            resultDisplay.innerHTML = `
                <h3>❌ Incorrect</h3>
                <p>The song was from <strong>${result.correctYear}</strong></p>
            `;
        }
    }

    // Hide result display
    hideResult() {
        document.getElementById('result-display').classList.add('hidden');
    }

    // Render team timelines
    renderTimelines() {
        game.teams.forEach((team, index) => {
            const timeline = document.getElementById(`team${index + 1}-timeline`);
            timeline.innerHTML = '';

            team.timeline.forEach((song, songIndex) => {
                const card = this.createSongCard(song, songIndex === 0);
                timeline.appendChild(card);
            });

            // Update score
            document.getElementById(`team${index + 1}-score`).textContent = team.score;
        });

        // Clear any active placement zones
        document.querySelectorAll('.placement-zones').forEach(zones => {
            zones.classList.remove('active');
            zones.innerHTML = '';
        });
    }

    // Create a song card element
    createSongCard(song, isAnchor) {
        const card = document.createElement('div');
        card.className = 'song-card' + (isAnchor ? ' anchor' : '');

        card.innerHTML = `
            <div class="song-year">${song.year}</div>
            <div class="song-details">
                <div class="song-card-artist">${song.artist}</div>
                <div class="song-card-title">${song.track}</div>
            </div>
            ${isAnchor ? '<div class="anchor-badge">START</div>' : ''}
        `;

        return card;
    }

    // Update turn indicator
    updateTurnIndicator() {
        const currentTeam = game.getCurrentTeam();
        document.getElementById('active-team-name').textContent = currentTeam.name;

        // Highlight active team section
        document.querySelectorAll('.team-section').forEach((section, index) => {
            if (index === game.currentTeamIndex) {
                section.classList.add('active-team');
            } else {
                section.classList.remove('active-team');
            }
        });
    }

    // Show victory screen
    showVictory(team) {
        document.getElementById('winner-name').textContent = team.name;
        document.getElementById('winner-score').textContent = team.score;
        document.getElementById('winner-message').textContent = 'Successfully placed all songs in chronological order!';

        this.showScreen('victory');

        // Stop any playing music
        youtubeManager.pause();
    }

    // Play again with same settings
    async playAgain() {
        const team1Name = game.teams[0].name;
        const team2Name = game.teams[1].name;
        const difficulty = game.difficulty;
        const winCount = game.winCount;

        await game.initialize(team1Name, team2Name, difficulty, winCount);
        this.renderTimelines();
        this.updateTurnIndicator();
        this.hideResult();
        
        document.getElementById('draw-card-btn').disabled = false;
        
        this.showScreen('game');
    }

    // Show settings modal
    showSettings() {
        document.getElementById('settings-modal').classList.remove('hidden');
    }

    // Hide settings modal
    hideSettings() {
        document.getElementById('settings-modal').classList.add('hidden');
    }

    // End current game
    endGame() {
        game.reset();
        this.hideSettings();
        this.showScreen('setup');
    }

    // Update playback state (called from YouTube manager)
    updatePlaybackButton(isPlaying) {
        const playPauseBtn = document.getElementById('play-pause-btn');
        playPauseBtn.textContent = isPlaying ? '⏸️' : '▶️';
    }

    // Update progress bar
    updateProgress(progress) {
        document.getElementById('playback-progress').style.width = `${progress}%`;
    }
}

// Initialize UI when DOM is ready
window.gameUI = null;

document.addEventListener('DOMContentLoaded', () => {
    window.gameUI = new GameUI();
    window.gameUI.initialize();
});
