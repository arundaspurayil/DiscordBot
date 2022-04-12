module.exports = {
  counter: {},
  incrementCounter(author) {
    if (!this.counter.hasOwnProperty(author)) {
      this.counter[author] = 0;
    }

    this.counter[author] += 1;
  },
  clearCounter() {
    this.counter = {};
  },
  toString() {
    let string = 'Message Counter:';

    const keys = Object.keys(this.counter).sort(function (a, b) {
      return this.counter[a] - this.counter[b];
    });
    keys.forEach((key) => {
      string = string.concat('\n', `${key}: ${this.counter[key]}`);
    });

    return string;
  },
};
