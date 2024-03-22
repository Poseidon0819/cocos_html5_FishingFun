var Shark = Fish.extend({

    init: function (params) {
        Fish.prototype.init.call(this, params);
    },

    getJawsRect: function () {
        var box = this.getBoundingBox();
        var posWorld = this.getParent().convertToWorldSpace(cc.p(box.x, box.y));
        box.x = posWorld.x;
        box.y = posWorld.y;
        return box;
    },

    checkChew: function (bb) {
        var jrect = this.getJawsRect();
        return cc.rectOverlapsRect(jrect, bb);
    },

    swallow: function(fish) {
        fish.destroyDelayed();
    }

});

Shark.create = function (params) {
    var instance = new Shark();
    instance.init(params);
    return instance;
};