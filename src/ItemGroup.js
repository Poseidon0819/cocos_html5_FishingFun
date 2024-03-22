var ItemGroup = cc.Layer.extend({

    init: function (params) {
        this.setCascadeOpacityEnabled(true);
        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setContentSize(cc.size(ItemGroup.SIZE_X, ItemGroup.SIZE_Y))
        Fish.cacheTexture();
        this.addItems(this.getDesc());
    },

    addItems: function (items) {
        var length = items.length;
        for (var i = 0; i < length; i++) {
            var col = i % ItemGroup.COLS;
            var row = Math.floor(i / ItemGroup.COLS);
            var item = this.addItem(items[i]);
            var size = item.getContentSize();
            item.setPosition(cc.p(size.width * .5 + col * ItemGroup.HORZ_SPACE, ItemGroup.SIZE_Y - size.height * .5 - row * ItemGroup.VERT_SPACE));
        }
    },

    addItem: function (itemDesc) {
        var item = ItemInfo.create(itemDesc);
        this.addChild(item);
        return item;
    },

    getDesc: function () {
        var items = [];
        Pool.AVAILABLE_FISH.forEach(
            function (s) {
                var d = [];
                Database.getCellString("points", "id", s, "points", d);
                items.push({ id: s, payload: "score", amount: d[0], data: Fish[s] })
            }
        );
        Pool.AVAILABLE_BONUS.forEach(
            function (s) {
                var d = [];
                Database.getTableRowByValue("bonus", "type", s, d);
                if (s.indexOf("GIFT") != -1) {
                    s = "GIFT";
                }
                items.push({ id: s, payload: d[0][1], amount: parseInt(d[0][2]), data: Bonus[s] })
            }
        );
        return items;
    }

});

ItemGroup.COLS = 4;
ItemGroup.HORZ_SPACE = 280;
ItemGroup.VERT_SPACE = 90;
ItemGroup.SIZE_X = 1106;
ItemGroup.SIZE_Y = 440;


ItemGroup.create = function (params) {
    var instance = new ItemGroup();
    instance.init(params);
    return instance;
};
