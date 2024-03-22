var GameStage = cc.Layer.extend({

    _pool: null,
    _bear: null,
    _decorations: null,

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this.addDecorations();
        this.addBear(
            {
                callbackManager: params.callbackManager,
                lineSlot: this._decorations.getLineSlot()
            }
        );
        this.addPool(params.callbackManager);
    },

    callbackStage: function (params) {
        switch (params.id) {
            case CallbackID.DECORATIONS_RUBBER:
                this._decorations.adjustSpeed(params.value);
                break;
            case CallbackID.BEAR_RUBBER:
                this._bear.adjustSpeed(params.value);
                break;
            case CallbackID.CHECK_WORM:
                this._bear.checkWorm();
                break;
            case CallbackID.BEAR_DROP_LINE:
                this._bear.dropLine(params.value);
                break;
            case CallbackID.POOL_DEPLOY_BOMB:
                this._pool.deployBomb();
                break;
        }
    },

    addDecorations: function () {
        this._decorations = Decorations.create();
        this._decorations.setName("decorations");
        this.addChild(this._decorations);
    },

    addPool: function (cbm) {
        this._pool = Pool.create(
            {
                callbackSpeedCorrection: function () {
                    return this._decorations.getSpeedCurrentMult();
                }.bind(this),
                callbackCheckCatch: function (rect) {
                    return this._bear.checkCatch(rect);
                }.bind(this),
                callbackAttachToHook: function (fish) {
                    this._bear.attachToHook(fish);
                }.bind(this),
                callbackDetachFromHook: function () {
                    this._bear.detachFromHook();
                }.bind(this),
                callbackCheckCollect: function (rect) {
                    return this._bear.checkCollect(rect);
                }.bind(this),
                callbackCollect: function (fish) {
                    this._bear.collect(fish)
                }.bind(this),
                callbackManager: cbm,
                shark: true,
                bonus: true,
                fish: true
            }
        );
        this._decorations.getPoolSlot().addChild(this._pool);
    },

    addBear: function (params) {
        var size = this._decorations.getContentSize();
        this._bear = Bear.create(params);
        this._bear.setPosition(cc.p(size.width * .5, size.height - 108));
        this._decorations.getBearSlot().addChild(this._bear);
        this._bear.setSail();
    },

    getBear: function () {
        return this._bear;
    },

    getDecorations: function () {
        return this._decorations;
    }

});

GameStage.create = function (params) {
    var instance = new GameStage();
    instance.init(params);
    return instance;
};
