const XMLHttpRequest = require("xhr2");
let request = new XMLHttpRequest();

function getImages(subreddit) {
  request.open("GET", `http://www.reddit.com/r/${subreddit}.json`);
  request.send();
  request.onload = () => {
    if (request.status != 200) return;
    var res = JSON.parse(request.response).data.children;
    var resMap = new Map();
    resMap = res.map((post) => ({
      author: post.data.author,
      link: post.data.url,
      img: post.data?.preview?.images[0].source.url,
    }));
    resMap.forEach((post) => {
      console.log(post.link);
    });
    return resMap;
  };
}
