const RATING = "RATING";
const REVIEW = "REVIEW";
const SHOW_LOGGED = "SHOW_LOGGED";
const CHANGE = "change";

function getHideRatingCheckbox() {
    return document.getElementById("ratings");
}

function getHideReviewCheckbox() {
    return document.getElementById("reviews");
}

function getShowLoggedCheckbox() {
    return document.getElementById("show-logged");
}

function setupPopup() {
    const ratingCheckbox = getHideRatingCheckbox();
    const reviewCheckbox = getHideReviewCheckbox();
    const showLoggedCheckbox = getShowLoggedCheckbox();

    ratingCheckbox.addEventListener(CHANGE, (event) => {
        browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            const checked = event.target.checked;
            updateVisibility(tabs, RATING, checked, showLoggedCheckbox.checked);
            browser.storage.local.set({
                RATING: checked
            })

            updateShowLoggedCheckbox();
        }).catch(reportScriptError);
    });

    reviewCheckbox.addEventListener(CHANGE, (event) => {
        browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            const checked = event.target.checked;
            updateVisibility(tabs, REVIEW, checked, showLoggedCheckbox.checked);
            browser.storage.local.set({
                REVIEW: checked
            })

            updateShowLoggedCheckbox();
        }).catch(reportScriptError);
    });

    showLoggedCheckbox.addEventListener(CHANGE, (event) => {
        const showOnlyLoggedChecked = event.target.checked;
        const hideRatings = ratingCheckbox.checked;
        const hideReviews = reviewCheckbox.checked;

        browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            updateVisibility(tabs, RATING, hideRatings, showOnlyLoggedChecked);
            updateVisibility(tabs, REVIEW, hideReviews, showOnlyLoggedChecked);
        }).catch(reportScriptError);

        browser.storage.local.set({
            SHOW_LOGGED: showOnlyLoggedChecked
        });
    })
}

function reportScriptError(error) {
    console.error(error.message);
}

function updatePopupFromStorage() {
    browser.storage.local.get(RATING).then((setting) => {
        if (!setting.RATING) {
            browser.storage.local.set({
                RATING: false
            });
        }
        getHideRatingCheckbox().checked = setting.RATING;
    });

    browser.storage.local.get(REVIEW).then((setting) => {
        if (!setting.REVIEW) {
            browser.storage.local.set({
                REVIEW: false
            });
        }
        getHideReviewCheckbox().checked = setting.REVIEW;
    });

    browser.storage.local.get(SHOW_LOGGED).then((setting) => {
        if (!setting.SHOW_LOGGED) {
            browser.storage.local.set({
                SHOW_LOGGED: false
            });
        }

        getShowLoggedCheckbox().checked = setting.SHOW_LOGGED;
    });
}

function updateVisibility(tabs, type, hide, showOnlyLogged) {
    browser.tabs
        .query({active: true, currentWindow: true})
        .then(() => {
            browser.tabs.sendMessage(tabs[0].id, {
                type, hide, showOnlyLogged
            });
        })
        .catch(reportScriptError);
}

function updatePopupEditability() {
    const pattern = "*://letterboxd.com/film/*";
    const regexPattern = new RegExp(`^${pattern.replace(/\./g, "\\.").replace(/\*/g, ".*")}$`);

    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        for (const element of document.getElementsByTagName("input")) {
            element.disabled = !regexPattern.test(tabs[0].url);
        }
    });
}

function updateShowLoggedCheckbox() {
    const showLoggedCheckbox = getShowLoggedCheckbox();
    const hideSomething = getHideRatingCheckbox().checked || getHideReviewCheckbox().checked;

    showLoggedCheckbox.disabled = !hideSomething;
    if (!hideSomething) {
        showLoggedCheckbox.checked = false;
        browser.storage.local.set({
            SHOW_LOGGED: false
        });
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