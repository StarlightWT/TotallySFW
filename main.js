const { Client, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./src.json");
const XMLHttpRequest = require("xhr2");
const { EmbedBuilder } = require("@discordjs/builders");
let request = new XMLHttpRequest();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  var embed;
  var subreddit;
  var imageLink = "";
  var subredditCount = 0;
  setInterval(async () => {
    let channel = await client.channels.cache.get("1113409427224145923");

    switch (subredditCount) {
      case 0:
        subreddit = "hentaibondage";
        subredditCount++;
        break;
      case 1:
        subreddit = "yurihentai";
        subredditCount++;
        break;
      case 2:
        subreddit = "hentaipetgirls";
        subredditCount++;
        break;
      case 3:
        subreddit = "yuri";
        subredditCount++;
        break;
      case 4:
        subreddit = "Hentai_Bondage";
        subredditCount++;
        break;
      case 5:
        subreddit = "GenshinImpactHentai";
        subredditCount++;
        break;
      case 6:
        subreddit = "GenshinImpactNSFW";
        subredditCount++;
        break;
      case 7:
        subreddit = "GenshinBondage";
        subredditCount++;
        break;
      case 8:
        subreddit = "GenshinYuri";
        subredditCount++;
        break;
      default:
        subredditCount = 0;
    }

    request.open("GET", `http://www.reddit.com/r/${subreddit}.json?limit=100`);
    request.send();
    request.onload = () => {
      if (request.status != 200) return;
      var amountOfImages = 0;
      var res = JSON.parse(request.response).data.children;
      var resMap = new Map();
      var i = 0;
      resMap = res.map((post) => ({
        author: post.data.author,
        link: post.data.url,
        img: post.data?.preview?.images[0].source.url,
      }));
      //   console.log(resMap);
      resMap.forEach(() => {
        amountOfImages++;
      });
      var imgIndex = Math.floor(Math.random() * amountOfImages);

      resMap.forEach((post) => {
        if (
          (!post.link ||
            !post.link.includes("redd.it") ||
            post.link == imageLink) &&
          imgIndex == i
        ) {
          imgIndex++;
        }
        if (imgIndex > amountOfImages) imgIndex = 0;
        if (imgIndex === i) {
          imageLink = post.link;
          console.log(
            `(${
              subredditCount - 1
            })${subreddit}:(${imgIndex})${imageLink}[${i}/${amountOfImages}]`
          );
        }
        i++;
      });
      i = 0;
      embed = new EmbedBuilder()
        .setTitle("A wild kinky image appears:")
        .setImage(`${imageLink}`)
        .setTimestamp();
      channel.send({
        embeds: [embed],
      });
    };
  }, 10000);
});

// Log in to Discord with your client's token
client.login(token);
