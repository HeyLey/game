var speed = 0;

var physicManager = {

    scoreUpAudio: new Audio("audio/success.wav"),
    lostAudio: new Audio("audio/throw.mp3"),

    update: function (obj, left_pressed, right_pressed, up_pressed) {

        var newX = obj.pos_x;
        var newY = obj.pos_y;

        var e = this.entityAtXY(obj, newX, newY);

        var ts = mapManager.getTilesetIdx(newX + obj.size_x, newY + obj.size_y);

        if (e !== null) {
            //alert('Game Over!');
            physicManager.scoreUpAudio.play();
            for (i = 0; i < gameManager.entities.length; i++) {
                if (gameManager.entities[i] === e) {
                    e = null;
                    gameManager.entities.splice(i, 1);
                    break;
                }

            }
            //window.location = "/fail.html";        
        }
        if (newY > 1000) {
            physicManager.lostAudio.play();
            gameManager.game_state = "lost";
            return
        }

        var isFall = mapManager.getTilesetIdx(obj.pos_x + obj.size_x / 2, obj.pos_y + obj.size_y + 0.02) === 0;

        if (right_pressed && mapManager.getTilesetIdx(obj.pos_x + obj.size_x, obj.pos_y + obj.size_y - 5) === 0) {
            Player.pos_x += 4;
            if (!isFall) {
                Player.frame = (Player.frame + 1) % 30;
            } else {
                Player.frame = 0;
            }
            Player.side = "right"
        } else if (left_pressed && mapManager.getTilesetIdx(obj.pos_x, obj.pos_y + obj.size_y - 5) === 0) {
            Player.pos_x -= 4;
            if (!isFall) {
                Player.frame = (Player.frame + 1) % 30;
            } else {
                Player.frame = 0;
            }
            Player.side = "left"
        } else {
            Player.side = "none"
        }

        if (isFall || speed < 0) {
            Player.pos_y += speed;
            if (speed < 8) {
                speed += 0.2;
            }

            if (mapManager.getTilesetIdx(obj.pos_x, obj.pos_y + obj.size_y - 5) !== 0) {
                Player.pos_x += 5;
            }

            if (mapManager.getTilesetIdx(obj.pos_x + obj.size_x, obj.pos_y + obj.size_y - 5) !== 0) {
                Player.pos_x -= 5;
            }
        } else {
            speed = 0;
            if (up_pressed) {
                speed = -8.0;
            }
            while (mapManager.getTilesetIdx(obj.pos_x + obj.size_x / 2, obj.pos_y + obj.size_y) != 0) {
                obj.pos_y -= 0.01
            }
        }

        if (newX > 3100) {
            gameManager.game_state = "win";
        }
    },

    entityAtXY: function (obj, x, y) {
        for (var i = 0; i < gameManager.entities.length; i++) {
            var e = gameManager.entities[i];
            if (e.name !== obj.name) {
                if (x + obj.size_x < e.pos_x || y + obj.size_y < e.pos_y
                    || x > e.pos_x + e.size_x || y > e.pos_y + e.size_y)
                    continue;
                return e;
            }
        }

        return null;
    }
};