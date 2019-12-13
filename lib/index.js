const path = require('path')
const fs = require('fs')
const { deepClone } = require('./utils/index')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpackMerge = require('webpack-merge')
const { error } = require('./utils')

class Service {
  constructor() {
    this.webpackConfig = {}
    this.karmaConfig = {}
    this.cliArgs = {}
  }
  
  start(mode, args) {
    this.cliArgs = args
    let subServer = null
    let defaultWebpackConfig = null
    let SubService = null
    // According to environment mode, choose the related service to run
    process.env.NODE_ENV = mode || ''
    switch (mode) {
    case 'development':
      defaultWebpackConfig = require('./webpack/webpack.config.dev').getConfig(this)
      SubService = require('./service/devService')
      break
    case 'production':
      defaultWebpackConfig = require('./webpack/webpack.config.prod').getConfig(this)
      SubService = require('./service/prodService')
      break
    case 'test:unit':
      process.env.BABEL_ENV = 'test'
      defaultWebpackConfig = require('./webpack/webpack.config.test').getConfig(this)
      SubService = require('./service/testUnitService')
      break
    case 'test:e2e':
      SubService = require('./service/testE2eService')
      break
    // If mode is not the one of 'development', 'production', or 'test', show error tip.
    default:
      error(
        'Mode value is not allowed.\n' +
        'Mode must be one of \'development\', \'production\', or \'test\'.'
      )
      process.exit(1)
      break
    }
    this._mergeConfig(defaultWebpackConfig)
    subServer = new SubService(this)
    subServer.run()
  }

  resolve(dir) {
    return path.resolve(process.cwd(), dir)
  }

  _mergeConfig(defaultWebpackConfig) {
    // Load user configuration
    const userConfig = this._loadUserConfig()
    this._mergeWebpackConfig(defaultWebpackConfig, userConfig.webpackConfig)
  }

  _loadUserConfig() {
    const epaySpartaConfig = this.resolve('sparta.config.js')
    if (fs.readFileSync(epaySpartaConfig)) {
      return require(epaySpartaConfig)
    }
  }

  _mergeWebpackConfig(defaultWebpackConfig, userWebpackConfig) {
    // Deep clone user webpack config
    const userWebpackConfigCopy = deepClone(userWebpackConfig)
    // Convert pages to HtmlWebpackPlugin
    if (userWebpackConfigCopy.hasOwnProperty('pages')) {
      this.webpackConfig.plugins = userWebpackConfigCopy.pages.map(pageConfig => {
        return new HtmlWebpackPlugin(pageConfig)
      })
      delete userWebpackConfigCopy.pages
    }
    // Merge configs
    this.webpackConfig = webpackMerge(
      this.webpackConfig,
      defaultWebpackConfig,
      userWebpackConfigCopy
    )
  }
}

module.exports = Service
