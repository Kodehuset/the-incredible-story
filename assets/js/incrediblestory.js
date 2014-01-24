var TheIncredibleStory = {
    game: null,
    initialize: function () {

        game = new Core(1280, 720);
        game.preload("assets/graphics/levelMap.map");
        game.rootScene.backgroundColor = "blue";
        game.onload = function() {

            var levelOne = new Scene();
        };

    },
    run: function () {

        game.start();
    }
};