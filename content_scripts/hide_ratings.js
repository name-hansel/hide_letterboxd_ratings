function updateElementVisibility(elementClassName, hide) {
    document.querySelectorAll(`.${elementClassName}`).forEach((element) => {
        element.style.display = hide ? "none" : "";
    });
}

function updatePageVisibility(request, sender, sendResponse) {
    let hide = request[MESSAGE.HIDE];
    if (isFilmWatched() && request[MESSAGE.SHOW_LOGGED] === true) {
        hide = false;
    }

    if (request[MESSAGE.KEY] === SETTINGS.RATING.key) {
        updateElementVisibility(SETTINGS.RATING.className, hide);
    }

    if (request[MESSAGE.KEY] === SETTINGS.REVIEW.key) {
        updateElementVisibility(SETTINGS.REVIEW.className, hide);
    }
}

browser.runtime.onMessage.addListener(updatePageVisibility);