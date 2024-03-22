var InfoStage = cc.Layer.extend({

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        var decorations = this.addDecorations();
        this.addPool(decorations);
    },

    addDecorations: function () {
        var decorations = Decorations.create();
        decorations.setName("decorations");
        this.addChild(decorations);
        return decorations;
    },

    addPool: function (decorations) {
        var pool = Pool.create(
            {
                callbackSpeedCorrection: function () { return 0; },
                callbackCheckCatch: function (rect) { return false; },
                callbackAttachToHook: function (fish) { },
                callbackDetachFromHook: function () { },
                callbackCheckCollect: function () { return false; },
                callbackCollect: function () { },
                shark: false,
                bonus: false,
                fish: false
            }
        );
        decorations.getPoolSlot().addChild(pool);
    }

});

InfoStage.create = function (params) {
    var instance = new InfoStage();
    instance.init(params);
    return instance;
};
