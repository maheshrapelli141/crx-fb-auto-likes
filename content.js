var text = "hello";
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        console.log("abc");
        switch(message.type) {
            case "getText":
                console.log("here");
                sendResponse(text);
            break;
        }
    }
);