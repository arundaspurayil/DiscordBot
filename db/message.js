const moment = require('moment');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'messages.json');

const proxyHandler = {
  set: function (obj, prop, value) {
    const res = Reflect.set(obj, prop, value);

    persistMessagesToFile(obj);

    return res;
  },
};

module.exports = {
  messages: new Proxy(readMessagesFromFile(), proxyHandler),
  create(author, body) {
    this.messages.push({
      author,
      body,
      createdAt: moment(),
    });
  },
  findFromStartDate(startDate) {
    return this.messages.filter((message) =>
      moment(message.createdAt).isBefore(startDate)
    );
  },
};

function persistMessagesToFile(messages) {
  fs.writeFileSync(filePath, JSON.stringify(messages));
}

function readMessagesFromFile() {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  return JSON.parse(fs.readFileSync(filePath));
}
