enchant();
var GameParams = {
    jumpHeight: 150,
    horizontalMoveInterval: 40,
    gravity: 15,
    startGravity: 15,
    playfieldPushDistance: 400,
    playfieldPushInterval: 10,
    riftTile: 2,
    ladderMorph: 1,
    drillMorph: 2,
    springMorph: 3

};

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

                if (that.player.x + that.player.image.width + GameParams.horizontalMoveInterval > levelOne.levelSprite.width) {
                    return;
                }


                if (that.player.x > that.game.width - GameParams.playfieldPushDistance && (Math.abs(levelOne.x) + that.game.width < levelOne.getLevelWidth())) {
                    levelOne.x -= GameParams.playfieldPushInterval;
                }

                if (that.player.isMoving === true) {
                    return;
                }

                var new_x = that.player.x + GameParams.horizontalMoveInterval;
                that.player.moveXPerFrame = (new_x - that.player.x) / 5;
                that.player.moveToX = new_x;
                that.player.isMoving = true;


            });

            that.game.addEventListener(Event.RIGHT_BUTTON_UP, function () {
                that.player.isMoving = false;
            });

            that.game.addEventListener(Event.LEFT_BUTTON_DOWN, function () {

                if (that.player.x - GameParams.horizontalMoveInterval < 0) {
                    return;
                }

                if (that.player.x < Math.abs(levelOne.x) + GameParams.playfieldPushDistance && levelOne.x < 0) {
                    levelOne.x += GameParams.playfieldPushInterval;
                }

                if (that.player.isMoving === true) {
                    return;
                }

                var new_x = (that.player.x - GameParams.horizontalMoveInterval);
                that.player.moveXPerFrame = -1 * (that.player.x - new_x) / 5;
                that.player.moveToX = new_x;
                that.player.isMoving = true;

            });

            that.game.addEventListener(Event.LEFT_BUTTON_UP, function () {
                that.player.isMoving = false;
            });

            that.game.addEventListener(Event.UP_BUTTON_UP, function () {
                if (that.player.y - GameParams.jumpHeight < 0 || that.player.isFalling === true) {
                    return;
                }

                if (that.player.isJumping === true) {
                    return;
                }
                var new_y = that.player.y - GameParams.jumpHeight;
                that.player.isJumping = true;
                that.player.jumpYPerFrame = (new_y - that.player.y) / 5;
                that.player.jumpToY = new_y;


            });


            that.game.addEventListener(Event.ENTER_FRAME, function () {


                if (that.player.isJumping) {

                    var new_y = that.player.y + that.player.jumpYPerFrame;
                    if (levelOne.collides(that.player.x, new_y)) {
                        that.player.isJumping = false; // done jumping - we've hit something
                    } else {

                        that.player.y += that.player.jumpYPerFrame;
                        if (that.player.y === that.player.jumpToY) {
                            that.player.isJumping = false;
                        }
                    }
                }

                if (that.player.isMoving) {


                    var new_x = that.player.x + that.player.moveXPerFrame;

                    if (levelOne.collides(new_x + that.player.width, that.player.y) === true) {
                        that.player.isMoving = false;
                    } else if (new_x < 0) {
                        that.player.x = 0;
                    } else if (new_x + that.player.width > levelOne.getLevelWidth()) {
                        that.player.x = levelOne.getLevelWidth() - that.player.width;
                    } else {
                        that.player.x += that.player.moveXPerFrame;
                    }


                }


                if (!that.player.isJumping) {

                    var new_player_bottom_loc = that.player.y + that.player.height + (GameParams.gravity);

                    if (levelOne.collides(that.player.x, new_player_bottom_loc) === true) {

                        new_player_bottom_loc--;
                        while (levelOne.collides(that.player.x, new_player_bottom_loc) === true) {
                            new_player_bottom_loc--;
                        }

                        that.player.y = new_player_bottom_loc - that.player.height;
                        GameParams.gravity = GameParams.startGravity;
                        that.player.isFalling = false;
                    } else {

                        that.player.y = that.player.y + GameParams.gravity++;
                        that.player.isFalling = true;
                    }
                }

                var interractionTile = levelOne.stepsOnTile(that.player);

                if (interractionTile != -1 && that.player.isInterracting !== true) {

                    that.interractWithTile(interractionTile);
                }

            });

            that.game.pushScene(levelOne);
        };

        this.game.scale = windowWidth / this.game.width;

    },

    interractWithTile: function (tile) {


        var tileIsRift = tile === GameParams.riftTile;
        if (tileIsRift && this.player.morph === GameParams.springMorph) {
            var player = this.player;
            player.isInterracting = true;

            player.tl.moveTo(player.x, player.y - 500, 5).then(function () {
                player.isInterracting = false;
                player.morph = null;
            });
        } else if (tileIsRift && this.player.morph === GameParams.ladderMorph) {


            var player = this.player;
            player.isInterracting = true;

            var 

        } else if (tileIsRift && this.player.morph === GameParams.drillMorph) {

        }
    },

    run: function () {

        this.game.start();
    },

    keyUp: function (event) {

        if (event.keyCode === 49) { // 1

            this.player.morph = GameParams.ladderMorph;
            console.log("morph 1");
        } else if (event.keyCode === 50) { // 2

            this.player.morph = GameParams.drillMorph;
            console.log("morph 2");
        } else if (event.keyCode === 51) { // 3

            this.player.morph = GameParams.springMorph;
            console.log("morph 3");
        }

    }
});