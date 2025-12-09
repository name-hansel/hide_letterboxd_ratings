function visibilityUpdate() {
    // TODO Make setting one object
    // TODO refactor this mess

    const pattern = "*://letterboxd.com/film/*";
    const regexPattern = new RegExp(`^${pattern.replace(/\./g, "\\.").replace(/\*/g, ".*")}$`);

    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        if (regexPattern.test(tabs[0].url)) {
            browser.storage.local.get("RATING").then((setting) => {
                browser.tabs.sendMessage(tabs[0].id, {type: "RATING", show: setting.RATING});
            })

            browser.storage.local.get("REVIEW").then((setting) => {
                browser.tabs.sendMessage(tabs[0].id, {type: "REVIEW", show: setting.REVIEW});
            })
        }
    })
}

browser.tabs.onActivated.addListener(visibilityUpdate);