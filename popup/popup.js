function listenForSettingChange() {
  const ratingRadios = document.querySelectorAll('input[name="ratings"]');
  const reviewRadios = document.querySelectorAll('input[name="reviews"]');

  ratingRadios.forEach((radio) => {
    radio.addEventListener("change", (event) => {
      if (event.target.checked) {
        browser.tabs
          .query({ active: true, currentWindow: true })
          .then((tabs) => {
            updateRatingVisibility(tabs, event.target.value === "yes");
          })
          .catch(reportScriptError);
      }
    });
  });

  reviewRadios.forEach((radio) => {
    radio.addEventListener("change", (event) => {
      if (event.target.checked) {
        browser.tabs
          .query({ active: true, currentWindow: true })
          .then((tabs) => {
            updateReviewVisibility(tabs, event.target.value === "yes");
          })
          .catch(reportScriptError);
      }
    });
  });

  function updateRatingVisibility(tabs, showRating) {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(() => {
        browser.tabs.sendMessage(tabs[0].id, {
          command: showRating ? "SHOW_RATINGS" : "HIDE_RATINGS",
        });
      })
      .catch(reportScriptError);
  }

  function updateReviewVisibility(tabs, showReview) {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(() => {
        browser.tabs.sendMessage(tabs[0].id, {
          command: showReview ? "SHOW_REVIEWS" : "HIDE_REVIEWS",
        });
      })
      .catch(reportScriptError);
  }
}

function reportScriptError(error) {
  console.error(error.message);
}

browser.tabs
  .executeScript({
    file: "/content_scripts/hide_ratings.js",
  })
  .then(listenForSettingChange)
  .catch(reportScriptError);
