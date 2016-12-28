var Entity = {

    pos_x: 0,
    pos_y: 390,
    size_x: 0,
    size_y: 0,
    touch: false,

    extend: function(extendProto) {
        var object = Object.create(this);
        for(var property in extendProto) {
            if(this.hasOwnProperty(property) || typeof object[property] === 'undefined') {
                object[property] = extendProto[property];
            }
        }
        return object;
    }
};

var Player = Entity.extend({
    size_x: 48,
    size_y: 64,
    move_x: 0, 
    move_y: 0,
    side: "none",
    frame: 0,
    draw: function(ctx) {
        if (this.side == "left") {
            var img;
            if (this.frame < 10) {
                img = "ball_left_0"
            } else if (this.frame < 20) {
                img = "ball_left_1"
            } else {
                img = "ball_left_2"
            }
            spriteManager.drawSprite(ctx, img, this.pos_x, this.pos_y);
        } else if (this.side == "right") {
            var img;
            if (this.frame < 10) {
                img = "ball_right_0"
            } else if (this.frame < 20) {
                img = "ball_right_1"
            } else {
                img = "ball_right_2"
            }
            spriteManager.drawSprite(ctx, img, this.pos_x, this.pos_y);
        } else if (this.side == "up") {
            spriteManager.drawSprite(ctx, "ball_up", this.pos_x, this.pos_y);
        } else if (this.side == "none") {
            spriteManager.drawSprite(ctx, "ball", this.pos_x, this.pos_y);
        }
    },
    update: function() {

        //physicManager.update(this, eventManager.left_pressed, eventManager.right_pressed, eventManager.up_pressed);
    },
    onTouchEntity: function(obj) {
        //разрешение конфликта при касании игрока.
    },
    onTouchMap: function(obj){
        //разрешение конфликта при касании карты;
    }
});

var Player1 = Player.extend();

var spikes = Entity.extend({

    draw: function(ctx) {
        spriteManager.drawSprite(ctx, "spikes", this.pos_x, this.pos_y);
    }
});



