const Twitter = require('twitter');
const TwitterService = require('./twitter-service');
const Discord = require('discord.js');

const twitterClient = new Twitter(require('./twitterConfig'));
const twitterService = new TwitterService(twitterClient, 'tholl_22');
const client = new Discord.Client();

client.login(process.env.TOKEN);

client.on('message', async msg => {
  const message = msg.content.toLowerCase();

  if (message.includes('tanner') || message.includes('tholl')) {
    const tweet = await twitterService.getRandomTweet();
    msg.channel.send(tweet);
  }
});
