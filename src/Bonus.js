

var Bonus = cc.Sprite.extend({

    _type: -1,
    _payload: -1,
    _amount: 0,
    _beingDestroyed: false,

    init: function (params) {
        this.initWithTexture(Fish.cachedTexture);
        this.setCascadeOpacityEnabled(true);
        this._type = params.type;
        if (this._type.indexOf("GIFT") != -1) {
            this._type = "GIFT";
        }
        this._payload = params.payload;
        this._amount = params.amount;
        this._callbackPop = params.callbackPop;
        this.addSprite();
        this.addMoveHorizontal()
    },

    updatePoolPosition: function (dt, currentCorrection) {
        var p = this.getPosition();
        p.x += dt * currentCorrection;
        p.y += dt * 65;
        this.setPosition(p);
        this.checkLifeBounds(p.x);
        this.checkLifeBoundsTop(p.y);
    },

    checkLifeBounds: function (x) {
        var w = this.getParent().getParent().getContentSize().width; //batch node in the middle
        var leftLimit = 0 - Bonus.LIFE_MARGIN;
        var rightLimit = w + Bonus.LIFE_MARGIN;
        if (x < leftLimit || x > rightLimit) {
            this.destroy();
        }
    },

    checkLifeBoundsTop: function (y) {
        if (y > Bonus.UPPER_BOUND) {
            this.destroyDelayed();
        }
    },

    destroy: function () {
        this.removeFromParent();
    },

    destroyDelayed: function () {
        this._beingDestroyed = true;
        Sound.getInstance().playSound(res.snd_bubble);
        var pos = this.getParent().convertToWorldSpace(this.getPosition());
        this._callbackPop(pos);
        this.destroy();
    },

    calcRect: function (pp, pos) {
        var side = Bonus.FRAMES;
        var offsetX = Bonus.SIZE_X;
        var offsetY = Bonus.SIZE_Y;
        var p = pp;
        var x = p.x + (pos % side) * offsetX;
        var y = p.y + Math.floor(pos / side) * offsetY;
        return cc.rect(x, y, offsetX, offsetY);
    },

    addMoveHorizontal: function () {
        var horz = 20;
        var posLeft = cc.p(+horz, 0);
        var posRight = cc.p(-horz, 0);
        var anim = cc.sequence(
            cc.moveBy(1., posLeft).easing(cc.easeSineInOut()),
            cc.moveBy(1., posRight).easing(cc.easeSineInOut())
        );
        this.runAction(cc.repeatForever(anim));
    },

    addSprite: function () {
        this.setContentSize(cc.size(Bonus.SIZE_X, Bonus.SIZE_Y));
        this.setTextureRect(this.calcRect(Bonus[this._type].pos, 0));
        this.setScale(Bonus.SCALE);
    },

    isCatchable: function () {
        return false;
    },

    isCollectable: function () {
        return true;
    },

    getInfo: function () {
        return { payload: this._payload, amount: this._amount };
    }

});

Bonus.BOMB = {
    pos: cc.p(0, 668),
    size: cc.size(100, 100)
};

Bonus.GIFT = {
    pos: cc.p(100, 668),
    size: cc.size(100, 100)
};

Bonus.TIME = {
    pos: cc.p(200, 668),
    size: cc.size(100, 100)
};

Bonus.WORM = {
    pos: cc.p(300, 668),
    size: cc.size(100, 100)
};

Bonus.TREASURE = {
    pos: cc.p(400, 668),
    size: cc.size(100, 100)
};

Bonus.POP = {
    pos: cc.p(500, 668),
    size: cc.size(100, 100)
};

Bonus.TYPE_NONE = -1;
Bonus.TYPE_BOMB = 1;
Bonus.TYPE_GIFT = 2;
Bonus.TYPE_TREASURE = 3;
Bonus.TYPE_TIME = 4;
Bonus.TYPE_WORM = 5;

Bonus.PAYLOAD_NONE = -1;
Bonus.PAYLOAD_BOMB = 0;
Bonus.PAYLOAD_WORM = 1;
Bonus.PAYLOAD_SCORE = 2;
Bonus.PAYLOAD_TIME = 3;

Bonus.LIFE_MARGIN = 250;
Bonus.TIME_FRAME = .1;
Bonus.FRAMES = 4;
Bonus.SIZE_X = 100;
Bonus.SIZE_Y = 100;
Bonus.UPPER_BOUND = 500;
Bonus.SCALE = .6;

Bonus.create = function (params) {
    var instance = new Bonus();
    instance.init(params);
    return instance;
};





