require('dotenv').config()
var Twitter = require('twitter');
const Discord = require('discord.js');
allTweets = []


var twitter = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});
 

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.login(process.env.TOKEN);

async function getTweets(){
  let maxId = Infinity
  let tweets = await twitter.get('statuses/user_timeline', {screen_name: 'Tholl_22', exclude_replies: false, include_rts: false, tweet_mode: 'extended'})
  while(tweets.length > 1 ){
    tweets.forEach(tweet => {
      if(!tweet.hasOwnProperty('quoted_status')){
        allTweets.push(tweet.full_text)
      }
      if(tweet.id < maxId){
        maxId = tweet.id
      }
    })
    tweets = await twitter.get('statuses/user_timeline', {screen_name: 'Tholl_22', max_id: maxId, exclude_replies: false, include_rts: false, tweet_mode: 'extended'})  
  }
}

async function getRandomTweet(){
  if(allTweets.length == 0){
    await getTweets();
  }
  let random = Math.floor(Math.random()*allTweets.length)
  let msg = allTweets[random];
  allTweets.splice(random,1)
  return msg
}


client.on('message', async (msg) => {
  const message = msg.content.toLowerCase()
  if (message.includes("tanner")) {
    let tweet = await getRandomTweet();
    msg.channel.send(tweet);
  }
});



