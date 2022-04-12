const Twitter = require('twitter');
const twitterConfig = require('./twitter-config');

module.exports = class TwitterService {
  constructor(twitterHandle) {
    this.twitterHandle = twitterHandle;
    this.tweets = [];
    this.twitterClient = new Twitter(twitterConfig);
  }

  async #getTweets(maxId = Infinity, prevMaxId = undefined) {
    if (maxId === prevMaxId) {
      return;
    }

    let config = {
      screen_name: this.twitterHandle,
      exclude_replies: false,
      include_rts: false,
      ...(maxId !== Infinity && { max_id: maxId }),
    };

    let tweets = await this.twitterClient.get('statuses/user_timeline', config);
    let currentMaxId;

    tweets.forEach((tweet) => {
      if (tweet.hasOwnProperty('quoted_status')) {
        return;
      }
      let { text } = tweet;

      if (text.charAt(0) == '@') {
        text = text.substring(text.indexOf(' ') + 1);
      }

      this.tweets.push(text);
      currentMaxId = Math.min(tweet.id, maxId);
    });

    await this.#getTweets(currentMaxId, maxId);
  }

  async getRandomTweet() {
    if (this.tweets.length == 0) await this.#getTweets();

    const randomNumber = Math.floor(Math.random() * this.tweets.length);
    const [msg] = this.tweets.splice(randomNumber, 1);
    return msg;
  }
};
