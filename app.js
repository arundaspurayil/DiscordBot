const TwitterService = require('./twitter-service');
const Discord = require('discord.js');
const cron = require('node-cron')
const MessageCounter = require("./message-counter")

const twitterService = new TwitterService('tholl_22');
const client = new Discord.Client();

client.login(process.env.TOKEN);

client.on('message', async msg => {
  if(msg.author.id === client.user.id) { return; }
  MessageCounter.incrementCounter(msg.author)

  const message = msg.content.toLowerCase();

  if (message.includes('tanner') || message.includes('tholl')) {
    const tweet = await twitterService.getRandomTweet();
    msg.channel.send(tweet);
  }
});

client.on('messageDelete', async msg => {
  let message = msg.content;
  const author = msg.author.username
  
  if(msg.attachments){
    msg.attachments.forEach(attachment => {
      message = message.concat(attachment.proxyURL)
    })
  }
  
  msg.channel.send(`${author} deleted message: ${message}`);
});


client.on('ready', () => {
  scheduleCronJob("0 0 9 * * *", () => sendMessageInAllChannels("Good morning!"))
  scheduleCronJob("0 0 12 * * *", () => sendMessageInAllChannels("I need chips :)"))
  scheduleCronJob("0 0 17 * * *", () => sendMessageInAllChannels("Time for dinner!"))
  scheduleCronJob("0 0 17 * * * ", () => {
    sendMessageInAllChannels(MessageCounter.prettyPrintCounter())
    MessageCounter.clearCounter()
  })
});

const sendMessageInAllChannels = (message) => {
  const channels = client.channels.cache.filter(c => c.guild && c.type === 'text');

  channels.forEach(async c => {
    const permissions = await c.permissionsFor(client.user)
    const hasPermissions = permissions.has(['SEND_MESSAGES', 'VIEW_CHANNEL'], true)

    if(hasPermissions) c.send(message)
  })
}

const scheduleCronJob = (expression, cb) => {
  cron.schedule(expression, cb, {
    scheduled: true,
    timezone: "America/New_York"
  })
}
