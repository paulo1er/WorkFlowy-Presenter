function showMainIcon(tabId, changeInfo, tab) {
  if ((tab.url == "https://workflowy.com/") || (tab.url == "http://workflowy.com/")) {
    chrome.pageAction.show(tabId);
  };
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(showMainIcon);
