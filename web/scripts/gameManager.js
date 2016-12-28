side_zombie = 1;

var gameManager = {

    game_state: "run",
    factory: {},
    entities: [],
    player1: null,

    loadAll: function () {
        mapManager.loadMap("map/map.json");
        spriteManager.loadAtlas("map/sprites.json", "map/spritesheet.png");
        gameManager.factory['Player1'] = Player1;
        gameManager.factory['spikes'] = spikes;
        mapManager.parseEntities();
        mapManager.draw(ctx);
        eventManager.setup(canvas);
    },

    play: function () {
        setInterval(updateWorld, 20);
    },

    update: function () {
        this.entities.forEach(function (e) {
            try {
                e.update();
            } catch (ex) {
            }
        });
        mapManager.draw(ctx);
        mapManager.centerAt(Player.pos_x, Player.pos_y);
        mapManager.draw(ctx);
        Player.draw(ctx);
        if (gameManager.game_state == 'run') {
            physicManager.update(Player, eventManager.left_pressed, eventManager.right_pressed, eventManager.up_pressed);
        }
        this.draw(ctx);

        if (gameManager.game_state != 'run') {
            var gradient = ctx.createLinearGradient(0, 0, 500, 0);
            gradient.addColorStop("0", "magenta");
            gradient.addColorStop("0.5", "blue");
            gradient.addColorStop("1.0", "red");

            ctx.fillStyle = gradient;

            ctx.font = "120px serif";
            ctx.textAlign = "center";
            if (gameManager.game_state == "win") {
                ctx.fillText("You win", 500, 200);
            } else {
                ctx.fillText("Game over", 500, 200);
            }
        }
    },

    draw: function (ctx) {
        for (var e = 0; e < this.entities.length; e++)
            this.entities[e].draw(ctx);
    }
};

function updateWorld() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameManager.update();
}

var mainAudio;

function loadAudio() {
    mainAudio = new Audio("audio/beat1.mp3");
    mainAudio.volume = 0.2;
    mainAudio.autoplay = true;
    mainAudio.loop = true;
}

var canvas = document.getElementById("canvasId");

var ctx = canvas.getContext("2d");

loadAudio();

gameManager.loadAll();
gameManager.play();

