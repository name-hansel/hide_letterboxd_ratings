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
}

browser.runtime.onMessage.addListener(updatePageVisibility);