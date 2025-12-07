const SETTING_RATING = {
  name: "RATING",
  className: "ratings-histogram-chart",
};

const SETTING_REVIEW = {
  name: "REVIEW",
  className: "film-recent-reviews",
};

Promise.all([
  waitForElement(SETTING_RATING.className).then(() => {
    browser.storage.local.get(SETTING_RATING.name).then(({ RATING }) => {
      updateElementVisibility(SETTING_RATING.className, RATING);
    });
  }),

  waitForElement(SETTING_REVIEW.className).then(() => {
    browser.storage.local.get(SETTING_REVIEW.name).then(({ REVIEW }) => {
      updateElementVisibility(SETTING_REVIEW.className, REVIEW);
    });
  }),
]);

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

    observer.observe(document.body, { childList: true, subtree: true });
  });
}

function updateElementVisibility(elementClassName, show) {
  document.querySelectorAll(`.${elementClassName}`).forEach((element) => {
    element.style.display = show ? "none" : "";
  });
}
