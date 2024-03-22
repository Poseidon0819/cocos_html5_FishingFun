var Bear = cc.Layer.extend({

    _headAnim: null,
    _head: null,
    _paddle: null,
    _paddleState: 0,
    _rod: null,
    _rodState: 0,
    _line: null,
    _plumb: null,
    _lineSlot: null,
    _hook: null,
    _worm: null,
    _callbackManager: null,

    init: function (params) {
        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setCascadeOpacityEnabled(true);
        this.scheduleUpdate();
        this.setContentSize(cc.size(Bear.WIDTH, Bear.HEIGHT));
        this._lineSlot = params.lineSlot;
        this.addBear();
        this.addLine();
        this._callbackManager = params.callbackManager;
    },

    addBear: function () {
        this.addRod();
        this.addBody();
        this.addBoat();
        this.addPaddle();
        this.addHead();
    },

    addLine: function () {
        this._line = cc.Sprite.create(res.fishing_line);
        this._line.setAnchorPoint(cc.p(.5, 1));
        this._line.setScaleY(Bear.LINE_MIN);
        this._lineSlot.addChild(this._line);
        this._plumb = cc.Sprite.create(res.plumb);
        this._plumb.setCascadeOpacityEnabled(true);
        this._lineSlot.addChild(this._plumb);
        this._hook = cc.Sprite.create(res.hook);
        this._hook.setAnchorPoint(cc.p(.5, 1));
        this._lineSlot.addChild(this._hook);
        this._worm = cc.Sprite.create(res.worm);
        this._worm.setAnchorPoint(cc.p(0, 1));
        this._worm.setPosition(cc.p(0, -30));
        this._worm.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.scaleTo(.5, 1, .7).easing(cc.easeSineInOut()),
                    cc.scaleTo(.5, 1, 1).easing(cc.easeSineInOut())
                )
            )
        );
        this._plumb.addChild(this._worm);
    },

    adjustLine: function () {
        this._line.setPosition(this.getLinePivot());
        var box = this._line.getBoundingBox();
        var midX = cc.rectGetMidX(box);
        var midY = cc.rectGetMinY(box)
        this._plumb.setPosition(cc.p(midX, midY + Bear.PLUMB_POS_Y));
        this._hook.setPosition(cc.p(midX, midY));
    },

    getLinePivot: function () {
        return this._lineSlot.convertToNodeSpace(this._rod.convertToWorldSpace(cc.p(Bear.ROD_END_X, Bear.ROD_END_Y)));
    },

    addBoat: function () {
        var boat = cc.Sprite.create(res.bear_boat);
        var pos = cc.pFromSize(this.getContentSize());
        boat.setPosition(cc.p(pos.x * .5, boat.getContentSize().height * .5));
        this.addChild(boat);
    },

    addBody: function () {
        var body = cc.Sprite.create(res.bear_body);
        body.setPosition(cc.p(Bear.BODY_X, Bear.BODY_Y));
        this.addChild(body);
    },

    addRod: function () {
        this._rod = cc.Sprite.create(res.bear_rod);
        var size = this._rod.getContentSize();
        this._rod.setAnchorPoint(cc.p(Bear.ROD_AP_X / size.width, Bear.ROD_AP_Y / size.height));
        this._rod.setPosition(cc.p(Bear.ROD_X, Bear.ROD_Y));
        this.addChild(this._rod);
    },

    addPaddle: function () {
        this._paddle = cc.Sprite.create(res.bear_paddle);
        var size = this._paddle.getContentSize();
        this._paddle.setAnchorPoint(cc.p(Bear.PADDLE_AP_X / size.width, Bear.PADDLE_AP_Y / size.height));
        this._paddle.setPosition(cc.p(Bear.PADDLE_X, Bear.PADDLE_Y));
        this.addChild(this._paddle);
    },

    calcRect: function (pos) {
        var side = Bear.HEAD_SIDE_TEX_ITEMS;
        var x = (pos % side) * Bear.HEAD_SIZE_X;
        var y = Math.floor(pos / side) * Bear.HEAD_SIZE_Y;
        return cc.rect(x, y, Bear.HEAD_SIZE_X, Bear.HEAD_SIZE_Y);
    },

    addHeadSprite: function (bearTexture) {
        this._head = cc.Sprite.create(bearTexture, this.calcRect(0));
        this._head.setCascadeOpacityEnabled(true);
        var size = this._head.getContentSize();
        this._head.setAnchorPoint(cc.p(Bear.HEAD_AP_X / size.width, Bear.HEAD_AP_Y / size.height));
        this._head.setPosition(cc.p(Bear.HEAD_X, Bear.HEAD_Y));
        this.addChild(this._head);
    },

    addHeadAnimation: function (bearTexture) {
        this._headAnim = cc.Animation.create();
        for (var i = 1; i < Bear.HEAD_TEX_ITEMS; i++) {
            this._headAnim.addSpriteFrameWithTexture(bearTexture, this.calcRect(i));
        }
        this._headAnim.setDelayPerUnit(Bear.HEAD_TIME_FRAME);
        this._headAnim.setLoops(1);
        this._headAnim.retain();
    },

    addHeadSway: function () {
        this._head.setRotation(-Bear.HEAD_ANGLE / 2);
        this._head.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.rotateBy(Bear.HEAD_TIME, Bear.HEAD_ANGLE).easing(cc.easeSineInOut()),
                    cc.rotateBy(Bear.HEAD_TIME, -Bear.HEAD_ANGLE).easing(cc.easeSineInOut())
                )
            )
        );
    },

    addHead: function () {
        var bearTexture = cc.textureCache.addImage(res.bear_heads);
        this.addHeadSprite(bearTexture);
        this.addHeadAnimation(bearTexture);
        this.addHeadSway();
    },

    makeTemporaryHappy: function () {
        this._head.runAction(cc.Animate.create(this._headAnim));
    },

    animatePaddle: function (val) {
        var state = Math.abs(val) < Bear.PADDLE_TRESHOLD ? Bear.PADDLE_STALL : Bear.PADDLE_ROW;
        if (this._paddleState == state) {
            return;
        }
        this._paddleState = state;
        this._paddle.stopAllActions();
        if (state == Bear.PADDLE_STALL) {
            this._paddle.runAction(
                cc.rotateTo(Bear.PADDLE_TIME * .75, 0).easing(cc.easeSineOut())
            );
        } else {
            this._paddle.runAction(
                cc.repeatForever(
                    cc.sequence(
                        cc.rotateTo(Bear.PADDLE_TIME, -Bear.PADDLE_ANGLE).easing(cc.easeSineInOut()),
                        cc.rotateTo(Bear.PADDLE_TIME, Bear.PADDLE_ANGLE * 1.5).easing(cc.easeSineInOut())
                    )
                )
            );
        }
    },

    adjustSpeed: function (delta) {
        this.animatePaddle(delta);
    },

    setSail: function () {
        var p = this.getPosition();
        this.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.moveTo(Bear.WAVE_TIME, cc.p(p.x, p.y + Bear.WAVE_SHIFT)).easing(cc.easeSineInOut()),
                    cc.moveTo(Bear.WAVE_TIME, cc.p(p.x, p.y - Bear.WAVE_SHIFT)).easing(cc.easeSineInOut())
                )
            )
        );
    },

    dropLine: function (state) {
        if (state == true && this._rodState == Bear.ROD_STATE_UP) {
            this._rodState = Bear.ROD_STATE_DOWN;
            this._rod.stopAllActions();
            var time = (Bear.ROD_ANGLE - this._rod.getRotation()) / Bear.ROD_ANGLE * Bear.ROD_DROP_TIME;
            this._rod.runAction(cc.rotateTo(time, Bear.ROD_ANGLE));
            this.extendLine(true, time);
            if (this._rod.getRotation() <= .5) { 
                Sound.getInstance().playSound(res.snd_hook);
            }
        } else if (state == false && this._rodState == Bear.ROD_STATE_DOWN) {
            this._rodState = Bear.ROD_STATE_UP;
            this._rod.stopAllActions();
            var time = this._rod.getRotation() / Bear.ROD_ANGLE * Bear.ROD_DROP_TIME;
            this._rod.runAction(cc.rotateTo(time, 0));
            this.extendLine(false, time);
        }
    },

    extendLine: function (state, time) {
        this._line.stopAllActions();
        if (state) {
            this._line.runAction(cc.scaleTo(time, 1, Bear.LINE_MAX));
        } else {
            this._line.runAction(cc.scaleTo(time, 1, Bear.LINE_MIN));
        }
    },

    checkCatch: function (rect) {
        if (this._hook.getChildrenCount() > 0) {
            return false;
        }
        var pos = this._lineSlot.convertToWorldSpace(this._hook.getPosition());
        return cc.rectContainsPoint(rect, pos);
    },

    attachToHook: function (fish) {
        if (this._hook.getChildrenCount() > 0) {
            return;
        }
        if (this._callbackManager({ id: CallbackID.WORM_NUM, value: 0 }) == 0) {
            return;
        }
        this._callbackManager({ id: CallbackID.WORM_USED, value: 0 })
        this.hideWorm();
        var fishPosWorld = fish.getParent().convertToWorldSpace(fish.getPosition());
        this.scoreReward(fish, fishPosWorld);
        this.makeTemporaryHappy();
        var pos = this._hook.convertToNodeSpace(fishPosWorld);
        fish.retain();
        fish.removeFromParent();
        var cs = this._hook.getContentSize();
        fish.setPosition(pos);
        this._hook.addChild(fish);
        fish.release();
        fish.runAction(
            cc.moveTo(
                Bear.ROD_HOOK_SNAP_TIME,
                cc.p(cs.width * .5, -cs.width * .33)
            ).easing(cc.easeSineOut())
        );
        fish.runAction(
            cc.rotateTo(Bear.ROD_HOOK_SNAP_TIME, fish.isMirrored() ? -90 : 90)
        );
    },

    detachFromHook: function () {
        this._hook.removeAllChildren();
    },

    checkPullUp: function () {
        if (this._hook.getChildrenCount() == 0) {
            return;
        }
        if (this._line.getScaleY() <= Bear.LINE_MIN) {
            this.detachDisposeFish();
            Sound.getInstance().playSound(res.snd_caught);
        }
    },

    detachDisposeFish: function () {
        var fish = this._hook.getChildren()[0];
        var pos = this._hook.convertToWorldSpace(fish.getPosition());
        fish.retain();
        fish.removeFromParent();
        var parent = this.getParent();
        fish.setPosition(parent.convertToNodeSpace(pos));
        parent.addChild(fish, -1);
        fish.release();
        this.throwFish(fish);
        if (this._callbackManager({ id: CallbackID.WORM_NUM }) > 0) {
            this.showWorm(true);
        } else {
            Animations.getInstance().popText("WORMS NEEDED");
        }
    },

    throwFish: function (fish) {
        var pos = fish.getPosition();
        var array = [
            pos,
            cc.p(pos.x - Bear.FISH_FLY_WIDTH * .333, pos.y + Bear.FISH_FLY_HEIGHT),
            cc.p(pos.x - Bear.FISH_FLY_WIDTH * .666, pos.y + Bear.FISH_FLY_HEIGHT),
            cc.p(pos.x - Bear.FISH_FLY_WIDTH, pos.y)
        ];
        var flyPath = cc.cardinalSplineTo(Bear.FISH_FLY_TIME, array, 0);
        fish.runAction(
            cc.sequence(
                flyPath,
                cc.fadeOut(Bear.FISH_FADEOUT_TIME),
                cc.callFunc(
                    function () {
                        fish.destroy();
                    }
                )
            )
        );
        fish.runAction(
            cc.rotateBy(Bear.FISH_FLY_TIME, Bear.FISH_FLY_ANGLE)
        );
    },

    showWorm: function (delayed) {
        if (delayed) {
            this._worm.runAction(
                cc.sequence(
                    cc.delayTime(Bear.WORM_FADE_TIME * 3),
                    cc.fadeIn(Bear.WORM_FADE_TIME)
                )
            );
        } else {
            this._worm.runAction(
                cc.fadeIn(Bear.WORM_FADE_TIME)
            );
        }
    },

    hideWorm: function () {
        this._worm.runAction(cc.fadeOut(Bear.WORM_FADE_TIME));
    },

    scoreReward: function (fish, fishPosWorld) {
        var score = fish.getScore();
        if (score != 0) {
            this._callbackManager(
                {
                    id: CallbackID.SCORE_UPDATE,
                    value: score
                }
            );
            Animations.getInstance().popScoreText(score > 0 ? "+" + score.toString() : score.toString(), fishPosWorld);
            Sound.getInstance().playSound(res.snd_addscore);
        }
    },

    checkCollect: function (pos) {
        var pos = this.getParent().convertToNodeSpace(pos);
        return cc.rectContainsPoint(this.getBoundingBox(), pos);
    },

    collect: function (fish) {
        var fishPosWorld = fish.getParent().convertToWorldSpace(fish.getPosition());
        this.bonusReward(fish, fishPosWorld);
        var pos = fish.getParent().convertToWorldSpace(fish.getPosition());
        fish.retain();
        fish.removeFromParent();
        var parent = this.getParent();
        fish.setPosition(parent.convertToNodeSpace(pos));
        parent.addChild(fish, 1);
        fish.release();
        fish.runAction(
            cc.sequence(
                cc.moveTo(.65, this.getPosition()),
                cc.fadeOut(.65),
                cc.callFunc(
                    function () {
                        fish.destroy();
                    }
                )
            )
        );
    },

    bonusReward: function (fish, fishPosWorld) {
        var info = fish.getInfo();
        this._callbackManager(
            {
                id: CallbackID.BONUS_UPDATE,
                value: info
            }
        );
        Animations.getInstance().popScoreText("+" + info.amount + " " + info.payload.toUpperCase(), fishPosWorld);
        if (info.payload == "bomb") {
            Sound.getInstance().playSound(res.snd_addbombs);
        } else if (info.payload == "score") {
            Sound.getInstance().playSound(res.snd_addscore);
        } else if (info.payload == "time") {
            Sound.getInstance().playSound(res.snd_addseconds);
        } else if (info.payload == "worm") {
            Sound.getInstance().playSound(res.snd_addworms);
        }       
    },

    checkWorm: function () {
        if (this._callbackManager({ id: CallbackID.WORM_NUM }) > 0) {
            this.showWorm(true);
        }
    },

    update: function (dt) {
        this.adjustLine();
        this.checkPullUp();
    },

    onEnter: function () {
        cc.Node.prototype.onEnter.call(this);
        this.adjustLine();
    },

    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        this._headAnim.release();
    }

});

