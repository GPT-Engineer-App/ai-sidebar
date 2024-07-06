// In content-script.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getContent") {
      const content = document.body.innerText;
      sendResponse({content: content});
    }
  });