'use strict';

var gameData = require('./game-data');

const GreatAdventure = class {
    constructor() {
        this.command = null;

        // The room # you are in before moving
        this.currentRoom = gameData.init.currentRoom;
        this.doorUnlocked = gameData.init.doorUnlocked;
        this.foundKey = gameData.init.foundKey;
        this.foundTaser = gameData.init.foundTaser;
        this.foundSecretRoom = gameData.init.foundSecretRoom;

        // Default items in each room
        this.roomItems = gameData.roomItems;
        this.roomVisits = gameData.roomVisits;

        // All the items
        this.items = gameData.items;

        // Custom actions per room
        this.actions = gameData.actions;

        // What you carry
        this.inventory = gameData.init.inventory;

        // Your health
        this.health = gameData.init.health;

        // Your health
        this.money = gameData.init.money;
    }

    begin() {
        return this.createResponse('Welcome to Text Adventure! ' +
            "You wake up feeling dizzy. As your vision comes into focus, you see you’re in an empty room with stone walls.  You don’t remember how you got here, but decide that two pina coladas is definitely your limit. There’s a door to the east, and exits north, south, and west. You decide not to question how you know the directions of things.");
    }

    setCommand(command) {
        this.command = command.toLowerCase();
        return this;
    }

    setParams(params) {
        this.currentRoom = params.currentRoom;
        this.roomItems = params.roomItems;
        this.roomVisits = params.roomVisits;
        this.health = params.health;
        this.inventory = params.inventory;
        this.money = params.money;
        this.doorUnlocked = (params.doorUnlocked != undefined) ? params.doorUnlocked : this.doorUnlocked;
        this.foundKey = (params.foundKey != undefined) ? params.foundKey : this.foundKey;
        this.foundTaser = (params.foundTaser != undefined) ? params.foundTaser : this.foundTaser;
        this.foundSecretRoom = (params.foundSecretRoom != undefined) ? params.foundSecretRoom : this.foundSecretRoom;
        return this;
    }

    createResponse(newPrompt) {
        return {
            "prompt": newPrompt,
            "data": {
                "currentRoom": this.currentRoom,
                "roomItems": this.roomItems,
                "roomVisits": this.roomVisits,
                "health": this.health,
                "inventory": this.inventory,
                "money": this.money,
                "doorUnlocked": this.doorUnlocked,
                "foundKey": this.foundKey,
                "foundTaser": this.foundTaser,
                "foundSecretRoom": this.foundSecretRoom
            }
        };
    }

    parse() {
        var direction = this.moveDirection();
        if (direction) {
            return direction;
        }

        var lookAround = this.lookAround();
        if (lookAround) {
            return lookAround;
        }

        var checkInventory = this.checkInventory();
        if (checkInventory) {
            return checkInventory;
        }

        var customActions = this.customActions();
        if (customActions) {
            return customActions;
        }

        // Interact with items
        var interactWithItem = this.interactWithItem();
        if (interactWithItem) {
            return interactWithItem;
        }

        var itemPickedUp = this.pickupItem();
        if (itemPickedUp) {
            return itemPickedUp;
        }

        var dropItem = this.dropItem();
        if (dropItem) {
            return dropItem;
        }

        return this.createResponse("I don't understand.");
    }


    moveDirection() {
        let directionReg = /(north|south|east|west)/i;
        var directionMatch = this.command.match(directionReg);
        if (directionMatch) {
            var nextRoom = gameData.rooms[this.currentRoom].exits[directionMatch[1]];
            if (nextRoom) {
                this.currentRoom = nextRoom;
                if (this.roomVisits[this.currentRoom] == 0) {
                    this.roomVisits[this.currentRoom] = this.roomVisits[this.currentRoom] + 1;
                    return this.createResponse("You're in " + gameData.rooms[nextRoom].name + gameData.rooms[nextRoom].description + this.roomCheck());
                }

                this.roomVisits[this.currentRoom] = this.roomVisits[this.currentRoom] + 1;
                return this.createResponse("You're in " + gameData.rooms[nextRoom].name);
            }

            var res = [
                "I can't go that way.",
                "I really would like to go there. But I can't",
                "Unfortunately, the physcial laws of universe are preventing me from going there."
            ];

            return this.createResponse(res[Math.floor(Math.random() * res.length)]);
        }

        return false;
    }

    lookAround() {
        if (this.command == 'where am i' || this.command == 'look around' || this.command == 'look') {
            return this.createResponse("Looking around. You're in " + gameData.rooms[this.currentRoom].name + gameData.rooms[this.currentRoom].description + '. ' + this.roomCheck());
        }

        return false;
    }

    roomCheck() {
        var itemsInRoom = this.roomItems[this.currentRoom];
        var res = '';
        if (this.currentRoom == "five" && this.foundSecretRoom) {
            res = "There's a secret room behind the trimmed away vines. ";
        }
        if (itemsInRoom.length > 0) {
            res = res + 'You also see ';
            var lastItem = (itemsInRoom.length - 1);
            for (var i = 0; i < itemsInRoom.length; i++) {
                if (gameData.items[itemsInRoom[i]].name != undefined) {
                    if (itemsInRoom.length > 1 && i == lastItem) {
                        res = res + 'and ' + gameData.items[itemsInRoom[i]].name + '. ';
                    } else {
                        res = res + gameData.items[itemsInRoom[i]].name + ', ';
                    }
                }
            }

            return res;
        }

        return '';
    }

    pickupItem() {
        let pickupReg = /(?:pick up|get|grab)(?:\sthe|\sa)? (.*)/i;
        var pickupMatch = this.command.match(pickupReg);
        if (pickupMatch) {
            var matchedItem = pickupMatch[1];
            if (this.roomItems[this.currentRoom].indexOf(matchedItem) == -1) {
                return this.createResponse('You don\'t see that here.');
            }
            this.inventory.push(matchedItem);
            this.roomItems[this.currentRoom] = this.roomItems[this.currentRoom].filter(function (item) {
                return item !== matchedItem;
            });

            return this.createResponse('You pick up ' + this.items[matchedItem].name);
        }

        return false;
    }

    dropItem() {
        let putdownReg = /(?:put down|drop)(?:\sthe|\sa)? (.*)/i;
        var putdownMatch = this.command.match(putdownReg);
        if (putdownMatch) {
            var matchedItem = putdownMatch[1];

            if (this.inventory.indexOf(matchedItem) == -1) {
                return this.createResponse('You don\'t have that in your inventory.');
            }

            this.roomItems[this.currentRoom].push(matchedItem);
            this.inventory = this.inventory.filter(function (item) {
                return item !== matchedItem;
            });

            return this.createResponse('You dropped ' + this.items[matchedItem].name);
        }

        return false;
    }

    interactWithItem() {
        // Does the room have any items
        var totalRoomItems = this.roomItems[this.currentRoom].length;
        if (totalRoomItems > 0) {
            // Loop through the items in the room
            for (var i = 0; i < totalRoomItems; i++) {
                // Does the item have any actions
                var roomItemActions = this.checkItemActions(this.roomItems[this.currentRoom][i]);
                if (roomItemActions) {
                    return roomItemActions;
                }
            }
        }

        if (this.inventory.length > 0) {
            for (var i = 0; i < this.inventory.length; i++) {
                // Does the item have any actions
                var roomItemActions = this.checkItemActions(this.inventory[i]);
                if (roomItemActions) {
                    return roomItemActions;
                }
            }
        }

        return false;
    }

    checkItemActions(item) {
        var currentItem = this.items[item].actions;
        if (currentItem == undefined) {
            return false;
        }

        if (currentItem.length > 0) {
            // Loop through the actions
            for (var x = 0; x < currentItem.length; x++) {
                // See if the actions match the command
                var itemMatch = this.command.match(currentItem[x].regex);
                if (itemMatch) {
                    if (typeof currentItem[x].description == "function") {
                        return this.createResponse(currentItem[x].description());
                    }
                    return this.createResponse(currentItem[x].description);
                }
            }
        }

        return false;
    }

    customActions() {
        if (this.currentRoom == "one") {
            var roomOne = this.roomOne();
            if (roomOne) {
                return roomOne;
            }
        }

        if (this.currentRoom == "five") {
            var roomFive = this.roomFive();
            if (roomFive) {
                return roomFive;
            }
        }

        if (this.currentRoom == "six") {
            var roomSix = this.roomSix();
            if (roomSix) {
                return roomSix;
            }
        }

        if (this.currentRoom == "eight") {
            var roomEight = this.roomEight();
            if (roomEight) {
                return roomEight;
            }
        }

        if (this.currentRoom == "nine") {
            var roomNine = this.roomNine();
            if (roomNine) {
                return roomNine;
            }
        }

        if (this.currentRoom == "eleven") {
            var roomEleven = this.roomEleven();
            if (roomEleven) {
                return roomEleven;
            }
        }

        if (this.actions[this.currentRoom] == undefined || this.actions[this.currentRoom].length == 0) {
            return false;
        }

        var totalActions = this.actions[this.currentRoom].length;
        for (var i = 0; i < totalActions; i++) {
            var customMatch = this.command.match(this.actions[this.currentRoom][i].regex);
            if (customMatch) {
                if (typeof this.actions[this.currentRoom][i].description == "function") {
                    console.log("room function");
                    return this.createResponse(this.actions[this.currentRoom][i].description());
                }
                return this.createResponse(this.actions[this.currentRoom][i].description);
            }
        }

        return false;
    }

    checkInventory() {
        let inventoryReg = /(inventory|carrying)/i;
        var inventoryMatch = this.command.match(inventoryReg);
        if (inventoryMatch) {
            if (this.inventory.length == 0) {
                return this.createResponse("There's nothing in your inventory.");
            }

            var inventoryReturn = "You are carrying ";
            for (var i = 0; i < this.inventory.length; i++) {
                if (this.inventory.length > 1 && (i + 1) == this.inventory.length) {
                    inventoryReturn = inventoryReturn + " and " + gameData.items[this.inventory[i]].name + ".";
                }
                inventoryReturn = inventoryReturn + gameData.items[this.inventory[i]].name + ', ';
            }

            return this.createResponse(inventoryReturn);
        }

        return false;
    }

    roomOne() {
        var regex = /(unlock(\sthe)? door)/i;
        var unlockMatch = this.command.match(regex);
        if (unlockMatch) {
            if (this.inventory.indexOf("lockpick") == -1 && this.inventory.indexOf("key") >= 0) {
                return this.createResponse("You try to unlock the door, but the key doesn't fit. If this had sound effects, I'd play a sad trombone sound here.");
            }

            return this.createResponse("You attempt to use your powers of telekinesis to unlock the door. But then you remember, you don't have those powers.");
        }

        var regex = /(pick(\sthe)? lock)/i;
        var unlockMatch = this.command.match(regex);
        var regex = /(use(\sthe)? lockpick)/i;
        var pickMatch = this.command.match(regex);
        if (unlockMatch || pickMatch) {
            if (this.inventory.indexOf("lockpick") >= 0) {
                this.doorUnlocked = true;
                return this.createResponse("You remember you're actually a very skilled lockpick.  You're able to unlock and open the door with ease. You step outside into a bright, sunny day.  Looking forward to your next adventure!");
            }

            return this.createResponse("You don't have the tools to do that.");
        }

        return false;
    }

    roomFive() {
        var regex = /(use(\sthe)? shears)/i;
        var shearsMatch = this.command.match(regex);
        var regex = /((shear|trim|cut)(\sthe)? vines)/i;
        var vinesMatch = this.command.match(regex);
        if (shearsMatch || vinesMatch) {
            if (this.inventory.indexOf("shears") >= 0) {
                if (this.foundSecretRoom) {
                    return this.createResponse("You can't shear them any more than you already have.");
                }
                this.foundSecretRoom = true;
                return this.createResponse("You cut away at the vines. You see the opening of a secret room behind them.");
            }

            return this.createResponse("You're fingers just aren't sharp enough.");
        }

        var regex = /(go(\sto)?(\sthe)?(\ssecret)? room)/i;
        var roomMatch = this.command.match(regex);
        if (roomMatch) {
            if (this.foundSecretRoom) {
                this.currentRoom = "eleven";
                if (this.roomVisits[this.currentRoom] == 0) {
                    this.roomVisits[this.currentRoom] = this.roomVisits[this.currentRoom] + 1;
                    return this.createResponse("You're in " + gameData.rooms[this.currentRoom].name + gameData.rooms[this.currentRoom].description + this.roomCheck());
                }

                this.roomVisits[this.currentRoom] = this.roomVisits[this.currentRoom] + 1;
                return this.createResponse("You're in " + gameData.rooms[this.currentRoom].name);
            }

            return this.createResponse("I can't go there yet.");
        }

        return false;
    }

    roomSix() {
        var regex = /((tase|shoot)(\sthe)? robot)/i;
        var robotMatch = this.command.match(regex);
        var regex = /((use|shoot)(\sthe)? taser)/i;
        var taseMatch = this.command.match(regex);
        if (robotMatch || taseMatch) {
            if (this.inventory.indexOf("taser") >= 0) {
                if (this.foundKey) {
                    return this.createResponse("You fire your taser at the robot. He starts making loud buzzing noises");
                }

                this.foundKey = true;
                this.roomItems[this.currentRoom].push("key");
                return this.createResponse("You fire your taser at the robot. He starts making loud buzzing noises and pieces of metal start flying through the air. You notice a key has fallen on the ground.");
            }

            return this.createResponse("You don't have anything that can do that. You just succeeded in making the robot upset.");
        }

        return false;
    }

    roomEight() {
        var regex = /(unlock(\sthe)? chest)/i;
        var chestMatch = this.command.match(regex);
        if (chestMatch) {
            if (this.foundKey) {
                this.roomItems[this.currentRoom].push("shears");
                return this.createResponse("You unlock the chest. You find a set of gardening shears.")
            }

            return this.createResponse("You can't unlock the chest.");
        }

        var regex = /(open(\sthe)? chest)/i;
        var chestMatch = this.command.match(regex);
        if (chestMatch) {
            return this.createResponse("You can't open the chest. It's locked.");
        }

        return false;
    }

    roomNine() {
        var regex = /((look|examine)(\sat|in)?(\sthe)? desk)/i;
        var nineMatch = this.command.match(regex);
        if (nineMatch) {
            if (this.foundTaser == false) {
                this.foundTaser = true;
                this.roomItems[this.currentRoom].push("taser");
                return this.createResponse("You examine the desk closely, and notice a taser has fallen out of one of the drawers. How shocking.")
            }

            return this.createResponse("You examine the desk but see nothing special.");
        }

        return false;
    }

    roomEleven() {
        var regex = /(go(\sto)?(\sthe)? garden)/i;
        var elevenMatch = this.command.match(regex);
        if (elevenMatch) {
            this.currentRoom = "five";
            this.roomVisits[this.currentRoom] = this.roomVisits[this.currentRoom] + 1;
            return this.createResponse("You're in " + gameData.rooms[this.currentRoom].name + gameData.rooms[this.currentRoom].description + this.roomCheck());
        }

        return false;
    }
}


module.exports = GreatAdventure;
