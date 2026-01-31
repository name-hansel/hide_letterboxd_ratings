function isWatchElementLoaded(element) {
    if (!element) {
        return false;
    }

    return element.innerText.split("\n").length > 0;
}

// TODO: Show/hide ratings when user marks movie as Watched / Unwatched on the page

function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (isWatchElementLoaded(element)) {
        callback();
        return;
    }

    const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (isWatchElementLoaded(el)) {
            observer.disconnect();
            callback();
        }
    });

    observer.observe(document.body, {
        childList: true, subtree: true, characterData: true
    });
}

function isFilmNotWatched() {
    const action = document.querySelector(".actions-row1");
    return action.innerText.split("\n")[0] === "Watch";
}

waitForElement(".actions-row1", () => {
    browser.storage.local.get(SETTING_SHOW_LOGGED.name).then(({SHOW_LOGGED}) => {
        browser.storage.local.get(SETTING_RATING.name).then(({RATING}) => {
            updateElementVisibility(SETTING_RATING.className, RATING, SHOW_LOGGED);
        });

        browser.storage.local.get(SETTING_REVIEW.name).then(({REVIEW}) => {
            updateElementVisibility(SETTING_REVIEW.className, REVIEW, SHOW_LOGGED);
        });
    });
});