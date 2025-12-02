function listenForSettingChange() {
  const radios = document.querySelectorAll('input[name="show_ratings"]');

  radios.forEach((radio) => {
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
