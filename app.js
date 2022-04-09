const TwitterService = require('./twitter-service');
const Discord = require('discord.js');

const twitterService = new TwitterService('tholl_22');
const client = new Discord.Client();

client.login(process.env.TOKEN);

client.on('messageCreate', async msg => {
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
