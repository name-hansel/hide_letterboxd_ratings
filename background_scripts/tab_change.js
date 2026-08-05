function visibilityUpdate() {
    getActiveTab().then((tab) => {
        if (isFilmPage(tab.url)) {
            Settings.getAll().then((settings) => {
                const showLogged = settings[SETTINGS.SHOW_LOGGED.key];
                sendVisibilityUpdate(tab.id, SETTINGS.RATING.key, settings[SETTINGS.RATING.key], showLogged);
                sendVisibilityUpdate(tab.id, SETTINGS.REVIEW.key, settings[SETTINGS.REVIEW.key], showLogged);
            });
        }
    });
}

browser.tabs.onActivated.addListener(visibilityUpdate);