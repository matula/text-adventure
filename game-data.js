var init = {
    "currentRoom": "one",
    "inventory": [],
    "health": 100,
    "money": 0,
    "doorUnlocked": false,
    "foundTaser": false,
    "foundKey": false,
    "foundSecretRoom": false
}

var rooms = {
    "one": {
        "name": "An empty room with stone walls.",
        "description": function () {
            return "There’s a door to the east, and exits north, south, and west."
        }(),
        "exits": {
            "north": "two",
            "south": "four",
            "west": "three"
        }
    },
    "two": {
        "name": "a rundown courtyard surrounded by high walls.",
        "description": "Weeds are growing through the cracks in the floor. There's a garden to the west and a room is south.",
        "exits": {
            "south": "one",
            "west": "five"
        }
    },
    "three": {
        "name": "the kitchen.",
        "description": "There's dust all over the counters. This place hasn't been used in a very long time. There's a garden to the north, and exits east and west.",
        "exits": {
            "east": "one",
            "west": "six",
            "north": "five"
        }
    },
    "four": {
        "name": "the hallway.",
        "description": "Old paintings are hung along the walls. There are exits north and south.",
        "exits": {
            "south": "ten",
            "north": "one"
        }
    },
    "five": {
        "name": "an overgrown garden.",
        "description": "Weeds are everywhere and vines have covered the walls. There is a courtyard to the east and a kitchen to the south.",
        "exits": {
            "east": "two",
            "south": "three"
        }
    },
    "six": {
        "name": "a utility closet.",
        "description": "There's an angry looking robot in the corner, staring at you with red flashing eyes. Exits are east and south.",
        "exits": {
            "east": "three",
            "south": "seven"
        }
    },
    "seven": {
        "name": "a long hallway.",
        "description": "The elaborate wallpaper is falling off, and looks to have been chewed away by rodents. The hallway goes north and south.",
        "exits": {
            "south": "eight",
            "north": "six"
        }
    },
    "eight": {
        "name": "a storage room.",
        "description": "It's filled with junk that is of no interest. But you also notice a heavy chest in the center of the room. You can exit to the north and east",
        "exits": {
            "east": "nine",
            "north": "seven"
        }
    },
    "nine": {
        "name": "the office. ",
        "description": "As with the rest of this place, everything is pretty dusty. The walls are covered with books and there's a desk along one side. Exits are east and west.",
        "exits": {
            "east": "ten",
            "west": "eight"
        }
    },
    "ten": {
        "name": "the bedroom.",
        "description": "There's a bed in here, but it looks old and lumpy. There is an exit to the north and one to the west.",
        "exits": {
            "west": "nine",
            "north": "four"
        }
    },
    "eleven": {
        "name": "a secret room.",
        "description": "It was well hidden by the vines in the garden.",
        "exits": {}
    },

};

var roomVisits = {
    "one": 1,
    "two": 0,
    "three": 0,
    "four": 0,
    "five": 0,
    "six": 0,
    "seven": 0,
    "eight": 0,
    "nine": 0,
    "ten": 0,
    "eleven": 0
}

var items = {
    "paper": {
        "name": "a piece of paper",
        "actions": [
            {
                "regex": /(read(\sthe)? paper)/i,
                "description": "The paper reads... Thanks for playing Text Adventure! Created by Matula Studios! This is just a short adventure as a preview of bigger and better things coming soon!"
            },
            {
                "regex": /(look(\sat)?(\sthe)? paper)/i,
                "description": "It's paper alright. There are some words on it you may want to read."
            }
        ]
    },
    "bread": {
        "name": "a slice of bread",
        "actions": [
            {
                "regex": /(eat(\sthe)? bread)/i,
                "description": "Yummy. If we tracked your health in this game, this might actually do something."
            },
            {
                "regex": /(look(\sat)?(\sthe)? bread)/i,
                "description": "It looks like a mixture of flour, yeast, and water.  Also known as bread."
            }
        ]
    },
    "coins": {
        "name": "a stack of gold coins",
        "actions": [
            {
                "regex": /(look(\sat)?(\sthe)? coins)/i,
                "description": "The coins are very shiny, but pretty useless until the programmer adds a currency system into the game."
            }
        ]
    },
    "shears": {
        "name": "a pair of garden shears",
        "actions": [
            {
                "regex": /(use(\sthe)? shears)/i,
                "description": function () {
                    return "Snip snip. Nothing happened.";
                }()
            }
        ]
    },
    "taser": {
        "name": "an electric taser gun",
        "actions": [
            {
                "regex": /((use|shoot)(\sthe)? taser)/i,
                "description": function () {
                    return "A electrical charge emits from the taser into the air. This seems pretty dangerous.";
                }()
            }
        ]
    },
    "key": {
        "name": "a golden key",
        "actions": [
            {
                "regex": /(use(\sthe)? key)/i,
                "description": function () {
                    return "You use the key. It was... uneventful.";
                }()
            }
        ]
    },
    "lockpick": {
        "name": "a lockpick",
        "actions": [
            {
                "regex": /(use(\sthe)? lockpick)/i,
                "description": function () {
                    return "You use the lockpick. It was... uneventful.";
                }()
            }
        ]
    }
}

var roomItems = {
    "one": ["paper"],
    "two": [],
    "three": ["bread"],
    "four": [],
    "five": [],
    "six": [],
    "seven": ["coins"],
    "eight": [],
    "nine": [],
    "ten": [],
    "eleven": ["lockpick"],
}

var actions = {
    "one": [
        {
            "regex": /(open(\sthe)? door)/i,
            "description": "It's locked, and won't budge."
        }
    ],
    "four": [
        {
            "regex": /(look(\sat)?(\sthe)? paintings)/i,
            "description": function () {
                return "They're very faded with age. You can't make out anything in them."
            }()
        },
        {
            "regex": /(get(\sthe)? (painting|paintings))/i,
            "description": function () {
                return "They're attached very firmly to the walls. You can't take them."
            }()
        }
    ],
    "five": [
        {
            "regex": /(look(\sat)?(\sthe)? vines)/i,
            "description": function () {
                return "They've grown all over the place. They really need to be cut back."
            }()
        }
    ],
    "six": [
        {
            "regex": /(hit(\sthe)? robot)/i,
            "description": "He didn't take very kindly to that, and he zaps you with his laser eyes. If we were tracking your health, you'd probably lose some."
        },
        {
            "regex": /((shoot|tase)(\sthe)? robot)/i,
            "description": function () {
                return "You shoot the taser at the robot, sending him into an electric fit. As he falls over, you notice a golden key fall to the ground."
            }()
        }
    ],
    "nine": [
        {
            "regex": /(get(\sthe|a)? book)/i,
            "description": "You decide it's probably not a good idea to steal one of these books."
        },
        {
            "regex": /(read(\sa)? book)/i,
            "description": function () {
                return "It looks like an instruction manual for Zork."
            }()
        },
        {
            "regex": /(look(\sat)?(\sthe|a)? book)/i,
            "description": function () {
                return "It looks like an instruction manual for Zork."
            }()
        }
    ],
    "ten": [
        {
            "regex": /(go(\to)?(\sthe)? bed)/i,
            "description": "You take a short nap. You wake up feeling refreshed."
        },
        {
            "regex": /(go(\to)? sleep)/i,
            "description": "You take a short nap. You wake up feeling refreshed."
        },
        {
            "regex": /(sleep(.*)? bed)/i,
            "description": "You take a short nap. You wake up feeling refreshed."
        }
    ],
};

module.exports = {
    init,
    rooms,
    items,
    roomItems,
    actions,
    roomVisits
}
