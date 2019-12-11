const webpack = require('webpack')

class TestService {
  constructor(config) {
    this.config = config
  }

  async run() {
    webpack(this.config.webpackConfig)
  }
}

module.exports = TestService