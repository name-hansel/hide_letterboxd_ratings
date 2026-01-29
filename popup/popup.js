const RATING = "RATING";
const REVIEW = "REVIEW";
const SHOW_LOGGED = "SHOW_LOGGED";
const RESET = "RESET";
const CHANGE = "change";

function setupPopup() {
    const ratingCheckbox = document.getElementById("ratings");
    const reviewCheckbox = document.getElementById("reviews");
    const showLoggedCheckbox = document.getElementById("show-logged");

    ratingCheckbox.addEventListener(CHANGE, (event) => {
        browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            const checked = event.target.checked;
            updateVisibility(tabs, RATING, checked);
            browser.storage.local.set({
                RATING: checked
            })
        }).catch(reportScriptError);
    });

    reviewCheckbox.addEventListener(CHANGE, (event) => {
        browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            const checked = event.target.checked;
            updateVisibility(tabs, REVIEW, checked);
            browser.storage.local.set({
                REVIEW: checked
            })
        }).catch(reportScriptError);
    });

    showLoggedCheckbox.addEventListener(CHANGE, (event) => {
        const showOnlyLoggedChecked = event.target.checked;
        var hideRatings = false;
        var hideReviews = false;

        browser.storage.local.get(RATING).then((setting) => {
            hideRatings = setting.RATING;
        });
        browser.storage.local.get(REVIEW).then((setting) => {
            hideReviews = setting.REVIEW;
        });

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
    browser.storage.local.get(SHOW_LOGGED).then((setting) => {
        document.getElementById("show-logged").checked = setting.SHOW_LOGGED;
    });

    browser.storage.local.get(RATING).then((setting) => {
        document.getElementById("ratings").checked = setting.RATING;
    });
    browser.storage.local.get(REVIEW).then((setting) => {
        document.getElementById("reviews").checked = setting.REVIEW;
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

browser.tabs
    .executeScript({
        file: "/content_scripts/hide_ratings.js",
    })
    .then(() => {
        updatePopupFromStorage();
        setupPopup();
        updatePopupEditability();
    })
    .catch(reportScriptError);
