module.exports = {
  counter: {},
  incrementCounter: function (author) {
    if (!this.counter.hasOwnProperty(author)) {
      this.counter[author] = 0;
    }

    this.counter[author] += 1;
  },
  clearCounter: function () {
    this.counter = {};
  },
  toString: function () {
    const sortFunction = function (a, b) {
      return this.counter[b] - this.counter[a];
    }.bind(this);

    let string = 'Message Counter:';

    const keys = Object.keys(this.counter).sort(sortFunction);
    keys.forEach((key) => {
      string = string.concat('\n', `${key}: ${this.counter[key]}`);
    });

    return string;
  },
};
