const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpackConfigBase = require('./webpack.config.base')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpackMerge = require('webpack-merge')

module.exports.getConfig = context => {
  const ANALYZE = context.cliArgs.analyze
  const ONLINE = context.cliArgs.online

  let config = webpackMerge(webpackConfigBase, {
    mode: 'production',
    // You should configure your server to disallow access to the Source Map file for normal users!
    // devtool: 'source-map', // 因为需要PE支持，暂时先不生成吧
    output: {
      path: context.resolve('dist'),
      publicPath: context.webpackConfig.publicPath || '/',
      filename: 'static/js/[name].[contenthash:8].js',
      chunkFilename: 'static/js/[name].[contenthash:8].js',
      globalObject: 'this'
    },
    optimization: {
      // 分割文件
      splitChunks: {
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial'
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true
          }
        }
      },
      // 压缩js
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true
        })
      ]
    },
    performance: {
      hints: 'warning'
    },
    module: {
      rules: [
        {
          test: /\.(css|scss)$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            { loader: 'css-loader' },
            { loader: 'postcss-loader' },
            { loader: 'sass-loader' }
          ]
        },
      ]
    },
    plugins: [
      // 删除build文件夹
      new CleanWebpackPlugin(
        'dist',
        {
          root: context.resolve('')
        }
      ),
      // 抽离出css
      new MiniCssExtractPlugin(
        {
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].css',
        }
      ),
      // 复制文件
      new CopyWebpackPlugin([
        // 复制favicon到dist
        {
          from: context.resolve(context.spartaConfig.favicon),
          to: context.resolve('dist/')
        }
      ]),
      // 定义全局常量
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"',
          ONLINE: ONLINE ? 'true' : 'false' // 一般来说，上线之后埋点会用线上正式的key
        }
      }),
      // 加署名
      new webpack.BannerPlugin('Copyright by 网易支付 https://epay.163.com/'),
    ]
  })

  // analyze的话，进行文件可视化分析
  if (ANALYZE) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    config = webpackMerge(config, {
      plugins: [
        new BundleAnalyzerPlugin()
      ]
    })
  }

  return config
}