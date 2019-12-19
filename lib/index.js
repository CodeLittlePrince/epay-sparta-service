const path = require('path')
const fs = require('fs')
const { deepClone } = require('./utils/index')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpackMerge = require('webpack-merge')
const { error } = require('./utils')

class Service {
  constructor() {
    this.cliArgs = {}
    this.spartaConfig = null
    this.webpackConfig = {}
  }
  
  start(mode, args) {
    this.cliArgs = args
    let subServer = null
    let defaultWebpackConfig = null
    let SubService = null
    // According to environment mode, choose the related service to run
    process.env.NODE_ENV = mode || ''
    this._loadSpartaConfig()
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
    case 'lint':
      SubService = require('./service/lintService')
      break
    // If mode is not the one of values unpon, show error tip.
    default:
      this._tipModeError(mode)
      process.exit(1)
      break
    }
    this._mergeConfig(defaultWebpackConfig, mode)
    subServer = new SubService(this)
    subServer.run()
  }

  resolve(dir) {
    return path.resolve(process.cwd(), dir)
  }

  _loadSpartaConfig() {
    const spartaConfigPath = this.resolve('sparta.config.js')
    if (fs.readFileSync(spartaConfigPath)) {
      this.spartaConfig = require(spartaConfigPath)
    }
  }

  _tipModeError(mode) {
    error(
      'Mode value \'' + mode + '\' is not allowed.\n' +
      'Mode must be one of: \n' +
      [
        'development',
        'production',
        'test:unit',
        'test:e2e',
        'lint'
      ].join(', ').concat('.')
    )
  }

  _mergeConfig(defaultWebpackConfig, mode) {
    // Load user configuration
    const spartaConfigWebpack = this._loadSpartaWebpackConfig(mode)
    this._mergeWebpackConfig(defaultWebpackConfig, spartaConfigWebpack)
  }

  _loadSpartaWebpackConfig(mode) {
    if (this.spartaConfig) {
      return this._getConvertSpartaWebpackConfig(mode)
    }
    return {}
  }

  _getConvertSpartaWebpackConfig(mode) {
    // Deep clone user webpack config
    const spartaConfigWebpackCopy = deepClone(this.spartaConfig.webpack)
    if (spartaConfigWebpackCopy) {
      const config = spartaConfigWebpackCopy
      // Convert pages to HtmlWebpackPlugin
      this._convertAllTypeOfEntryToArrayType(config)
      // Convert pages to HtmlWebpackPlugin
      this._convertPagesToHtmlWebpackPlugin(config, mode)
      // Convert publicPath to output.publicPath
      this._convertPublicPathToOutputPublicPath(config)
      return config
    }
    return {}
  }

  _mergeWebpackConfig(defaultWebpackConfig, spartaConfigWebpack) {
    // Merge configs
    this.webpackConfig = webpackMerge(
      this.webpackConfig,
      defaultWebpackConfig,
      spartaConfigWebpack
    )
  }

  /**
   * Covert all types of entry to array type
   * e.g.
   * '/index.js'          => ['/index/js']
   * [{app: '/index.js'}] => ['/index.js']
   * {app: '/index.js'}   => ['/index.js']
   *
   * @param {object} spartaConfigWebpackCopy sparta.config.js webpack configuration
   */
  _convertAllTypeOfEntryToArrayType(spartaConfigWebpackCopy) {
    const config = spartaConfigWebpackCopy
    let entryFiles = config.entry || []
    if (typeof config.entry === 'string') {
      entryFiles = [config.entry]
    } else if (Array.isArray(config.entry)) {
      entryFiles = config.entry
    } else {
      entryFiles = Object.values(config.entry || []).reduce((allEntries, curr) => allEntries.concat(curr), [])
    }
    entryFiles = entryFiles.map(file => this.resolve(file))
    config.entry = entryFiles
  }

  /**
   * Convert pages of webpack configuration's to webpack plugin - HtmlWebpackPlugin
   * @param {object} spartaConfigWebpackCopy sparta.config.js webpack configuration
   * @param {string} mode excute mode
   */
  _convertPagesToHtmlWebpackPlugin(spartaConfigWebpackCopy, mode) {
    const config = spartaConfigWebpackCopy
    if (config.hasOwnProperty('pages')) {
      this.webpackConfig.plugins = config.pages.map(pageConfig => {
        if (mode === 'production') {
          pageConfig = Object.assign({}, pageConfig, {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              collapseBooleanAttributes: true,
              removeScriptTypeAttributes: true
            }
          })
        }
        return new HtmlWebpackPlugin(pageConfig)
      })
      delete config.pages
    }
  }

  _convertPublicPathToOutputPublicPath(spartaConfigWebpackCopy) {
    const config = spartaConfigWebpackCopy
    if (config.hasOwnProperty('publicPath')) {
      const publicPath = config.publicPath
      config.output = {}
      config.output.publicPath = publicPath
      delete config.publicPath
    }
  }
}

module.exports = Service
