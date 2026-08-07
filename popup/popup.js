const CHANGE = "change";

// GETTERS
function getHideRatingCheckbox() {
    return document.getElementById("hide-ratings-checkbox");
}

function getHideReviewCheckbox() {
    return document.getElementById("hide-reviews-checkbox");
}

function getShowLoggedCheckbox() {
    return document.getElementById("show-logged-checkbox");
}

async function setupPopup() {
    const ratingCheckbox = getHideRatingCheckbox();
    const reviewCheckbox = getHideReviewCheckbox();
    const showLoggedCheckbox = getShowLoggedCheckbox();

    ratingCheckbox.addEventListener(CHANGE, async (event) => {
        await Settings.setRating(event.target.checked);
        await updateShowLoggedCheckbox();
        await updateLetterboxdTabs();
    });

    reviewCheckbox.addEventListener(CHANGE, async (event) => {
        await Settings.setReview(event.target.checked);
        await updateShowLoggedCheckbox();
        await updateLetterboxdTabs();
    });

    showLoggedCheckbox.addEventListener(CHANGE, async (event) => {
        await Settings.setShowLogged(event.target.checked);
        await updateLetterboxdTabs();
    });

    await updatePopupFromStorage();
    await updateShowLoggedCheckbox();
}

function reportScriptError(error) {
    console.error(error.message);
}

// Default popup checkboxes from storage
async function updatePopupFromStorage() {
    const settings = await Settings.getAll();

    getHideRatingCheckbox().checked = settings[SETTINGS.RATING.key];
    getHideReviewCheckbox().checked = settings[SETTINGS.REVIEW.key];
    getShowLoggedCheckbox().checked = settings[SETTINGS.SHOW_LOGGED.key];
}

// Update show logged checkbox
async function updateShowLoggedCheckbox() {
    const settings = await Settings.getAll();
    const hideSomething =
        settings[SETTINGS.RATING.key] ||
        settings[SETTINGS.REVIEW.key];

    getShowLoggedCheckbox().disabled = !hideSomething;
    if (!hideSomething) {
        await Settings.setShowLogged(false);
        getShowLoggedCheckbox().checked = false;
    }
}

async function updateLetterboxdTabs() {
    const tabs = await browser.tabs.query({
        url: "*://letterboxd.com/film/*"
    });

    for (const tab of tabs) {
        browser.tabs.sendMessage(tab.id, {
            type: SETTINGS_CHANGED
        }).catch(() => {
        });
    }
}

browser.tabs
    .executeScript({
        file: "/content_scripts/hide_ratings.js",
    })
    .then(async () => {
        await setupPopup();
    })
    .catch(reportScriptError);