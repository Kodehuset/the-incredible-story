enchant();
var LevelScene = Class.create(Scene, {
    backgroundSprite: null,
    middleSprite: null,
    levelSprite: null,
    timeLabel: null,
    ladderAbilitySprite: null,
    transparentAbilitySprite: null,
    springAbilitySprite: null,
    abilityBar: null,
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


        this.timeLabel = new Label();
        this.timeLabel.text = "00:60";
        this.timeLabel.color = "black";
        this.timeLabel.textAlign = "right";
        this.timeLabel.font = "62px sans-serif";
        this.timeLabel.x = this.width - this.timeLabel.width - 20;

        this.addChild(this.timeLabel);

        this.abilityBar = new Group(196, 64);
        this.abilityBar.x = 20;
        this.abilityBar.y = 20;

        this.ladderAbilitySprite = new Sprite(64, 64);
        this.ladderAbilitySprite.x = this.abilityBar.x;
        this.ladderAbilitySprite.image = game.assets["assets/graphics/morph_ladder_on.png"];
        this.abilityBar.addChild(this.ladderAbilitySprite);

        this.transparentAbilitySprite = new Sprite(64, 64);
        this.transparentAbilitySprite.x = this.ladderAbilitySprite.x + 64 + 2;
        this.transparentAbilitySprite.image = game.assets["assets/graphics/morph_trans_on.png"];
        this.abilityBar.addChild(this.transparentAbilitySprite);

        this.springAbilitySprite = new Sprite(64, 64);
        this.springAbilitySprite.x = this.transparentAbilitySprite.x + 64 + 2;
        this.springAbilitySprite.image = game.assets["assets/graphics/morph_spring_on.png"];
        this.abilityBar.addChild(this.springAbilitySprite);

        this.addChild(this.abilityBar);

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
    },

    updateTime: function(time) {
        this.timeLabel.text = time;
    }

});
