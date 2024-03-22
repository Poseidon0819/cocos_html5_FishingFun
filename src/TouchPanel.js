var TouchPanel = cc.Layer.extend({

    _dir: 0,
    _middle: 0,
    _rectDirLeft: null,
    _rectDirRight: null,
    _rectMiddle: null,
    _callbackDirLeft: null,
    _callbackDirRight: null,
    _callbackDirUp: null,
    _callbackMiddleDown: null,
    _callbackMiddleUp: null,

    init: function (params) {
        this._callbackDirLeft = params.callbackDirLeft;
        this._callbackDirRight = params.callbackDirRight;
        this._callbackDirUp = params.callbackDirUp;
        this._callbackMiddleDown = params.callbackMiddleDown;
        this._callbackMiddleUp = params.callbackMiddleUp;
        this.calcZones();
        this.addListeners();
    },

    addListeners: function () {
        this.addDirLeftListener();
        this.addDirRightListener();
        this.addMiddleListener();
    },

    addDirLeftListener: function () {
        var eventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE
        });
        eventListener.setSwallowTouches(false);
        eventListener.onTouchBegan =
            function (touch, event) {
                if (cc.rectContainsPoint(this._rectDirLeft, touch.getLocation())) {
                    this.onDirChange(TouchPanel.DIR_LEFT);
                }
                return true;
            }.bind(this);
        eventListener.onTouchMoved =
            function (touch, event) {
                if (cc.rectContainsPoint(this._rectDirLeft, touch.getLocation())) {
                    this.onDirChange(TouchPanel.DIR_LEFT);
                }
            }.bind(this);
        eventListener.onTouchEnded =
            function (touch, event) {
                this.onDirChange(TouchPanel.DIR_STOP);
            }.bind(this);
        cc.eventManager.addListener(eventListener, this);
    },

    addDirRightListener: function () {
        var eventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE
        });
        eventListener.setSwallowTouches(false);
        eventListener.onTouchBegan =
            function (touch, event) {
                if (cc.rectContainsPoint(this._rectDirRight, touch.getLocation())) {
                    if (cc.rectContainsPoint(this._rectDirRight, touch.getLocation())) {
                        this.onDirChange(TouchPanel.DIR_RIGHT);
                    }
                }
                return true;
            }.bind(this);
        eventListener.onTouchMoved =
            function (touch, event) {
                if (cc.rectContainsPoint(this._rectDirRight, touch.getLocation())) {
                    if (cc.rectContainsPoint(this._rectDirRight, touch.getLocation())) {
                        this.onDirChange(TouchPanel.DIR_RIGHT);
                    }
                }
            }.bind(this);
        eventListener.onTouchEnded =
            function (touch, event) {
                this.onDirChange(TouchPanel.DIR_STOP);
            }.bind(this);
        cc.eventManager.addListener(eventListener, this);
    },

    addMiddleListener: function () {
        var eventListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE
        });
        eventListener.setSwallowTouches(false);
        eventListener.onTouchBegan =
            function (touch, event) {
                if (cc.rectContainsPoint(this._rectMiddle, touch.getLocation())) {
                    this.onMiddleChange(TouchPanel.MIDDLE_DOWN);
                }
                return true;
            }.bind(this);
        eventListener.onTouchMoved =
            function (touch, event) {
                if (cc.rectContainsPoint(this._rectMiddle, touch.getLocation())) {
                    this.onMiddleChange(TouchPanel.MIDDLE_DOWN);
                }
            }.bind(this);
        eventListener.onTouchEnded =
            function (touch, event) {
                this.onMiddleChange(TouchPanel.MIDDLE_UP);
            }.bind(this);
        cc.eventManager.addListener(eventListener, this);
    },

    onDirChange: function (dir) {
        if (dir != this._dir) {
            this._dir = dir;
            if (dir == TouchPanel.DIR_LEFT) {
                this._callbackDirLeft();
            } else if (dir == TouchPanel.DIR_RIGHT) {
                this._callbackDirRight();
            } else if (dir == TouchPanel.DIR_STOP) {
                this._callbackDirUp();
            }
        }
    },

    onMiddleChange: function (middle) {
        if (this._middle != middle) {
            this._middle = middle;
            if (middle == TouchPanel.MIDDLE_DOWN) {
                this._callbackMiddleDown();
            } else if (middle == TouchPanel.MIDDLE_UP) {
                this._callbackMiddleUp();
            }
        }
    },

    calcZones: function () {
        var bb = this.getBoundingBox();
        this._rectDirLeft = cc.rect(0, 0, bb.width * .5 - TouchPanel.CENTER_SIDE_WIDTH * .5, bb.height);
        this._rectDirRight = cc.rect(bb.width * .5 + TouchPanel.CENTER_SIDE_WIDTH * .5, 0, bb.width * .5 + TouchPanel.CENTER_SIDE_WIDTH * .5, bb.height);
        this._rectMiddle = cc.rect(bb.width * .5 - TouchPanel.CENTER_SIDE_WIDTH * .5, 0, TouchPanel.CENTER_SIDE_WIDTH, bb.height);
    }



});

TouchPanel.CENTER_SIDE_WIDTH = 300;
TouchPanel.DIR_STOP = 0;
TouchPanel.DIR_LEFT = 1;
TouchPanel.DIR_RIGHT = 2;
TouchPanel.MIDDLE_UP = 0;
TouchPanel.MIDDLE_DOWN = 1;

TouchPanel.create = function (params) {
    var instance = new TouchPanel();
    instance.init(params);
    return instance;
};
