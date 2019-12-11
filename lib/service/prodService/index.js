const webpack = require('webpack')

class ProdService {
  constructor(config) {
    this.config = config
  }

  async run() {
    const compiler = webpack(this.config.webpackConfig)
    compiler.run()
  }
}

module.exports = ProdService