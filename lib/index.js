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
    this._mergeConfig(defaultWebpackConfig, mode)
    subServer = new SubService(this)
    subServer.run()
  }

  resolve(dir) {
    return path.resolve(process.cwd(), dir)
  }

  _mergeConfig(defaultWebpackConfig, mode) {
    // Load user configuration
    const epaySpartaWebpackConfig = this._loadEpaySpartaWebpackConfig(mode)
    this._mergeWebpackConfig(defaultWebpackConfig, epaySpartaWebpackConfig)
  }

  _loadEpaySpartaWebpackConfig(mode) {
    const epaySpartaConfigRawPath = this.resolve('sparta.config.js')
    if (fs.readFileSync(epaySpartaConfigRawPath)) {
      const epaySpartaConfigRaw = require(epaySpartaConfigRawPath)
      return this._getConvertEpaySpartaWebpackConfig(epaySpartaConfigRaw, mode)
    }
    return {}
  }

  _getConvertEpaySpartaWebpackConfig(epaySpartaConfigRaw, mode) {
    // Deep clone user webpack config
    const epaySpartaConfigRawWebpackCopy = deepClone(epaySpartaConfigRaw.webpackConfig)
    const config = epaySpartaConfigRawWebpackCopy
    // Convert pages to HtmlWebpackPlugin
    this._convertAllTypeOfEntryToArrayType(config)
    // Convert pages to HtmlWebpackPlugin
    this._convertPagesToHtmlWebpackPlugin(config, mode)
    // Convert publicPath to output.publicPath
    this._convertPublicPathToOutputPublicPath(config)
    return config
  }

  _mergeWebpackConfig(defaultWebpackConfig, epaySpartaWebpackConfig) {
    // Merge configs
    this.webpackConfig = webpackMerge(
      this.webpackConfig,
      defaultWebpackConfig,
      epaySpartaWebpackConfig
    )
  }

  /**
   * covert all types of entry to array type
   * e.g.
   * '/index.js'          => ['/index/js']
   * [{app: '/index.js'}] => ['/index.js']
   * {app: '/index.js'}   => ['/index.js']
   *
   * @param {object} epaySpartaConfigRawWebpackCopy sparta.config.js webpack configuration
   */
  _convertAllTypeOfEntryToArrayType(epaySpartaConfigRawWebpackCopy) {
    const config = epaySpartaConfigRawWebpackCopy
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

  _convertPagesToHtmlWebpackPlugin(epaySpartaConfigRawWebpackCopy, mode) {
    const config = epaySpartaConfigRawWebpackCopy
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

  _convertPublicPathToOutputPublicPath(epaySpartaConfigRawWebpackCopy) {
    const config = epaySpartaConfigRawWebpackCopy
    if (config.hasOwnProperty('publicPath')) {
      const publicPath = config.publicPath
      config.output = {}
      config.output.publicPath = publicPath
      delete config.publicPath
    }
  }
}

module.exports = Service
