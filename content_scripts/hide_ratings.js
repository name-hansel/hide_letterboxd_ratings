function updateElementVisibility(elementClassName, hide) {
    document.querySelectorAll(`.${elementClassName}`).forEach((element) => {
        element.style.display = hide ? "none" : "";
    });
}


function updatePageVisibility(request, sender, sendResponse) {
    const filmWatched = !isFilmNotWatched();
    let hide = request.hide;
    if (filmWatched && request.showOnlyLogged) {
        hide = false;
    }

    if (request.type === SETTING_RATING.name) {
        updateElementVisibility(SETTING_RATING.className, hide);
    }

    if (request.type === SETTING_REVIEW.name) {
        updateElementVisibility(SETTING_REVIEW.className, hide);
    }
}

browser.runtime.onMessage.addListener(updatePageVisibility);