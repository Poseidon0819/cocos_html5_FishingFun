var BoardTime = BoardItem.extend({

    _timer: null,

    init: function (params) {
        BoardItem.prototype.init.call(this, params);
        this.setCascadeOpacityEnabled(true);
        this.addTimer(params.callbackManager);
    },

    addTimer: function (callbackManager) {
        var xLeft = cc.rectGetMaxX(this._label.getBoundingBox());
        var xRight = cc.rectGetMaxX(this.getBoundingBox());
        this._timer = Timer.create(
            {
                callbackUpdate: function(seconds) {
                    callbackManager(
                        {
                            id: CallbackID.TIME_UPDATE,
                            value: seconds
                        }
                    )
                }
            }
        );
        this._timer.setPosition(cc.p(xLeft + (xRight - xLeft) * .5, BoardTime.POS_Y));
        this.addChild(this._timer);
    },

    setSeconds: function (sec) {
        this._timer.setSeconds(sec);
    }

});

BoardTime.POS_Y = 14;

BoardTime.create = function (params) {
    var instance = new BoardTime();
    instance.init(params);
    return instance;
};
