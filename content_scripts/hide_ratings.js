(function () {
  if (window.hasRun) {
    return;
  }

  window.hasRun = true;

  browser.runtime.onMessage.addListener((message) => {
    updateElementVisibility(
      message.type === "RATING" ? "ratings-histogram-chart" : "film-reviews",
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
  waitForElement("ratings-histogram-chart").then(() => {
    browser.storage.local.get("RATING").then(({ RATING }) => {
      updateElementVisibility("ratings-histogram-chart", RATING);
    });
  }),
  waitForElement("film-recent-reviews").then(() => {
    browser.storage.local.get("REVIEW").then(({ REVIEW }) => {
      updateElementVisibility("film-recent-reviews", REVIEW);
    });
  }),
]);
