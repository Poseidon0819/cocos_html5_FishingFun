//code version 1
function Sound() {

    if (arguments.callee.instance) {
        return arguments.callee.instance;
    }
    arguments.callee.instance = this;

    m_bSoundEnabled = true;
    m_bMusicEnabled = true;
    m_bMute = false;

    m_strMusicLast = '';

    this.init = function () {
        var settings = Settings.load();
        m_bSoundEnabled = settings.sound;
        m_bMusicEnabled = settings.music;
        m_bMute = false;
        this.preloadSound();
        cc.audioEngine.setMusicVolume(0.15);
        cc.audioEngine.setEffectsVolume(0.4);
    };

    this.playMusic = function (strMusic) {
        if (m_bMusicEnabled && m_bMute == false) {
            if (m_strMusicLast == strMusic && cc.audioEngine.isMusicPlaying()) {
                return;
            }
            cc.audioEngine.playMusic(strMusic, true);
        }
        m_strMusicLast = strMusic;
    };

    this.playSound = function (strSound, loop) {
        if (m_bSoundEnabled && m_bMute == false) {
            return cc.audioEngine.playEffect(strSound, loop);
        }
        return null;
    };

    this.stopSound = function (soundId) {
        cc.audioEngine.stopEffect(soundId);
    },

        this.pauseSound = function (soundId) {
            cc.audioEngine.pauseEffect(soundId);
        },

        this.resumeSound = function (soundId) {
            cc.audioEngine.resumeEffect(soundId);
        },

        this.isSoundEnabled = function () {

            return m_bSoundEnabled;
        };

    this.isMusicEnabled = function () {

        return m_bMusicEnabled;
    };

    this.enableSound = function (bEnabled) {

        m_bSoundEnabled = bEnabled;

        var settings = Settings.load();
        settings.sound = m_bSoundEnabled;
        Settings.save(settings);
    };

    this.enableMusic = function (bEnabled) {
        if (m_bMusicEnabled == true) {
            if (bEnabled == false) {
                cc.audioEngine.stopMusic();
            }
        }
        else {
            if (bEnabled == true && m_bMute == false) {
                if (m_strMusicLast != '') {
                    cc.audioEngine.playMusic(m_strMusicLast, true);
                }
            }
        }
        m_bMusicEnabled = bEnabled;
        var settings = Settings.load();
        settings.music = m_bMusicEnabled;
        Settings.save(settings);
    };

    this.mute = function (bTrue) {
        if (m_bMusicEnabled == true) {
            if (bTrue) {
                cc.audioEngine.stopMusic();
            } else {
                if (m_strMusicLast != '') {
                    cc.audioEngine.playMusic(m_strMusicLast, true);
                }
            }
        }
        m_bMute = bTrue;
    };

    this.preloadSound = function () {
        for (var i in res) {
            if (res[i].indexOf(".mp3") != -1 && res[i].indexOf("gamemusic") == -1) {
                cc.audioEngine.preloadEffect(res[i]);
            }
        }
    }

};

Sound.getInstance = function () {

    var singletonClass = new Sound();
    return singletonClass;

};
