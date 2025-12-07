(function () {
  if (window.hasRun) {
    return;
  }

  window.hasRun = true;

  browser.runtime.onMessage.addListener((message) => {
    updateElementVisibility(
      message.type === SETTING_RATING.name
        ? SETTING_RATING.className
        : SETTING_REVIEW.className,
      message.show
    );
  });
})();
