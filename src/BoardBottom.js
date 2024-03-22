var BoardBottom = cc.Sprite.extend({

    _bombs: null,
    _worms: null,

    init: function () {
        this.initWithFile(res.framebottom);
        this.setCascadeOpacityEnabled(true);
        this.addBombs();
        this.addWorms();
    },

    addBombs: function () {
        this._bombs = BoardCounter.create({ label: "BOMBS" });
        this._bombs.setPosition(cc.p(BoardBottom.BOMBS_POS_X, BoardBottom.ITEM_POS_Y));
        this.addChild(this._bombs);
    },

    addWorms: function () {
        this._worms = BoardCounter.create({ label: "WORMS" });
        this._worms.setPosition(cc.p(BoardBottom.WORMS_POS_X, BoardBottom.ITEM_POS_Y));
        this.addChild(this._worms);
    },

    managerUpdate: function (params) {
        switch (params.id) {
            case CallbackID.BOMB_UPDATE:
                this._bombs.setNumber(params.value, true);
                break;
            case CallbackID.WORM_UPDATE:
                this._worms.setNumber(params.value, true);
                break;
        }
    }
});

BoardBottom.BOMBS_POS_X = 85;
BoardBottom.WORMS_POS_X = 300;
BoardBottom.ITEM_POS_Y = 32;

BoardBottom.create = function (params) {
    var instance = new BoardBottom();
    instance.init(params);
    return instance;
};
