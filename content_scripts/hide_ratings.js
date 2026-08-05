function updateElementVisibility(elementClassName, hide) {
    document.querySelectorAll(`.${elementClassName}`).forEach((element) => {
        element.style.display = hide ? "none" : "";
    });
}

function updatePageVisibility(request, sender, sendResponse) {
    const hide = shouldHide(request[MESSAGE.HIDE], request[MESSAGE.SHOW_LOGGED] === true);

    if (request[MESSAGE.KEY] === SETTINGS.RATING.key) {
        updateElementVisibility(SETTINGS.RATING.className, hide);
    }

    if (request[MESSAGE.KEY] === SETTINGS.REVIEW.key) {
        updateElementVisibility(SETTINGS.REVIEW.className, hide);
    }
}

browser.runtime.onMessage.addListener(updatePageVisibility);