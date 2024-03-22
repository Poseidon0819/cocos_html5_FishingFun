var Manager = cc.Class.extend({

    _score: 0,
    _targetScore: 0, //max score in endless mode, target in level mode
    _scoreAtStart: 0,
    _isEndless: true, //level mode or endless mode
    _level: -1, //in the code 0,1,2,....  (1,2,3 in the game)
    _time: -1,
    _bomb: 0,
    _worm: 0,
    _callbackInterface: null,

    init: function (params) {
        this._isEndless = params.endless;
    },

    setInterfaceCallback: function (callback) {
        this._callbackInterface = callback;
    },

    callbackManager: function (params) {
        switch (params.id) {
            case CallbackID.SCORE_UPDATE:
                this.scoreUpdate(params.value);
                break;
            case CallbackID.TIME_UPDATE:
                this._time = params.value;
                this.updateProgress();
                if (this._time == 0) {
                    this.levelFailed();
                }
                break;
            case CallbackID.BONUS_UPDATE:
                this.bonusUpdate(params.value);
                break;
            case CallbackID.WORM_NUM:
                return this._worm;
            case CallbackID.WORM_USED:
                this.wormUpdate(-1);
                break;
            case CallbackID.BOMB_NUM:
                return this._bomb;
            case CallbackID.BOMB_USED:
                this.bombUpdate(-1);
                break;
        }
    },

    start: function () {
        var progress = Manager.PROGRESS;
        var endless = this._isEndless ? "endless" : "levels";
        if (this._isEndless) {
            this._score = progress[endless].score;
            this._scoreAtStart = progress[endless].scoreAtStart;
            this._targetScore = progress[endless].targetScore;
            this._bomb = progress[endless].bomb;
            this._worm = progress[endless].worm;
        } else {
            this._level = progress[endless].level;
            this._score = progress[endless].score;
            this._scoreAtStart = progress[endless].scoreAtStart;
            this._targetScore = progress[endless].targetScore;
            this._time = progress[endless].time;
            this._bomb = progress[endless].bomb;
            this._worm = progress[endless].worm;
        }
        this.startLevel(true);
    },

    startLevel: function (init) {
        if (this._isEndless == false) {
            this._targetScore = Database.getCellInt("levels", "target", this._level);
            this._callbackInterface({ id: CallbackID.LEVEL_UPDATE, value: this._level });
            if (this._time == -1) {
                this._time = Database.getCellInt("levels", "seconds", this._level);
            }
            this._callbackInterface({ id: CallbackID.TIME_UPDATE, value: this._time });
        }
        this._callbackInterface({ id: CallbackID.TARGET_SCORE_UPDATE, value: this._targetScore });
        this._targetScoreAtStart = this._targetScore;
        this._scoreAtStart = this._score;
        this._callbackInterface({ id: CallbackID.SCORE_UPDATE, value: this._score });
        this._worm = Math.max(this._worm, Manager.MIN_WORM);
        this._callbackInterface({ id: CallbackID.WORM_UPDATE, value: this._worm });
        this._bomb = Math.max(this._bomb, Manager.MIN_BOMB);
        this._callbackInterface({ id: CallbackID.BOMB_UPDATE, value: this._bomb });
        this.checkLevelComplete(); //if too much points for current level
    },

    scoreUpdate: function (score) {
        this._score += score;
        this._callbackInterface({ id: CallbackID.SCORE_UPDATE, value: this._score });
        if (this._isEndless == true) {
            this._targetScore = Math.max(this._targetScore, this._score);
            this._callbackInterface({ id: CallbackID.TARGET_SCORE_UPDATE, value: this._targetScore });
        }
        this.updateProgress();
        this.checkLevelComplete();
    },

    bombUpdate: function (amount) {
        this._bomb += amount;
        this._callbackInterface({ id: CallbackID.BOMB_UPDATE, value: this._bomb });
        this.updateProgress();
    },

    wormUpdate: function (amount) {
        this._worm += amount;
        this._callbackInterface({ id: CallbackID.WORM_UPDATE, value: this._worm });
        this.updateProgress();
    },

    timeUpdate: function (seconds) {
        this._time += seconds;
        this._callbackInterface({ id: CallbackID.TIME_UPDATE, value: this._time });
        this.updateProgress();
    },

    bonusUpdate: function (val) {
        if (val.payload == "score") {
            this.scoreUpdate(val.amount);
        } else if (val.payload == "bomb") {
            this.bombUpdate(val.amount);
        } else if (val.payload == "worm") {
            this.wormUpdate(val.amount);
        } else if (val.payload == "time") {
            this.timeUpdate(val.amount);
        }
    },

    checkLevelComplete: function () {
        if (this._isEndless == false && this._score >= this._targetScore) {
            Animations.getInstance().textQueued("LEVEL UP!");
            Sound.getInstance().playSound(res.snd_levelup);
            this._level++;
            if (this.isLastLevel() == true) {
                this.resetLevels();
            } else {
                this.restoreLevelDefaults(true);
            }
            this.updateProgress();
            this.startLevel(false);
            return true;
        }
        return false;
    },

    levelFailed: function () {
        Animations.getInstance().textQueued("TIMES UP!");
        this.restoreLevelDefaults(false);
        this.updateProgress();
        this.startLevel(false);
    },

    showAim: function (callbackContiune) {
        //Modals.getInstance().show('AimPopup', { endless: this._isEndless, callback: callbackContiune }, false, true);
    },

    updateProgress: function () {
        if (this._isEndless == false) {
            Manager.PROGRESS.levels.score = this._score;
            Manager.PROGRESS.levels.scoreAtStart = this._scoreAtStart;
            Manager.PROGRESS.levels.level = this._level;
            Manager.PROGRESS.levels.targetScore = this._targetScore;
            Manager.PROGRESS.levels.time = this._time;
            Manager.PROGRESS.levels.worm = this._worm;
            Manager.PROGRESS.levels.bomb = this._bomb;
        } else {
            Manager.PROGRESS.endless.score = this._score;
            Manager.PROGRESS.endless.scoreAtStart = this._scoreAtStart;
            Manager.PROGRESS.endless.targetScore = this._targetScore;
            Manager.PROGRESS.endless.worm = this._worm;
            Manager.PROGRESS.endless.bomb = this._bomb;
        }
    },

    restoreLevelDefaults: function (isWon) {
        this._time = -1;
        if (isWon == false) {
            if (this._isEndless == false) {
                this._score = this._scoreAtStart;
            } else {
                this._score = 0;
            }
        }
    },

    /*resetLevel: function () {
        this.restoreLevelDefaults(false);
        this.updateProgress();
    },*/

    resetLevels: function () {
        this._scoreAtStart = 0;
        this._score = 0;
        this._callbackInterface({ id: CallbackID.SCORE_UPDATE, value: this._score });
        if (this._isEndless == false) {
            this._targetScore = 0;
            this._callbackInterface({ id: CallbackID.TARGET_SCORE_UPDATE, value: this._targetScore });
            this._level = 0;
            this._callbackInterface({ id: CallbackID.LEVEL_UPDATE, value: this._level });
        }
    },

    isLastLevel: function () {
        if (this._isEndless == false) {
            var levelsNum = Database.getRowsNum("levels");
            if (this._level == levelsNum) {
                return true;
            }
        }
        return false;
    }


});

