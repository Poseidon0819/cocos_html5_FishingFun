var BoardTop = cc.Sprite.extend({

    _score: null,
    _target: null,
    _level: null,
    _time: null,

    init: function (params) {
        this.initWithFile(res.frametop);
        this.setCascadeOpacityEnabled(true);
        this.addTarget();
        this.addScore();
        this.addLevel();
        this.addTime(params);
    },

    addTarget: function () {
        this._target = BoardCounter.create({ label: "TARGET" });
        this._target.setPosition(cc.p(BoardTop.TARGET_POS_X, BoardTop.ITEM_POS_Y));
        this.addChild(this._target);
    },

    addScore: function () {
        this._score = BoardCounter.create({ label: "SCORE" });
        this._score.setPosition(cc.p(BoardTop.SCORE_POS_X, BoardTop.ITEM_POS_Y));
        this.addChild(this._score);
    },

    addLevel: function () {
        this._level = BoardCounter.create({ label: "LEVEL" });
        this._level.setPosition(cc.p(BoardTop.LEVEL_POS_X, BoardTop.ITEM_POS_Y));
        this.addChild(this._level);
    },

    addTime: function (params) {
        this._time = BoardTime.create(
            { 
                label: "TIME",
                callbackManager: params.callbackManager
            }
        );
        this._time.setPosition(cc.p(BoardTop.TIME_POS_X, BoardTop.ITEM_POS_Y));
        this.addChild(this._time);
    },

    managerUpdate: function (params) {
        switch (params.id) {
            case CallbackID.SCORE_UPDATE:
                this._score.setNumber(params.value, true);
                break;
            case CallbackID.TARGET_SCORE_UPDATE:
                this._target.setNumber(params.value, true);
                break;
            case CallbackID.LEVEL_UPDATE:
                this._level.setNumber(params.value + 1, true);
                break;
            case CallbackID.TIME_UPDATE:
                this._time.setSeconds(params.value);
                break;
        }
    }
});

BoardTop.TARGET_POS_X = 130;
BoardTop.ITEM_POS_Y = 12;
BoardTop.SCORE_POS_X = 350;
BoardTop.LEVEL_POS_X = 570;
BoardTop.TIME_POS_X = 790;

BoardTop.create = function (params) {
    var instance = new BoardTop();
    instance.init(params);
    return instance;
};
