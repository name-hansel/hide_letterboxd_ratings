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
        // Clear rating and review checkboxes
        let ratingsCheckbox = document.getElementById("ratings");
        ratingsCheckbox.checked = false;
        browser.storage.local.set({
            RATING: false
        });

        let reviewsCheckbox = document.getElementById("reviews");
        reviewsCheckbox.checked = false;
        browser.storage.local.set({
            REVIEW: false
        });

        // Disable / enable rating and review checkboxes
        const showOnlyLoggedChecked = event.target.checked;
        ratingsCheckbox.disabled = showOnlyLoggedChecked;
        reviewsCheckbox.disabled = showOnlyLoggedChecked;

        browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            if (showOnlyLoggedChecked) {
                updateVisibility(tabs, SHOW_LOGGED, null);
            } else {
                updateVisibility(tabs, RESET, null);
            }
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
        let ratingCheckbox = document.getElementById("ratings");
        let reviewsCheckbox = document.getElementById("reviews");

        if (setting.SHOW_LOGGED) {
            document.getElementById("show-logged").checked = setting.SHOW_LOGGED;
            ratingCheckbox.disabled = true;
            reviewsCheckbox.disabled = true;
        } else {
            browser.storage.local.get(RATING).then((setting) => {
                ratingCheckbox.checked = setting.RATING;
            });
            browser.storage.local.get(REVIEW).then((setting) => {
                reviewsCheckbox.checked = setting.REVIEW;
            });
        }
    });
}

function updateVisibility(tabs, type, hide) {
    browser.tabs
        .query({active: true, currentWindow: true})
        .then(() => {
            browser.tabs.sendMessage(tabs[0].id, {
                type, hide
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
