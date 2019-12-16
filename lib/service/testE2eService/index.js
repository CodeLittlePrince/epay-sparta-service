const Mocha = require('mocha')

class TestE2eService {
  constructor(context) {
    this.context = context
  }

  async run() {
    const mocha = new Mocha()
    mocha.addFile(this.context.resolve('test/e2e/index.js'))
    mocha.run()
  }
}

module.exports = TestE2eService