

document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('saveButton');
    const stopButton = document.getElementById('stopButton');

    saveButton.addEventListener('click', function () {
        const likeInterval = parseInt(document.getElementById('likeInterval').value);
        const refreshInterval = parseInt(document.getElementById('refreshInterval').value);

        setRefresh(likeInterval,refreshInterval);
    });

    stopButton.addEventListener('click', function () {
        clearRefresh();

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: stop,
                args: [likeInterval]
            }).then(() => console.log('Stopped!'));
        });
    });

    let refreshIntervalId;
    function setRefresh(likeInterval,refreshInterval){
        refreshIntervalId = setInterval(() => {
            chrome.tabs.query({ active: true, currentWindow: true },async function (tabs) {
                chrome.tabs.reload(tabs[0].id, () => {
                    // Add a listener for the DOMContentLoaded event
                    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                        if (tabId === tabs[0].id && changeInfo.status === 'complete') {
                            // The page is ready, remove the listener and trigger triggerLikes
                            chrome.tabs.onUpdated.removeListener(listener);
                            triggerLikes(likeInterval);
                        }
                    });
                });
            });
        },refreshInterval);
        triggerLikes(likeInterval);
    }

    function triggerLikes(likeInterval){
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: init,
                args: [likeInterval,false]
            }).then(() => console.log('Started!'));
        });
    }

    function clearRefresh(){
        clearInterval(refreshIntervalId);
    }

});


const init = (likeInterval, stopSignal) => {
    const DESKTOP_POSTS = `div[aria-posinset]`;
    const DESKTOP_LIKE_BTN = `[aria-label="Like"] span`;

    const MOBILE_POSTS = `#screen-root > div > div:nth-child(1) > div:nth-child(INDEX)`;
    const MOBILE_LIKE_BTN = `div:nth-child(6) > div:nth-child(1)`;
    const MOBILE_LIKE_ALT_BTN = `div:nth-child(5) > div:nth-child(1)`;
    const TEST_BTN = `div > button`;
    const YOU_TEXT = `div:nth-child(5) > div:nth-child(2) > div > div`;


    
    
    function likePost(post) {
        post.scrollIntoView({ behavior: 'smooth' })
        if(!ifAlreadyLiked(post)){
            if(post.querySelector(MOBILE_LIKE_BTN) && post.querySelector(`${MOBILE_LIKE_BTN} > ${TEST_BTN}`)) {
                post.querySelector(MOBILE_LIKE_BTN).click();
            } else if(post.querySelector(MOBILE_LIKE_ALT_BTN) && post.querySelector(`${MOBILE_LIKE_ALT_BTN} > ${TEST_BTN}`)) {
                post.querySelector(MOBILE_LIKE_ALT_BTN).click();
            }
        }
    }

    function ifAlreadyLiked(post){
        return post.querySelector(YOU_TEXT) && post.querySelector(YOU_TEXT).textContent.includes('You');
    }

    function getPosts(idx = 0){
        //idx+10 because in mobile version actual posts start from 10th div and each post appears after 2 divs
        //thats why further posts are fetched by increment by 2
        // console.log(MOBILE_POSTS.replace('INDEX',idx+10));
        return document.querySelector(MOBILE_POSTS.replace('INDEX',idx+10));
    }

    function start() {
        if(!window.likeId){
            if(!window.currentIndex) window.currentIndex = 0;

            function clickNextLikeButton() {
                let post = getPosts(window.currentIndex);
                // console.log({post});
                if(post && post.querySelector(MOBILE_LIKE_BTN) || post.querySelector(MOBILE_LIKE_ALT_BTN)){
                    likePost(post);
                    window.currentIndex = window.currentIndex + 2;
                }
            }

            clickNextLikeButton();
            window.likeId = setInterval(clickNextLikeButton, likeInterval);
        }
    }

    start();
}

function stop(){
    if(window.likeId){
        clearInterval(window.likeId);
        window.likeId = null;
    }
}