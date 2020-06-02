# Laurcons/place
## A simulation or Reddit's Place
This project is a JavaScript/PHP implementation of Reddit's r/place event that took place on April 1st, 2017.
## Features and bugs
* Uses the same 16 colors
* The timeout is 1 minute (configurable)
* Is not compatible with mobile
* Has a MySQL backend (that works okay-ish only if your board is not larger than 250k tiles)
* Pretty configurable
## Already online!
The game is online already on [SickGamez](https://sickgamez.com)! If you just wanna play, go over to that site and find the game in the gamez list.
## Bot support
The API is bot-ready. You can use the API bot interface to create your own clients for the game, be it using the backend hosted on SickGamez or anywhere else.
The bot API reference can be found [here](https://laurcons.ucoz.org/files/place/apidocs.html).
## Installation
* You need an Apache server with mod_rewrite on.
* Place the files somewhere on your server so that they are accessible under the path "/place". You can view and modify the AJAX calls in the `place.js` file if you want to be able to use a different path. You are looking for the functions that start with `ajax_`.
* Open `api.php` and modify the database credentials, configure your game (please note that the options here need to be synced up with the options in `place.js`!) and configure the login code in the places that comments indicate. Don't forget about line 67 if you implement users!
  * If you do not want user support, the game is already configured to work using request codes, which are tokens that are generated on page loading. Keep in mind that this makes the timeout useless, as users can just reload the page to reset the timer.
* Open `index.php` in your web browser and see how the game behaves!
## Bugs
The backend is quite unbreakable, as it keeps track of the timeouts for each user and refuses tile placements if the timeout hasn't passed. The user interface is a bit visually buggy though, but nothing that can't easily be fixed. If you want to help with the interface, please do.
