REQUEST_HIDE = "hide";
REQUEST_SHOW_ONLY_LOGGED = "showOnlyLogged";
REQUEST_TYPE = "type";

function updateVisibility(elementClassName, hide, showLogged) {
    if(showLogged && isFilmWatched()) {
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

    if (request.REQUEST_TYPE === SETTING_RATING.name) {
        updateElementVisibility(SETTING_RATING.className, hide);
    }

    if (request.REQUEST_TYPE === SETTING_REVIEW.name) {
        updateElementVisibility(SETTING_REVIEW.className, hide);
    }
}

browser.runtime.onMessage.addListener(updatePageVisibility);