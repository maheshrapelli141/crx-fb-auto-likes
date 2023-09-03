
const init = (likeInterval) => {
    let MOBILE_POSTS;
    if(!window.location.pathname.includes('home.php') && window.location.pathname.length > 1) MOBILE_POSTS = `.feed article`;
    else MOBILE_POSTS = `#m_newsfeed_stream > div > section > article`;
     
    const MOBILE_LIKE_BTN = `footer > div > div:nth-child(2) > div > a`;
    const MOBILE_LIKE_ALT_BTN = `footer > div > div:nth-child(2) > div > a`;
    const TEST_BTN = `footer > div > div:nth-child(2) > div > a`;
    const YOU_TEXT = `footer > div > div:nth-child(1) > a > div > div > div`;
    
    
    function likePost(post) {
        post.scrollIntoView({ behavior: 'smooth' })
        if(!ifAlreadyLiked(post)){
            if(post.querySelector(MOBILE_LIKE_BTN)) {
                post.querySelector(MOBILE_LIKE_BTN).click();
            } else  {
                throw new Error('Invalid post');
            } 
        }
    }

    function ifAlreadyLiked(post){
        return post.querySelector(YOU_TEXT) && post.querySelector(YOU_TEXT).textContent.includes('You');
    }

    function getPosts(){
        return document.querySelectorAll(MOBILE_POSTS);
    }

    function start() {
        if(!window.likeId){
            if(!window.currentIndex) window.currentIndex = 0;

            function clickNextLikeButton() {
                let posts = getPosts();
                console.log({posts});
                if(posts && posts.length > 0 && posts[window.currentIndex].querySelector(MOBILE_LIKE_BTN) || posts[window.currentIndex].querySelector(MOBILE_LIKE_ALT_BTN)){
                    try {
                        likePost(posts[window.currentIndex]);
                    } catch (error) {
                        window.currentIndex++;
                        clickNextLikeButton();
                    }
                    window.currentIndex++;
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

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        console.log({message});
        switch(message.command) {
            case "start":
                init(message.likeInterval);
            break;
            case "stop":
                stop();
            break;
        }
    }
);