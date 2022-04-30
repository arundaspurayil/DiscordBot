require('dotenv').config();
const express = require('express');
const moment = require('moment');
const Messages = require('./db/messages');
const MongoClient = require('./db/mongo-client');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  res.send('Hello world!');
});

app.get('/messages', async (req, res) => {
  const startDate = moment().subtract(7, 'days');
  const endDate = moment();

  const messages = await Messages.getMessages(startDate, endDate);
  res.json(messages);
});

(async () => {
  await MongoClient.connect();

  app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
  });
})();
