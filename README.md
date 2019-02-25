# LIRI Node App

### Programmer: Paul Meehan
### Date: 2/24/2019

**Purpose:**
This application is a command line interpreter and will take your commands, search the internet for information, and provide you with the resulting information about concerts, songs, and movies.

**User instructions:**
Instructions for setting up this application and using it are described in the following video:

https://drive.google.com/file/d/1Qotkq56jslP73Et_ljduwUA6zEqbCMVJ/view?usp=sharing

Download the appliction and then watch this video to learn how to configure it to work on your workstation as well as learn what commands you can enter and what information you will receive back.

**Technical information:**

This application makes use of the following APIs:

* Spotify (node-spotify-api)
* Bands In Town (bandsintown)
* Open Movie Database (omdbapi)

The request entered by the user on the command line is parsed to identify the command and the input parameters.  The appropriate API for the command is asynchronously called and the returned response is parsed to provid the user with specific information.

The user will be notified if there is no information for the specific parameters they have entered or if there is an error while making the API call.