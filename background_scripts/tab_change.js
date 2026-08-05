function visibilityUpdate() {
    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        if (isFilmPage(tabs[0].url)) {
            Settings.getAll().then((settings) => {
                const showLogged = settings[SETTINGS.SHOW_LOGGED.key];
                sendVisibilityUpdate(tabs[0].id, settings, SETTINGS.RATING.key, showLogged);
                sendVisibilityUpdate(tabs[0].id, settings, SETTINGS.REVIEW.key, showLogged);
            });
        }

    });
}

const sendVisibilityUpdate = (tabId, settings, key, showLogged) => {
    return browser.tabs.sendMessage(tabId, {
        REQUEST_TYPE: key,
        REQUEST_HIDE: settings[key],
        REQUEST_SHOW_ONLY_LOGGED: showLogged
    });
}

browser.tabs.onActivated.addListener(visibilityUpdate);