var Fish = cc.Sprite.extend({

    _speed: 0,
    _mirrored: false,
    _score: 0,
    _catchable: false,
    _callbackIsNoMore: null,
    _beingDestroyed: false,

    init: function (params) {
        this.initWithTexture(Fish.cachedTexture);
        this.setCascadeOpacityEnabled(true);
        var fsh = Fish[params.fish];
        this.addAnimations(fsh);
        this.addMoveVertical(fsh)
        this.updateScale(params.mirrored);
        this._mirrored = params.mirrored;
        this._score = params.score;
        this._catchable = fsh.catchable;
        this._callbackIsNoMore = params.callbackIsNoMore;
        this.calcSpeed(fsh);
    },

    updatePoolPosition: function (dt, currentCorrection) {
        var x = this.getPositionX();
        var fishSpeed = this._speed * (this._mirrored ? 1 : -1);
        x += dt * (fishSpeed + currentCorrection);
        this.setPositionX(x);
        this.checkLifeBounds(x);
    },

    checkLifeBounds: function (x) {
        var w = this.getParent().getParent().getContentSize().width; //batch node in the middle
        var leftLimit = 0 - Fish.LIFE_MARGIN;
        var rightLimit = w + Fish.LIFE_MARGIN;
        if (x < leftLimit || x > rightLimit) {
            this.destroy();
        }
    },

    destroy: function () {
        if (this._callbackIsNoMore) {
            this._callbackIsNoMore(this);
        }
        this.removeFromParent();
    },

    destroyDelayed: function () {
        this._beingDestroyed = true;
        this.runAction(
            cc.sequence(
                cc.spawn(
                    cc.fadeOut(Fish.DELAY_DIE_TIME),
                    cc.rotateBy(Fish.DELAY_DIE_TIME, Fish.DELAY_DIE_ROTATION),
                    cc.scaleTo(Fish.DELAY_DIE_TIME, Fish.DELAY_DIE_SCALE)
                ),
                cc.callFunc(
                    function () {
                        this.destroy();
                    }.bind(this)
                )
            )
        );
    },

    calcRect: function (pos, fsh) {
        var side = fsh.side;
        var offsetX = fsh.size.width;
        var offsetY = fsh.size.height;
        var p = fsh.pos;
        var x = p.x + (pos % side) * offsetX;
        var y = p.y + Math.floor(pos / side) * offsetY;
        return cc.rect(x, y, offsetX, offsetY);
    },

    addAnimationsFrames: function (fsh) {
        var fishTexture = Fish.cachedTexture;
        var fishAnim = cc.Animation.create();
        var length = fsh.frames;
        for (var i = 0; i < length; i++) {
            fishAnim.addSpriteFrameWithTexture(fishTexture, this.calcRect(i, fsh));
        }
        for (var i = length - 1; i >= 0; i--) {
            fishAnim.addSpriteFrameWithTexture(fishTexture, this.calcRect(i, fsh));
        }
        fishAnim.setDelayPerUnit(Fish.TIME_FRAME);
        fishAnim.setLoops(1);
        //fishAnim.retain();        ;
        return cc.Animate.create(fishAnim);
    },

    addAnimationSway: function (fsh) {
        var rand = Math.random() * Fish.RAND_MAX;
        var anim = cc.sequence(
            cc.rotateTo(Fish.TIME_ROTATION + rand, -10).easing(cc.easeSineInOut()),
            cc.rotateTo(Fish.TIME_ROTATION + rand, 10).easing(cc.easeSineInOut())
        );
        return anim;
    },

    addMoveVertical: function (fsh) {
        var rand = Math.random() * Fish.RAND_MAX;
        var vert = fsh.vertical;
        var vertTime = fsh.vertTime;
        var posUp = cc.p(0, + vert);
        var posDown = cc.p(0, - vert);
        var anim = cc.sequence(
            cc.moveBy(fsh.timeVertical + rand, posUp).easing(cc.easeSineInOut()),
            cc.moveBy(fsh.timeVertical + rand, posDown).easing(cc.easeSineInOut())
        );
        this.runAction(cc.repeatForever(anim));
    },

    addAnimationsType: function (fsh) {
        var anim = null;
        if (fsh.animation == "frames") {
            anim = this.addAnimationsFrames(fsh);
        } else if (fsh.animation == "rotation") {
            anim = this.addAnimationSway(fsh);
        }
        if (anim) {
            this.runAction(cc.repeatForever(anim));
        }
    },

    addAnimations: function (fsh) {
        this.setContentSize(fsh.size);
        this.setTextureRect(this.calcRect(0, fsh));
        this.addAnimationsType(fsh);
    },

    calcSpeed: function (fsh) {
        this._speed = fsh.speed_min + Math.random() * fsh.speed_range;
    },

    updateScale: function (mirrored) {
        this.setScaleX(mirrored ? -Fish.SCALE : Fish.SCALE);
        this.setScaleY(Fish.SCALE)
    },

    isMirrored: function () {
        return this._mirrored;
    },

    isCatchable: function () {
        return this._catchable && !this._beingDestroyed;
    },

    isCollectable: function() {
        return false;
    },

    getScore: function () {
        return this._score;
    }

});


