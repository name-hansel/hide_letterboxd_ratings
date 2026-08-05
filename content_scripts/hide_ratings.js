REQUEST_HIDE = "hide";
REQUEST_SHOW_ONLY_LOGGED = "showOnlyLogged";
REQUEST_TYPE = "type";

function updateVisibility(elementClassName, hide, showLogged) {
    if (showLogged && isFilmWatched()) {
        hide = false;
    }

    updateElementVisibility(elementClassName, hide);
}

function updateElementVisibility(elementClassName, hide) {
    document.querySelectorAll(`.${elementClassName}`).forEach((element) => {
        element.style.display = hide ? "none" : "";
    });
}

function updatePageVisibility(request, sender, sendResponse) {
    let hide = request.REQUEST_HIDE;
    if (isFilmWatched() && request.REQUEST_SHOW_ONLY_LOGGED) {
        hide = false;
    }

    if (request.REQUEST_TYPE === SETTINGS.RATING.key) {
        updateElementVisibility(SETTINGS.RATING.className, hide);
    }

    if (request.REQUEST_TYPE === SETTINGS.REVIEW.key) {
        updateElementVisibility(SETTINGS.REVIEW.className, hide);
    }
}

browser.runtime.onMessage.addListener(updatePageVisibility);