const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const webpackConfigBase = require('./webpack.config.base')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports.getConfig = context => {
  return webpackMerge(webpackConfigBase, {
    mode: 'development',
    // sourcemap 模式
    devtool: 'eval-source-map', // 定位会有问题，还是用eval-source-map好了
    // entry: {
    //   app: [webpackConfigBase.resolve('src/index.js')]
    // },
    output: {
      path: context.resolve('dev'),
      filename: '[name].js',
      publicPath: context.webpackConfig.publicPath || '/',
      globalObject: 'this'
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
      new CopyWebpackPlugin([
        // Copy favicon to destination
        {
          from: context.resolve('favicon.ico'),
          to: context.resolve('dev')
        }
      ]),
      // 热替换插件
      new webpack.HotModuleReplacementPlugin(),
      // 更友好地输出错误信息
      new FriendlyErrorsPlugin(),
      // 提示信息
      new webpack.NoEmitOnErrorsPlugin(),
    ]
  })
}