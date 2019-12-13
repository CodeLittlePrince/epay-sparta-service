module.exports = {
  webpackConfig: {
    // 入口
    entry: {
      app: ['src/index.js']
    },
    pages: [
      {
        filename: 'index.html',
        template: 'src/index.html'
      }
    ]
    // plugins: [
    //   // html 模板插件
    //   new HtmlWebpackPlugin({
    //     filename: 'index.html',
    //     template: 'src/index.html'
    //   }),
    // ]
  },
  karmaConfig: {
    basePath: ''
  }
}