Fish.FISH1 = {
    pos: cc.p(0, 0/*-90*/),
    size: cc.size(117, 90),
    frames: 4,
    side: 4,
    animation: "frames",
    vertical: 100,
    timeVertical: 3,
    catchable: true,
    speed_min: 50,
    speed_range: 100
};
Fish.FISH2 = {
    pos: cc.p(468, 0/*-86*/),
    size: cc.size(132, 86),
    frames: 4,
    side: 4,
    animation: "frames",
    vertical: 100,
    timeVertical: 3,
    catchable: true,
    speed_min: 50,
    speed_range: 100
};
Fish.FISH3 = {//(creved)
    pos: cc.p(850, 181/*-286*/),
    size: cc.size(80, 105),
    frames: 1,
    side: 1,
    animation: "rotation",
    vertical: 30,
    timeVertical: 1,
    catchable: true,
    speed_min: 50,
    speed_range: 100
};
Fish.FISH4 = {
    pos: cc.p(0, 90/*-182*/),
    size: cc.size(104, 92),
    frames: 4,
    side: 4,
    animation: "frames",
    vertical: 100,
    timeVertical: 3,
    catchable: true,
    speed_min: 50,
    speed_range: 100
};
Fish.FISH5 = {
    pos: cc.p(416, 102/*-182*/),
    size: cc.size(129, 80),
    frames: 4,
    side: 4,
    animation: "frames",
    vertical: 100,
    timeVertical: 3,
    catchable: true,
    speed_min: 50,
    speed_range: 100
};
Fish.FISH6 = {
    pos: cc.p(0, 577/*-663*/),
    size: cc.size(132, 86),
    frames: 4,
    side: 4,
    animation: "frames",
    vertical: 100,
    timeVertical: 3,
    catchable: true,
    speed_min: 50,
    speed_range: 100
};
Fish.FISH7 = {
    pos: cc.p(528, 577/*-667*/),
    size: cc.size(117, 90),
    frames: 4,
    side: 4,
    animation: "frames",
    vertical: 100,
    timeVertical: 3,
    catchable: true,
    speed_min: 50,
    speed_range: 100
};
Fish.SHARK = {
    pos: cc.p(0, 182/*-380*/),
    size: cc.size(425, 198),
    frames: 4,
    side: 2,
    animation: "frames",
    vertical: 15,
    timeVertical: .5,
    catchable: false,
    speed_min: 250,
    speed_range: 50
};
Fish.SEAHORSE = {
    pos: cc.p(930, 181/*-312*/),
    size: cc.size(82, 131),
    frames: 1,
    side: 1,
    animation: "rotation",
    vertical: 30,
    timeVertical: 2,
    catchable: false,
    speed_min: 50,
    speed_range: 100
};
Fish.SHELL1 = {
    pos: cc.p(930, 103/*-181*/),
    size: cc.size(81, 78),
    frames: 1,
    side: 1,
    animation: "none",
    vertical: 20,
    timeVertical: 1,
    catchable: false,
    speed_min: 50,
    speed_range: 100
};
Fish.SHELL2 = {
    pos: cc.p(850, 311/*-389*/),
    size: cc.size(81, 78),
    frames: 1,
    side: 1,
    animation: "none",
    vertical: 20,
    timeVertical: 1,
    catchable: false,
    speed_min: 50,
    speed_range: 100
};
Fish.SHELL3 = {
    pos: cc.p(931, 327/*-389*/),
    size: cc.size(62, 62),
    frames: 1,
    side: 1,
    animation: "none",
    vertical: 20,
    timeVertical: 1,
    catchable: false,
    speed_min: 50,
    speed_range: 100
};
Fish.STAR1 = {
    pos: cc.p(850,/*-472*/388),
    size: cc.size(94, 84),
    frames: 1,
    side: 1,
    animation: "none",
    vertical: 20,
    timeVertical: 1,
    catchable: false,
    speed_min: 50,
    speed_range: 100
};
Fish.STAR2 = {
    pos: cc.p(850,/*-556*/472),
    size: cc.size(94, 84),
    frames: 1,
    side: 1,
    animation: "none",
    vertical: 20,
    timeVertical: 1,
    catchable: false,
    speed_min: 50,
    speed_range: 100
};


Fish.LIFE_MARGIN = 250;
Fish.RAND_MAX = .5;
Fish.TIME_FRAME = 0.08;
Fish.TIME_ROTATION = .4;
Fish.cachedTexture = null;
Fish.SCALE = .6;
Fish.DELAY_DIE_TIME = .3;
Fish.DELAY_DIE_ROTATION = 300;
Fish.DELAY_DIE_SCALE = .5;

Fish.cacheTexture = function () {
    Fish.cachedTexture = cc.textureCache.addImage(res.fishes);
};


Fish.create = function (params) {
    var instance = new Fish();
    instance.init(params);
    return instance;
};