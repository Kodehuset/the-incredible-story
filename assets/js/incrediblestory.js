enchant();
var GameParams = {
    jumpHeight: 150,
    horizontalMoveInterval: 40,
    gravity: 15,
    startGravity: 15,
    playfieldPushDistance: 300,
    playfieldPushInterval: 10,
    ladderMorph: 1,
    drillMorph: 2,
    springMorph: 3,
    dogSprite: 17,
    playerMoveAnimation: [0, 0, 0, 1, 1, 1],
    playerStopAnimation: [0]
};

var TheIncredibleStory = Class.create({
    game: null,
    player: null,
    currentLevelScene: null,
    activeLadderSprite: null,
    introScene: null,
    introSlides: [],
    timeLeft: 60,
    gameActive: false,
    countdownIntervalId: null,
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
        this.game.preload("assets/graphics/opening1.gif");
        this.game.preload("assets/graphics/opening2.gif");
        this.game.preload("assets/graphics/opening3.gif");
        this.game.preload("assets/graphics/opening4.gif");
        this.game.preload("assets/graphics/opening5.gif");

        this.game.rootScene.backgroundColor = "black";
        this.game.fps = 30;

        var windowWidth = $(window).width();
        var that = this;
        this.game.onload = function () {

            var gameMenu = new Scene();
            var menu = new Sprite(that.game.width, that.game.height);
            var startGame = new Label("Press an arrow key to start");
            startGame.width = 600;
            startGame.textAlign = "center";
            startGame._touchable = true;
            window.addEventListener("click", function () {
                if (that.game.currentScene !== gameMenu) {
                    return;
                }
                that.timeLeft = 60;
                that.createNewGame(that);
                that.game.pushScene(that.currentLevelScene);
                if (that.countdownIntervalId !== null) {
                    clearInterval(that.countdownIntervalId);
                }
                that.countdownIntervalId = setInterval(function () {
                    that.timeLeft--;
                    that.currentLevelScene.updateTime("00:" + (that.timeLeft < 10 ? "0" + that.timeLeft : that.timeLeft));

                    if (that.timeLeft === 0) {
                        that.gameOver();
                    }
                }, 1000);

            });
            startGame.font = "32px sans-serif";
            startGame.color = "green";
            startGame.x = (that.game.width / 2) - (startGame.width / 2);
            startGame.y = 200;
            gameMenu.addChild(menu);
            gameMenu.addChild(startGame);


            if (that.playIntro !== false) {

                if (that.playInto !== false) {

                    that.introScene = new Scene();

                    var slide1 = new Sprite(that.game.width, that.game.height);
                    slide1.image = that.game.assets["assets/graphics/opening1.gif"];
                    slide1.opacity = 0;

                    var slide2 = new Sprite(that.game.width, that.game.height);
                    slide2.image = that.game.assets["assets/graphics/opening2.gif"];
                    slide2.opacity = 0;

                    var slide3 = new Sprite(that.game.width, that.game.height);
                    slide3.image = that.game.assets["assets/graphics/opening3.gif"];
                    slide3.opacity = 0;

                    var slide4 = new Sprite(that.game.width, that.game.height);
                    slide4.image = that.game.assets["assets/graphics/opening4.gif"];
                    slide4.opacity = 0;

                    var slide5 = new Sprite(that.game.width, that.game.height);
                    slide5.image = that.game.assets["assets/graphics/opening5.gif"];

                    that.introSlides = [slide1, slide2, slide3, slide4, slide5];
                    that.introScene.addChild(slide1);

                    slide1.tl.fadeIn(30).delay(90).fadeOut(30).then(function () {
                        that.introScene.addChild(slide2);
                        slide2.tl.fadeIn(30).delay(90).fadeOut(30).then(function () {
                            that.introScene.addChild(slide3);
                            slide3.tl.fadeIn(30).delay(90).fadeOut(10).then(function () {
                                that.introScene.addChild(slide4);
                                slide4.tl.fadeIn(10).delay(30).then(function () {
                                    that.introScene.addChild(slide5);
                                    slide5.tl.delay(90).then(function () {
                                        that.introScene.removeChild(slide5);
                                        slide4.tl.delay(60).fadeOut(30).then(function () {
                                            that.game.pushScene(gameMenu);
                                        });
                                    });
                                });
                            });
                        });
                    });

                }

                that.game.pushScene(that.introScene);
            } else {


                that.game.pushScene(gameMenu);
            }
        };


        this.game.scale = windowWidth / this.game.width;

    },

    createNewGame: function (that) {

        var levelOne = new LevelScene();
        that.currentLevelScene = levelOne;
        levelOne.init("level1");

        that.player = new Sprite(32, 64);
        that.player.image = that.game.assets["assets/graphics/player.png"];
        that.player.frame = GameParams.playerStopAnimation;
        that.player.direction = 1;
        that.player.y = levelOne.getPlayerStartY() - that.player.image.height;
        levelOne.addChild(that.player);

        levelOne.addEventListener(Event.RIGHT_BUTTON_DOWN, function () {

            if (that.player.frame == GameParams.playerStopAnimation) {
                that.player.frame = GameParams.playerMoveAnimation;
            }

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

        levelOne.addEventListener(Event.RIGHT_BUTTON_UP, function () {
            that.player.isMoving = false;
            that.player.frame = GameParams.playerStopAnimation;
        });

        levelOne.addEventListener(Event.LEFT_BUTTON_DOWN, function () {


            if (that.player.frame == GameParams.playerStopAnimation) {
                that.player.frame = GameParams.playerMoveAnimation;
            }

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

        levelOne.addEventListener(Event.LEFT_BUTTON_UP, function () {
            that.player.isMoving = false;
            that.player.frame = GameParams.playerStopAnimation;
        });

        levelOne.addEventListener(Event.UP_BUTTON_UP, function () {


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


        levelOne.addEventListener(Event.ENTER_FRAME, function () {

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

                    that.currentLevelScene.timeLabel.x = (Math.abs(levelOne.x) + that.game.width) - that.currentLevelScene.timeLabel.width - 20;
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

            var alignedTile = levelOne.nextToTile(that.player);
            if (alignedTile === GameParams.dogSprite) {

                that.completeGame();
            }


        });
    },

    gameOver: function () {

        var gameOverScene = new Scene(this.game.width, this.game.height);
        gameOverScene.backgroundColor = "white";
        var label = new Label();
        label.text = "Game over!";
        label.textAlign = "center";
        label.x = (this.game.width / 2) - (label.width / 2);
        label.y = (this.game.height / 2) - (label.height / 2);

        gameOverScene.addChild(label);
        this.game.pushScene(gameOverScene);
        var that = this;
        setTimeout(function () {
            that.game.popScene();
            that.game.popScene();
        }, 3000);
    },

    completeGame: function () {

        var completeGameScene = new Scene(this.game.width, this.game.height);
        completeGameScene.backgroundColor = "white";
        var label = new Label();
        label.text = "You made it!";
        label.textAlign = "center";
        label.x = (this.game.width / 2) - (label.width / 2);
        label.y = (this.game.height / 2) - (label.height / 2);

        completeGameScene.addChild(label);
        this.game.pushScene(completeGameScene);
        var that = this;
        setTimeout(function () {
            that.game.popScene();
            that.game.popScene();
        }, 3000);
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
                that.resetPlayerAnimations();
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
                that.resetPlayerAnimations();
            }, 3000);


        } else if (tileIsRift && this.player.morph === GameParams.drillMorph) {

            var player = this.player;
            player.isInterracting = true;


            var pit_sprite = new Sprite(32, 32);
            pit_sprite.image = this.game.assets["assets/graphics/levelTiles.png"];
            pit_sprite.frame = [19];

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
                that.resetPlayerAnimations();
            }, 3000);
        }
    },

    resetPlayerAnimations: function () {

        GameParams.playerMoveAnimation = [0, 0, 0, 1, 1, 1];
        GameParams.playerStopAnimation = [0];
        this.player.frame = GameParams.playerStopAnimation;
    },

    run: function () {

        this.game.start();

    },

    keyUp: function (event) {

        if (event.keyCode === 49) { // 1

            this.player.morph = GameParams.ladderMorph;
            GameParams.playerMoveAnimation = [2, 2, 2, 3, 3, 3];
            GameParams.playerStopAnimation = [2];
            this.player.frame = GameParams.playerStopAnimation;
        } else if (event.keyCode === 50) { // 2

            this.player.morph = GameParams.drillMorph;
            GameParams.playerMoveAnimation = [4, 4, 4, 5, 5, 5];
            GameParams.playerStopAnimation = [4];
            this.player.frame = GameParams.playerStopAnimation;
        } else if (event.keyCode === 51) { // 3

            this.player.morph = GameParams.springMorph;
            GameParams.playerMoveAnimation = [6, 6, 6, 7, 7, 7];
            GameParams.playerStopAnimation = [6];
            this.player.frame = GameParams.playerStopAnimation;
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