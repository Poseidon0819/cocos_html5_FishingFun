function Animations() {
    if (arguments.callee.instance) {
        return arguments.callee.instance;
    }
    arguments.callee.instance = this;

    var inProgress = false;
    var queue = [];

    this.addAnimation = function (anim) {
        queue.push(anim);
        this.parseQueue();
    };
    this.parseQueue = function () {
        if (inProgress == true) {
            return;
        }
        if (queue.length > 0) {
            queue[0]();
            inProgress = true;
            queue.splice(0, 1);
        }
    };

    this.resetProgress = function () {
        inProgress = false;
    };

    this.createBubbles = function () {
        var pos = cc.pFromSize(cc.view.getDesignResolutionSize());
        var psq = cc.ParticleSystem.create();
        //if (Globals.isWebGL) {    
        psq.setTotalParticles(96);
        psq.setDuration(cc.ParticleSystem.DURATION_INFINITY);
        psq.setEmitterMode(cc.ParticleSystem.MODE_GRAVITY);
        psq.setGravity(cc.p(0, 50.));
        psq.setRadialAccel(0);
        psq.setRadialAccelVar(0);
        psq.setSpeed(0);
        psq.setSpeedVar(0);
        psq.setStartSpinVar(0.);
        psq.setAngle(0);
        psq.setAngleVar(0);
        psq.setPosVar(cc.p(pos.x, 0));
        psq.setLife(4.6);
        psq.setLifeVar(0);
        psq.setStartSize(14.);
        psq.setStartSizeVar(0);
        psq.setEndSize(9);
        psq.setEmissionRate(psq.getTotalParticles() / psq.getLife());
        psq.setStartColor(cc.color.WHITE);
        psq.setStartColorVar(cc.color(0, 0, 0, 0));
        psq.setEndColor(cc.color.WHITE);
        psq.setEndColorVar(cc.color(0, 0, 0, 0));
        psq.setBlendAdditive(false);
        var tex = cc.textureCache.addImage(res.bubble);
        psq.setTexture(tex);
        psq.setPositionType(cc.ParticleSystem.TYPE_FREE);
        psq.setPosition(cc.p(pos.x / 2., 0 - 50));
        //}
        return psq;
    };

    this.textQueued = function (text) {
        this.addAnimation(
            function () {
                this.popText(text);
            }.bind(this)
        );
    };

    this.popText = function (text) {
        var time = 1.2;
        var animHolder = cc.director.getRunningScene().getChildByName("root").getChildByName("animations_top_holder");;
        var pos = cc.pFromSize(animHolder.getContentSize());
//        var label = cc.LabelTTF.create(text, getFontNamePlatform(res.fontFoo), 62, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
//        label.enableStroke(cc.color(Globals.STROKE_COLOR), 12);
        var label = new cc.LabelBMFont(text, res.fooFNT, 0, cc.TEXT_ALIGNMENT_CENTER);
        label.setColor(Globals.TEXT_COLOR);
        var scale = 62/Globals.FONT_SIZE_FACTOR;
        label.setPosition(cc.p(pos.x * .5, pos.y * .5));
        label.setOpacity(0);
        label.setScale(.5);
        animHolder.addChild(label);
        label.runAction(
            cc.sequence(
                cc.spawn(
                    cc.scaleTo(time * .5, scale*1.),
                    cc.fadeIn(time * .5)
                ),
                cc.spawn(
                    cc.scaleTo(time * .6, scale*1.4),
                    cc.fadeOut(time * .6)
                ),
                cc.callFunc(
                    function () {
                        label.removeFromParent();
                        this.resetProgress();
                        this.parseQueue();
                    }.bind(this)
                )
            )
        );
    };

    this.popScoreText = function (text, pos) {
        var time = 1.5;
        var animHolder = cc.director.getRunningScene().getChildByName("root").getChildByName("animations_top_holder");;
//        var label = cc.LabelTTF.create(text, getFontNamePlatform(res.fontFoo), 42, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
//        label.enableStroke(cc.color(Globals.STROKE_COLOR), 12);
        var label = new cc.LabelBMFont(text, res.fooFNT, 0, cc.TEXT_ALIGNMENT_CENTER);
        label.setColor(Globals.TEXT_COLOR);
        var scale = 42/Globals.FONT_SIZE_FACTOR
        label.setPosition(pos);
        label.setOpacity(0);
        label.setScale(.5);
        animHolder.addChild(label);
        label.runAction(
            cc.sequence(
                cc.spawn(
                    cc.scaleTo(time * .5, scale*1.),
                    cc.fadeIn(time * .5)
                ),
                cc.spawn(
                    cc.scaleTo(time * .6, scale*1.4),
                    cc.fadeOut(time * .6)
                ),
                cc.callFunc(
                    function () {
                        label.removeFromParent();
                    }.bind(this)
                )
            )
        );
        label.runAction(
            cc.moveBy(time * .5 + time * .6, cc.p(0, 130)).easing(cc.easeExponentialOut())
        );
    };

};

Animations.getInstance = function () {
    var singletonClass = new Animations();
    return singletonClass;
};

