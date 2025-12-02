(function () {
  if (window.hasRun) {
    return;
  }

  window.hasRun = true;

  function hideRatings() {
    console.log("HIDE RATINGS");
  }

  function showRatings() {
    console.log("SHOW RATINGS");
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "HIDE_RATINGS") {
      hideRatings();
    } else if (message.command === "SHOW_RATINGS") {
      showRatings();
    }
  });
})();
