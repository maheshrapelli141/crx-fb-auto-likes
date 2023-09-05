
const init = (likeInterval) => {
    let MOBILE_POSTS;
    if(!window.location.pathname.includes('home.php') && window.location.pathname.length > 1) MOBILE_POSTS = `article`;
    else MOBILE_POSTS = `#m_newsfeed_stream > div > section > article`;
     
    const MOBILE_LIKE_BTN = `footer > div > div:nth-child(2) > div > a`;
    const MOBILE_LIKE_ALT_BTN = `footer > div > div:nth-child(2) > div > a`;
    const TEST_BTN = `footer > div > div:nth-child(2) > div > a`;
    const YOU_TEXT = `footer > div > div:nth-child(1) > a > div > div > div`;
    
    const POST_ALREADY_LIKED_ERROR = 'ERROR:POST_ALREADY_LIKED';
    
    function likePost(post) {
        post.scrollIntoView({ behavior: 'smooth' })
        if(!ifAlreadyLiked(post)){
            if(post.querySelector(MOBILE_LIKE_BTN)) {
                post.querySelector(MOBILE_LIKE_BTN).click();
            } else  {
                throw new Error('Invalid post');
            } 
        } else {
            throw new Error(POST_ALREADY_LIKED_ERROR);
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

            let posts = [];
            function clickNextLikeButton() {
                let newPosts = getPosts();
                // if(newPosts.length === posts.length){
                //     return;
                // }
                posts = newPosts;

                console.log({posts});
                if(posts && posts.length > 0 && window.currentIndex < posts.length){
                    try {
                        console.log('post index',window.currentIndex);
                        likePost(posts[window.currentIndex]);
                    } catch (error) {
                        console.log(error);
                        window.currentIndex++;
                        clickNextLikeButton();
                    }
                } else {
                    console.log('scrolling to bottom');
                    posts[posts.length-1].scrollIntoView({ behavior: 'smooth' });
                }
                // window.currentIndex++;
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