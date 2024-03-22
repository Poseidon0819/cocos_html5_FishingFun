var Decorations = cc.Layer.extend({

    _nodeGrid: null,
    _bubbles: null,
    _sky: null,
    _water: null,
    _corals: null,
    _seaweed: null,
    _ground: null,
    _bearSlot: null,
    _poolSlot: null,
    _lineSlot: null,

    init: function () {
        this.setCascadeOpacityEnabled(true);
        this.addBack();
        this.addSky();
        this.addBearSlot();
        this.addEffect();
        this.addWater();
        this.addCorals();
        this.addSeaweed();
        this.addGround();
        this.addLineSlot();
        this.addPoolSlot();
        this.addBubbles();
    },

    addBack: function () {
        var back = cc.LayerColor.create();
        back.setColor(cc.color(200, 200, 220));
        this.addChild(back);
    },

    addSky: function () {
        this._sky = SpriteScroll.create(
            {
                pic: res.sky,
                speed: 20,
                speedStatic: -15
            }
        );
        this._sky.setPositionY(370);
        this.addChild(this._sky);
    },

    addBearSlot: function () {
        this._bearSlot = cc.Layer.create();
        this._bearSlot.setCascadeOpacityEnabled(true);
        this.addChild(this._bearSlot);
    },

    addEffect: function () {
        this._nodeGrid = new cc.NodeGrid();
        this._nodeGrid.setCascadeOpacityEnabled(true);
        this._nodeGrid.runAction(
            cc.repeatForever(
                cc.liquid(15, cc.size(40, 20), 15, 1)
            )
        );
        this.addChild(this._nodeGrid);
    },

    addWater: function () {
        this._water = SpriteScroll.create(
            {
                pic: res.water,
                speed: 160,
                speedStatic: -40
            }
        );
        this._water.setPositionY(-110);
        this._water.setOpacity(215);
        this._nodeGrid.addChild(this._water);
    },

    addCorals: function () {
        this._corals = SpriteScroll.create(
            {
                pic: res.corals,
                speed: 70,
                speedStatic: 0
            }
        );
        this._corals.setPositionY(50);
        this._nodeGrid.addChild(this._corals);
    },

    addSeaweed: function () {
        this._seaweed = SpriteScroll.create(
            {
                pic: res.seaweed,
                speed: 100,
                speedStatic: 0
            }
        );
        this._seaweed.setPositionY(40);
        this._nodeGrid.addChild(this._seaweed);
    },

    addGround: function () {
        this._ground = SpriteScroll.create(
            {
                pic: res.ground,
                speed: 140,
                speedStatic: 0
            }
        );
        this._ground.setPositionY(-20);
        this._nodeGrid.addChild(this._ground);
    },

    addPoolSlot: function () {
        this._poolSlot = cc.Layer.create();
        this._poolSlot.setCascadeOpacityEnabled(true);
        this._nodeGrid.addChild(this._poolSlot);
    },

    addLineSlot: function () {
        this._lineSlot = cc.Layer.create();
        this._lineSlot.setCascadeOpacityEnabled(true);
        this._nodeGrid.addChild(this._lineSlot);
    },

    addBubbles: function () {
        this._bubbles = Bubbles.create({ speed: -30 });
        this._nodeGrid.addChild(this._bubbles);
    },

    adjustSpeed: function (delta) {
        this._sky.setSpeedCurrentMult(delta);
        this._water.setSpeedCurrentMult(delta);
        this._corals.setSpeedCurrentMult(delta);
        this._seaweed.setSpeedCurrentMult(delta);
        this._ground.setSpeedCurrentMult(delta);
        this._bubbles.setSpeedCurrentMult(delta);
    },

    getSpeedCurrentMult: function () {
        return this._ground.getSpeedCurrentMult();
    },

    getBearSlot: function () {
        return this._bearSlot;
    },

    getPoolSlot: function () {
        return this._poolSlot;
    },

    getLineSlot: function () {
        return this._lineSlot;
    },

    /*cleanPoolBearLineSlots: function () {
        this._bearSlot.removeAllChildren();
        this._poolSlot.removeAllChildren();
        this._lineSlot.removeAllChildren();
    }*/

});

Decorations.create = function () {
    var instance = new Decorations();
    instance.init();
    return instance;
};