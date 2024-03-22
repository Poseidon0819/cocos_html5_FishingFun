var Bubbles = cc.Layer.extend({

    _speed: 0,
    _speedCurrentMult: -1,

    init: function (params) {
        this._speed = params.speed;
        this.addBubbles();
        this.setSpeedCurrentMult(0);
    },

    addBubbles: function () {
        this._bubbles = Animations.getInstance().createBubbles()
        this.addChild(this._bubbles);
    },

    setSpeedCurrentMult: function (val) {
        this._speedCurrentMult = val;
        this._speedCurrentMult = Math.min(1, Math.max(-1, this._speedCurrentMult));
        this._bubbles.setGravity(cc.p(-this._speed * this._speedCurrentMult, 50.));
    }

});

Bubbles.create = function (params) {
    var instance = new Bubbles();
    instance.init(params);
    return instance;
};