enchant();
var GameParams = {
    jumpHeight: 150,
    horizontalMoveInterval: 40,
    verticalMoveInterval: 40,
    gravity: 15,
    startGravity: 15,
    playfieldPushDistance: 300,
    playfieldPushInterval: 10,
    ladderMorph: 1,
    drillMorph: 2,
    springMorph: 3,
    dogSprite: 23,
    playerMoveAnimation: [0, 0, 0, 1, 1, 1],
    playerStopAnimation: [0],
    backgroundColor: "#69c1fb"
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
        this.game.preload("assets/graphics/start1.gif");
        this.game.preload("assets/graphics/end1.gif");
        this.game.preload("assets/graphics/end2.gif");
        this.game.preload("assets/graphics/morph_ladder_on.png");
        this.game.preload("assets/graphics/morph_spring_on.png");
        this.game.preload("assets/graphics/morph_trans_on.png");

        this.game.rootScene.backgroundColor = GameParams.backgroundColor;
        this.game.fps = 30;

        var windowWidth = $(window).width();
        var that = this;
        this.game.onload = function () {

            var gameMenu = new Scene();
            gameMenu.backgroundColor = GameParams.backgroundColor;
            var menu = new Sprite(that.game.width, that.game.height);
            menu.image = that.game.assets["assets/graphics/start1.gif"];
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
            gameMenu.addChild(menu);

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
        that.player.x = 200;
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


            if (that.player.x + that.player.image.width > levelOne.getLevelWidth() + GameParams.playfieldPushDistance) {
                //console.log("x=", that.player.x + that.player.image.width, ", levelWidth=", levelOne.getLevelWidth() + GameParams.playfieldPushDistance);
                return;
            }


            if (that.player.isMoving === true) {
                return;
            }

            var absolute_x = (that.player.x / 32) * 32;
            var new_x = absolute_x + GameParams.horizontalMoveInterval;
            that.player.moveXPerFrame = (new_x - absolute_x) / 5;
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

            var absolute_x = (that.player.x / 32) * 32;
            var new_x = absolute_x - GameParams.horizontalMoveInterval;
            that.player.moveXPerFrame = -1 * (absolute_x - new_x) / 5;
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
                if (player.y + player.height > that.activeLadderSprite.y + 16 && player.x + player.width / 2 > that.activeLadderSprite.x && player.x + player.width / 2 < that.activeLadderSprite.x + that.activeLadderSprite.width) {
                    GameParams.gravity = 0;
                    that.disableGravity = true;
                    player.y -= GameParams.verticalMoveInterval;
//                    player.isMoving = true;
                } else {
                    that.resetGravity();
                }
            }

        });


        levelOne.addEventListener(Event.ENTER_FRAME, function () {

            if (that.player.isJumping) {

                var new_y = that.player.y + that.player.jumpYPerFrame;
                if (levelOne.collides(that.player.x + that.player.width / 2, new_y)) {
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


                if (levelOne.collides(new_x + that.player.width, that.player.y) === true || levelOne.collides(new_x, that.player.y)) {
                    that.player.x = Math.round(new_x / 32) * 32;
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
                    that.currentLevelScene.abilityBar.x = (Math.abs(levelOne.x) + 20);
                }

            }


            if (!that.player.isJumping && that.disableGravity !== true) {

                var new_player_bottom_loc = that.player.y + that.player.height + (GameParams.gravity);

                var player_x = Math.round(that.player.x / 32) * 32 + that.player.width / 2;
                if (levelOne.collides(player_x, new_player_bottom_loc) === true) {

                    new_player_bottom_loc--;
                    while (levelOne.collides(player_x, new_player_bottom_loc) === true) {
                        new_player_bottom_loc--;
                    }

                    //console.log("modified y=", new_player_bottom_loc, ", minus height=", new_player_bottom_loc - that.player.height);

                    that.player.y = Math.round(new_player_bottom_loc / 32) * 32 - that.player.height;
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

        var gameOverScene = new Scene();
        gameOverScene.backgroundColor = GameParams.backgroundColor;
        var graphic = new Sprite(this.game.width, this.game.height);
        graphic.image = this.game.assets["assets/graphics/end1.gif"];
        gameOverScene.addChild(graphic);
        this.game.pushScene(gameOverScene);
        var that = this;
        setTimeout(function () {
            graphic.tl.fadeOut(30).then(function () {
                that.game.popScene();
                that.game.popScene();
            });
        }, 5000);
    },

    completeGame: function () {

        var completeGameScene = new Scene(this.game.width, this.game.height);
        completeGameScene.backgroundColor = GameParams.backgroundColor;
        var graphic = new Sprite(this.game.width, this.game.height);
        graphic.image = this.game.assets["assets/graphics/end2.gif"];
        completeGameScene.addChild(graphic);
        this.game.pushScene(completeGameScene);
        var that = this;
        setTimeout(function () {
            graphic.tl.fadeOut(30).then(function () {
                that.game.popScene();
                that.game.popScene();
            });

        }, 5000);
    },

    resetGravity: function () {

        GameParams.gravity = GameParams.startGravity;
        this.disableGravity = false;
    },

    interractWithTile: function (tile) {


        var tileIsRift = tile === 9 || tile === 10;
        if (tileIsRift && this.player.morph === GameParams.springMorph) {
            var player = this.player;
            player.isInterracting = true;

            var sprite = new Sprite(32, 32);
            sprite.image = this.game.assets["assets/graphics/levelTiles.png"];
            sprite.frame = [11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14];
            sprite.x = Math.round(player.x / 32) * 32;
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
            map.x = Math.round(player.x / 32) * 32;
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