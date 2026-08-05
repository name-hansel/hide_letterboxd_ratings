function visibilityUpdate() {
    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        if (isFilmPage(tabs[0].url)) {
            Settings.getAll().then((settings) => {
                const showLogged = settings[SETTINGS.SHOW_LOGGED.key];
                sendVisibilityUpdate(tabs[0].id, SETTINGS.RATING.key, settings[SETTINGS.RATING.key], showLogged);
                sendVisibilityUpdate(tabs[0].id, SETTINGS.REVIEW.key, settings[SETTINGS.REVIEW.key], showLogged);
            });
        }
    });
}

browser.tabs.onActivated.addListener(visibilityUpdate);