// Handle the keyboard shortcut command
browser.commands.onCommand.addListener((command) => {
    if (command === "copy-url") {
      // Get the active tab
      browser.tabs.query({active: true, currentWindow: true})
        .then(tabs => {
          if (tabs[0]) {
            const url = tabs[0].url;
            // Send message to content script to copy URL
            browser.tabs.sendMessage(tabs[0].id, {
              action: "copyUrl",
              url: url
            });
          }
        })
        .catch(err => console.error("Error getting active tab:", err));
    }
  });

  // Optional: Show notification when URL is copied
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "urlCopied") {
      browser.notifications.create({
        type: "basic",
        iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDMwTDEyIDIyTDE0LjQgMTkuNkwyMCAyNS4yTDMzLjYgMTEuNkwzNiAxNEwyMCAzMFoiIGZpbGw9IiM0Q0FGNTASCZ8L3N2Zz4K",
        title: "URL Copied!",
        message: `Copied: ${message.url}`
      });
    }
  });
