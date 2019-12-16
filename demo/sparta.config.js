module.exports = {
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
    publicPath: '/',
  },
  devServer: {
    proxy: [{
      context: ['/api', '/mock-switch'],
      target: 'http://localhost:7777',
      secure: false,
      changeOrigin: true
    }],
    historyApiFallback: true,
  },
  // 参照karma配置文档 http://karma-runner.github.io/4.0/config/configuration-file.html
  karma: {
    basePath: ''
  }
}