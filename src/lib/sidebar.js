// Function to get page content
function getPageContent() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: () => document.body.innerText,
      },
      (results) => {
        if (results && results[0]) {
          document.getElementById("content").textContent = results[0].result;
        }
      }
    );
  });
}

function summarizeCurrentPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getContent" }, function (response) {
      if (response && response.content) {
        // Use OpenAI API to summarize response.content
        // Update sidebar UI with summary
      }
    });
  });
}

// Function to summarize content using OpenAI API
async function summarizeContent() {
  const content = document.getElementById("content").textContent;

  // Retrieve the OpenAI API key (you need to implement secure API key storage)
  chrome.storage.sync.get(["openaiApiKey"], async function (result) {
    const apiKey = result.openaiApiKey;

    if (!apiKey) {
      document.getElementById("summary").textContent = "Please set your OpenAI API key in the extension options.";
      return;
    }

    try {
      const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt: `Summarize the following text:\n\n${content}\n\nSummary:`,
          max_tokens: 100,
          n: 1,
          stop: null,
          temperature: 0.5,
        }),
      });

      const data = await response.json();
      const summary = data.choices[0].text.trim();
      document.getElementById("summary").textContent = summary;
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("summary").textContent = "An error occurred while summarizing the content.";
    }
  });
}

// Event listeners
document.addEventListener("DOMContentLoaded", getPageContent);
document.getElementById("summarizeButton").addEventListener("click", summarizeContent);
document.getElementById("getContentButton").addEventListener("click", getPageContent);