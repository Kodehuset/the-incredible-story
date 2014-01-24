var LevelScene = Class.create(Scene, {
    backgroundSprite: null,
    middleSprite: null,
    levelSprite: null,

    init: function () {
        var game;

        Scene.apply(this);

        game = Game.instance;

        levelSprite = new Map(32, 32);
        levelSprite.image = game.assets['assets/graphics/levelMap.png'];

        var map = game.assets["assets/graphics/level1/levelMap.map"];
        levelSprite.loadData(map);

        this.addChild(levelSprite);
    }
});
