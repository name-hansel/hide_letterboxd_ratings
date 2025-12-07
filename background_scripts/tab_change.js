function visibilityUpdate() {
    // TODO Add check - active tab must be letterboxd.com/film
    // TODO Make setting one object
    // TODO refactor this mess

    browser.storage.local.get("RATING").then((setting) => {
        browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {type: "RATING", show: setting.RATING});
        })
    });

    browser.storage.local.get("REVIEW").then((setting) => {
        browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {type: "REVIEW", show: setting.REVIEW});
        })
    });
}

browser.tabs.onActivated.addListener(visibilityUpdate);