var SpriteScroll = cc.Layer.extend({

    _sprites: null,
    _leftCoord: null,
    _rightCoord: null,
    _posX: 0,
    _segmentSzie: 0,
    _speed: 0,
    _speedStatic: 0,
    _speedCurrentMult: -1,

    ctor: function () {
        cc.Layer.prototype.ctor.call(this);
        this._sprites = [];
    },

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this.scheduleUpdate();
        for (var i = 0; i < SpriteScroll.SEGMENTS; i++) {
            this._sprites.push(this.addSprite(params.pic));
        }
        this._speed = params.speed;
        this._speedStatic = params.speedStatic;
    },

    addSprite: function (pic) {
        var sprite = cc.Sprite.create(pic);
        this._segmentSzie = sprite.getContentSize().width;
        this._leftCoord = -this._segmentSzie;
        this._rightCoord = this._segmentSzie;
        sprite.setAnchorPoint(cc.p(0, 0));
        this.addChild(sprite);
        return sprite;
    },

    update: function (dt) {
        if (this._posX < this._leftCoord) {
            this._posX = this._rightCoord;
        } else if (this._posX > this._rightCoord) {
            this._posX = this._leftCoord;
        } else {
            this._posX += (this._speedStatic + this._speed * this._speedCurrentMult) * dt;
        }
        this.updatePos();
    },

    updatePos: function () {
        var x = this._posX;
        for (var i = 0; i < this._sprites.length; i++) {
            var s = this._sprites[i];
            var xTo = x + i * this._segmentSzie;
            if (xTo > this._rightCoord) {
                xTo = xTo - SpriteScroll.SEGMENTS * this._segmentSzie;
            }
            s.setPositionX(xTo);
        }
    },

    setSpeedCurrentMult: function (val) {
        this._speedCurrentMult = val;
        this._speedCurrentMult = Math.min(1, Math.max(-1, this._speedCurrentMult));
    },

    getSpeedCurrentMult: function () {
        return this._speedCurrentMult;
    }

});

SpriteScroll.SEGMENTS = 3;

SpriteScroll.create = function (params) {
    var instance = new SpriteScroll();
    instance.init(params);
    return instance;
};