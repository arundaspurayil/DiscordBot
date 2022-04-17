const { MongoClient: MongoDb } = require('mongodb');

class MongoClient {
  constructor() {
    this.client = new MongoDb(process.env.MONGODB_URI);
  }

  async connect() {
    await this.client.connect();
  }

  async close() {
    await this.client.close();
  }

  get db() {
    return this.client.db('DiscordBot');
  }
}

module.exports = new MongoClient();
