const TwitterService = require('./twitter-service');
const Discord = require('discord.js');
const { scheduleCronJob, sendMessageInAllChannels } = require('./lib/utils');

const twitterService = new TwitterService('tholl_22');
const client = new Discord.Client();

client.on('message', async (msg) => {
  if (msg.author.id === client.user.id) {
    return;
  }

  const message = msg.content.toLowerCase();

  if (message.includes('tanner') || message.includes('tholl')) {
    const tweet = await twitterService.getRandomTweet();
    msg.channel.send(tweet);
  }
});

client.on('ready', () => {
  scheduleCronJob('0 0 17 * * *', () =>
    sendMessageInAllChannels(client, 'Time for dinner!')
  );
});
