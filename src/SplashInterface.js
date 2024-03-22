var SplashInterface = cc.Layer.extend({    

    _levelScore : null,

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this.addLogo();
        this.addExit();
        this.addInfo();
        this.addReplayButton();
        this.addMusicButton();
        this.addSoundButton();
        this.addLevelScore();
        this.updateLevelScore();
        this.addVersion();
        this.addPlayLevels();
    },

    addLogo: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var logo = cc.Sprite.create(res.logo);
        logo.setPosition(cc.p(pos.x * 0.5, pos.y - 155));
        logo.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.scaleTo(.5, 1.01).easing(cc.easeSineInOut()),
                    cc.scaleTo(.5, .99).easing(cc.easeSineInOut())
                )
            )
        );
        this.addChild(logo);
    },

    addExit: function () {
        var buttonExit7 = Button.create(
            {
                strPicFile: res.exit,
                keyScan: [cc.KEY.num7, cc.KEY["7"]],
                callbackDown:
                    function () {
                        this.onExitPress();
                    }.bind(this)
            }
        );
        buttonExit7.setPosition(cc.p(42, SplashInterface.BUTTON_Y));
        this.addChild(buttonExit7);
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

    onExitPress: function () {
        cc.director.end();
        Globals.redirectExit();
    },

    addInfo: function () {
        var buttonInfo8 = Button.create(
            {
                strPicFile: res.info,
                keyScan: cc.KEY.num8,
                callbackDown:
                    function () {
                        Overlays.getInstance().changeOverlay(OverlaysStates.OVER_INFO, { endless: false }, function (overlayCreated) { });
                    }.bind(this)
            });
        buttonInfo8.setPosition(cc.p(119, SplashInterface.BUTTON_Y));
        this.addChild(buttonInfo8);
    },

    addPlayLevels: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var buttonPlay = Button.create(
            {
                strPicFile: res.play,
                keyScan: [cc.KEY.num5, cc.KEY['5']],
                callbackDown:
                    function () {
                        Sound.getInstance().playMusic(res.snd_gamemusic);//temporary Chrome workaround due to changed behaviour TODO: fix music context startup
                        Overlays.getInstance().changeOverlay(OverlaysStates.OVER_GAME, { endless: false }, function (overlayCreated) { });
                    }.bind(this)
            }
        );
        buttonPlay.setPosition(cc.p(pos.x * 0.5, pos.y - 425));
        this.addChild(buttonPlay);
    },

    addReplayButton: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var buttonReplay = Button.create(
            {
                strPicFile: res.replay,
                keyScan: [cc.KEY.num0, cc.KEY['0']],
                callbackDown:
                    function () {
                        Manager.reset();
                        this.updateLevelScore();
                    }.bind(this)
            }
        );
        this.addChild(buttonReplay);
        buttonReplay.setPosition(cc.p(pos.x - 196, SplashInterface.BUTTON_Y));        
    },
  
    addMusicButton: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var buttonSoundOnOff = Button.create(
            {
                strPicFile: res.music_off,
                strPicFileOff: res.music_on,
                keyScan: [cc.KEY.num1, cc.KEY['1']],
                callbackDown:
                    function (on) {
                        Sound.getInstance().enableMusic(on == false);
                    }.bind(this)
            }
        );
        this.addChild(buttonSoundOnOff);
        buttonSoundOnOff.setPosition(cc.p(pos.x - 119, SplashInterface.BUTTON_Y));
        buttonSoundOnOff.setOn(Sound.getInstance().isSoundEnabled() == false);
    },

    addSoundButton: function () {
        var pos = cc.pFromSize(this.getContentSize());
        var buttonSoundOnOff = Button.create(
            {
                strPicFile: res.sound_off,
                strPicFileOff: res.sound_on,
                keyScan: [cc.KEY.num3, cc.KEY['3']],
                callbackDown:
                    function (on) {
                        Sound.getInstance().enableSound(on == false);
                    }.bind(this)
            }
        );
        this.addChild(buttonSoundOnOff);
        buttonSoundOnOff.setPosition(cc.p(pos.x - 42, SplashInterface.BUTTON_Y));
        buttonSoundOnOff.setOn(Sound.getInstance().isSoundEnabled() == false);
    },

    addVersion: function () {

        var pos = cc.pFromSize(this.getContentSize());
        //var label = cc.LabelTTF.create("v 1.0.0(0)", getFontNamePlatform(res.fontFoo), 20, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        var label = new cc.LabelBMFont("v 1.0.0(0)", res.fooFNT);
        label.setScale(20/Globals.FONT_SIZE_FACTOR);
        label.setPosition(cc.p(pos.x - 60, pos.y - 30));
        this.addChild(label);
    },

    addLevelScore: function() {
        var pos = cc.pFromSize(this.getContentSize());
        //this._levelScore = cc.LabelTTF.create("", getFontNamePlatform(res.fontFoo), 30, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        this._levelScore = new cc.LabelBMFont("", res.fooFNT, 0, cc.TEXT_ALIGNMENT_CENTER);
        this._levelScore.setScale(30/Globals.FONT_SIZE_FACTOR);
        this._levelScore.setPosition(cc.p(pos.x*.5, 55));
        this._levelScore.setColor(Globals.TEXT_COLOR);
        this.addChild(this._levelScore);
    },

    updateLevelScore: function() {
        var save = Manager.PROGRESS;
        var string = "LEVEL " + save.levels.level + "\nSCORE " +  save.levels.score;        
        this._levelScore.setString(string);
    }


});

SplashInterface.PANEL_TIME = .3;
SplashInterface.LOGO_ANGLE = 5;
SplashInterface.LOGO_ROTATE_TIME = 1.;
SplashInterface.BUTTON_Y = 43;

SplashInterface.create = function (params) {
    var instance = new SplashInterface();
    instance.init(params);
    return instance;
};