Manager.MIN_BOMB = 5;
Manager.MIN_WORM = 5;
Manager.PROGRESS = "";

Manager.loadFromFile = function() {
    var ls = cc.sys.localStorage;
    var data = ls.getItem('fishingfun_progress');
    var progress = null;
    if (data != null) {
        progress = JSON.parse(Crypter.cryptoGimmicksUndo(data));
    } else {
        progress = Manager.fillDefaults();
    }
    Manager.PROGRESS = progress;
};

Manager.saveToFile = function () {
    Manager.PROGRESS.time = Math.floor(Date.now() / 1000);
    var ls = cc.sys.localStorage;
    ls.setItem('fishingfun_progress', Crypter.cryptoGimmicksDo(JSON.stringify(Manager.PROGRESS)));
};

Manager.reset = function () {
    Manager.PROGRESS = Manager.fillDefaults();
    Manager.saveToFile();
};

Manager.fillDefaults = function () {
    var progress = {
        endless: {
            score: 0,
            scoreAtStart: 0,
            targetScore: 0,
            worm: -1,
            bomb: -1
        },
        levels: {
            level: 0,
            score: 0,
            scoreAtStart: 0,
            targetScore: 0,
            time: -1,
            worm: -1,
            bomb: -1
        },
        time: 0
    };
    return progress;
};

Manager.create = function (params) {
    var instance = new Manager();
    instance.init(params);
    return instance;
};

