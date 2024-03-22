var BoardItem = cc.Layer.extend({

    _label : null,

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this.setContentSize(cc.size(BoardItem.WIDTH, BoardItem.HEIGHT));
        this.addLabel(params.label)
    },

    addLabel: function (label) {
        //this._label = cc.LabelTTF.create(label, getFontNamePlatform(res.fontFoo), 32, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        //this._label.setColor(Globals.TEXT_COLOR);
        this._label = new cc.LabelBMFont(label, res.fooFNT, 0, cc.TEXT_ALIGNMENT_CENTER);
        this._label.setScale(32/Globals.FONT_SIZE_FACTOR);
        this._label.setColor(Globals.TEXT_COLOR);
        this._label.setPosition(cc.p(0, BoardItem.LABEL_Y))
        this._label.setAnchorPoint(cc.p(0, .5));
        this.addChild(this._label);
    }
});

BoardItem.WIDTH = 210;
BoardItem.HEIGHT = 30;
BoardItem.LABEL_Y = 12;

BoardItem.create = function (params) {
    var instance = new BoardItem();
    instance.init(params);
    return instance;
};
