const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const devConfig = require('./config')
const { info, type } = require('../../utils')

class DevService {
  constructor(context) {
    this.context = context
  }

  async run() {
    this.devConfig = await devConfig.getDevConfig()
    // Compile webpack
    const compiler = webpack(this.context.webpackConfig)
    this._mergeDevServerConfig()
    // Tips of webpack compile start
    this._webpackCompileStartTip()
    // DevServer initialization
    const devServer = this._initDevServer(compiler)
    // Tips of webpack compile done
    this._webpackCompileDoneTip(compiler, devServer.options.proxy)
    // Listen node process signal to make sure devServer close
    this._listenProcessSignalForServerClose(devServer)
    // Listen devServer error event and give a tip if error occur
    this._listenDevServerErrorForTip(devServer)
  }

  _initDevServer(compiler) {
    return new WebpackDevServer(
      compiler,
      this.devServerConfig
    )
  }
  
  _mergeDevServerConfig() {
    let devServerConfig = {}
    const { devServerPort } = this.devConfig
    if (this.context.spartaConfig && this.context.spartaConfig.devServer) {
      devServerConfig = this.context.spartaConfig.devServer
    }
    this.devServerConfig = Object.assign({},
      {
        clientLogLevel: 'none',
        quiet: true,
        port: devServerPort,
        proxy: [{
          context: ['/api', '/mock-switch'],
          target: this.devConfig.proxyServerHost,
          secure: false,
          changeOrigin: true
        }],
        historyApiFallback: false,
        disableHostCheck: true, // For mobile phone visit
        contentBase: this.context.resolve('dev'), // 本地服务器所加载的页面所在的目录(HMR很依赖它)
        watchContentBase: true,
        inline: true,
        hot: true  // Work with 'HotModuleReplacementPlugin'
      },
      devServerConfig)
  }

  _webpackCompileStartTip() {
    info('Webpack compiling starts ...')
  }

  _webpackCompileDoneTip(compiler, proxy) {
    compiler.hooks.done.tap('Webpack devServer serve', stats => {
      if (stats.hasErrors()) {
        return
      }
      const { devLocalDomain, devServerDomain } = this.devConfig
      const devServerPort = this.devServerConfig.port
      console.log()
      console.log('  App running at:')
      console.log(`  - Local:   ${chalk.cyan(devLocalDomain +':'+ devServerPort)}`)
      console.log(`  - Network: ${chalk.cyan(devServerDomain +':'+ devServerPort)}`)
      this._logMockHosts(proxy)
      console.log()
      console.log('  Note that the development build is not optimized.')
      console.log(`  To create a production build, and take a view of files' size, run ${chalk.cyan('npm run analyze')}.`)
      console.log()
    })
  }

  /**
   * Tip proxy localhosts
   * @param {object|array} proxy WebpackDevServer proxy
   */
  _logMockHosts(proxy) {
    const typeOfProxy = type(proxy)
    if (typeOfProxy === 'array') {
      proxy.forEach(item => {
        console.log(`  - Mock of prefix: '${item.context.toString()}'`)
        console.log(`    Mock at: ${chalk.cyan(item.target)}`)
      })
    } else if (typeOfProxy === 'obejct') {
      console.log(`  - Mock of prefix: '${proxy.context.toString()}'}`)
      console.log(`    Mock at: ${chalk.cyan(proxy.target)}`)
    }
  }

  _listenProcessSignalForServerClose(devServer) {
    ['SIGINT', 'SIGTERM'].forEach(signal => {
      process.on(signal, () => {
        devServer.close(() => {
          process.exit(0)
        })
      })
    })
  }

  _listenDevServerErrorForTip(server) {
    const { ip } = this.devConfig
    server.listen(this.devServerConfig.port, ip, err => {
      err && console.log(err)
    })
  }
}

module.exports = DevService