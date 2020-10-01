const Twitter = require('twitter');
const twitter = new Twitter(require('./twitterConfig'));
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.TOKEN);
let allTweets = [];

async function getTweets() {
  let maxId = Infinity;
  let config = {
    screen_name: 'Tholl_22',
    exclude_replies: false,
    include_rts: false,
  };

  let tweets = await twitter.get('statuses/user_timeline', config);

  while (tweets.length > 1) {
    tweets.forEach(tweet => {
      //If reply get the text after reply @ mention

      if (!tweet.hasOwnProperty('quoted_status')) {
        let { text } = tweet;
        if (tweet.in_reply_to_screen_name) {
          text = text.substring(text.indexOf(' ') + 1);
        }
        allTweets.push(text);
      }

      if (tweet.id < maxId) {
        maxId = tweet.id;
      }
    });

    config.max_id = maxId;
    tweets = await twitter.get('statuses/user_timeline', config);
  }
}

async function getRandomTweet() {
  if (allTweets.length == 0) await getTweets();

  const random = Math.floor(Math.random() * allTweets.length);
  const msg = allTweets[random];
  allTweets.splice(random, 1);
  return msg;
}

client.on('message', async msg => {
  const message = msg.content.toLowerCase();
  const { username } = msg.author;
  if (message.includes('tanner') || message.includes('tholl')) {
    const tweet = await getRandomTweet();
    msg.channel.send(tweet);
  }
});
