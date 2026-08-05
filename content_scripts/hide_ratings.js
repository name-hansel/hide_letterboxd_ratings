function updateElementVisibility(elementClassName, hide) {
    document.querySelectorAll(`.${elementClassName}`).forEach((element) => {
        element.style.display = hide ? "none" : "";
    });
}

function updatePageVisibility(request, sender, sendResponse) {
    const hide = shouldHide(request[MESSAGE.HIDE], request[MESSAGE.SHOW_LOGGED] === true);

    const setting = Object.values(SETTINGS)
        .find(s => s.key === request[MESSAGE.KEY]);

    if (!setting?.className) {
        return;
    }

    updateElementVisibility(setting.className, hide);
}

browser.runtime.onMessage.addListener(updatePageVisibility);