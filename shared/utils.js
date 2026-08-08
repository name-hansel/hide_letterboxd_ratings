const SETTINGS = Object.freeze({
    RATING: {
        key: "RATING",
        className: "ratings-histogram-chart"
    },
    REVIEW: {
        key: "REVIEW",
        className: "film-recent-reviews"
    },
    SHOW_LOGGED: {
        key: "SHOW_LOGGED"
    },
    HIDE_REVIEWS_BELOW: {
        key: "HIDE_REVIEWS_BELOW"
    }
});

const SETTINGS_CHANGED = "SETTINGS_CHANGED";
const MINIMUM_REVIEW_CHARACTER_LENGTH = "100";

function isFilmWatched() {
    const watchLink = document.querySelector("[data-is-watched]");

    if (watchLink) {
        return watchLink.dataset.isWatched === "true";
    }

    const actionText = document.querySelector(".js-user-actions-menu-text")?.innerText;
    return actionText === "You’ve logged this film" ||
        actionText === "You’ve reviewed this film";
}

const shouldHideRatingOrReviewIfNotLogged = (hide, showLogged) => {
    if (!hide) {
        return false;
    }

    if (showLogged && isFilmWatched()) {
        return false;
    }

    return true;
}

const shouldHideShortReview = (reviewText, minimumCharacterLength) => {
    return reviewText.trim().length < minimumCharacterLength;
}