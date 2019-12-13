const Server = require('karma').Server

class TestUnitService {
  constructor(context) {
    this.config = this._mergeKarmaConfig(context)
  }

  async run() {
    const server = new Server(this.config)
    server.start()
  }
  
  _mergeKarmaConfig(context) {
    // Merge default karma and user karma configuration
    const defaultKarmaConfig = require('./karma.conf')
    const userKarmaConfig = context.karmaConfig
    return Object.assign(
      {},
      defaultKarmaConfig.getConfig(context.webpackConfig),
      userKarmaConfig
    )
  }
}

module.exports = TestUnitService