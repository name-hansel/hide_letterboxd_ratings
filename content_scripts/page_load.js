function isWatchElementLoaded(element) {
    if (!element) {
        return false;
    }

    return element.innerText.split("\n")[0].indexOf("Watch") !== -1;
}

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
        if (SHOW_LOGGED) {
            const hideRatingsReviews = isFilmNotWatched();
            updateElementVisibility(SETTING_RATING.className, hideRatingsReviews);
            updateElementVisibility(SETTING_REVIEW.className, hideRatingsReviews);
        } else {
            browser.storage.local.get(SETTING_RATING.name).then(({RATING}) => {
                updateElementVisibility(SETTING_RATING.className, RATING);
            });

            browser.storage.local.get(SETTING_REVIEW.name).then(({REVIEW}) => {
                updateElementVisibility(SETTING_REVIEW.className, REVIEW);
            });
        }
    });
});
