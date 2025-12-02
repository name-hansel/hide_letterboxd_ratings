(function () {
  if (window.hasRun) {
    return;
  }

  window.hasRun = true;

  function updateElementVisibility(elementClassName, show) {
    document.querySelectorAll(`.${elementClassName}`).forEach((element) => {
      element.style.display = show ? "" : "none";
    });
  }

  browser.runtime.onMessage.addListener((message) => {
    updateElementVisibility(
      message.type === "RATING" ? "ratings-histogram-chart" : "film-reviews",
      message.show
    );
  });
})();
