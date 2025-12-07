const RATING = {
  name: "RATING",
  className: "ratings-histogram-chart",
};

const REVIEW = {
  name: "REVIEW",
  className: "film-recent-reviews",
};

(function () {
  if (window.hasRun) {
    return;
  }

  window.hasRun = true;

  browser.runtime.onMessage.addListener((message) => {
    updateElementVisibility(
      message.type === RATING.name ? RATING.className : REVIEW.className,
      message.show
    );
  });
})();

function updateElementVisibility(elementClassName, show) {
  document.querySelectorAll(`.${elementClassName}`).forEach((element) => {
    element.style.display = show ? "" : "none";
  });
}

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

Promise.all([
  waitForElement(RATING.className).then(() => {
    browser.storage.local.get(RATING.name).then(({ RATING }) => {
      updateElementVisibility(RATING.className, RATING);
    });
  }),

  waitForElement(REVIEW.className).then(() => {
    browser.storage.local.get(REVIEW.name).then(({ REVIEW }) => {
      updateElementVisibility(REVIEW.className, REVIEW);
    });
  }),
]);
