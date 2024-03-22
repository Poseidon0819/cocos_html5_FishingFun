var RubberController = cc.Class.extend({

    _listeners: null,
    _action: -1,
    _velocity: 0,

    init: function (params) {
        this._listeners = params.listeners;
        cc.director.getScheduler().scheduleUpdateForTarget(this, 0, false);
    },

    destroy: function () {
        cc.director.getScheduler().unscheduleAllCallbacksForTarget(this);
    },

    onKey: function (action) {
        this._action = action;
    },

    adjustSpeed: function (value) {
        this._listeners.forEach(
            function (listener) {
                listener(value);
            }
        );
    },

    update: function (dt) {
        if (this._action == RubberController.ON_KEY_LEFT) {
            this._velocity += dt * RubberController.ACCEL_VELOCITY;
        } else if (this._action == RubberController.ON_KEY_RIGHT) {
            this._velocity -= dt * RubberController.ACCEL_VELOCITY;
        } else if (this._action == RubberController.ON_KEY_RELEASE) {
            if (this._velocity > 0) {
                this._velocity -= dt;
                this._velocity = Math.max(0, this._velocity);
            } else if (this._velocity < 0) {
                this._velocity += dt;
                this._velocity = Math.min(0, this._velocity);
            }
        }
        this._velocity = Math.min(Math.max(-RubberController.MAX_VELOCITY, this._velocity), RubberController.MAX_VELOCITY);
        this.adjustSpeed(this._velocity);
    }

});

RubberController.MAX_VELOCITY = 1;
RubberController.ACCEL_VELOCITY = 2;
RubberController.ON_KEY_UNKNOWN = -1;
RubberController.ON_KEY_LEFT = 0;
RubberController.ON_KEY_RIGHT = 1;
RubberController.ON_KEY_RELEASE = 2;

RubberController.create = function (params) {
    var instance = new RubberController();
    instance.init(params);
    return instance;
};


