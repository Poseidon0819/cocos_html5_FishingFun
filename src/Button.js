//version_code 1
var Button = cc.Layer.extend({

    _labelLetter: null,
    _textWidthLimit: -1,
    _sideSpaceWidth: -1,
    _callbackDown: null,
    _callbackUp: null,
    _button: null,
    //_buttonPressed: null,
    _buttonOff: null,
    _base: null,
    _keyScan: -1,
    _disabled: false,
    _sound: true,

    init: function (params) {
        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setCascadeOpacityEnabled(true);
        this.setCallbacks(params.callbackDown, params.callbackUp);
        this.addBase();
        this.addButton(params.strPicFile);
        //this.addButtonPressed(params.strPicFilePressed)
        this.addButtonOff(params.strPicFileOff);
        this.addLabel(params);
        this.addListeners(params.swallow);
        this.addListenersKey(params.keyScan);
    },

    setCallbacks: function (down, up) {
        this._callbackDown = down;
        this._callbackUp = up;
    },

    addBase: function () {
        this._base = cc.Layer.create();
        this._base.ignoreAnchorPointForPosition(false);
        this._base.setAnchorPoint(cc.p(0.5, 0.5));
        this._base.setCascadeColorEnabled(true);
        this._base.setCascadeOpacityEnabled(true);
        this.addChild(this._base);
    },

    addButton: function (strPicFile) {
        this._button = cc.Sprite.create(strPicFile);
        this.setContentSize(this._button.getContentSize());
        this._base.setContentSize(this._button.getContentSize());
        this._base.setPosition(cc.pMult(cc.pFromSize(this._button.getContentSize()), .5));
        this._button.setCascadeColorEnabled(true);
        this._button.setCascadeOpacityEnabled(true);
        this._button.setPosition(cc.pMult(cc.pFromSize(this._button.getContentSize()), .5));
        this._base.addChild(this._button);
    },

    /*addButtonPressed: function (strPicFilePressed) {
        if (strPicFilePressed) {
            this._buttonPressed = cc.Sprite.create(strPicFilePressed);
            this._buttonPressed.setCascadeColorEnabled(true);
            this._buttonPressed.setCascadeOpacityEnabled(true);
            this._buttonPressed.setOpacity(0);
            this._buttonPressed.setPosition(cc.pMult(cc.pFromSize(this._buttonPressed.getContentSize()), .5));
            this._base.addChild(this._buttonPressed);
        }
    },*/

    addButtonOff: function (strPicFileOff) {
        if (strPicFileOff) {
            this._buttonOff = cc.Sprite.create(strPicFileOff);
            this._buttonOff.setPosition(cc.pMult(cc.pFromSize(this._buttonOff.getContentSize()), .5));
            this._base.addChild(this._buttonOff);
        }
    },

    addLabel: function (params) {
        this._textWidthLimit = params.textWidthLimit;
//        this._labelLetter = cc.LabelTTF.create("  ", getFontNamePlatform(res.fontFoo), params.textSize, cc.size(0, 0), cc.TEXT_ALIGNMENT_LEFT, cc.TEXT_ALIGNMENT_CENTER);
        this._labelLetter = new cc.LabelBMFont("  ", res.fooFNT, 0, cc.TEXT_ALIGNMENT_CENTER);
        //this._labelLetter.setScale(params.textSize/Globals.FONT_SIZE_FACTOR);
        this._sideSpaceWidth = this._labelLetter.getContentSize().width;
        var pos = cc.pMult(cc.pFromSize(this.getContentSize()), .5);
        if (params.textCoordX != -1) {
            pos.x = params.textCoordX;
        }
        if (params.textCoordY != -1) {
            pos.y = params.textCoordY;
        }
        this._labelLetter.setPosition(pos);
        this._labelLetter.setColor(params.textColor ? params.textColor : cc.color.BLACK);
        if (params.textColorStroke) {
            this._labelLetter.enableStroke(params.textColorStroke, 5)
        }
        this._button.addChild(this._labelLetter);
    },

    addListeners: function (swallow) {
        var eventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE
        });
        eventListener.setSwallowTouches(!!swallow);
        eventListener.onTouchBegan =
            function (touch, event) {
                if (this._disabled == true) {
                    return false;
                }
                var rect = this.getBoundingBox();
                var leftMin = cc.p(rect.x, rect.y);
                var rightMax = cc.p(rect.x + rect.width, rect.y + rect.height);
                leftMin = this.getParent().convertToWorldSpace(leftMin);
                rightMax = this.getParent().convertToWorldSpace(rightMax);
                rect = cc.rect(leftMin.x, leftMin.y, rightMax.x - leftMin.x, rightMax.y - leftMin.y);
                if (cc.rectContainsPoint(rect, touch.getLocation())) {
                    this.onButtonActivated();
                    return true;
                }
                return false;
            }.bind(this);
        eventListener.onTouchEnded =
            function (touch, event) {
                this.onButtonDeactivated();
            }.bind(this);
        cc.eventManager.addListener(eventListener, this);
    },

    addListenersKey: function (keyScan) {
        if (keyScan && keyScan.length != 0) {
            this._keyScan = keyScan;
            var keyboardListener = cc.EventListener.create({
                event: cc.EventListener.KEYBOARD
            });
            keyboardListener.onKeyPressed =
                function (keyCode, event) {
                    if (this._keyScan.indexOf(keyCode) != -1) {
                        this.onButtonActivated();
                    }
                }.bind(this);
            keyboardListener.onKeyReleased =
                function (keyCode, event) {
                    if (this._keyScan.indexOf(keyCode) != -1) {
                        this.onButtonDeactivated();
                    }
                }.bind(this);
            cc.eventManager.addListener(keyboardListener, this);
        }
    },

    rotateText: function () {
        this._labelLetter.setRotation(90);
    },

    setText: function (text) {
        this._labelLetter.setUserData(text);
        this._labelLetter.runAction(
            cc.sequence(
                cc.fadeOut(.1),
                cc.callFunc(
                    function () {
                        this._labelLetter.setString(" " + this._labelLetter.getUserData() + " ");
                        if (this._textWidthLimit != -1) {
                            var labelSizeWidth = this._labelLetter.getContentSize().width - this._sideSpaceWidth;
                            if (labelSizeWidth > this._textWidthLimit) {
                                this._labelLetter.setScale(this._textWidthLimit / labelSizeWidth);
                            }
                        }
                    }.bind(this)
                ),
                cc.fadeIn(.1)
            )
        );
    },

    getbase: function (node) {
        return this._base;
    },

    setOn: function (bMode) {
        if (this._buttonOff) {
            if (bMode == false) {
                this._buttonOff.setVisible(true);
                this._button.setVisible(false);
            }
            else {
                this._button.setVisible(true);
                this._buttonOff.setVisible(false);
            }
        }
    },

    onButtonActivated: function () {
        if (this._sound) {
            Sound.getInstance().playSound(res.snd_button);
        }
        this._callbackDown(!this._button.isVisible());
        if (this._base.getNumberOfRunningActions() != 0) {
            this._base.stopAllActions();
        }
        if (/*this._buttonPressed == null*/1) {
            this._base.runAction(
                cc.sequence(
                    cc.spawn(
                        cc.scaleTo(0.1, .92),
                        cc.tintTo(0.1, 210, 210, 210)
                    )
                )
            );
        }/* else {
            this._button.setOpacity(0);
            this._buttonPressed.setOpacity(255);
            this._buttonPressed.runAction(
                cc.sequence(
                    cc.delayTime(0.3),
                    cc.callFunc(
                        function () {
                            this._button.setOpacity(255);
                            this._buttonPressed.setOpacity(0);
                            if (this._buttonOff) {//2 mode
                                if (this._button.isVisible()) {
                                    this.setOn(false);
                                } else {
                                    this.setOn(true);
                                }
                            }
                        }.bind(this)
                    ),
                    cc.callFunc(
                        function () {
                            this._callbackDown(this._button.isVisible());
                        }.bind(this)
                    )
                )
            );
        }*/
    },

    onButtonDeactivated: function () {
        if (this._callbackUp) {
            this._callbackUp();
        }
        if (this._base.getNumberOfRunningActions() != 0) {
            this._base.stopAllActions();
        }
        if (1/*this._buttonPressed == null*/) {
            this._base.runAction(
                cc.sequence(
                    cc.callFunc(
                        function () {
                            this._button.setOpacity(255);
                            //this._buttonPressed.setOpacity(0);
                            if (this._buttonOff) {//2 mode
                                if (this._button.isVisible()) {
                                    this.setOn(false);
                                }
                                else {
                                    this.setOn(true);
                                }
                            }
                        }.bind(this)
                    ),
                    cc.spawn(
                        cc.scaleTo(0.1, 1.),
                        cc.tintTo(0.1, 255, 255, 255)
                    )
                )
            );
        } /*else {
            this._button.setOpacity(0);
            this._buttonPressed.setOpacity(255);
            this._buttonPressed.runAction(
                cc.sequence(
                    cc.delayTime(0.3),
                    cc.callFunc(
                        function () {
                            this._button.setOpacity(255);
                            this._buttonPressed.setOpacity(0);
                            if (this._buttonOff) {//2 mode
                                if (this._button.isVisible()) {
                                    this.setOn(false);
                                }
                                else {
                                    this.setOn(true);
                                }
                            }
                        }.bind(this)),
                    cc.callFunc(
                        function () {
                            this._callbackDown(this._button.isVisible());
                        }.bind(this)
                    )
                )
            );
        }*/
    },

    disableTap: function () {
        this._disabled = true;
    },

    disableSound: function() {
        this._sound = false;
    }

});


/*fillParams: function(params) {
    this.strPicFile = "";
    this.strPicFilePressed = "";
    this.strPicFileOff = "";
    this.textSize = 18;
    this._textWidthLimit = -1;
    this.textColorStroke = null;
    this.textCoordX = -1;
    this.textCoordY = -1;
    this._callbackDown = null;
    this._keyScan = -1;
},*/

Button.create = function (param) {
    var layer = new Button();
    layer.init(param);
    return layer;
};
