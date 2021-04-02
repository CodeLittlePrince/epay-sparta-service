const webpack = require('webpack')
const webpackConfigBase = require('./webpack.config.base')
const { merge } = require('webpack-merge')

module.exports.getConfig = () => {
  const config = merge(webpackConfigBase, {
    // sourcemap 模式
    mode: 'development',
    resolve: {
      alias: {
        // https://github.com/vuejs-templates/webpack/issues/215#issuecomment-238095102
        vue: 'vue/dist/vue.js'
      }
    },
    plugins: [
      // 定义全局常量
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"test"'
        }
      })
    ]
  })
  return config
}