var BoardCounter = BoardItem.extend({

    _counter: null,

    init: function (params) {
        BoardItem.prototype.init.call(this, params);
        this.setCascadeOpacityEnabled(true);
        this.addCounter();
    },

    addCounter: function () {
        var xLeft = cc.rectGetMaxX(this._label.getBoundingBox());
        var xRight = cc.rectGetMaxX(this.getBoundingBox());
        this._counter = Counter.create();
        this._counter.setPosition(cc.p(xLeft + (xRight - xLeft) * .5, BoardCounter.POS_Y));
        this.addChild(this._counter);
    },

    setNumber: function (num, anim) {
        this._counter.setNumber(num, anim);
    }
});

BoardCounter.POS_Y = 11;

BoardCounter.create = function (params) {
    var instance = new BoardCounter();
    instance.init(params);
    return instance;
};
