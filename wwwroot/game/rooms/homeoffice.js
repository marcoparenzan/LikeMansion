// http://phaser.io/examples/v2/input/pixelpick-scrolling-effect
// http://phaser.io/tutorials/making-your-first-phaser-game/part3        
// http://www.joshmorony.com/how-to-create-an-animated-character-using-sprites-in-phaser/

define([
    "subjects/him"
], function (
    that
) {
        return {

            type: "room",
            room_type: "homeoffice",

            // standard Phaser handlers

            preload: function () {
                var room = this;

                room.game.load.image('background', 'game/rooms/images/homeoffice.png');

                // things

                room.things = [];
                room.things.push({ id: "desk1", type: "thing", thing_type: "desk", x: 100, y: 274, width: 219, height: 80 });
                room.things.push({ id: "shelf1", type: "thing", thing_type: "shelf", x: 360, y: 274, width: 111, height: 260 });
                room.things.push({ id: "clock1", type: "thing", thing_type: "clock", x: 70, y: 90, width: 86, height: 86 });
                room.things.push({ id: "board1", type: "thing", thing_type: "board", x: 240, y: 130, width: 74, height: 107 });
                room.things.push({ id: "penholder1", type: "thing", thing_type: "penholder", x: 260, y: 194, width: 36, height: 93 });
                room.things.push({
                    id: "pencil1", type: "thing", thing_type: "pencil", x: 280, y: 149, width: 16, height: 48, icon_index: 2, pickup: true, use_with: function (him, that) {
                        if (that.thing_type != "pieceofpaper") {
                            him.saying("I DON'T KNOW HOW TO DO IT");
                        }
                        else {
                            him.saying("I can write another book");
                        }
                    }
                });
                room.things.push({ id: "computer1", type: "thing", thing_type: "computer", x: 110, y: 194, width: 105, height: 88, turnon: function(him){
                    room.show_thing("computer_screen1");
                    him.saying("I can write another game!");
                } });
                room.things.push({ id: "computer_screen1", type: "thing", thing_type: "computer_screen", x: 114, y: 198, width: 64, height: 88, visible: false });
                room.things.push({
                    id: "plan1", type: "thing", thing_type: "plan", x: 250, y: 75, width: 57, height: 48, icon_index: 0, pickup: true, use: function (him) {
                        him.saying("Devo cominciare a pensare a cosa fare a partire da lunedì...");
                    }
                });
                room.things.push({ id: "pieceofpaper1", type: "thing", thing_type: "pieceofpaper", x: 260, y: 95, width: 19, height: 28, icon_index: 1, pickup: true });
                room.things.push({ id: "window1", type: "thing", thing_type: "window", x: 530, y: 194, width: 201, height: 164 });
                room.things.push({
                    id: "marco_book1", type: "thing", thing_type: "marco_book", x: 430, y: 162, width: 32, height: 40, icon_index: 3, pickup: function (him) {
                        him.saying("E' il mio libro!");
                        return true;
                    }, use: function (him) {
                        var thing = this;
                        if (thing._parent.type == "room") {
                            him.saying("I cannot read it on the bookshelf");
                            return;
                        }
                        him.saying("Interesting: so my next application must work in the cloud!");
                        return true;
                    }
                });

                room.things.forEach(function (thing) {
                    room.game.load.spritesheet(thing.id + '_spritesheet', 'game/things/images/' + thing.thing_type + '.png');
                });

                // him

                var him = that(room.game, 170, 284);
                him.preload();
                room.him = him;
            },

            create: function () {
                var room = this;
                var him = room.him;

                room.game.physics.startSystem(Phaser.Physics.ARCADE);
                room.game.world.setBounds(0, 0, 790, 284);

                room.background = room.game.add.tileSprite(0, 0, 790, 284, 'background');

                // things

                room.things.forEach(function (thing) {
                    room.place_thing(thing);
                });

                // him

                him.create();
            },

            render: function () {
                var room = this;
                var him = room.him;

                // him

                him.render();

                // things

                room.things.forEach(function (item) { if (item.render != undefined) item.render(); });
            },

            update: function () {
                var room = this;
                var him = room.him;

                // him

                him.update();

                // things

                room.things.forEach(function (item) { if (item.update != undefined) item.update(); });
            },

            // custom

            complete_verb: function () {
                var room = this;
                var him = room.him;

                room.targetVerb = undefined;
            },
            
            get_thing: function (thing) {
                var room = this;

                for(var i = 0; i<room.things.length; i++) {
                    if (room.things[i].id == thing) return room.things[i];
                }
                return undefined;
            },
                        
            show_thing: function (thing) {
                var room = this;

                if (typeof thing === "string") {
                    return room.show_thing(room.get_thing(thing));
                }
                else {
                    thing.body_sprite.visible = true;
                }
            },

            place_thing: function (thing, x, y) {
                var room = this;
                var him = room.him;

                if (typeof thing === "string") {
                    return this.place_thing(him.inventory_thing(thing), x, y);
                }

                var room = this;
                var him = room.him;

                if (x != undefined) thing.x = x;
                if (y != undefined) thing.y = y;

                thing._parent = room;

                thing.body_sprite = room.game.add.sprite(thing.x, thing.y - thing.height, thing.id + '_spritesheet');
                if (thing.visible != undefined) {
                    thing.body_sprite.visible = thing.visible;
                }

                thing.body_sprite.inputEnabled = true;
                thing.body_sprite.input.pixelPerfectClick = true;
                thing.body_sprite.events.onInputDown.add(
                    function (source, event) {
                        room.game.select_thing(thing);
                    }, {
                        targetObject: thing
                    }
                );
            },

            remove_thing: function (thing) {
                var room = this;
                var him = room.him;

                thing.body_sprite.destroy();
                thing.body_sprite = undefined;
                room.things.splice(thing, 1);
                thing._parent = undefined;
            }
        };
    });
