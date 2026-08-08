const SETTINGS = Object.freeze({
    RATING: {
        key: "RATING",
        className: "ratings-histogram-chart"
    },
    REVIEW_MODE: {
        key: "REVIEW_MODE",
        className: "film-recent-reviews"
    },
    SHOW_LOGGED: {
        key: "SHOW_LOGGED"
    }
});

const REVIEW_MODES = Object.freeze({
    ALL: "all",
    SHORT: "short"
});

const SETTINGS_CHANGED = "SETTINGS_CHANGED";
const MINIMUM_REVIEW_CHARACTER_LENGTH = "100";

function isFilmWatched() {
    const actionText = document.querySelector(".js-user-actions-menu-text")?.innerText;
    if (actionText) {
        return actionText === "You’ve logged this film" ||
            actionText === "You’ve reviewed this film";
    }

    const action = document.querySelector(".actions-row1");
    return action.innerText.split("\n")[0] !== "Watch";
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