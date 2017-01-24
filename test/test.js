var chai = require('chai');
var assert = chai.assert;
var GreatAdv = require('../adventure');
var gadv = new GreatAdv();

it('does not recognize look at command', function () {
    gadv.command = 'blah';
    assert.equal(false, gadv.lookAtSomething());
});

it('does not see item', function () {
    gadv.command = 'look at cat';
    var look = gadv.lookAtSomething();
    assert.equal("I do not see that here.", look.prompt);

    gadv.command = 'examine the cat';
    var look = gadv.lookAtSomething();
    assert.equal("I do not see that here.", look.prompt);

    gadv.command = 'look at the small dagger';
    var look = gadv.lookAtSomething();
    assert.equal("I do not see that here.", look.prompt);
});

it('can look at an item', function () {
    var expected = [
        "It's just a normal dagger. Kind of pointy.",
        "The dagger is very.... daggerish",
        "Yep, it's a dagger alright."
    ];

    gadv.command = "look at the dagger";
    var look = gadv.lookAtSomething();
    assert.oneOf(look.prompt, expected);

    gadv.command = "look at a dagger";
    var look = gadv.lookAtSomething();
    assert.oneOf(look.prompt, expected);

    gadv.command = "examine dagger";
    var look = gadv.lookAtSomething();
    assert.oneOf(look.prompt, expected);

    gadv.command = "examine a dagger";
    var look = gadv.lookAtSomething();
    assert.oneOf(look.prompt, expected);

    gadv.command = "look dagger";
    var look = gadv.lookAtSomething();
    assert.oneOf(look.prompt, expected);

    gadv.command = "look a dagger";
    var look = gadv.lookAtSomething();
    assert.oneOf(look.prompt, expected);
});

it('can check the room for items', function () {
    assert.equal("You also see a dagger, and a piece of paper.", gadv.roomCheck());
});

it('can move in a direction', function () {
    gadv.command = "go north";
    var move = gadv.moveDirection();
    assert.equal("This is the second Room", move.prompt);

    gadv.command = "south";
    var move = gadv.moveDirection();
    assert.equal("This is Room one", move.prompt);

    var res = [
        "I can't go that way.",
        "I really would like to go there. But I can't",
        "Unfortunately, the physcial laws of universe are preventing me from going there."
    ];
    gadv.command = "please go east";
    var move = gadv.moveDirection();
    assert.oneOf(move.prompt, res);

    gadv.command = "walk west";
    var move = gadv.moveDirection();
    assert.oneOf(move.prompt, res);
});

it('can not pick up an item', function () {
    gadv.command = "pick up narwhal";
    var pickup = gadv.pickupItem();
    assert.equal("You don't see that here.", pickup.prompt);

    gadv.command = "get the narwhal";
    var pickup = gadv.pickupItem();
    assert.equal("You don't see that here.", pickup.prompt);

    gadv.command = "get narwhal";
    var pickup = gadv.pickupItem();
    assert.equal("You don't see that here.", pickup.prompt);
});

it('can pick up an item', function () {
    gadv.command = "pick up dagger";
    var pickup = gadv.pickupItem();
    assert.equal("You pick up a dagger", pickup.prompt);

    gadv.command = "get the paper";
    var pickup = gadv.pickupItem();
    assert.equal("You pick up a piece of paper", pickup.prompt);
});

it('can drop an item', function () {
    gadv.command = "drop the paper";
    var drop = gadv.dropItem();
    assert.equal("You dropped a piece of paper", drop.prompt);
});




