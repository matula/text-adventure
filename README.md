# Text Adventure for Google Home

This is an experiment to create a [Zork](https://en.wikipedia.org/wiki/Zork)-like text adventure for the Google Home. It's currently a single, 11 room adventure.

### Plans and Ideas
* Encapsulate the entire adventure into `game-data.js` and move game-specific logic out of the `adventure.js` parser.
* On initialization, allow the user to select an adventure to play. Then load in the appropriate `game-data` file.
* Add sound effects
* Add health
	* Eat food to increase health
	* As time passes, health goes down
	* "med kit" can increase health
* Add a "battle" system (like a quasi-RPG)
	* "enemies" have health
* Add a money system
	* Buy items from NPCs or a store
* Overall better and faster code.

### License
Feel free to use this code for learning how (or how _not_) to do things with the Google Actions SDK.  If you take any of the code for your own project, it would be nice if you provided attribution back to this repo.  


### Docs
 1. Actions SDK: [https://developers.google.com/actions/develop/sdk/getting-started#getting-started](https://developers.google.com/actions/develop/sdk/getting-started#getting-started).