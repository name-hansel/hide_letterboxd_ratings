function isWatchElementLoaded(element) {
    if (!element) {
        return false;
    }

    const watchAction = element.innerText.split("\n")[0];
    return watchAction.trim().length > 0;
}

// TODO: Show/hide ratings when user marks movie as Watched / Unwatched on the page

function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (isWatchElementLoaded(element)) {
        callback();
        return;
    }

    const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (isWatchElementLoaded(el)) {
            observer.disconnect();
            callback();
        }
    });

    observer.observe(document.body, {
        childList: true, subtree: true, characterData: true
    });
}

// Update visibility after page loads
if (isFilmReviewPage(window.location)) {
    void updatePageVisibility();
} else {
    waitForElement(".actions-row1", async () => {
        await updatePageVisibility();
    });
}