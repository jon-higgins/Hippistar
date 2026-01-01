#!/usr/bin/env node
/**
 * One-time script to map songs to Spotify track IDs
 *
 * Usage:
 * 1. Get Spotify API credentials:
 *    - Go to https://developer.spotify.com/dashboard
 *    - Create an app (takes 2 minutes, much easier than Google Cloud!)
 *    - Copy your Client ID and Client Secret
 *
 * 2. Run this script:
 *    node map-spotify-tracks.js YOUR_CLIENT_ID YOUR_CLIENT_SECRET
 *
 * This will update all song JSON files with Spotify track IDs
 */

const fs = require('fs');
const https = require('https');

// Get credentials from command line
const CLIENT_ID = process.argv[2];
const CLIENT_SECRET = process.argv[3];

if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('Usage: node map-spotify-tracks.js YOUR_CLIENT_ID YOUR_CLIENT_SECRET');
    console.error('\nGet credentials from: https://developer.spotify.com/dashboard');
    process.exit(1);
}

// Song files to process
const SONG_FILES = ['songs-easy.json', 'songs-medium.json', 'songs-hard.json'];

// Get Spotify access token
async function getAccessToken() {
    return new Promise((resolve, reject) => {
        const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
        const postData = 'grant_type=client_credentials';

        const options = {
            hostname: 'accounts.spotify.com',
            path: '/api/token',
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data).access_token);
                } else {
                    reject(new Error(`Auth failed: ${res.statusCode} ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

// Search for a track on Spotify
async function searchTrack(token, artist, track) {
    return new Promise((resolve, reject) => {
        const query = encodeURIComponent(`track:${track} artist:${artist}`);
        const path = `/v1/search?q=${query}&type=track&limit=1`;

        const options = {
            hostname: 'api.spotify.com',
            path: path,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const result = JSON.parse(data);
                    if (result.tracks.items.length > 0) {
                        resolve(result.tracks.items[0].id);
                    } else {
                        resolve(null);
                    }
                } else {
                    reject(new Error(`Search failed: ${res.statusCode}`));
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}

// Process all song files
async function processSongs() {
    console.log('Getting Spotify access token...');
    const token = await getAccessToken();
    console.log('✓ Token obtained\n');

    for (const filename of SONG_FILES) {
        console.log(`Processing ${filename}...`);
        const songs = JSON.parse(fs.readFileSync(filename, 'utf8'));

        let found = 0;
        let notFound = 0;

        for (let i = 0; i < songs.length; i++) {
            const song = songs[i];
            process.stdout.write(`  [${i+1}/${songs.length}] ${song.artist} - ${song.track}... `);

            try {
                const trackId = await searchTrack(token, song.artist, song.track);

                if (trackId) {
                    song.spotify_track_id = trackId;
                    process.stdout.write(`✓ ${trackId}\n`);
                    found++;
                } else {
                    process.stdout.write(`✗ Not found\n`);
                    notFound++;
                }

                // Rate limiting: wait 100ms between requests
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                process.stdout.write(`✗ Error: ${error.message}\n`);
                notFound++;
            }
        }

        // Save updated file
        fs.writeFileSync(filename, JSON.stringify(songs, null, 2));
        console.log(`\n✓ ${filename} updated: ${found} found, ${notFound} not found\n`);
    }

    console.log('Done! All song files have been updated with Spotify track IDs.');
    console.log('You can now use Spotify embeds without needing an API key during gameplay!');
}

// Run
processSongs().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
});
