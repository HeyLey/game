var eventManager = {
    left_pressed: false,
    right_pressed: false,
    up_pressed: false,
    action: [],
    setup: function (canvas) {
        document.body.addEventListener("keydown", this.onKeyDown);
        document.body.addEventListener("keyup", this.onKeyUp);
    },

    onKeyDown: function (event) {
        if (event.keyCode === 37) {
            eventManager.left_pressed = true;
        }
        if (event.keyCode === 39) {
            eventManager.right_pressed = true;
        }
        if (event.keyCode === 38) {
            eventManager.up_pressed = true;
        }
    },
    onKeyUp: function (event) {
        if (event.keyCode === 37) {
            eventManager.left_pressed = false;
        }
        if (event.keyCode === 39) {
            eventManager.right_pressed = false;
        }
        if (event.keyCode === 38) {
            eventManager.up_pressed = false;
        }
    }
};