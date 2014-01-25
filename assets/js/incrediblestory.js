enchant();
var GameParams = {
    jumpHeight: 150,
    horizontalMoveInterval: 40,
    gravity: 15,
    startGravity: 15,
    playfieldPushDistance: 300,
    playfieldPushInterval: 10,
    riftTile: 10,
    ladderMorph: 1,
    drillMorph: 2,
    springMorph: 3

};

var TheIncredibleStory = Class.create({
    game: null,
    player: null,
    currentLevelScene: null,
    activeLadderSprite: null,
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
        this.game.fps = 30;

        var windowWidth = $(window).width();
        var that = this;
        this.game.onload = function () {

            var levelOne = new LevelScene();
            that.currentLevelScene = levelOne;
            levelOne.init("level1");

            that.player = new Sprite(32, 64);
            that.player.image = that.game.assets["assets/graphics/player.png"];
            that.player.frame = [0, 0, 0, 1, 1, 1];
            that.player.direction = 1;
            that.player.y = levelOne.getPlayerStartY() - that.player.image.height;
            levelOne.addChild(that.player);

            that.game.addEventListener(Event.RIGHT_BUTTON_DOWN, function () {

                that.resetGravity();

                if (that.player.direction !== 1) {
                    that.player.tl.scaleTo(1, 1, 2);
                    that.player.direction = 1;
                }

                if (that.player.x + that.player.image.width + GameParams.horizontalMoveInterval > levelOne.levelSprite.width) {
                    return;
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

                that.resetGravity();


                if (that.player.direction !== -1) {
                    that.player.tl.scaleTo(-1, 1, 2);
                    that.player.direction = -1;
                }

                if (that.player.x - GameParams.horizontalMoveInterval < 0) {
                    return;
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


                var player = that.player;
                if (player.morph === GameParams.ladderMorph) {
                    if (that.activeLadderSprite.within(player) === true) {
                        GameParams.gravity = 0;
                        player.y -= GameParams.horizontalMoveInterval;
                    } else {
                        that.resetGravity();
                    }
                }

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

                        var distanceFromLeftEdge = that.player.x - Math.abs(levelOne.x);
                        var distanceFromRightEdge = levelOne.getLevelWidth() - that.game.width - that.player.x;
                        if (distanceFromRightEdge < GameParams.playfieldPushDistance && (Math.abs(levelOne.x) + that.game.width < levelOne.getLevelWidth())) {
                            levelOne.x -= that.player.moveXPerFrame;
                        } else if (distanceFromLeftEdge < GameParams.playfieldPushDistance && levelOne.x < 0) {
                            levelOne.x -= that.player.moveXPerFrame;
                        }
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
                        //GameParams.gravity = GameParams.startGravity;
                        that.player.isFalling = false;
                    } else {

                        that.player.y = that.player.y + GameParams.gravity;
                        that.player.isFalling = true;
                    }
                }


                if (that.player.y + that.player.height >= that.game.height) {
                    that.gameOver();
                    return;
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

    gameOver: function () {

        this.game.popScene();
        var gameOverScene = new Scene(this.game.width, this.game.height);
        gameOverScene.backgroundColor = "white";
        var label = new Label();
        label.text = "Game over!";
        label.textAlign = "center";
        label.x = (this.game.width / 2) - (label.width / 2);
        label.y = (this.game.height / 2) - (label.height / 2);

        gameOverScene.addChild(label);
        this.game.pushScene(gameOverScene);
    },

    resetGravity: function () {

        GameParams.gravity = GameParams.startGravity;
    },

    interractWithTile: function (tile) {


        var tileIsRift = tile === 9 || tile === 10;
        if (tileIsRift && this.player.morph === GameParams.springMorph) {
            var player = this.player;
            player.isInterracting = true;


            var sprite = new Sprite(32, 32);
            sprite.image = this.game.assets["assets/graphics/levelTiles.png"];
            sprite.frame = [11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14];
            sprite.x = player.x + player.width / 2;
            sprite.y = player.y + player.height - sprite.height;
            this.currentLevelScene.addChild(sprite);
            var that = this;

            player.tl.moveTo(player.x, player.y - 800, 10).then(function () {
                player.isInterracting = false;
                player.morph = null;
            });

            setTimeout(function () {
                that.currentLevelScene.removeChild(sprite);
            }, 3000);

        } else if (tileIsRift && this.player.morph === GameParams.ladderMorph) {


            var player = this.player;
            player.isInterracting = true;

            var map = new Map(32, 32);
            map.image = this.game.assets["assets/graphics/levelTiles.png"];
            map.loadData([
                [16],
                [15],
                [15],
                [15],
                [15],
                [15],
                [15]
            ]);
            map.collisionData = [
                [1],
                [1],
                [1],
                [1],
                [1],
                [1],
                [1]

            ];
            map.x = player.x + player.width / 2;
            map.y = player.y + player.height - map.height;
            this.activeLadderSprite = map;
            this.currentLevelScene.addChild(map);
            GameParams.gravity = 0;
            var that = this;
            setTimeout(function () {

                that.currentLevelScene.removeChild(map);
                player.isInterracting = false;
                player.morph = null;
                that.resetGravity();
            }, 3000);


        } else if (tileIsRift && this.player.morph === GameParams.drillMorph) {

            var player = this.player;
            player.isInterracting = true;


            var pit_sprite = new Sprite(32, 32);
            pit_sprite.image = this.game.assets["assets/graphics/levelTiles.png"];
            pit_sprite.frame = [0];

            var pit_x = Math.round(player.x / 32) * 32;
            var pit_y = Math.round((player.y + player.height) / 32) * 32;
            pit_sprite.x = pit_x;
            pit_sprite.y = pit_y;
            this.currentLevelScene.addChild(pit_sprite);
            var that = this;


            var new_y = player.y + player.height + 32;
            while (that.currentLevelScene.collides(pit_x + 16, new_y)) {
                new_y++;
            }

            player.moveTo(pit_x + 16, new_y);

            setTimeout(function () {

                player.isInterracting = false;
                player.morph = null;
                that.currentLevelScene.removeChild(pit_sprite);
            }, 3000);
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
        } else if (event.keyCode === 32) { // spacebar

            if (this.player.y - GameParams.jumpHeight < 0 || this.player.isFalling === true) {
                return;
            }

            if (this.player.isJumping === true) {
                return;
            }
            var new_y = this.player.y - GameParams.jumpHeight;
            this.player.isJumping = true;
            this.player.jumpYPerFrame = (new_y - this.player.y) / 5;
            this.player.jumpToY = new_y;

        }

    }
});