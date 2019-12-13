const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const exec = require('child_process').execSync
const webpackConfigBase = require('./webpack.config.base')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpackMerge = require('webpack-merge')
const { warn } = require('../utils')

// 网站版本号设置
let appVersion = ''
try {
  appVersion = exec('git rev-parse --short HEAD').toString().replace(/\n/, '')
} catch (e) {
  warn('Getting revision failed. Maybe this is not a git project.')
}

// 将第三方依赖（node_modules）的库打包，从而充分利用浏览器缓存
const vendors = [
// <% if (includeVuex) { -%>
//   'vuex',
// <% } -%>
// <% if (includeSpartaUI) { -%>
//   'sparta-ui',
// <% } -%>
// <% if (!isPc) { -%>
//   'vue-lazyload',
// <% } -%>
  'vue',
  'vue-router',
  'axios'
]

module.exports.getConfig = context => {
  const ANALYZE = context.cliArgs.analyze
  const ONLINE = context.cliArgs.online
  const CDN = process.env.CDN || '/'

  let config = webpackMerge(webpackConfigBase, {
    mode: 'production',
    // You should configure your server to disallow access to the Source Map file for normal users!
    // devtool: 'source-map', // 因为需要PE支持，暂时先不生成吧
    // entry: {
    //   app: context.resolve('src/index.js'),
    //   /*
    //     webpack v4默认其实在spitChunks已经有这个功能了，
    //     但是因为babel-polyfill的动态加入，
    //     直接将babel-polyfill加入vendor，
    //     万一以后用到高级语法需要polyfill支持，
    //     那样会影响整个vendor，
    //     因此，单独抽离（spitChunks自动会做）
    //    */
    //   vendors: vendors
    // },
    output: {
      path: context.resolve('dist'),
      // publicPath: 'https://cdn.self.com'
      publicPath: CDN,
      filename: 'static/js/[name].[contenthash:8].js',
      chunkFilename: 'static/js/[name].[contenthash:8].js',
      globalObject: 'this'
    },
    optimization: {
      // 分割文件
      splitChunks: {
        chunks: 'all'
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
            { loader: 'css-loader', options: { sourceMap: true } },
            { loader: 'postcss-loader', options: { sourceMap: true } },
            { loader: 'sass-loader', options: { sourceMap: true } }
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
      // html 模板插件
      new HtmlWebpackPlugin({
        appVersion,
        filename: 'index.html',
        template: context.resolve('src/index.html'),
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeScriptTypeAttributes: true
        }
      }),
      // 复制文件
      new CopyWebpackPlugin([
        // 复制favicon到dist
        {
          from: context.resolve('favicon.ico'),
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