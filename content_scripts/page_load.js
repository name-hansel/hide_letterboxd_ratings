function isWatchElementLoaded(element) {
    if (!element) {
        return false;
    }

    const watchAction = element.innerText.split("\n")[0];
    return watchAction.trim().length > 0;
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

function isFilmWatched() {
    const action = document.querySelector(".actions-row1");
    return action.innerText.split("\n")[0] !== "Watch";
}

waitForElement(".actions-row1", () => {
    Settings.getAll().then((settings) => {
        const showLogged = settings[SETTINGS.SHOW_LOGGED.key];
        updateVisibility(SETTINGS.RATING.className, settings[SETTINGS.RATING.key], showLogged);
        updateVisibility(SETTINGS.REVIEW.className, settings[SETTINGS.REVIEW.key], showLogged);
    })
});