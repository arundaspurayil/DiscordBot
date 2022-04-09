const TwitterService = require('./twitter-service');
const Discord = require('discord.js');

const twitterService = new TwitterService('tholl_22');
const client = new Discord.Client({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_PRESENCES']
});

client.login(process.env.TOKEN);

client.on('message', async msg => {
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

client.on('presenceUpdate', async (oldPresence, newPresence) => {
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
  var user = client.users.cache.find(user => user.id === newPresence.userID)
  client.channels.cache.get('962450090117722115').send(user.username + ' is online');
});