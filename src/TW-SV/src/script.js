var TWSV = {
    SCRIPT_NAME: 'TW Skip the Video',
};

TWSV.run = function () {
    CinemaWindow.controller = TWSV.controller;
};

TWSV.stop = function () {
    CinemaWindow.controller = TWSV.controller_backup;
};

TWSV.init = function () {
    TWSV.controller_backup = CinemaWindow.controller;
    TWSV.controller = function (key) {
        /*  $('#cinema-canvas > *', CinemaWindow.DOM).css('display', 'none');
        unlockWindow();
        if (videoLimiter < 1) return provider.showEmptyCanvas(); */
        $('#cinema-canvas > *', CinemaWindow.DOM).css('display', 'none');
        CinemaWindow.window.removeClass('nocloseall');
        CinemaWindow.window.removeClass('nominimize');
        CinemaWindow.window.removeClass('noreload');
        CinemaWindow.window.dontCloseAll = false;

        switch (key) {
            case 'start':
                return TWSV.controller_backup('start');
            case 'video':
                return TWSV.controller_backup('rewards');
            case 'rewards':
                return TWSV.controller_backup('rewards');
            case 'noVideo':
                return TWSV.controller_backup('noVideo');
            default:
                return TWSV.controller_backup();
        }
    };
};
