enchant();
var LevelScene = Class.create(Scene, {
    backgroundSprite: null,
    middleSprite: null,
    levelSprite: null,

    init: function (level) {
        var game, levelMap, collisionData, middleMap, backgroundMap, interractMap, interractCollisionData;

        Scene.apply(this);

        game = Game.instance;

        // Background sprite
        this.backgroundSprite = new Map(256, 720);
        this.backgroundSprite.image = game.assets["assets/graphics/backgroundTiles.png"];

        backgroundMap = eval(game.assets["assets/graphics/" + level + "/background.map"]);
        this.backgroundSprite.loadData(backgroundMap);
        this.addChild(this.backgroundSprite);

        // Middle sprite
        this.middleSprite = new Map(128, 320);
        this.middleSprite.image = game.assets["assets/graphics/middleTiles.png"];

        middleMap = eval(game.assets["assets/graphics/" + level + "/middle.map"]);
        this.middleSprite.loadData(middleMap);

        this.addChild(this.middleSprite);

        // Level sprite
        this.levelSprite = new Map(32, 32);
        this.levelSprite.image = game.assets['assets/graphics/levelTiles.png'];

        levelMap = eval(game.assets["assets/graphics/" + level + "/level.map"]);
        collisionData = eval(game.assets["assets/graphics/" + level + "/collision.map"]);
        this.levelSprite.collisionData = collisionData;
        this.levelSprite.loadData(levelMap);

        this.addChild(this.levelSprite);

    },

    getPlayerStartY: function () {

        var y = 0;
        while (true) {
            if (this.levelSprite.hitTest(0, y) === true) {
                return y;
            }

            y++;
        }
    },

    getLevelWidth: function () {
        return this.levelSprite.width;
    },

    collides: function (x, y) {

        return this.levelSprite.hitTest(x, y);
    },


    stepsOnTile: function (player) {

        return this.levelSprite.checkTile(player.x + (player.width / 2), player.y + player.height + 2);
    },

    nextToTile: function (player) {
        return this.levelSprite.checkTile(player.x + 48, player.y + 48);
    }

});
