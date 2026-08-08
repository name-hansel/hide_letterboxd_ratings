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
    }
});

const SETTINGS_CHANGED = "SETTINGS_CHANGED";

function isFilmWatched() {
    const watchLink = document.querySelector("[data-is-watched]");

    if (watchLink) {
        return watchLink.dataset.isWatched === "true";
    }

    const actionText = document.querySelector(".js-user-actions-menu-text")?.innerText;
    return actionText === "You’ve logged this film" ||
        actionText === "You’ve reviewed this film";
}

const shouldHide = (hide, showLogged) => {
    if (!hide) {
        return false;
    }

    if (showLogged && isFilmWatched()) {
        return false;
    }

    return true;
}