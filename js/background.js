
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == 'showIcon') {
    chrome.pageAction.show(sender.tab.id);
  }
});
