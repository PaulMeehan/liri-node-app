require("dotenv").config();
var moment = require("moment");
var axios = require("axios");
var keys = require("./keys.js");

// var spotify = new Spotify(keys.spotify);
var Spotify = require("node-spotify-api");

var params = process.argv.slice(2);

var toBeRun = params[0];
console.log(toBeRun);

switch (toBeRun) {
    case "concert-this":
        var artist = params.slice(1).join(" ");
        console.log("\r\n\r\n");
        console.log("Upcoming events for " + artist + ":");
        console.log("\r\n");
        // Replace special characters with codes accepted by the API
        artist = artist.replace("/", "%252F");
        artist = artist.replace("?", "%253F");
        artist = artist.replace("*", "%252A");
        artist = artist.replace('"', '%27C');
        
        axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(function (response) {
            for (var i=0; i < response.data.length; i++) {
                var venue = response.data[i].venue.name;
                var venueLoc = response.data[i].venue.city;
                var venueReg = response.data[i].venue.region;
                var venueCountry = response.data[i].venue.country;
                var venueDT = moment(response.data[i].datetime).format("MM/DD/YYYY HH:mm");
                console.log(venue + " - " + venueLoc + " - " + venueReg + " - " + venueCountry + " - " + venueDT);
            };
            console.log("\r\n\r\n")

        }).catch(function (error) {
            console.log(error);
        });
        break;

    case "spotify-this-song":
        console.log("spotify info");
        axios.get("https://api.spotify.com/v1").then(function (response) {
            console.log(response.data)
        }).catch(function (error) {
            console.log(error);
        });
        break;

    case "movie-this":
        console.log("movie info");
        break;

    case "do-what-it-says":
        console.log("could be anything");
        break;
        
    default:
        console.log("Something is wrong here.");
}

