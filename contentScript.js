let clickedCardData = null;

document.addEventListener("mousedown", function (event) {
  if (event.button == 2) {
    const cardElement = event.target.closest('article.project-card');

    if (cardElement) {
      const { cardId, columnId, contentType, contentId, cardRepo, cardTitle } = cardElement.dataset;

      const repo = cardRepo ? JSON.parse(cardRepo)[0] : undefined;
      const contentNumber = contentType === 'Issue' ? JSON.parse(cardTitle)[1] : undefined;

      clickedCardData = {
        cardId, columnId, contentType, contentId, repo, contentNumber
      }
    }
  }
}, true);

chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
  if (request == "getClickedCardData") {
    sendResponse({ value: clickedCardData });
  }
});
