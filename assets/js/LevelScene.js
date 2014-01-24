enchant();
var LevelScene = Class.create(Scene, {
    backgroundSprite: null,
    middleSprite: null,
    levelSprite: null,

    init: function (level) {
        var game, levelMap, collisionData, middleMap;

        Scene.apply(this);

        game = Game.instance;

        // Middle sprite
        this.middleSprite = new Map(128, 320);
        this.middleSprite.image = game.assets["assets/graphics/middleTiles.png"];

        middleMap = eval(game.assets["assets/graphics/" + level + "/middleMap.map"]);
        this.middleSprite.loadData(middleMap);

        this.addChild(this.middleSprite);

        // Level sprite
        this.levelSprite = new Map(32, 32);
        this.levelSprite.image = game.assets['assets/graphics/levelTiles.png'];

        levelMap = eval(game.assets["assets/graphics/" + level + "/levelMap.map"]);
        collisionData = eval(game.assets["assets/graphics/" + level + "/collision.map"]);
        this.levelSprite.collisionData = collisionData;
        this.levelSprite.loadData(levelMap);

        this.addChild(this.levelSprite);


    }
});
