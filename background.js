let refreshIntervalId = null;

function triggerLikes(likeInterval, stopSignal = false,tabId){
    console.log({tabId});
    chrome.tabs.sendMessage(tabId,{command: stopSignal ? "stop" : "start",likeInterval});
}

function startRefresh(refreshInterval,likeInterval,tabId) {
  if (refreshIntervalId === null) {
    refreshIntervalId = setInterval(() => {
        chrome.tabs.reload(tabId, () => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                if (tabId === tabId && changeInfo.status === 'complete') {
                    chrome.tabs.onUpdated.removeListener(listener);
                    triggerLikes(likeInterval,false,tabId);
                }
            });
        });
    }, refreshInterval);
    triggerLikes(likeInterval,false,tabId);
  }
}

function stopRefresh(tabId) {
  if (refreshIntervalId !== null) {
    triggerLikes(0,true,tabId);
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === 'start') {
    startRefresh(request.refreshInterval, request.likeInterval,request.tabId);
  } else if (request.command === 'stop') {
    stopRefresh(request.tabId);
  }
});
