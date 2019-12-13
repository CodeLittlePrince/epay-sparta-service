const webpack = require('webpack')

class ProdService {
  constructor(context) {
    this.config = context.webpackConfig
  }

  async run() {
    webpack(this.config, this._compileMessageReport)
  }

  _compileMessageReport(err, stats) {
    if (err) {
      console.error(err)
      return
    }
    console.log(stats.toString({
      chunks: false,  // Makes the build much quieter
      colors: true    // Shows colors in the console
    }))
  }
}

module.exports = ProdService