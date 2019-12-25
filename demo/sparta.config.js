const proxyServerConfig = require('./config/proxyServer')

module.exports = {
  favicon: 'favicon.ico',
  webpack: {
    entry: {
      app: ['src/index.js']
    },
    pages: [
      {
        filename: 'index.html',
        template: 'src/index.html'
      }
    ],
    publicPath: process.env.NODE_ENV === 'production'
      ? '//epay.cdn.com'
      : '/',
  },
  devServer: {
    proxy: [{
      context: ['/api', '/mock-switch'],
      target: `http://localhost:${proxyServerConfig.port}`
    }],
    historyApiFallback: false,
  },
  // 参照karma配置文档 http://karma-runner.github.io/4.0/config/configuration-file.html
  karma: {
    browsers: ['Chrome']
  }
}