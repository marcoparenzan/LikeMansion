require([
    "commanding",
    "rooms/homeoffice"
], function(
    commandingx,
    homeoffice
) {
    var room = document.getElementById("room");
    var room_game = new Phaser.Game(386, 284, Phaser.CANVAS, room);

    // states
    room_game.state.add("preload", {
        preload: function(game) {
            // preload images
            game.load.spritesheet('things_icons', 'game/things/images/things_icons.png', 64, 64);
            game.state.start("homeoffice");
        }
    });
    room_game.state.add("homeoffice", homeoffice);
    room_game.state.start("preload");
    //room_game.state.start("bedroom");

    var commanding = document.getElementById("commanding");
    var commanding_game = new Phaser.Game(386, 284, Phaser.CANVAS, commanding);
    commanding_game.state.add("commanding", commandingx);
    commanding_game.state.start("commanding");

    // common methods useful in all game, out of state

    room_game.redraw_inventory = function() {
        var room = room_game.state.states[room_game.state.current];
        var him = room.him;

        var y = 5;
        him.things.forEach(function(item){
            item.body_sprite.x = 260;
            item.body_sprite.y = y;
            y += 70;
        });
    };
    
    room_game.inventory_thing = function(thing) {
        var room = room_game.state.states[room_game.state.current];
        var him = room.him;

        commandingx.place_thing(thing, function() {
            if (room.targetVerb != undefined) {
                if (room.targetVerb(him, thing)) {
                    room.complete_verb();
                }
            }
        })

        him.things.push(thing);
        room_game.redraw_inventory();
    };
    
    room_game.place_thing = function(thing) {
        var room = room_game.state.states[room_game.state.current];
        var him = room.him;

        thing.preload(room);
        room.place(thing);
        room.things.push(thing);

        room_game.redraw_inventory();
    };
    
    room_game.select_thing = function(thing) {
        var room = room_game.state.states[room_game.state.current];
        var him = room.him;

        if (room.targetVerb != undefined) {
            if (room.targetVerb(him, thing)) {
                room.complete_verb();
            }
        }
    };

    room_game.completed_verb = function() {
        var room = room_game.state.states[room_game.state.current];
        var him = room.him;

        setTimeout(function() {
            room.complete_verb();
        }, 1000);
    };
    
    room_game.thinking = function(message) {
        var room = room_game.state.states[room_game.state.current];
        var him = room.him;

        commandingx.thinking(message);
    };

    commandingx.select_verb = function(handler) {
        var room = room_game.state.states[room_game.state.current];
        var him = room.him;

        room.targetVerb = handler;
        if (room.targetVerb(him)) {
            room.complete_verb();
        }
    };
    
    commandingx.place_thing = function (thing, callback) {
        var room = this;

        thing._parent = room;

        thing.body_sprite = room.game.add.sprite(thing.x, thing.y - thing.height, 'things_icons');
        thing.body_sprite.animations.add("icon", [thing.icon_index], 10, true);
        thing.body_sprite.animations.play("icon");

        thing.body_sprite.inputEnabled = true;
        thing.body_sprite.input.pixelPerfectClick = true;
        thing.body_sprite.events.onInputDown.add(callback);
    }
});
