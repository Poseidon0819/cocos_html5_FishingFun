var InfoOverlay = cc.Layer.extend({

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this.addStage();
        this.addInterface();
    },

    addStage: function() {
        var stage = InfoStage.create();
        this.addChild(stage);
        return stage;
    },

    addInterface: function (params) {
        var controls = InfoInterface.create(params);
        this.addChild(controls);
    }

});

InfoOverlay.create = function (params) {
    var instance = new InfoOverlay();
    instance.init(params);
    return instance;
};


