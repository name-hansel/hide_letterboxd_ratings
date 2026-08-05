function visibilityUpdate() {
    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        if (isFilmPage(tabs[0].url)) {
            Settings.getAll().then((settings) => {
                const showLogged = settings[SETTINGS.SHOW_LOGGED.key];

                browser.tabs.sendMessage(tabs[0].id, {
                    REQUEST_TYPE: SETTINGS.RATING.key,
                    REQUEST_HIDE: settings[SETTINGS.RATING.key],
                    REQUEST_SHOW_ONLY_LOGGED: showLogged
                });

                browser.tabs.sendMessage(tabs[0].id, {
                    REQUEST_TYPE: SETTINGS.REVIEW.key,
                    REQUEST_HIDE: settings[SETTINGS.REVIEW.key],
                    REQUEST_SHOW_ONLY_LOGGED: showLogged
                });
            });
        }

    });
}

browser.tabs.onActivated.addListener(visibilityUpdate);