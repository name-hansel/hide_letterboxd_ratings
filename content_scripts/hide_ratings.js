function updateElementVisibility(elementClassName, show) {
    document.querySelectorAll(`.${elementClassName}`).forEach((element) => {
        element.style.display = show ? "none" : "";
    });
}


function updatePageVisibility(request, sender, sendResponse) {
    if (request.type === SETTING_RATING.name) {
        updateElementVisibility(SETTING_RATING.className, request.show);
    }

    if (request.type === SETTING_REVIEW.name) {
        updateElementVisibility(SETTING_REVIEW.className, request.show);
    }

    if (request.type === SETTING_SHOW_LOGGED.name) {
        const showRatingsReviews = isFilmWatched();
        updateElementVisibility(SETTING_RATING.className, !showRatingsReviews);
        updateElementVisibility(SETTING_REVIEW.className, !showRatingsReviews);
    }
}

browser.runtime.onMessage.addListener(updatePageVisibility);