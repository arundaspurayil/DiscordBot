require('dotenv').config()
var Twitter = require('twitter');

var twitter = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});
 

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});


client.login(process.env.TOKEN);

allTweets = []
async function getTweets(){
  const tweets = await twitter.get('statuses/user_timeline', {screen_name: 'Tholl_22', count: 3200, exclude_replies: true, include_rts: false})
  tweets.forEach(tweet => {
    allTweets.push(tweet.text)
  })
}

client.on('message', async (msg) => {
  const message = msg.content.toLowerCase()
  if (message.includes("tanner")) {
    if(allTweets.length == 0){
      await getTweets();
    }
    msg.channel.send(allTweets.pop());

  }
});



