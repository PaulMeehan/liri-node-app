require("dotenv").config();
var moment = require("moment");
var axios = require("axios");
var spotify = require("./keys.js");
var fs = require("fs");

var command = process.argv[2];         // The command to be processed is always the third input parameter.
var params = process.argv.slice(3);    // An array of any number of remaining input parameters after the command.

function addLog (thisString) {
// Writes the provided string to the console and also appends it to the log.txt file.
    console.log(thisString);
    try {
        fs.appendFileSync("./log.txt", thisString + "\n")
    } catch (err) {
        console.log("* * * Warning: Error writting to log file:" + err);
    };
};

function getConcert(thisArtist) {
// Calls the Bands In Town API passing in the provided artist name and displays the results.

    // Remove any leading or trailing spaces in the artist's name.
    thisArtist = thisArtist.trim();

    // Replace special characters with codes accepted by the API.
    thisArtist = thisArtist.replace("/", "%252F");
    thisArtist = thisArtist.replace("?", "%253F");
    thisArtist = thisArtist.replace("*", "%252A");
    thisArtist = thisArtist.replace('"', '%27C');

    // Call the API and get the results.
    axios.get("https://rest.bandsintown.com/artists/" + thisArtist + "/events?app_id=codingbootcamp").then(function (response) {
        
        // Add space to the output display.
        addLog("\n\n");

        // Provide a message if no information was found for the specified artist.
        if ((response.data.indexOf("Not found") > 0) || (response.data.length === 0)) {
            addLog("Sorry.  No information available about: " + thisArtist);
        } else {
            // Provide a header message for the output.
            addLog("Upcoming events for " + thisArtist + ":");
            addLog("\n");
            // Repeat for each event returned.
            for (var i = 0; i < response.data.length; i++) {
                var venue = response.data[i].venue.name;           // Name of the venue.
                var venueLoc = response.data[i].venue.city;        // City of the venue.
                var venueReg = response.data[i].venue.region;      // State of the venue (might be blank outside of US)
                var venueCountry = response.data[i].venue.country; // Country of the venue
                var venueDT = moment(response.data[i].datetime).format("MM/DD/YYYY HH:mm");   // Time when event will begin (military time)
                // Display the results.
                addLog(venue + " - " + venueLoc + " - " + venueReg + " - " + venueCountry + " - " + venueDT);
            };
        };
    }).catch(function (error) {     // Provide message if there is an error when calling the API.
        addLog("\n\n");
        addLog("Sorry, the following error occurred while contacting Bands In Town:" + error);
    });
};

function getSpotify(thisSong) {
// Calls the Spotify API passing in the provided song name and displays the results.

    // If no song name provided, use "The Sign" as a default.
    if (thisSong.length === 0) {
        thisSong = "The Sign";
    };

    // Call the API and get the results.
    spotify.search({ type: 'track', query: thisSong }, function (err, results) {
        
        // Add space to the display output.
        addLog("\n\n");

        // Provide message and halt execution if there is an error when calling the API.
        if (err) {
            return addLog("Sorry.  The following error occurred while contacting Spotify: " + err);
        }

        // Provide message if no information was found for the specified song.
        if (results.tracks.items.length === 0) {
            addLog("Sorry, no information about: " + thisSong);
        } else {
            // Provide header message for the display output.
            addLog("First 20 tracks of the song: " + thisSong);

            // Repeat for each track returned.
            for (var i = 0; i < results.tracks.items.length; i++) {
                addLog("\n");     // Add space between the information for each track.
                addLog("Track #" + (i + 1));   // Number each track using the index value incremented by 1.
                addLog("Artist name:" + results.tracks.items[i].artists[0].name);          // Name of the artist.
                addLog("Song name: " + results.tracks.items[i].name);                      // Name of the song.
                addLog("Spotify link: " + results.tracks.items[i].external_urls.spotify);  // Link to the Spotify recording of the track.
                addLog("Album name: " + results.tracks.items[i].album.name);               // Name of the album where the track can be found.
            };
        };
    });
};

