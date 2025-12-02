(function () {
  if (window.hasRun) {
    return;
  }

  window.hasRun = true;

  function updateRatingsVisibility(showRatings) {
    document.querySelectorAll(".ratings-histogram-chart").forEach((element) => {
      element.style.display = showRatings ? "" : "none";
    });
  }

  function updateReviewsVisibility(showReviews) {
    document.querySelectorAll(".film-reviews").forEach((element) => {
      element.style.display = showReviews ? "" : "none";
    });
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "HIDE_RATINGS") {
      updateRatingsVisibility(false);
    } else if (message.command === "SHOW_RATINGS") {
      updateRatingsVisibility(true);
    } else if (message.command === "HIDE_REVIEWS") {
      updateReviewsVisibility(false);
    } else if (message.command === "SHOW_REVIEWS") {
      updateReviewsVisibility(true);
    }
  });
})();
