const RATING = "RATING";
const REVIEW = "REVIEW";
const SHOW_LOGGED = "SHOW_LOGGED";
const CHANGE = "change";

function setupPopup() {
    const ratingCheckbox = document.getElementById("ratings");
    const reviewCheckbox = document.getElementById("reviews");
    const showLoggedCheckbox = document.getElementById("show-logged");

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
        const hideRatings = document.getElementById("ratings").checked;
        const hideReviews = document.getElementById("reviews").checked;

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

function updateShowLoggedCheckbox() {
    const showLoggedCheckbox = document.getElementById("show-logged");
    const hideAnything = document.getElementById("ratings").checked || document.getElementById("reviews").checked;

    showLoggedCheckbox.disabled = !hideAnything;
    if (!hideAnything) {
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
        updatePopupFromStorage();
        setupPopup();
        updatePopupEditability();
    })
    .catch(reportScriptError);