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
    const action = document.querySelector(".actions-row1");
    return action.innerText.split("\n")[0] !== "Watch";
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