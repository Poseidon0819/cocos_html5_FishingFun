var GameOverlay = cc.Layer.extend({

    _manager: null,
    _interface: null,

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this.createManager();
        var stage = this.addStage();
        this.addInterface(stage);
        this.linkManagerCallback();
        this._manager.start();
    },

    addStage: function () {
        var stage = GameStage.create(
            {
                callbackManager: function (params) {
                    return this._manager.callbackManager(params);
                }.bind(this)
            }
        );
        this.addChild(stage);
        return stage;
    },

    addInterface: function (stage) {
        this._interface = GameInterface.create(
            {
                decorations: stage.getDecorations(),
                bear: stage.getBear(),
                callbackManager: function (params) {
                    return this._manager.callbackManager(params);
                }.bind(this),
                callbackStage: function(params) {
                    return stage.callbackStage(params);
                }.bind(this)
            }
        );
        this.addChild(this._interface);
    },

    createManager: function () {
        this._manager = Manager.create(
            {
                endless: false
            }
        );
    },

    linkManagerCallback: function () {
        this._manager.setInterfaceCallback(
            function (params) {
                this._interface.managerUpdate(params);
            }.bind(this)
        );
    }

});

GameOverlay.create = function (params) {
    var instance = new GameOverlay();
    instance.init(params);
    return instance;
};
