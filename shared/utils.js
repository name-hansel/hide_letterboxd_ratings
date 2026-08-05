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

const sendVisibilityUpdate = (tabId, key, hide, showLogged) => {
    return browser.tabs.sendMessage(tabId, {
        [MESSAGE.KEY]: key,
        [MESSAGE.HIDE]: hide,
        [MESSAGE.SHOW_LOGGED]: showLogged
    });
}

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