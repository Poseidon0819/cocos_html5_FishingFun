function Settings() {

};

Settings.load = function () {
    var ls = cc.sys.localStorage;
    var data = ls.getItem('fishingfun_settings');
    var settings = null;
    if (data != null) {
        settings = JSON.parse(data);
    } else {
        settings = Settings.fillDefaults();
    }
    return settings;
};

Settings.save = function (settings) {
    var ls = cc.sys.localStorage;
    ls.setItem('fishingfun_settings', JSON.stringify(settings));
};

Settings.fillDefaults = function () {
    var settings = {
        music: true,
        sound: true
    };
    return settings;
};