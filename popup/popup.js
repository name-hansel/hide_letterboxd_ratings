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

    updatePopupFromStorage();
    await updateShowLoggedCheckbox();
}

function reportScriptError(error) {
    console.error(error.message);
}

// Default popup checkboxes from storage
function updatePopupFromStorage() {
    Settings.getAll().then((settings) => {
        getHideRatingCheckbox().checked = settings[SETTINGS.RATING.key];
        getHideReviewCheckbox().checked = settings[SETTINGS.REVIEW.key];
        getShowLoggedCheckbox().checked = settings[SETTINGS.SHOW_LOGGED.key];
    });
}

// Update show logged checkbox
async function updateShowLoggedCheckbox() {
    const hideSomething = await calculateShowLoggedCheckboxEditability();

    getShowLoggedCheckbox().disabled = !hideSomething;
    if (!hideSomething) {
        await Settings.setShowLogged(false);
    }
}

async function calculateShowLoggedCheckboxEditability() {
    const [hideRating, hideReview] = await Promise.all([
        Settings.getRating(),
        Settings.getReview(),
    ]);

    return hideRating || hideReview;
}

async function updateLetterboxdTabs() {
    const tabs = await browser.tabs.query({
        url: "*://letterboxd.com/film/*"
    });

    for (const tab of tabs) {
        browser.tabs.sendMessage(tab.id, {
            type: SETTINGS_CHANGED
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