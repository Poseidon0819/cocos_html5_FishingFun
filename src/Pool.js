var Pool = cc.Layer.extend({ //TODO: split into classes, fish launcher, bonus launcher, etc

    _batchNode: null,
    _bombSlot: null,
    _launchTime: -1,
    _launchTimeOut: -1,
    _launchTimeOutShark: -1,
    _launchTimeOutBonus: -1,
    _lastChosenFishIdx: -1,
    _lastChosenBonusIdx: -1,
    _shark: false,
    _bonus: false,
    _fish: false,
    _sharks: null,
    _callbackSpeedCorrection: null,
    _callbackCheckCatch: null,
    _callbackAttachToHook: null,
    _callbackDetachFromHook: null,
    _callbackCheckCollect: null,
    _callbackCollect: null,
    _callbackManager: null,

    ctor: function () {
        cc.Layer.prototype.ctor.call(this);
        this._sharks = [];
        this._launchTime = Pool.LAUNCH_TIMEOUT;
    },

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this.scheduleUpdate();
        this.addBatchNode();
        this.addBombSlot();
        this._callbackSpeedCorrection = params.callbackSpeedCorrection;
        this._callbackCheckCatch = params.callbackCheckCatch;
        this._callbackAttachToHook = params.callbackAttachToHook;
        this._callbackDetachFromHook = params.callbackDetachFromHook;
        this._callbackCheckCollect = params.callbackCheckCollect;
        this._callbackCollect = params.callbackCollect;
        this._callbackManager = params.callbackManager;
        this._shark = params.shark;
        this._bonus = params.bonus;
        this._fish = params.fish;
    },

    addBatchNode: function () {
        Fish.cacheTexture();
        Bomb.cacheTexture();
        this._batchNode = cc.SpriteBatchNode.create(Fish.cachedTexture);
        this._batchNode.setCascadeOpacityEnabled(true);
        this.addChild(this._batchNode);
    },

    addBombSlot: function () {
        this._bombSlot = cc.Layer.create();
        this.addChild(this._bombSlot);
    },

    adjustSpeed: function (delta) {
        this._speedCorrection = delta;
    },

    chooseFish: function () {
        var availableFish = Pool.AVAILABLE_FISH;
        var length = availableFish.length;
        var idx = Math.floor(Math.random() * length);
        if (idx == this._lastChosenFishIdx) {
            if (++idx == length) {
                idx = 0;
            }
        }
        this._lastChosenFishIdx = idx;
        return availableFish[idx];
    },

    launchFish: function (fishName) {
        var mirrored = !!(Math.floor(Math.random() * 2));
        var data = [];
        Database.getCellString("points", "id", fishName, "points", data);
        var fish1 = Fish.create(
            {
                fish: fishName,
                mirrored: mirrored,
                score: (data.length > 0 ? parseInt(data[0]) : 0)
            }
        );
        this.launchFishPos(fish1, mirrored);
    },

    launchShark: function () {
        var mirrored = !!(Math.floor(Math.random() * 2));
        var data = [];
        Database.getCellString("points", "id", "SHARK", "points", data);
        var shark = Shark.create(
            {
                fish: "SHARK",
                mirrored: mirrored,
                score: (data.length > 0 ? parseInt(data[0]) : 0),
                callbackIsNoMore: function (fish) {
                    this.onFishDestroyed(fish)
                }.bind(this)
            }
        );
        this._sharks.push(shark);
        this.launchFishPos(shark, mirrored);
    },

    launchFishPos: function (fish, mirrored) {
        var size = this.getContentSize();
        var x = mirrored ? -Pool.LAUNCH_MARGIN : size.width + Pool.LAUNCH_MARGIN;
        fish.setPosition(cc.p(x, Pool.LAUNCH_MIN_Y + Math.random() * Pool.LAUNCH_RANGE_Y));
        this._batchNode.addChild(fish);
    },

    chooseBonus: function () {
        var availableBonus = Pool.AVAILABLE_BONUS;
        var length = availableBonus.length;
        var idx = Math.floor(Math.random() * length);
        if (idx == this._lastChosenBonusIdx) {
            if (++idx == length) {
                idx = 0;
            }
        }
        this._lastChosenBonusIdx = idx;
        return availableBonus[idx];
    },

    launchBonus: function (bonusName) {
        var data = [];
        Database.getTableRowByValue("bonus", "type", bonusName, data);
        var bonus = Bonus.create(
            {
                type: bonusName,
                payload: data[0][1],
                amount: parseInt(data[0][2]),
                callbackPop: function (pos) {
                    this.popBonus(pos)
                }.bind(this)
            }
        );
        this.launchBonusPos(bonus);
    },

    launchBonusPos: function (bonus) {
        var size = this.getContentSize();
        var x = Math.floor(Pool.BONUS_LAUNCH_OFFSET + (size.width - Pool.BONUS_LAUNCH_OFFSET * 2) * Math.random());
        bonus.setPosition(cc.p(x, -100));
        this._batchNode.addChild(bonus);
    },

    killInRadius: function (pos, radius) {
        var children = this._batchNode.getChildren();
        children.forEach(
            function (child) {
                if (child.isCollectable()) {
                    return;
                }
                var posChild = child.getPosition();
                var subtract = cc.pSub(pos, posChild);
                if (cc.pLength(subtract) < radius) {
                    this.explodeFish(child, posChild);
                }
            }.bind(this)
        );
    },

    explodeFish: function (child, posChild) {
        child.runAction(
            cc.sequence(
                cc.fadeOut(.1 + Math.random()*.2),
                cc.callFunc(
                    function () {
                        this.scoreReward(child, posChild);
                        child.destroy();
                    }.bind(this)
                )
            )
        );
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

    deployBomb: function () {
        if (this._callbackManager({ id: CallbackID.BOMB_NUM }) > 0) {
            this._callbackManager({ id: CallbackID.BOMB_USED });
            var bomb = Bomb.create(
                {
                    callbackDetonate: function (pos, radius) {
                        this.killInRadius(pos, radius);
                        Sound.getInstance().playSound(res.snd_explosion);
                    }.bind(this)
                }
            );
            var size = this.getContentSize();
            bomb.setPosition(cc.p(size.width * .5, 520));
            this._bombSlot.addChild(bomb);
            Sound.getInstance().playSound(res.snd_bomb);
        } else {
            Animations.getInstance().popText("BOMBS NEEDED");
        }
    },

    onFishDestroyed: function (fish) {
        var idx = this._sharks.indexOf(fish);
        if (idx != -1) {
            this._sharks.splice(idx, 1);
        }
    },

    checkCatch: function (fish) {
        if (fish.isCatchable() == false) {
            return;
        }
        var bb = this.fishGetBB(fish);
        var shark = this.checkAteBySharks(bb, fish);
        if (shark != null) {
            shark.swallow(fish);
        } else if (this._callbackCheckCatch(bb)) {
            this._callbackAttachToHook(fish);
        }
    },

    checkCollect: function (fish) {
        if (fish.isCollectable() == false) {
            return;
        }
        var pos = this._batchNode.convertToWorldSpace(fish.getPosition());
        if (this._callbackCheckCollect(pos)) {
            this._callbackCollect(fish);
        }
    },

    fishGetBB: function (fish) {
        var bb = fish.getBoundingBox();
        var p = this._batchNode.convertToWorldSpace(cc.p(bb.x, bb.y));
        bb.x = p.x;
        bb.y = p.y;
        return bb;
    },

    checkAteBySharks: function (bb) {
        for (var i = 0; i < this._sharks.length; i++) {
            var shark = this._sharks[i];
            if (shark.checkChew(bb)) {
                return shark;
            }
        }
        return null;
    },

    launchUpdate: function (dt) {
        var cbAbs = Math.abs(this._callbackSpeedCorrection());
        this._launchTime = Pool.LAUNCH_TIMEOUT - Pool.LAUNCH_TIMEOUT * .6 * cbAbs;
        if (this._launchTimeOut <= 0) {
            this.launchFish(this.chooseFish());
            this._launchTimeOut = this._launchTime + Math.random() * (Pool.LAUNCH_TIMEOUT_RAND_MAX - Pool.LAUNCH_TIMEOUT_RAND_MAX * .6 * cbAbs);
        } else {
            this._launchTimeOut -= dt;
        }
    },

    launchUpdateShark: function (dt) {
        if (this._launchTimeOutShark <= 0) {
            this.launchShark();
            this._launchTimeOutShark = Pool.LAUNCH_TIMEOUT_SHARK + Math.random() * Pool.LAUNCH_TIMEOUT_RAND_MAX_SHARK;
        } else {
            this._launchTimeOutShark -= dt;
        }
    },

    launchUpdateBonus: function (dt) {
        if (this._launchTimeOutBonus <= 0) {
            this.launchBonus(this.chooseBonus());
            this._launchTimeOutBonus = Pool.LAUNCH_TIMEOUT_BONUS + Math.random() * Pool.LAUNCH_TIMEOUT_RAND_MAX_BONUS;
        } else {
            this._launchTimeOutBonus -= dt;
        }
    },

    currentUpdate: function (dt) {
        var children = this._batchNode.getChildren();
        children.forEach(
            function (child) {
                this.checkCatch(child);
                this.checkCollect(child);
                child.updatePoolPosition(dt, this._callbackSpeedCorrection() * Pool.SPEED_CURRENT);
            }.bind(this)
        );
    },

    currentUpdateBomb: function (dt) {
        var children = this._bombSlot.getChildren();
        children.forEach(
            function (child) {
                child.updatePoolPosition(dt, this._callbackSpeedCorrection() * Pool.SPEED_CURRENT);
            }.bind(this)
        );
    },

    update: function (dt) {
        if (this._fish) {
            this.launchUpdate(dt);
        }
        if (this._shark) { //TODO: make array with update listeners, and fill em on init, if required
            this.launchUpdateShark(dt);
        }
        if (this._bonus) {
            this.launchUpdateBonus(dt);
        }
        this.currentUpdate(dt);
        this.currentUpdateBomb(dt);
    },

    popBonus: function (pos) { //workaround, doesnt work in batch node for bonus TODO: clean up
        if (Fish.cacheTexture == null) {
            return;
        }
        var calcRect = function (pp, pos) {
            var side = Bonus.FRAMES;
            var offsetX = Bonus.SIZE_X;
            var offsetY = Bonus.SIZE_Y;
            var p = pp;
            var x = p.x + (pos % side) * offsetX;
            var y = p.y + Math.floor(pos / side) * offsetY;
            return cc.rect(x, y, offsetX, offsetY);
        };
        var addAnimationsFrames = function () {
            var bonusTexture = Fish.cachedTexture;
            var bonusAnim = cc.Animation.create();
            var length = Bonus.FRAMES;
            for (var i = 0; i < length; i++) {
                bonusAnim.addSpriteFrameWithTexture(bonusTexture, calcRect(Bonus.POP.pos, i));
            }
            bonusAnim.setDelayPerUnit(Bonus.TIME_FRAME);
            bonusAnim.setLoops(1);
            return cc.Animate.create(bonusAnim);
        };
        var pop = cc.Sprite.create(Fish.cachedTexture);
        pop.setScale(Bonus.SCALE);
        pop.setTextureRect(calcRect(Bonus.POP.pos, 0));
        pop.runAction(
            cc.sequence(
                addAnimationsFrames(),
                cc.callFunc(
                    function () {
                        this.removeFromParent();
                    }.bind(pop)
                )
            )
        );
        pop.setPosition(pos);
        this.addChild(pop);
    }

});