function getMovie(thisMovieTitle) {
// Calls the OMDB API passing in the provided movie title and displays the results.
    
    // If no title name is provided, use "Mr. Nobody" as a default.
    if (thisMovieTitle.length === 0) {
        thisMovieTitle = "Mr.+Nobody";
    }
    // Call the API and get the results
    axios.get("http://www.omdbapi.com/?plot=short&r=json&apikey=8009e607&t=" + thisMovieTitle + "&").then(function (response) {
        // Add space to the display output.
        addLog("\n\n");

        // Provide message if there is no information returned for the specified title.
        if (response.data.Response === "False") {
            addLog("Sorry.  No information available for: " + thisMovieTitle);
        } else {

            // Add the results to the display output.
            addLog("Movie title: " + response.data.Title);                    // Movie title
            addLog("Year released: " + response.data.Year);                   // Year the movie was released
            addLog("IMDB Rating: " + response.data.imdbRating);               // IMDB Rating

            // Search the ratings for the Rotten Tomatoes score.
            // Initalize variable to record the score.
            var rotten = "rating not available";
            // Repeat for each rating score provided.                             
            for (var j = 0; j < response.data.Ratings.length; j++) {
                // Record value if score was provided by Rotten Tomatoes
                if (response.data.Ratings[j].Source === "Rotten Tomatoes") {
                    rotten = response.data.Ratings[j].Value;
                };
            };
            // Add the score to the display output.
            addLog("Rotten Tomatoes Rating: " + rotten);

            addLog("Country where produced: " + response.data.Country);        // Countries where movie was produced.
            addLog("Language: " + response.data.Language);                     // Languages used in the movie.
            addLog("Plot: " + response.data.Plot);                             // Brief summary of the movie plot.
            addLog("Actors: " + response.data.Actors);                         // Names of actors in the movie.
        }
    }).catch(function (error) {   // Provide message if there was an error when calling the API.
        addLog("\n\n");
        addLog("Sorry.  The following error occurred while contacting OMDB:" + error);
    });
};


// Call functions based on the command provided in the input parameters.
switch (command) {
    case "concert-this":
        // Artist name is made up of all remainin input parameters joined by a blank space.
        var artist = params.join(" ");
        getConcert(artist);
        break;

    case "spotify-this-song":
        // Song name is made up of all remainin input parameters joined by a blank space.
        var song = params.join(" ");
        getSpotify(song);
       break;

    case "movie-this":
        // Movie name is made up of all remainin input parameters joined by the plus sign (+).
        var movieTitle = params.join("+");
        getMovie(movieTitle);
        break;

    case "do-what-it-says":
        // Read in the file containing the list of commands and parameters.
        fs.readFile("./random.txt", "utf8", function(err, results){
            // Provide message if there was an error reading the file.
            if (err) {
                return addLog("Sorry.  The following error occurred trying to read the file random.txt: " + err);
            };

            // Create an array with each element being a line from the input file.
            var linesArray = results.split("\n");

            var thisLine = "";            // The contents of the current command line being processed.
            var randomCommands = [];      // An array to separate the command from the parameters.
            var newCommand = "";          // The command from the current line.
            var newParameter = "";        // The parameter from the current line.

            // Repeat for each line in the input file.
            for (var k=0; k < linesArray.length; k++) {
                
                // Remove any leading or training space from the command line.
                thisLine = linesArray[k].trim();

                // Skip over any blank lines.
                if (thisLine.length > 0) {
                    randomCommands = thisLine.split(",");                  // Use the array to split the line into a command and the parameters.
                    newCommand = randomCommands[0].trim().toLowerCase();   // The command is the first element in the array.  Convert this to all lower case.
                    newParameter = randomCommands[1].trim();               // The parameters are all other elements.  Remove leading and trailing blanks.
                    
                    // Call the appropriate function according to the specified command.
                    if (newCommand === "concert-this") {
                        getConcert(newParameter);
                    } else if (newCommand === "spotify-this-song") {
                        getSpotify(newParameter);
                    } else if (newCommand === "movie-this") {
                        getMovie(newParameter.replace(" ","+"));            // Replace any space characters with the plus sign.
                    } else {
                        // Provide message if unknown command is given.
                        addLog("Unknown command given: " + randomCommands[0]);
                    };
                };
            };

        })
        break;
        
    default:
        // Provide message if unknown command is given.
        addLog("Unknown command: " + command);
}

