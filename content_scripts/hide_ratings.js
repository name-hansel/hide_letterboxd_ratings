function updateElementVisibility(elementClassName, hide) {
    document.querySelectorAll(`.${elementClassName}`).forEach((element) => {
        element.style.display = hide ? "none" : "";
    });
}

function updateReviewVisibility(reviewMode, showLogged) {
    const hideReviews = reviewMode !== null;

    document.querySelectorAll(".js-review").forEach((review) => {
        const reviewItem = review.closest(".listitem");
        const reviewBody = review.querySelector(".js-review-body");

        if (!reviewItem) {
            return;
        }

        // Logged films are always exempt from review hiding
        if (showLogged && isFilmWatched()) {
            reviewItem.style.display = "";
            return;
        }

        if (!hideReviews) {
            reviewItem.style.display = "";
            return;
        }

        if (reviewMode === REVIEW_MODES.ALL) {
            reviewItem.style.display = "none";
            return;
        }

        if (reviewMode === REVIEW_MODES.SHORT) {
            if (!reviewBody) {
                return;
            }

            const hide = shouldHideShortReview(
                reviewBody.textContent,
                MINIMUM_REVIEW_CHARACTER_LENGTH
            );

            reviewItem.style.display = hide ? "none" : "";
        }
    });
}


async function updatePageVisibility() {
    const settings = await Settings.getAll();
    const showLogged = settings[SETTINGS.SHOW_LOGGED.key];

    updateElementVisibility(
        SETTINGS.RATING.className,
        shouldHideRatingOrReviewIfNotLogged(
            settings[SETTINGS.RATING.key],
            showLogged
        )
    );

    const reviewMode = settings[SETTINGS.REVIEW_MODE.key];
    updateReviewVisibility(reviewMode, showLogged);
}

browser.runtime.onMessage.addListener(async (message) => {
    if (message.type === SETTINGS_CHANGED) {
        await updatePageVisibility();
    }
});