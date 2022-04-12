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

    Object.keys(this.counter)
      .sort((a, b) => this.counter[b] - this.counter[a])
      .forEach((key) => (string += '\n' + `${key}: ${this.counter[key]}`));

    return string;
  },
};
