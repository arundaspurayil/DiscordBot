const TwitterService = require('./twitter-service');
const Discord = require('discord.js');
const cron = require('node-cron')
const auth = require('./auth.json');

const twitterService = new TwitterService('tholl_22');
const client = new Discord.Client();

client.login(auth.token);

client.on('message', async msg => {
  if(msg.author.id === client.user.id) { return; }

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

client.on('presenceUpdate', (oldPresence, newPresence) => {
  if(oldPresence === undefined) {
    return;
  }
  if(oldPresence.status === newPresence.status) {
    return;
  } 
  if(oldPresence.status !== 'offline' && oldPresence.status !== 'idle') {
    return;
  }
  if(newPresence.status !== 'online') {
    return;
  }
  client.channels.cache.get('962450090117722115').send(newPresence.user.username + ' is online!');
});

client.on('ready', () => {
  scheduleCronJob("0 0 9 * * *", () => sendMessageInAllChannels("Good morning!"))
  scheduleCronJob("0 0 12 * * *", () => sendMessageInAllChannels("I need chips :)"))
  scheduleCronJob("0 0 17 * * *", () => sendMessageInAllChannels("Time for dinner!"))
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
