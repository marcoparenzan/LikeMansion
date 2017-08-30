define(["verb_button"], function (verb_button) {

    return {
        type: "commanding",

        // standard Phaser handlers
        preload: function () {
            var commanding = this;

            commanding.game.load.image('background', 'game/images/commanding.png');
            commanding.game.load.spritesheet('things_icons', 'game/things/images/things_icons.png', 64, 64);


            // commandings

            commanding.commandings = [];
            commanding.commandings.push(verb_button(commanding, 68, 42, "walkto", commanding.walkto));
            commanding.commandings.push(verb_button(commanding, 198, 42, "pickup", commanding.pickup));
            commanding.commandings.push(verb_button(commanding, 68, 80, "turnon", commanding.turnon));
            commanding.commandings.push(verb_button(commanding, 198, 80, "use", commanding.use));
            commanding.commandings.forEach(function (item) { item.preload(); });
        },

        create: function () {
            var commanding = this;

            commanding.background = commanding.game.add.tileSprite(0, 0, 395, 284, 'background');

            // commandings

            commanding.commandings.forEach(function (item) {
                item.create(function (source, event) {
                    commanding.select_verb(item.handler);
                });
            });
        },

        // messaging

        thinking: function(message) {
            var commanding = this;
        
            if ((message || "") == "") {
                if (commanding._thinking != undefined) {
                    commanding._thinking.destroy();
                    commanding._thinking = undefined;
                }
            }
            else if (commanding._thinking == undefined) {
                var style = { font: "12px Courier New", fill: "#ffffff", align: "left" };
                commanding._thinking = commanding.game.add.text(0, 0, message, style);
            }
            else {
                commanding._thinking.text = message;
            }
        },

        // commandings

        walkto: function (him, something) {
            if (him.walkto == undefined) {
                him.saying("I CANNOT DO THAT");
                return true;
            }
            return him.walkto(something);
        },

        pickup: function (him, something) {
            if (him.pickup == undefined) {
                him.saying("I CANNOT DO THAT");
                return true;
            }
            return him.pickup(something);
        },

        turnon: function (him, something) {
            if (him.turnon == undefined) {
                him.saying("I CANNOT DO THAT");
                return true;
            }
            return him.turnon(something);
        },

        use: function (him, something) {
            if (him.use == undefined) {
                him.saying("I CANNOT DO THAT");
                return true;
            }
            return him.use(something);
        }
    };
});
