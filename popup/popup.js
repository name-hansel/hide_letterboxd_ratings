const RATING = "RATING";
const REVIEW = "REVIEW";
const CHANGE = "change";

function setupPopup() {
    const ratingCheckbox = document.getElementById("ratings");
    const reviewCheckbox = document.getElementById("reviews");

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
}

function reportScriptError(error) {
    console.error(error.message);
}

function updatePopupFromStorage() {
    browser.storage.local.get(RATING).then((setting) => {
        document.getElementById("ratings").checked = setting.RATING;
    });

    browser.storage.local.get(REVIEW).then((setting) => {
        document.getElementById("reviews").checked = setting.REVIEW;
    });
}

function updateVisibility(tabs, type, show) {
    browser.tabs
        .query({active: true, currentWindow: true})
        .then(() => {
            browser.tabs.sendMessage(tabs[0].id, {
                type, show,
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

updatePopupEditability();
browser.tabs
    .executeScript({
        file: "/content_scripts/hide_ratings.js",
    })
    .then(() => {
        updatePopupFromStorage();
        setupPopup();
    })
    .catch(reportScriptError);
