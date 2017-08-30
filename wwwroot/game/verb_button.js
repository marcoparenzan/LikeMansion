define([], function() {

    return function(panel, x, y, verb_type, handler) {

        return {
            panel: panel,
            game: panel.game,
            
            type: "verb",
            verb_type: verb_type,
            handler: handler,

            width: 130,
            height: 36,

            x: x,
            y: y,
            
            // standard Phaser handlers

            preload: function() {
                var verb = this;
                verb.game.load.spritesheet(verb.verb_type + '_spritesheet', 'game/images/' + verb.verb_type + '.png');
            },

            create: function(onClick) {
                var verb = this;

                verb.body_sprite = verb.game.add.sprite(x-verb.width/2, y-verb.height/2, verb.verb_type + '_spritesheet');
                verb.body_sprite.inputEnabled = true;
                verb.body_sprite.input.pixelPerfectClick = true;
                verb.body_sprite.events.onInputDown.add(onClick, {
                    handler: verb.handler
                });

                return verb;
            },

            render: function() {
                var verb = this;
            },

            update: function() {
                var verb = this;
            }
        }
    };
});
