function updateElementVisibility(elementClassName, hide) {
    document.querySelectorAll(`.${elementClassName}`).forEach((element) => {
        element.style.display = hide ? "none" : "";
    });
}


function updatePageVisibility(request, sender, sendResponse) {
    if (request.type === SETTING_RATING.name) {
        updateElementVisibility(SETTING_RATING.className, request.hide);
    }

    if (request.type === SETTING_REVIEW.name) {
        updateElementVisibility(SETTING_REVIEW.className, request.hide);
    }

    if (request.type === SETTING_SHOW_LOGGED.name) {
        const hideRatingsReviews = isFilmNotWatched();
        updateElementVisibility(SETTING_RATING.className, hideRatingsReviews);
        updateElementVisibility(SETTING_REVIEW.className, hideRatingsReviews);
    }

    if (request.type === SETTING_RESET.name) {
        updateElementVisibility(SETTING_RATING.className, false);
        updateElementVisibility(SETTING_REVIEW.className, false);
    }
}

browser.runtime.onMessage.addListener(updatePageVisibility);