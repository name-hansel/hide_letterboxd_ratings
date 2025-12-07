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

// Update visibility for rating and review when rating elements are found
waitForElement(SETTING_RATING.className).then(() => {
    browser.storage.local.get(SETTING_RATING.name).then(({RATING}) => {
        updateElementVisibility(SETTING_RATING.className, RATING);
    });

    browser.storage.local.get(SETTING_REVIEW.name).then(({REVIEW}) => {
        updateElementVisibility(SETTING_REVIEW.className, REVIEW);
    });
})
