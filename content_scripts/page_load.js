function waitForElement(className) {
    return new Promise((resolve) => {
        if (document.querySelector(`.${className}`)) {
            resolve();
            return;
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(`.${className}`)) {
                observer.disconnect();
                resolve();
            }
        });

        observer.observe(document.body, {childList: true, subtree: true});
    });
}

function isFilmWatched() {
    const action = document.querySelector(".actions-row1");
    return action.innerText.split("\n")[0] !== "Watch";
}

// Update visibility for rating and review when rating elements are found
waitForElement(SETTING_RATING.className).then(() => {
    browser.storage.local.get(SETTING_SHOW_LOGGED.name).then(({SHOW_LOGGED}) => {
        if (SHOW_LOGGED) {
            const showRatingsReviews = isFilmWatched();
            updateElementVisibility(SETTING_RATING.className, showRatingsReviews);
            updateElementVisibility(SETTING_REVIEW.className, showRatingsReviews);
        } else {
            browser.storage.local.get(SETTING_RATING.name).then(({RATING}) => {
                updateElementVisibility(SETTING_RATING.className, RATING);
            });

            browser.storage.local.get(SETTING_REVIEW.name).then(({REVIEW}) => {
                updateElementVisibility(SETTING_REVIEW.className, REVIEW);
            });
        }
    });
})
