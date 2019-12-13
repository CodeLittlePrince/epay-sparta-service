module.exports = {
  webpackConfig: {
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
  karmaConfig: {
    basePath: ''
  }
}