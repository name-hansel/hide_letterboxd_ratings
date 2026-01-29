function updateElementVisibility(elementClassName, hide) {
    document.querySelectorAll(`.${elementClassName}`).forEach((element) => {
        element.style.display = hide ? "none" : "";
    });
}


function updatePageVisibility(request, sender, sendResponse) {
    const filmNotWatched = isFilmNotWatched();
    const showOnlyLogged = request.showOnlyLogged;

    if (request.type === SETTING_RATING.name) {
        updateElementVisibility(SETTING_RATING.className, request.hide || (filmNotWatched && showOnlyLogged));
    }

    if (request.type === SETTING_REVIEW.name) {
        updateElementVisibility(SETTING_REVIEW.className, request.hide || (filmNotWatched && showOnlyLogged));
    }
}

browser.runtime.onMessage.addListener(updatePageVisibility);