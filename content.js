// Listen for keyboard events to intercept Ctrl+Shift+C
document.addEventListener('keydown', function(event) {
    // Check if Ctrl+Shift+C is pressed
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyC') {
      // Prevent the default behavior (opening DevTools)
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      // Copy the current URL
      copyToClipboard(window.location.href);
    }
  }, true); // Use capture phase to intercept before other handlers

  // Listen for messages from background script (keep for potential future use)
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "copyUrl") {
      copyToClipboard(message.url);
    }
  });

  // Function to copy text to clipboard
  async function copyToClipboard(text) {
    try {
      // Try Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        showNotification(text);
        return;
      }
    } catch (err) {
      console.log('Failed to copy URL');
    }
  }

  // Show a brief notification
  function showNotification(url) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = `URL Copied: ${url}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #333;
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      max-width: 400px;
      word-break: break-all;
      transition: all 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);

    // Also notify background script
    browser.runtime.sendMessage({
      action: "urlCopied",
      url: url
    }).catch(() => {}); // Ignore errors if background script isn't listening
  }
