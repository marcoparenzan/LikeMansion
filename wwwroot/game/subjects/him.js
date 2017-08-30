// http://phaser.io/examples/v2/input/pixelpick-scrolling-effect
// http://phaser.io/tutorials/making-your-first-phaser-game/part3        
// http://www.joshmorony.com/how-to-create-an-animated-character-using-sprites-in-phaser/


define([], function () {

    return function (game, x, y) {

        return {

            type: "subject",
            sprite_type: "him",

            game: game,

            speed: 50,
            state: { id: "front" },

            width: 76,
            height: 224,

            // standard Phaser handlers

            preload: function () {
                var him = this;

                him.game.load.spritesheet(him.id + '_body_spritesheet', 'game/subjects/images/him-spritesheet.png', him.width, him.height);
                him.game.load.spritesheet(him.id + '_baloon', 'game/subjects/images/baloon.png');

                // things

                him.things = [];
            },

            create: function () {
                var him = this;

                him.body_sprite = him.game.add.sprite(x - him.width / 2, y - him.height, him.id + '_body_spritesheet');
                him.game.physics.arcade.enable(him.body_sprite);

                him.body_sprite.animations.add("front", [0], 10, true);
                him.body_sprite.animations.add("right", [10, 11, 12, 13, 14], 10, true);
                him.body_sprite.animations.add("left", [20, 21, 22, 23, 24], 10, true);
            },

            render: function () {
                var him = this;

                // things

                him.things.forEach(function (item) { if (item.render != undefined) item.render(); });
            },

            update: function () {
                var him = this;

                switch (him.state.id) {
                    case "walkto":
                        him.game.camera.x = him.body_sprite.body.x - 386 / 2;
                        if (him.body_sprite.body.x > him.state.x && him.state.direction == "right") {
                            him.goto_state({ id: "front" });
                            him.thinking();
                        }
                        if (him.body_sprite.body.x < him.state.x && him.state.direction == "left") {
                            him.goto_state({ id: "front" });
                            him.thinking();
                        }
                        break;
                }

                // things

                him.things.forEach(function (item) { if (item.update != undefined) item.update(); });
            },

            goto_state: function (state) {
                var him = this;

                switch (state.id) {
                    case "walkto":
                        if (state.direction == "left") {
                            him._animate("left", -him.speed);
                        }
                        else if (state.direction == "right") {
                            him._animate("right", him.speed);
                        }
                        break;
                    case "pickup":
                        break;
                    case "front":
                        him._animate("front", 0);
                        break;
                }
                if (state.thinking != undefined) {
                    him.thinking(state.thinking);
                }
                if (state.saying != undefined) {
                    him.saying(state.saying);
                }

                him.state = state;
            },

            // internal

            _animate: function (animation, velocity) {
                var him = this;

                him.body_sprite.animations.play(animation);
                him.body_sprite.body.velocity.setTo(velocity, 0);
            },

            saying: function (message) {
                var him = this;

                var baloon = him.game.add.sprite(him.body_sprite.body.x + 50, him.body_sprite.body.y - 80, him.id + '_baloon');

                var text = him.game.make.text(20, 30, message, { font: "12px Courier New", fill: "#000000", align: "center", wordWrap: true, wordWrapWidth: 110 });
                baloon.addChild(text);

                setTimeout(function (b) {
                    b.destroy();
                }, 2000, baloon);
            },

            thinking: function (message) {
                var him = this;
                game.thinking(message);
            },
                        
            get_thing: function (thing) {
                him = this;

                for(var i = 0; i<him.things.length; i++) {
                    if (room.things[i].id == thing) return him.things[i];
                }
                return undefined;
            },

            inventory_thing: function (thing) {
                var him = this;

                if (typeof thing === "string") {
                    return him.get_thing(thing);
                }
                else {
                    him.game.inventory_thing(thing);
                }
            },

            // custom handlers

            walkto: function (target) {
                var him = this;

                // nothing specified
                if (target == undefined) {
                    him.goto_state({
                        id: "walkto",
                        thinking: "WALK TO"
                    });
                    return;
                }

                if (him.state.target != target) {
                    him.goto_state({
                        id: "walkto",
                        target: target,
                        x: target.x,
                        thinking: "WALK TO " + target.id
                    });
                    return;
                }

                if (target._parent.type != "room") {
                    him.goto_state({
                        id: "front",
                        saying: "CANNOT DO THAT"
                    });
                    return;
                }

                if (him.body_sprite.body.x < target.x) {
                    if (him.state.id != "walkto" || him.state.direction != "right") {
                        him.goto_state({
                            id: "walkto",
                            direction: "right",
                            x: target.x,
                            target: target
                        });
                    }
                }
                else if (him.body_sprite.body.x > target.x) {
                    if (him.state.id != "walkto" || him.state.direction != "left") {
                        him.goto_state({
                            id: "walkto",
                            direction: "left",
                            x: target.x,
                            target: target
                        });
                    }
                }
            },

            pickup: function (target) {
                var him = this;

                // nothing specified
                if (target == undefined) {
                    him.goto_state({
                        id: "pickup",
                        thinking: "PICK UP"
                    });
                    return;
                }

                if (him.state.target != target) {
                    him.goto_state({
                        id: "pickup",
                        target: target,
                        x: target.x,
                        thinking: "PICK UP " + target.id
                    });
                    return;
                }

                if (target._parent.type != "room") {
                    him.goto_state({
                        id: "front",
                        saying: "CANNOT PICK UP THAT"
                    });
                    return;
                }

                var thing = him.state.target;
                if (thing.pickup == undefined) {
                    him.goto_state({
                        id: "front",
                        saying: "CANNOT PICKUP THAT"
                    });
                    return;
                }

                // do it!
                thing._parent.remove_thing(thing);
                him.inventory_thing(thing);
                if (thing.pickup != true) {
                    if (thing.pickup(him)) {
                    }
                }

                him.goto_state({
                    id: "front"
                });
                return;
            },
            
            
            turnon: function (target) {
                var him = this;

                // nothing specified
                if (target == undefined) {
                    him.goto_state({
                        id: "turnon",
                        thinking: "TURN ON"
                    });
                    return;
                }

                if (him.state.target != target) {
                    him.goto_state({
                        id: "turnon",
                        target: target,
                        x: target.x,
                        thinking: "TURN ON " + target.id
                    });
                    return;
                }

                if (target._parent.type != "room") {
                    him.goto_state({
                        id: "front",
                        saying: "CANNOT TURN ON THAT"
                    });
                    return;
                }

                var thing = him.state.target;
                if (thing.turnon == undefined) {
                    him.goto_state({
                        id: "front",
                        saying: "CANNOT TURN ON THAT"
                    });
                    return;
                }

                // do it!
                if (thing.turnon(him)) {
                }

                him.goto_state({
                    id: "front"
                });
                return;
            },

            use: function (target) {
                var him = this;

                // nothing specified
                if (target == undefined) {
                    him.goto_state({
                        id: "use",
                        use_with: false,
                        thinking: "USE"
                    });
                    return;
                }

                if (him.state.target == undefined) {
                    if (target.use_with != undefined) {
                        him.goto_state({
                            id: "use",
                            target: target,
                            use_with: true,
                            handler: target.use_with,
                            x: target.x,
                            thinking: "USE " + target.id + " WITH "
                        });
                    }
                    else if (target.use != undefined) {
                        him.goto_state({
                            id: "use",
                            target: target,
                            handler: target.use,
                            x: target.x,
                            thinking: "USE " + target.id
                        });
                    }
                    else {
                        him.goto_state({
                            id: "use",
                            target: target,
                            cannot_do_that: true,
                            thinking: "USE " + target.id
                        });
                    }
                    return;
                }

                if (him.state.use_with == true) {
                    if (him.state.target2 != target) {
                        him.goto_state({
                            id: "use",
                            target: him.state.target,
                            target2: target,
                            use_with: true,
                            x: him.state.target.x,
                            thinking: "USE " + him.state.target.id + " WITH " + target.id
                        });
                        return;
                    }
                }

                if (him.state.cannot_do_that) {
                    him.goto_state({
                        id: "front",
                        saying: "CANNOT DO THAT"
                    });
                    return;
                }

                // execute
                if (him.state.use_with) {
                    if (him.state.target.use_with(him, him.state.target2)) {
                        // determine what to do next
                    }
                }
                else {
                    if (him.state.target.use(him)) {
                        // determine what to do next
                    }
                }

                him.goto_state({
                    id: "front"
                });
            }
        }
    };
});
