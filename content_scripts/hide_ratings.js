function updateElementVisibility(elementClassName, hide) {
    document.querySelectorAll(`.${elementClassName}`).forEach((element) => {
        element.style.display = hide ? "none" : "";
    });
}

async function updatePageVisibility() {
    const settings = await Settings.getAll();
    const showLogged = settings[SETTINGS.SHOW_LOGGED.key];

    updateElementVisibility(SETTINGS.RATING.className, shouldHide(settings[SETTINGS.RATING.key], showLogged));
    updateElementVisibility(SETTINGS.REVIEW.className, shouldHide(settings[SETTINGS.REVIEW.key], showLogged));
}

browser.runtime.onMessage.addListener(async (message) => {
    if (message.type === SETTINGS_CHANGED) {
        await updatePageVisibility();
    }
});