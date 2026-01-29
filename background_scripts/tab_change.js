function visibilityUpdate() {

    const pattern = "*://letterboxd.com/film/*";
    const regexPattern = new RegExp(`^${pattern.replace(/\./g, "\\.").replace(/\*/g, ".*")}$`);

    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        if (regexPattern.test(tabs[0].url)) {
            var showLogged = false;

            browser.storage.local.get("SHOW_LOGGED").then((setting) => {
                showLogged = setting.SHOW_LOGGED;
            });

            browser.storage.local.get("RATING").then((setting) => {
                browser.tabs.sendMessage(tabs[0].id, {type: "RATING", hide: setting.RATING, showLogged});
            });

            browser.storage.local.get("REVIEW").then((setting) => {
                browser.tabs.sendMessage(tabs[0].id, {type: "REVIEW", hide: setting.REVIEW, showLogged});
            });
        }

    });
}

browser.tabs.onActivated.addListener(visibilityUpdate);