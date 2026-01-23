function visibilityUpdate() {

    const pattern = "*://letterboxd.com/film/*";
    const regexPattern = new RegExp(`^${pattern.replace(/\./g, "\\.").replace(/\*/g, ".*")}$`);

    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        if (regexPattern.test(tabs[0].url)) {
            browser.storage.local.get("SHOW_LOGGED").then((setting) => {
                if (setting) {
                    browser.tabs.sendMessage(tabs[0].id, {type: "SHOW_LOGGED", hide: null})
                } else {
                    browser.storage.local.get("RATING").then((setting) => {
                        browser.tabs.sendMessage(tabs[0].id, {type: "RATING", hide: setting.RATING});
                    })

                    browser.storage.local.get("REVIEW").then((setting) => {
                        browser.tabs.sendMessage(tabs[0].id, {type: "REVIEW", hide: setting.REVIEW});
                    })
                }
            })
        }
    })
}

browser.tabs.onActivated.addListener(visibilityUpdate);