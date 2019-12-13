const webpack = require('webpack')
const webpackConfigBase = require('./webpack.config.base')
const webpackMerge = require('webpack-merge')

module.exports.getConfig = () => {
  const config = webpackMerge(webpackConfigBase, {
    // sourcemap 模式
    mode: 'development',
    devtool: '#inline-source-map',
    resolve: {
      alias: {
        ...webpackConfigBase.resolve.alias,
        // https://github.com/vuejs-templates/webpack/issues/215#issuecomment-238095102
        vue: 'vue/dist/vue.js'
      }
    },
    module: {
      rules: [
        {
          test: /\.(css|scss)$/,
          use: [
            { loader: 'vue-style-loader' },
            { loader: 'css-loader', options: { sourceMap: true } },
            { loader: 'postcss-loader', options: { sourceMap: true } },
            { loader: 'sass-loader', options: { sourceMap: true } }
          ]
        },
      ]
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