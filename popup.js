

document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('saveButton');
    const stopButton = document.getElementById('stopButton');

    // Function to save interval values to storage
    function saveIntervalsToStorage(likeInterval, refreshInterval) {
        chrome.storage.local.set({ likeInterval, refreshInterval });
    }

    // Function to load interval values from storage and update inputs
    function loadIntervalsFromStorage() {
        chrome.storage.local.get(['likeInterval', 'refreshInterval'], (result) => {
            const { likeInterval, refreshInterval } = result;
            document.getElementById('likeInterval').value = likeInterval || 5000; // Default to 5000 if not set
            document.getElementById('refreshInterval').value = refreshInterval || 60000; // Default to 60000 if not set
        });
    }

    loadIntervalsFromStorage();

    saveButton.addEventListener('click',  function () {
        const likeInterval = parseInt(document.getElementById('likeInterval').value);
        const refreshInterval = parseInt(document.getElementById('refreshInterval').value);
        saveIntervalsToStorage(likeInterval, refreshInterval);
        chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
            const tab = tabs[0];
            const tabId = tab.id; // Get the active tab ID
            
            // Send a message to the background script with the tab ID to start the refresh interval
            await chrome.runtime.sendMessage({command: "start",refreshInterval,likeInterval,tabId});
          });
        
    });

    stopButton.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true },async function (tabs) {
            const tab = tabs[0];
            const tabId = tab.id; // Get the active tab ID
      
            // Send a message to the background script with the tab ID to start the refresh interval
            const response1 = await chrome.runtime.sendMessage({command: "stop", tabId});
          });
    });


});