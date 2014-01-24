enchant();
var LevelScene = Class.create(Scene, {
    backgroundSprite: null,
    middleSprite: null,
    levelSprite: null,

    init: function (level) {
        var game, map;

        Scene.apply(this);

        game = Game.instance;

        this.levelSprite = new Map(32, 32);
        this.levelSprite.image = game.assets['assets/graphics/levelMap.png'];

        map = eval(game.assets["assets/graphics/" + level + "/levelMap.map"]);

        this.levelSprite.loadData(map);

        this.addChild(this.levelSprite);

    }
});
