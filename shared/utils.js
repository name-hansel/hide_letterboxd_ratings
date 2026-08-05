const isFilmPage = (url) => {
    return /^https?:\/\/letterboxd\.com\/film\/.*/.test(url);
}

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

const MESSAGE = Object.freeze({
    KEY: "key",
    HIDE: "hide",
    SHOW_LOGGED: "showOnlyLogged"
});