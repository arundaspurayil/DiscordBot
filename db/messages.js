const MongoClient = require('./mongo-client');
const Messages = MongoClient.db.collection('messages');
const moment = require('moment');

const createMessage = async (author, body) => {
  const record = {
    author,
    body,
    createdAt: moment().toDate(),
  };

  await Messages.insertOne(record);
};

async function findInRange(startDate, endDate) {
  const projection = { author: 1, createdAt: 1 };

  return await Messages.find({
    createdAt: {
      $gt: startDate.toDate(),
      $lt: endDate.toDate(),
    },
  })
    .project(projection)
    .toArray();
}

module.exports = {
  createMessage,
  findInRange,
};
