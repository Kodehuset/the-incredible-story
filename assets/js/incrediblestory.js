enchant();
var TheIncredibleStory = Class.create({
    game: null,
    initialize: function () {

        this.game = new Core(1280, 720);
        this.game.preload("assets/graphics/level1/levelMap.map");
        this.game.preload("assets/graphics/level1/collision.map");
        this.game.preload("assets/graphics/levelTiles.png");
        this.game.rootScene.backgroundColor = "blue";

        var that = this;
        this.game.onload = function () {

            var levelOne = new LevelScene();
            levelOne.init("level1");

            that.game.pushScene(levelOne);
        };

        this.game.scale = $(window).width() / this.game.width;

    },
    run: function () {

        this.game.start();
    }
});