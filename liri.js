require("dotenv").config();
var moment = require("moment");
var axios = require("axios");
var spotify = require("./keys.js");
var fs = require("fs");

var command = process.argv[2];
var params = process.argv.slice(3);

// console.log(command);

function getConcert(thisArtist) {
    thisArtist = thisArtist.trim();

    // Replace special characters with codes accepted by the API
    thisArtist = thisArtist.replace("/", "%252F");
    thisArtist = thisArtist.replace("?", "%253F");
    thisArtist = thisArtist.replace("*", "%252A");
    thisArtist = thisArtist.replace('"', '%27C');

    axios.get("https://rest.bandsintown.com/artists/" + thisArtist + "/events?app_id=codingbootcamp").then(function (response) {
        console.log("\n\n");
        if ((response.data.indexOf("Not found") > 0) || (response.data.length === 0)) {
            console.log("Sorry.  No information available about: " + thisArtist);
        } else {
            console.log("Upcoming events for " + thisArtist + ":");
            console.log("\n");
            for (var i = 0; i < response.data.length; i++) {
                var venue = response.data[i].venue.name;
                var venueLoc = response.data[i].venue.city;
                var venueReg = response.data[i].venue.region;
                var venueCountry = response.data[i].venue.country;
                var venueDT = moment(response.data[i].datetime).format("MM/DD/YYYY HH:mm");
                console.log(venue + " - " + venueLoc + " - " + venueReg + " - " + venueCountry + " - " + venueDT);
            };
        };
    }).catch(function (error) {
        console.log("\n\n");
        console.log("Sorry, the following error occurred while contacting Bands In Town:" + error);
    });
};

function getSpotify(thisSong) {
    if (thisSong.length === 0) {
        thisSong = "The Sign";
    };
    spotify.search({ type: 'track', query: thisSong }, function (err, results) {
        console.log("\n\n");
        if (err) {
            return console.log("Sorry.  The following error occurred while contacting Spotify: " + err);
        }

        if (results.tracks.items.length === 0) {
            console.log("Sorry, no information about: " + thisSong);
        } else {
            console.log("First 20 tracks of the song: " + thisSong);
            for (var i = 0; i < results.tracks.items.length; i++) {
                console.log("\n");
                console.log("Artist #" + (i + 1));
                console.log("Artist name:" + results.tracks.items[i].artists[0].name);
                console.log("Song name: " + results.tracks.items[i].name);
                console.log("Spotify link: " + results.tracks.items[i].external_urls.spotify);
                console.log("Album name: " + results.tracks.items[i].album.name);
            };
        };
    });
};

function getMovie(thisMovieTitle) {
    if (thisMovieTitle.length === 0) {
        thisMovieTitle = "Mr.+Nobody";
    }
    axios.get("http://www.omdbapi.com/?plot=short&r=json&apikey=8009e607&t=" + thisMovieTitle + "&").then(function (response) {
        console.log("\n\n");
        if (response.data.Response === "False") {
            console.log("Sorry.  No information available for: " + thisMovieTitle);
        } else {
            // console.log(response.data);
            console.log("Movie title: " + response.data.Title);
            console.log("Year released: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            var rotten = "rating not available";
            for (var j = 0; j < response.data.Ratings.length; j++) {
                // console.log(response.data.Ratings[j].Source);
                if (response.data.Ratings[j].Source === "Rotten Tomatoes") {
                    rotten = response.data.Ratings[j].Value;
                };
            };
            console.log("Rotten Tomatoes Rating: " + rotten);
            console.log("Country where produced: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        }
    }).catch(function (error) {
        console.log("\n\n");
        console.log("Sorry.  The following error occurred while contacting OMDB:" + error);
    });
};



switch (command) {
    case "concert-this":
        var artist = params.join(" ");
        getConcert(artist);
        break;

    case "spotify-this-song":
        var song = params.join(" ");
        getSpotify(song);
       break;

    case "movie-this":
        var movieTitle = params.join("+");
        getMovie(movieTitle);
        break;

    case "do-what-it-says":
        fs.readFile("./random.txt", "utf8", function(err, results){
            if (err) {
                return console.log("Sorry.  The following error occurred trying to read the file random.txt: " + err);
            };
            var linesArray = results.split("\n");
            var thisLine = "";
            var randomCommands = [];
            var newCommand = "";
            var newParameter = "";
            for (var k=0; k < linesArray.length; k++) {
                thisLine = linesArray[k].trim();
                if (thisLine.length > 0) {
                    randomCommands = thisLine.split(",");
                    newCommand = randomCommands[0].trim().toLowerCase();
                    newParameter = randomCommands[1].trim();
                    if (newCommand === "concert-this") {
                        getConcert(newParameter);
                    } else if (newCommand === "spotify-this-song") {
                        getSpotify(newParameter);
                    } else if (newCommand === "movie-this") {
                        getMovie(newParameter.replace(" ","+"));
                    } else {
                        console.log("Unknown command given: " + randomCommands[0]);
                    };
                };
            };

        })
        break;
        
    default:
    debugger;
        console.log("Something is wrong here.");
}

