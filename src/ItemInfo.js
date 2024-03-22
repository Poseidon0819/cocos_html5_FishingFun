var ItemInfo = cc.Sprite.extend({

    init: function (itemDesc) {
        this.initWithFile(res.frameinfo)
        this.setCascadeOpacityEnabled(true);

        this.addIcon(itemDesc);
        this.addDesc(itemDesc);
    },

    addIcon: function (itemDesc) {
        var sprite = cc.Sprite.create(Fish.cachedTexture);
        var i = itemDesc.data;
        sprite.setTextureRect(cc.rect(i.pos.x, i.pos.y, i.size.width, i.size.height));
        sprite.setPosition(cc.p(80, 39));
        var heightLimit = 58;
        var height = sprite.getContentSize().height;        
        sprite.setScale(heightLimit/height);
        this.addChild(sprite);
    },

    addDesc: function (itemDesc) {
//        var label = cc.LabelTTF.create(itemDesc.payload.toUpperCase() + "\n+" + itemDesc.amount, getFontNamePlatform(res.fontFoo), 27, cc.size(0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER);
        var label = new cc.LabelBMFont(itemDesc.payload.toUpperCase() + "\n+" + itemDesc.amount, res.fooFNT, 200, cc.TEXT_ALIGNMENT_CENTER);
        label.setScale(27/Globals.FONT_SIZE_FACTOR);
        label.setPosition(cc.p(172, 37));
        label.setColor(Globals.TEXT_COLOR);
        this.addChild(label);
    }

});

ItemInfo.create = function (params) {
    var instance = new ItemInfo();
    instance.init(params);
    return instance;
};
