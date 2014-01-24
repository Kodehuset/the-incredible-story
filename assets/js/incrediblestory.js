enchant();
var TheIncredibleStory = Class.create({
    game: null,
    player: null,
    initialize: function () {

        this.game = new Core(1280, 720);
        this.game.preload("assets/graphics/level1/level.map");
        this.game.preload("assets/graphics/level1/middle.map");
        this.game.preload("assets/graphics/level1/background.map");
        this.game.preload("assets/graphics/level1/collision.map");
        this.game.preload("assets/graphics/levelTiles.png");
        this.game.preload("assets/graphics/middleTiles.png");
        this.game.preload("assets/graphics/backgroundTiles.png");
        this.game.preload("assets/graphics/player.png");

        this.game.rootScene.backgroundColor = "blue";

        var windowWidth = $(window).width();
        var that = this;
        this.game.onload = function () {

            var levelOne = new LevelScene();
            levelOne.init("level1");

            that.player = new Sprite(32, 64);
            that.player.image = that.game.assets["assets/graphics/player.png"];
            that.player.y = levelOne.getPlayerStartY() - that.player.image.height;
            levelOne.addChild(that.player);

            that.game.addEventListener(Event.RIGHT_BUTTON_DOWN, function () {


                if (that.player.x + that.player.image.width + 10 > levelOne.levelSprite.width) {
                    return;
                }

                var new_x = that.player.x + 10;
                if (levelOne.collides(new_x + that.player.width, that.player.y) === false) {
                    that.player.x = new_x;
                }

                if (that.player.x > that.game.width - 300 && (Math.abs(levelOne.x) + that.game.width < levelOne.getLevelWidth())) {
                    levelOne.x -= 10;
                }


            });

            that.game.addEventListener(Event.LEFT_BUTTON_DOWN, function () {

                if (that.player.x - 10 < 0) {
                    return;
                }

                var new_x = that.player.x - 10;
                if (levelOne.collides(new_x - that.player.width, that.player.y) === false) {
                    that.player.x = new_x;
                }

                if (that.player.x < Math.abs(levelOne.x) + 300 && levelOne.x < 0) {
                    levelOne.x += 10;
                }
            });

            that.game.addEventListener(Event.UP_BUTTON_DOWN, function () {

                if (that.player.y - 10 < 0) {
                    return;
                }

                var new_y = that.player.y - 50;
                if (levelOne.collides(that.player.x, new_y - that.player.height) === false && !that.player.isJumping) {
                    var original_y = that.player.y;
                    that.player.isJumping = true;
                    that.player.tl.moveTo(that.player.x, new_y, 5).then(function () {

                        that.player.tl.moveTo(that.player.x, original_y, 5).then(function() {
                            that.player.isJumping = false;
                        });

                    });
                }


            });

            that.game.pushScene(levelOne);
        };

        this.game.scale = windowWidth / this.game.width;

    },
    run: function () {

        this.game.start();
    }
});