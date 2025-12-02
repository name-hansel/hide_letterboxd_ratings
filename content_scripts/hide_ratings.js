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

  function showReviews() {
    console.log("SHOW REVIEWS");
  }

  function hideReviews() {
    console.log("HIDE REVIEWS");
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "HIDE_RATINGS") {
      hideRatings();
    } else if (message.command === "SHOW_RATINGS") {
      showRatings();
    } else if (message.command === "HIDE_REVIEWS") {
      hideReviews();
    } else if (message.command === "SHOW_REVIEWS") {
      showReviews();
    }
  });
})();
