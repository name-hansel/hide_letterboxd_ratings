const RATING = "RATING";
const REVIEW = "REVIEW";
const SETTING = "SETTING";
const YES = "yes";
const CHANGE = "change";

function setupPopup() {
  const ratingRadios = document.querySelectorAll('input[name="ratings"]');
  const reviewRadios = document.querySelectorAll('input[name="reviews"]');

  ratingRadios.forEach((radio) => {
    radio.addEventListener(CHANGE, (event) => {
      if (event.target.checked) {
        browser.tabs
          .query({ active: true, currentWindow: true })
          .then((tabs) => {
            updateVisibility(tabs, RATING, event.target.value === YES);
            browser.storage.local.set({
              RATING: event.target.value === YES,
            });
          })
          .catch(reportScriptError);
      }
    });
  });

  reviewRadios.forEach((radio) => {
    radio.addEventListener(CHANGE, (event) => {
      if (event.target.checked) {
        browser.tabs
          .query({ active: true, currentWindow: true })
          .then((tabs) => {
            updateVisibility(tabs, REVIEW, event.target.value === YES);
            browser.storage.local.set({
              REVIEW: event.target.value === YES,
            });
          })
          .catch(reportScriptError);
      }
    });
  });
}

function reportScriptError(error) {
  console.error(error.message);
}

function updatePopupFromStorage() {
  browser.storage.local.get(RATING).then(({ RATING }) => {
    document.getElementById(
      RATING ? "ratings_yes" : "ratings_no"
    ).checked = true;
  });

  browser.storage.local.get(REVIEW).then(({ REVIEW }) => {
    document.getElementById(
      REVIEW ? "reviews_yes" : "reviews_no"
    ).checked = true;
  });
}

function updateVisibility(tabs, type, show) {
  browser.tabs
    .query({ active: true, currentWindow: true })
    .then(() => {
      browser.tabs.sendMessage(tabs[0].id, {
        type,
        show,
      });
    })
    .catch(reportScriptError);
}

browser.tabs
  .executeScript({
    file: "/content_scripts/hide_ratings.js",
  })
  .then(() => {
    updatePopupFromStorage();
    setupPopup();
  })
  .catch(reportScriptError);
