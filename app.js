require('dotenv').config();
const Twitter = require('twitter');
const Discord = require('discord.js');
let allTweets = [];

const twitter = new Twitter({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token_key: process.env.ACCESS_TOKEN_KEY,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const client = new Discord.Client();

client.login(process.env.TOKEN);

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
			if (!tweet.hasOwnProperty('quoted_status')) {
				allTweets.push(tweet.text);
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
	if (allTweets.length == 0) {
		await getTweets();
	}
	let random = Math.floor(Math.random() * allTweets.length);
	let msg = allTweets[random];
	allTweets.splice(random, 1);
	return msg;
}

client.on('message', async msg => {
	const message = msg.content.toLowerCase();
	const { username } = msg.author;
	if (message.includes('tanner') || message.includes('tholl')) {
		let tweet = await getRandomTweet();
		msg.channel.send(tweet);
	}
});
