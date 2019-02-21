require("dotenv").config();
var moment = require("moment");
var axios = require("axios");
var keys = require("./keys.js");
var fs = require("fs");

// var spotify = new Spotify(keys.spotify);
var Spotify = require('node-spotify-api');

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

        var spotify = new Spotify({

        });

        // spotify.search({type: 'track', query: 'Rocket Man'}, function (err, results) {
        //     if (err) {
        //         return console.log("Error: " + err);
        //     }

        //     console.log ("results: " + results);
        // });


        // axios.get("https://api.spotify.com/v1").then(function (response) {
        //     console.log(response.data)
        // }).catch(function (error) {
        //     console.log(error);
        // });
        break;

    case "movie-this":
        console.log("movie info");
        var movieTitle = params.slice(1).join("+");
        if (movieTitle.length === 0) {
            movieTitle = "Mr.+Nobody";
        }
        console.log("title=" + movieTitle);
        axios.get("http://www.omdbapi.com/?plot=short&r=json&apikey=8009e607&t=" + movieTitle + "&").then(function (response) {
            console.log(response.data);
            console.log("\r\n\r\n");
            console.log("Title: " + response.data.Title);
            console.log("Year released: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country where produced: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            
        }).catch(function (error) {
            console.log("Error here:" + error);
        });
        


        break;

    case "do-what-it-says":
        console.log("could be anything");
        fs.readFile("./random.txt", "utf8", function(err, results){
            if (err) {
                return console.log("something wrong here");
            };
            console.log(results);
        })
        break;
        
    default:
        console.log("Something is wrong here.");
}

