console.log('this is loaded');
const Spotify = require('node-spotify-api')

module.exports = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
});
