var InfoInterface = cc.Layer.extend({

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this.addTitle();
        this.addInfo();
        this.addHelp();
        this.addMenu();
        this.addPlay();
    },

    addMenu: function () {
        var buttonMenu = Button.create(
            {
                strPicFile: res.menu,
                keyScan: [cc.KEY.num9, cc.KEY["9"]],
                callbackDown:
                    function () {
                        this.onMenuPress();
                    }.bind(this)
            }
        );
        buttonMenu.setPosition(cc.p(42, InfoInterface.BUTTON_Y));
        this.addChild(buttonMenu);
        var keyboardListenerBack = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode, event) {
                if (keyCode == cc.KEY.back) {
                    this.onExitPress();
                }
            }.bind(this)
        });
        cc.eventManager.addListener(keyboardListenerBack, this);
    },

    onMenuPress: function () {
        Overlays.getInstance().changeOverlay(OverlaysStates.OVER_SPLASH, {}, function () { });
    },

    addPlay: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var buttonPlay = Button.create(
            {
                strPicFile: res.plays,
                keyScan: [cc.KEY.num5, cc.KEY['5']],
                callbackDown:
                    function () {
                        Overlays.getInstance().changeOverlay(OverlaysStates.OVER_GAME, { endless: false }, function (overlayCreated) { });
                    }.bind(this)
            }
        );
        buttonPlay.setPosition(cc.p(pos.x - 42, InfoInterface.BUTTON_Y));
        this.addChild(buttonPlay);
    },

    addTitle: function () {
        var pos = cc.pFromSize(this.getContentSize());
//        var label = cc.LabelTTF.create("GAME INFO", getFontNamePlatform(res.fontFoo), 65, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        var label = new cc.LabelBMFont("GAME INFO", res.fooFNT, 0, cc.TEXT_ALIGNMENT_CENTER);
        label.setScale(65/Globals.FONT_SIZE_FACTOR);
        label.setPosition(cc.p(pos.x * .5, pos.y - 50));
        label.setColor(Globals.TEXT_COLOR);
        this.addChild(label);
    },

    addHelp: function () {
        var pos = cc.pFromSize(this.getContentSize());
//        var label = cc.LabelTTF.create("FISHING FUN! - FISH FOR AS MANY FISH AND SHELLFISH YOU CAN BEFORE THE\nTIME RUNS OUT !", getFontNamePlatform(res.fontFoo), 27, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        var label = new cc.LabelBMFont("FISHING FUN! - FISH FOR AS MANY FISH AND SHELLFISH YOU CAN BEFORE THE\nTIME RUNS OUT !", res.fooFNT, 1136, cc.TEXT_ALIGNMENT_CENTER);
        label.setScale(27/Globals.FONT_SIZE_FACTOR);
        label.setPosition(cc.p(pos.x * .5, 43));
        label.setColor(Globals.TEXT_COLOR);
        this.addChild(label);
    },

    addInfo: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var itemGroup = ItemGroup.create();
        itemGroup.setPosition(cc.p(pos.x*.5, pos.y*.5 + 10));
        this.addChild(itemGroup);
    }


});

InfoInterface.BUTTON_Y = 43;

InfoInterface.create = function (params) {
    var instance = new InfoInterface();
    instance.init(params);
    return instance;
};
