const CHANGE = "change";

function getHideRatingCheckbox() {
    return document.getElementById("hide-ratings-checkbox");
}

function getHideReviewCheckbox() {
    return document.getElementById("hide-reviews-checkbox");
}

function getShowLoggedCheckbox() {
    return document.getElementById("show-logged-checkbox");
}

function setupPopup() {
    const ratingCheckbox = getHideRatingCheckbox();
    const reviewCheckbox = getHideReviewCheckbox();
    const showLoggedCheckbox = getShowLoggedCheckbox();

    ratingCheckbox.addEventListener(CHANGE, (event) => {
        getActiveTab().then((tabs) => {
            const checked = event.target.checked;
            sendVisibilityUpdate(tabs[0].id, SETTINGS.RATING.key, checked, showLoggedCheckbox.checked);
            void Settings.setRating(checked);
            updateShowLoggedCheckbox();
        }).catch(reportScriptError);
    });

    reviewCheckbox.addEventListener(CHANGE, (event) => {
        getActiveTab().then((tabs) => {
            const checked = event.target.checked;
            sendVisibilityUpdate(tabs[0].id, SETTINGS.REVIEW.key, checked, showLoggedCheckbox.checked);
            void Settings.setReview(checked);
            updateShowLoggedCheckbox();
        }).catch(reportScriptError);
    });

    showLoggedCheckbox.addEventListener(CHANGE, (event) => {
        const showOnlyLoggedChecked = event.target.checked;
        const hideRatings = ratingCheckbox.checked;
        const hideReviews = reviewCheckbox.checked;

        getActiveTab().then((tabs) => {
            sendVisibilityUpdate(tabs[0].id, SETTINGS.RATING.key, hideRatings, showOnlyLoggedChecked);
            sendVisibilityUpdate(tabs[0].id, SETTINGS.REVIEW.key, hideReviews, showOnlyLoggedChecked);
        }).catch(reportScriptError);

        void Settings.setShowLogged(showOnlyLoggedChecked);
    })
}

function reportScriptError(error) {
    console.error(error.message);
}

function updatePopupFromStorage() {
    Settings.getAll().then((settings) => {
        getHideRatingCheckbox().checked = settings[SETTINGS.RATING.key];
        getHideReviewCheckbox().checked = settings[SETTINGS.REVIEW.key];
        getShowLoggedCheckbox().checked = settings[SETTINGS.SHOW_LOGGED.key];
    });
}

function updatePopupEditability() {
    getActiveTab().then((tabs) => {
        for (const element of document.getElementsByTagName("input")) {
            element.disabled = !isFilmPage(tabs[0].url);
        }
    });
}

function updateShowLoggedCheckbox() {
    const showLoggedCheckbox = getShowLoggedCheckbox();
    const hideSomething = getHideRatingCheckbox().checked || getHideReviewCheckbox().checked;

    showLoggedCheckbox.disabled = !hideSomething;
    if (!hideSomething) {
        showLoggedCheckbox.checked = false;
        void Settings.setShowLogged(false);
    }
}

browser.tabs
    .executeScript({
        file: "/content_scripts/hide_ratings.js",
    })
    .then(() => {
        setupPopup();
        updatePopupFromStorage();
        updatePopupEditability();
    })
    .catch(reportScriptError);