Bear.BODY_X = 94;
Bear.BODY_Y = 52;
Bear.ROD_X = 104;
Bear.ROD_Y = 55;
Bear.ROD_ANGLE = 13;
Bear.ROD_DROP_TIME = 1.1;
Bear.ROD_STATE_UP = 0;
Bear.ROD_STATE_DOWN = 1;
Bear.ROD_AP_X = 6;
Bear.ROD_AP_Y = 19;
Bear.ROD_END_X = 168;
Bear.ROD_END_Y = 76;
Bear.ROD_HOOK_SNAP_TIME = .3;
Bear.FISH_FLY_WIDTH = 160;
Bear.FISH_FLY_HEIGHT = 90;
Bear.FISH_FLY_TIME = .7;
Bear.FISH_FADEOUT_TIME = .5;
Bear.FISH_FLY_ANGLE = -450;
Bear.LINE_MIN = 35;
Bear.LINE_MAX = 450;
Bear.PLUMB_POS_Y = 17;
Bear.WORM_FADE_TIME = .1;
Bear.PADDLE_X = 83;
Bear.PADDLE_Y = 59;
Bear.PADDLE_AP_X = 11;
Bear.PADDLE_AP_Y = 92;
Bear.PADDLE_ANGLE = 30;
Bear.PADDLE_TRESHOLD = 0.1;
Bear.PADDLE_ROW = 1;
Bear.PADDLE_STALL = 0;
Bear.PADDLE_TIME = .55;
Bear.HEAD_SIZE_X = 58;
Bear.HEAD_SIZE_Y = 56;
Bear.HEAD_SIDE_TEX_ITEMS = 3;
Bear.HEAD_TEX_ITEMS = 3;
Bear.HEAD_TIME_FRAME = 1.5;
Bear.HEAD_AP_X = 27;
Bear.HEAD_AP_Y = 7;
Bear.HEAD_X = 92;
Bear.HEAD_Y = 68;
Bear.HEAD_ANGLE = 8;
Bear.HEAD_TIME = 2;
Bear.WAVE_TIME = 1.1;
Bear.WAVE_SHIFT = 3;
Bear.WIDTH = 220;
Bear.HEIGHT = 114;

Bear.create = function (params) {
    var instance = new Bear();
    instance.init(params);
    return instance;
};