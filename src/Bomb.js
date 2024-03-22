var Bomb = cc.Sprite.extend({

    _beingDestroyed: false,
    _callbackDetonate: null,

    init: function (params) {
        this.initWithTexture(Bomb.cachedTexture);
        this.setCascadeOpacityEnabled(true);
        this.setTextureRect(this.calcRect(cc.p(0, 0), 0));
        this._callbackDetonate = params.callbackDetonate;
    },

    calcRect: function (pp, pos) {
        var side = Bomb.SIDE;
        var offsetX = Bomb.SIZE;
        var offsetY = Bomb.SIZE;
        var p = pp;
        var x = p.x + (pos % side) * offsetX;
        var y = p.y + Math.floor(pos / side) * offsetY;
        return cc.rect(x, y, offsetX, offsetY);
    },

    addAnimationsFrames: function () {
        var bombTexture = Bomb.cachedTexture;
        var bombAnim = cc.Animation.create();
        var length = Bomb.FRAMES;
        for (var i = 0; i < length; i++) {
            bombAnim.addSpriteFrameWithTexture(bombTexture, this.calcRect(cc.p(0, 0), i));
        }
        bombAnim.setDelayPerUnit(Bomb.TIME_FRAME);
        bombAnim.setLoops(1);
        return cc.Animate.create(bombAnim);
    },

    updatePoolPosition: function (dt, currentCorrection) {
        var p = this.getPosition();
        p.x += dt * currentCorrection;
        if (this._beingDestroyed == false) {
            p.y -= dt * 165;
        }
        this.setPosition(p);
        this.checkLifeBounds(p.x);
        this.checkLifeBoundsBottom(p.y);
    },

    checkLifeBounds: function (x) {
        var w = this.getParent().getParent().getContentSize().width; //batch node in the middle
        var leftLimit = 0 - Bonus.LIFE_MARGIN;
        var rightLimit = w + Bonus.LIFE_MARGIN;
        if (x < leftLimit || x > rightLimit) {
            this.destroy();
        }
    },

    checkLifeBoundsBottom: function (y) {
        if (y <= Bomb.DETONATION_Y && this._beingDestroyed == false) {
            this._beingDestroyed = true;
            this.destroyDelayed();
        }
    },

    destroy: function () {
        this.removeFromParent();
    },

    destroyDelayed: function () {
        this.runAction(
            cc.sequence(
                cc.callFunc(
                    function () {
                        var pos = this.getParent().convertToWorldSpace(this.getPosition());
                        this._callbackDetonate(pos, Bomb.RADIUS);
                    }.bind(this)
                ),
                this.addAnimationsFrames(),
                cc.callFunc(
                    function () {
                        this.destroy();
                    }.bind(this)
                )
            )
        );
    },

});

Bomb.FRAMES = 10;
Bomb.SIDE = 4;
Bomb.SIZE = 447;
Bomb.TIME_FRAME = .07;
Bomb.DETONATION_Y = 250;
Bomb.DIVE_TIME = 1.3;
Bomb.RADIUS = 200;

Bomb.cacheTexture = function () {
    Bomb.cachedTexture = cc.textureCache.addImage(res.explosion);
};

Bomb.create = function (params) {
    var instance = new Bomb();
    instance.init(params);
    return instance;
};