Pool.AVAILABLE_FISH = ["FISH1", "FISH2", "FISH3", "FISH4", "FISH5", "FISH6", "FISH7", "SEAHORSE", "SHELL1", "SHELL2", "SHELL3", "STAR1", "STAR2"];
Pool.AVAILABLE_BONUS = ["BOMB", "TIME", "WORM", "TREASURE", "GIFT1", "GIFT2", "GIFT3"];
Pool.MAX_FISHES = 64;
Pool.LAUNCH_MARGIN = 200;
Pool.LAUNCH_MIN_Y = 75;//
Pool.LAUNCH_RANGE_Y = 240;//
Pool.SPEED_CURRENT = 100.;
Pool.LAUNCH_TIMEOUT = .7;
Pool.LAUNCH_TIMEOUT_RAND_MAX = .7;
Pool.LAUNCH_TIMEOUT_SHARK = 12.;
Pool.LAUNCH_TIMEOUT_RAND_MAX_SHARK = 2;
Pool.LAUNCH_TIMEOUT_BONUS = 7;
Pool.LAUNCH_TIMEOUT_RAND_MAX_BONUS = 2;
Pool.BONUS_LAUNCH_OFFSET = 50;

Pool.create = function (params) {
    var instance = new Pool();
    instance.init(params);
    return instance;
};