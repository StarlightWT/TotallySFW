const {
  Client,
  Events,
  GatewayIntentBits,
  WebhookClient,
  PermissionOverwrites,
  PermissionFlagsBits,
} = require("discord.js");
const { token } = require("./src/src.json");
const XMLHttpRequest = require("xhr2");
const { EmbedBuilder } = require("@discordjs/builders");
let request = new XMLHttpRequest();
var channels = [];
// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.on(Events.GuildMemberAdd, (member) => {
  member.guild.channels
    .create({
      name: member.id,
      permissionOverwrites: [
        { id: "1113409425152167997", deny: PermissionFlagsBits.ViewChannel },
        { id: member.id, allow: [PermissionFlagsBits.ViewChannel] },
      ],
      reason: "New member",
    })
    .then((channel) => {
      channels.push(channel.id);
    });
});

// client.on(Events.GuildMemberRemove, (member) => {
//   member.guild.channels.delete(member.id, "Member left");
// });

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  client.channels.cache.forEach((channel) => {
    if (channel.id != "1113409427224145923") channels.push(channel.id);
  });

  console.log(`Got channels:\n${channels}`);

  var embed;
  var colour;
  var subreddit;
  var imageLink = "";
  var j = 0;
  var sort = "";
  var totalImages = 0;
  setInterval(async () => {
    var sortCount = Math.floor(Math.random() * 3);
    switch (sortCount) {
      case 0:
        sort = "top";
        break;
      case 1:
        sort = "hot";
        break;
      case 2:
        sort = "new";
        break;
    }
    var subredditCount = Math.floor(Math.random() * 9);
    switch (subredditCount) {
      case 0:
        subreddit = "hentaibondage";
        colour = 0xd400ff;
        break;
      case 1:
        subreddit = "yurihentai";
        colour = 0xff00b2;
        break;
      case 2:
        subreddit = "hentaipetgirls";
        colour = 0xff004a;
        break;
      case 3:
        subreddit = "yuri";
        colour = 0xff0e00;
        break;
      case 4:
        subreddit = "Hentai_Bondage";
        colour = 0xff7000;
        break;
      case 5:
        subreddit = "GenshinImpactHentai";
        colour = 0xffcd00;
        break;
      case 6:
        subreddit = "GenshinImpactNSFW";
        colour = 0x57ff00;
        break;
      case 7:
        subreddit = "GenshinBondage";
        colour = 0x00ff21;
        break;
      case 8:
        subreddit = "GenshinYuri";
        colour = 0x02fd9c;
        break;
      case 8:
        subreddit = "femboyhentai";
        colour = 0x2b0cf3;
        break;
    }

    request.open(
      "GET",
      `http://www.reddit.com/r/${subreddit}.json?limit=100?sort=${sort}`
    );
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
            `(${subredditCount})[${sort}(${sortCount})]${subreddit}:(${imgIndex})${imageLink}[${i}/${amountOfImages}]`
          );
        }
        i++;
        totalImages++;
      });
      i = 0;

      channels.forEach(async (channelId) => {
        embed = new EmbedBuilder()
          .setTitle("A wild kinky image appears:")
          .setImage(`${imageLink}`)
          .setTimestamp()
          .setColor(colour);

        let channel = await client.channels.fetch(channelId);
        channel.send({
          embeds: [embed],
        });
      });
    };
    j++;
    if (j == 50) {
      console.log(`Total images posted: ${totalImages}`);
      j = 0;
    }
  }, 10000);
});

// Log in to Discord with your client's token
client.login(token);
