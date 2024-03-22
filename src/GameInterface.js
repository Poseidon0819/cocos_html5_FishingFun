var GameInterface = cc.Layer.extend({

    _rubberController: null,
    _bottom: null,
    _top: null,
    _callbackStage: null,

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this._callbackStage = params.callbackStage;
        this.addRubberController();
        this.addBottom();
        this.addTop(
            {
                callbackManager: params.callbackManager
            }
        );
        this.addButtons();
    },

    managerUpdate: function (params) {
        switch (params.id) {
            case CallbackID.SCORE_UPDATE:
            case CallbackID.TARGET_SCORE_UPDATE:
            case CallbackID.LEVEL_UPDATE:
            case CallbackID.TIME_UPDATE:
                this._top.managerUpdate(params);
                break;
            case CallbackID.BOMB_UPDATE:
            case CallbackID.WORM_UPDATE:
                this._bottom.managerUpdate(params); //callbackBottom
                this._callbackStage({ id: CallbackID.CHECK_WORM });
                break;
        }
    },

    addButtons: function () {
        if (Globals.TOUCH == false) {
            this.addLeft4();
            this.addRight6();
            this.addDown5();
        } else {
            this.addTouchPanel();
        }
        this.addBomb8();
        this.addPause();
    },

    addBottom: function () {
        var pos = cc.pFromSize(this.getContentSize());
        this._bottom = BoardBottom.create();
        this._bottom.setPosition(cc.p(pos.x * .5, 22));
        this.addChild(this._bottom);
    },

    addTop: function (params) {
        var pos = cc.pFromSize(this.getContentSize());
        this._top = BoardTop.create(params);
        this._top.setPosition(cc.p(pos.x * .5 - 50, pos.y - 15));
        this.addChild(this._top);
    },

    addLeft4: function () {
        var buttonLeft4 = Button.create(
            {
                strPicFile: res.left,
                keyScan: [cc.KEY.num4, cc.KEY['4']],
                callbackDown:
                    function () {
                        this._rubberController.onKey(RubberController.ON_KEY_LEFT);
                    }.bind(this),
                callbackUp:
                    function () {
                        this._rubberController.onKey(RubberController.ON_KEY_RELEASE);
                    }.bind(this)
            }
        );
        buttonLeft4.setPosition(cc.p(77, GameInterface.BUTTON_Y));
        buttonLeft4.disableSound();
        this.addChild(buttonLeft4);
    },

    addRight6: function () {
        var buttonRight6 = Button.create(
            {
                strPicFile: res.right,
                keyScan: [cc.KEY.num6, cc.KEY['6']],
                callbackDown:
                    function () {
                        this._rubberController.onKey(RubberController.ON_KEY_RIGHT);
                    }.bind(this),
                callbackUp:
                    function () {
                        this._rubberController.onKey(RubberController.ON_KEY_RELEASE);
                    }.bind(this),
            }
        );
        buttonRight6.setPosition(cc.p(219, GameInterface.BUTTON_Y));
        buttonRight6.disableSound();
        this.addChild(buttonRight6);
    },

    addDown5: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var buttonDown5 = Button.create(
            {
                strPicFile: res.down,
                keyScan: [cc.KEY.num5, cc.KEY['5']],
                callbackDown:
                    function () {
                        this._callbackStage({ id: CallbackID.BEAR_DROP_LINE, value: true });
                    }.bind(this),
                callbackUp:
                    function () {
                        this._callbackStage({ id: CallbackID.BEAR_DROP_LINE, value: false });
                    }.bind(this)
            });
        buttonDown5.setPosition(cc.p(pos.x - 78, GameInterface.BUTTON_Y));
        buttonDown5.disableSound();
        this.addChild(buttonDown5);
    },

    addBomb8: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var buttonBomb8 = Button.create(
            {
                strPicFile: res.drop,
                keyScan: [cc.KEY.num8, cc.KEY['8']],
                callbackDown:
                    function () {
                        this._callbackStage({ id: CallbackID.POOL_DEPLOY_BOMB });
                    }.bind(this),
                swallow: true
            });
        buttonBomb8.setPosition(cc.p(pos.x - (Globals.TOUCH ? 100 : 219), GameInterface.BUTTON_Y));
        buttonBomb8.disableSound();
        this.addChild(buttonBomb8);
    },

    addPause: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var pause = Button.create(
            {
                strPicFile: res.menu,
                keyScan: [cc.KEY.num9, cc.KEY['9']],
                callbackDown:
                    function () {
                        Overlays.getInstance().changeOverlay(OverlaysStates.OVER_SPLASH, {}, function () { });
                    }.bind(this),
                swallow: true
            });
        pause.setPosition(cc.p(pos.x - 43, pos.y - 41));
        this.addChild(pause);
    },

    addTouchPanel: function () {
        var touchPanel = TouchPanel.create(
            {
                callbackDirLeft:
                    function () {
                        this._rubberController.onKey(RubberController.ON_KEY_LEFT);
                    }.bind(this),
                callbackDirRight:
                    function () {
                        this._rubberController.onKey(RubberController.ON_KEY_RIGHT);
                    }.bind(this),
                callbackDirUp:
                    function () {
                        this._rubberController.onKey(RubberController.ON_KEY_RELEASE);
                    }.bind(this),
                callbackMiddleDown:
                    function () {
                        this._callbackStage({ id: CallbackID.BEAR_DROP_LINE, value: true });
                    }.bind(this),
                callbackMiddleUp:
                    function () {
                        this._callbackStage({ id: CallbackID.BEAR_DROP_LINE, value: false });
                    }.bind(this)
            }
        );
        this.addChild(touchPanel);
    },

    addRubberController: function (decorations, bear) {
        this._rubberController = RubberController.create(
            {
                listeners: [
                    function (val) {
                        this._callbackStage({ id: CallbackID.DECORATIONS_RUBBER, value: val });
                    }.bind(this),
                    function (val) {
                        this._callbackStage({ id: CallbackID.BEAR_RUBBER, value: val });
                    }.bind(this)
                ]
            }
        );
    },

    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        this._rubberController.destroy();
    }

});

GameInterface.BUTTON_Y = 79;

GameInterface.create = function (params) {
    var instance = new GameInterface();
    instance.init(params);
    return instance;
};
