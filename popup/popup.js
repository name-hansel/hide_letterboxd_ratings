function listenForSettingChange() {
  const ratingRadios = document.querySelectorAll('input[name="ratings"]');
  const reviewRadios = document.querySelectorAll('input[name="reviews"]');

  ratingRadios.forEach((radio) => {
    radio.addEventListener("change", (event) => {
      if (event.target.checked) {
        browser.tabs
          .query({ active: true, currentWindow: true })
          .then((tabs) => {
            updateVisibility(tabs, "RATING", event.target.value === "yes");
          })
          .catch(reportScriptError);

        // setValueInStorage("RATING", event.target.value);
      }
    });
  });

  reviewRadios.forEach((radio) => {
    radio.addEventListener("change", (event) => {
      if (event.target.checked) {
        browser.tabs
          .query({ active: true, currentWindow: true })
          .then((tabs) => {
            updateVisibility(tabs, "REVIEW", event.target.value === "yes");
          })
          .catch(reportScriptError);

        // setValueInStorage("REVIEW", event.target.value);
      }
    });
  });

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
}

function reportScriptError(error) {
  console.error(error.message);
}

// document.addEventListener("DOMContentLoaded", async () => {
//   const rating = await browser.storage.managed.get("RATING");
//   const review = await browser.storage.managed.get("REVIEW");
// });

// async function setValueInStorage(type, value) {
//   await browser.storage.sync.set({
//     [type]: value,
//   });
// }

browser.tabs
  .executeScript({
    file: "/content_scripts/hide_ratings.js",
  })
  .then(listenForSettingChange)
  .catch(reportScriptError);
