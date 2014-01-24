enchant();
var TheIncredibleStory = Class.create({
    game: null,
    initialize: function () {

        this.game = new Core(1280, 720);
        this.game.preload("assets/graphics/level1/levelMap.map");
        this.game.preload("assets/graphics/levelMap.png");
        this.game.rootScene.backgroundColor = "blue";

        var that = this;
        this.game.onload = function () {

            var levelOne = new Scene();

            var levelSprite = new Map(48, 48);
            levelSprite.image = that.game.assets['assets/graphics/levelMap.png'];

            var map = eval(that.game.assets["assets/graphics/level1/levelMap.map"]);
            console.log(map);
            levelSprite.loadData(map);

            levelOne.addChild(levelSprite);

            that.game.pushScene(levelOne);
        };

        this.game.scale = $(window).width() / this.game.width;

    },
    run: function () {

        this.game.start();
    }
});