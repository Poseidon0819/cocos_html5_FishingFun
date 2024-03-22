var SplashOverlay = cc.Layer.extend({

    buttonEndless: null,
    buttonFacebook: null,

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this.addStage();
        this.addInterface();
        Sound.getInstance().playMusic(res.snd_gamemusic);
    },

    addStage: function() {
        var stage = SplashStage.create();
        this.addChild(stage);
        return stage;
    },

    addInterface: function (params) {
        var controls = SplashInterface.create(params);
        this.addChild(controls);
    }

});

SplashOverlay.create = function (params) {
    var instance = new SplashOverlay();
    instance.init(params);
    return instance;
};


