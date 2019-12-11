const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const { deepClone } = require('./utils/index')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpackMerge = require('webpack-merge')

class Service {
  constructor() {
    this.config = {
      webpackConfig: {}
    }
  }
  
  start(mode) {
    let server = null
    let webpackConfig = null
    let SubService = null
    // According to environment mode, choose the related service to run
    switch (mode) {
      case 'development':
        webpackConfig = require('./webpack/webpack.config.dev')
        SubService = require('./service/devService')
        break;
      case 'production':
        process.env.NODE_ENV = 'production'
        webpackConfig = require('./webpack/webpack.config.prod')
        SubService = require('./service/prodService')
        break;
      case 'test':
        process.env.BABEL_ENV = 'test'
        webpackConfig = require('./webpack/webpack.config.test')
        SubService = require('./service/testService')
        break;
      // If mode is not the one of 'development', 'production', or 'test', show error tip.
      default:
        console.log(`${chalk.red('[Error] mode value is not allowed.')}`)
        console.log(`${chalk.red('- mode should be \'development\', \'production\', or \'test\'.')}`)
        process.exit(1)
        break;
    }
    this._mergeConfig(webpackConfig)
    server = new SubService(this.config)
    server.run()
  }

  _loadUserConfig() {
    const excuteCwd = process.cwd()
    const epaySpartaConfig = path.resolve(excuteCwd, 'sparta.config.js')
    if (fs.readFileSync(epaySpartaConfig)) {
      return require(epaySpartaConfig)
    }
  }

  _mergeConfig(defaultWebpackConfig) {
    // Load user configuration
    const userConfig = this._loadUserConfig()
    this._mergeWebpackConfig(defaultWebpackConfig, userConfig.webpackConfig)
  }

  _mergeWebpackConfig(defaultWebpackConfig, userWebpackConfig) {
    // Deep clone user webpack config
    const userWebpackConfigCopy = deepClone(userWebpackConfig)
    // Convert pages to HtmlWebpackPlugin
    if (userWebpackConfigCopy.hasOwnProperty('pages')) {
      this.config.webpackConfig.plugins = userWebpackConfigCopy.pages.map(pageConfig => {
        return new HtmlWebpackPlugin(pageConfig)
      })
      delete userWebpackConfigCopy.pages
    }
    // Merge configs
    this.config.webpackConfig = webpackMerge(
      this.config.webpackConfig,
      defaultWebpackConfig,
      userWebpackConfigCopy
    )
  }
}

module.exports = Service
