const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const devConfig = require('./config')

class DevService {
  constructor(config) {
    this.config = config
  }

  async run() {
    const {
      ip,
      devServerPort,
      devLocalHost,
      devServerHost,
      proxyServerHost,
    } = await devConfig.getDevConfig()
    // Inject js which hot-reload need into webpack entry
    this._injectDevHotReloadEntries(devServerHost)
    // Compile webpack
    const compiler = webpack(this.config.webpackConfig)
    // Tips of webpack compile done
    this._webpackCompileDoneTip(compiler, devLocalHost, devServerHost, proxyServerHost)
    // DevServer initialization
    const devServer = this._initDevServer(compiler, proxyServerHost)
    // Listen node process signal to make sure devServer close
    this._listenProcessSignalForServerClose(devServer)
    // Listen devServer error event and give a tip if error occur 
    this._listenDevServerErrorForTip(devServer, ip, devServerPort)
  }

  _injectDevHotReloadEntries(publicUrl) {
    // Inject dev & hot-reload middleware entries
    const sockjsUrl = `?${publicUrl}/sockjs-node`
    // Inject dev/hot client
    this.config.webpackConfig.entry.app.push(
      require.resolve('webpack-dev-server/client') + sockjsUrl,
      require.resolve('webpack/hot/dev-server')
    )
  }

  _initDevServer(compiler, proxyServerHost) {
    return new WebpackDevServer(
      compiler,
      {
        clientLogLevel: 'none',
        quiet: true,
        proxy: {
          '/': {
            target: proxyServerHost,
            secure: false,
            changeOrigin: true,
            // Skipping proxy for browser request
            bypass: function(req) {
              if (
                req.headers.accept.indexOf('html') !== -1 &&
                req.url !== '/mock-switch/'
              ) {
                return '/index.html'
              }
              if (-1 < req.url.indexOf('favicon.ico')) {
                return '/favicon.ico'
              }
            }
          }
        },
        disableHostCheck: true, // For mobile phone visit
        // contentBase: webpackConfigBase.resolve('dev'), // 本地服务器所加载的页面所在的目录
        watchContentBase: true,
        inline: true,
        hot: true  // Work with 'HotModuleReplacementPlugin'
      }
    )
  }

  _webpackCompileDoneTip(compiler, devLocalHost, devServerHost, proxyServerHost) {
    compiler.hooks.done.tap('Webpack devServer serve', stats => {
      if (stats.hasErrors()) {
        return
      }
      console.log()
      console.log('  App running at:')
      console.log(`  - Local:   ${chalk.cyan(devLocalHost)}`)
      console.log(`  - Network: ${chalk.cyan(devServerHost)}`)
      console.log(`  - Mock:    ${chalk.cyan(proxyServerHost)}`)
      console.log()
      console.log('  Note that the development build is not optimized.')
      console.log(`  To create a production build, and take a view of files' size, run ${chalk.cyan('npm run analyze')}.`)
      console.log()
    })
  }

  _listenProcessSignalForServerClose(devServer) {
    ;['SIGINT', 'SIGTERM'].forEach(signal => {
      process.on(signal, () => {
        devServer.close(() => {
          process.exit(0)
        })
      })
    })
  }

  _listenDevServerErrorForTip(server, ip, devServerPort) {
    server.listen(devServerPort, ip, err => {
      err && console.log(err)
    })
  }
}

module.exports = DevService