const MongoClient = require('./mongo-client');
const Messages = MongoClient.db.collection('messages');
const moment = require('moment');

const createMessage = async (author, body) => {
  const record = {
    author,
    body,
    createdAt: moment(),
  };

  await Messages.insertOne(record);
};

module.exports = {
  createMessage,
};
