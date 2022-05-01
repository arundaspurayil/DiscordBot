const TwitterService = require('./twitter-service');
const Discord = require('discord.js');
const MongoClient = require('./db/mongo-client');
const Messages = require('./db/messages');
const { scheduleCronJob, sendMessageInAllChannels } = require('./lib/utils');

const twitterService = new TwitterService('tholl_22');
const client = new Discord.Client();

MongoClient.connect().then(() => {
  client.login(process.env.TOKEN);
});

client.on('message', async (msg) => {
  if (msg.author.id === client.user.id) {
    return;
  }
  Messages.createMessage(msg.author?.username, msg.content);

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
  scheduleCronJob('0 0 22 * * Sunday', () => {
    sendMessageInAllChannels(client, MessageCounter.toString());
    MessageCounter.clearCounter();
  });
});

const cleanup = async (event) => {
  await MongoClient.close();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
