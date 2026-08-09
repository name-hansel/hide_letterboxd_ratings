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

function getReviewsPageInfo() {
    return document.getElementById("reviews-page-info");
}

async function isCurrentPageFilmReviewsPage() {
    const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true
    });

    return tab?.url ? isFilmReviewPage(tab.url) : false;
}

async function setupPopup() {
    const ratingCheckbox = getHideRatingCheckbox();
    const reviewCheckbox = getHideReviewCheckbox();
    const showLoggedCheckbox = getShowLoggedCheckbox();

    ratingCheckbox.disabled = await isCurrentPageFilmReviewsPage();
    ratingCheckbox.addEventListener(CHANGE, async (event) => {
        await Settings.setRating(event.target.checked);
        await updateShowLoggedCheckbox();
        await updateLetterboxdTabs();
    });

    reviewCheckbox.addEventListener(CHANGE, async (event) => {
        // On the reviews page, only short review mode is allowed
        const reviewMode = event.target.checked ? (
            await isCurrentPageFilmReviewsPage() ? REVIEW_MODES.SHORT : REVIEW_MODES.ALL
        ) : null;
        await Settings.setReviewMode(reviewMode);

        await updateReviewMode(reviewMode);
        await updateShowLoggedCheckbox();
        await updateLetterboxdTabs();
    });

    showLoggedCheckbox.addEventListener(CHANGE, async (event) => {
        await Settings.setShowLogged(event.target.checked);
        await updateLetterboxdTabs();
    });

    document.querySelectorAll(
        'input[name="hide-reviews-option"]'
    ).forEach((radio) => {
        radio.addEventListener(CHANGE, async (event) => {
            const isReviewsPage = await isCurrentPageFilmReviewsPage();

            if (isReviewsPage) {
                return;
            }

            await Settings.setReviewMode(event.target.value);
            await updateLetterboxdTabs();
        });
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
    const isCurrentPageReviewsPage = await isCurrentPageFilmReviewsPage();

    getHideRatingCheckbox().checked = settings[SETTINGS.RATING.key] && !isCurrentPageReviewsPage;
    getHideReviewCheckbox().checked = settings[SETTINGS.REVIEW_MODE.key] != null;

    // Show logged checkbox must be disabled and cleared when current page is reviews page
    getShowLoggedCheckbox().checked = settings[SETTINGS.SHOW_LOGGED.key] && !isCurrentPageReviewsPage;
    await updateReviewMode(settings[SETTINGS.REVIEW_MODE.key]);

    getReviewsPageInfo().hidden = !isCurrentPageReviewsPage;
}

// Update review mode in popup from storage
async function updateReviewMode(reviewMode) {
    const radios = document.querySelectorAll(
        'input[name="hide-reviews-option"]'
    );

    const isReviewsPage = await isCurrentPageFilmReviewsPage();

    if (isReviewsPage && reviewMode !== null) {
        reviewMode = REVIEW_MODES.SHORT;
    }

    radios.forEach((radio) => {
        radio.checked = radio.value === reviewMode;

        if (isReviewsPage && reviewMode !== null) {
            radio.disabled = radio.value === REVIEW_MODES.ALL;
        } else {
            radio.disabled = reviewMode === null;
        }
    });
}

// Update show logged checkbox
async function updateShowLoggedCheckbox() {
    const settings = await Settings.getAll();
    const isReviewsPage = await isCurrentPageFilmReviewsPage();

    const hideSomething =
        settings[SETTINGS.RATING.key] ||
        settings[SETTINGS.REVIEW_MODE.key] != null;

    getShowLoggedCheckbox().disabled = !hideSomething || isReviewsPage;

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