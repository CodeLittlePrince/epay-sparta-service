const path = require('path')
const isProduction = process.env.NODE_ENV === 'production'
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const WebpackBar = require('webpackbar')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function resolve(dir) {
  return path.resolve(process.cwd(), dir)
}

const svgBase64Reg = /__base64\.svg$/i
const svgSpriteReg = /__sprite\.svg$/i

// __dirname: It gives you the path of the currently running file
// __filename: It returns the directory from which you ran Node
module.exports = {
  resolve: {
    extensions: ['.js', '.vue', '.scss', '.css'],
    alias: {
      src: resolve('src'),
      config: resolve('src/config'),
      common: resolve('src/common'),
      ajax: resolve('src/common/js/ajax'),
      utils: resolve('src/common/js/utils'),
      pages: resolve('src/pages'),
      components: resolve('src/components'),
      componentsBase: resolve('src/componentsBase'),
      directives: resolve('src/directives'),
      filters: resolve('src/filters'),
      mixins: resolve('src/mixins'),
      plugins: resolve('src/plugins'),
      store: resolve('src/store')
    }
  },
  // loaders
  module: {
    noParse: /^(vue|vue-router|vuex)$/,
    rules: [
      {
        // Convert the svg which the suffix is __base64 to base64
        test: /\.(svg)(\?.*)?$/,
        include: svgBase64Reg,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 99999,
              name: isProduction
                ? 'static/img/[name].[hash:8].[ext]'
                : 'static/img/[name].[ext]'
            }
          },
          'svgo-loader'
        ]
      },
      {
        test: /\.(svg)(\?.*)?$/,
        include: svgSpriteReg,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              esModule: false,
              extract: true,
              spriteFilename: isProduction
                ? 'static/img/sprite.[hash:8].svg'
                : 'static/img/sprite.svg'
            }
          },
          'svgo-loader'
        ]
      },
      {
        // Convert the svg which the suffix is __base64 to base64
        test: /\.(svg)(\?.*)?$/,
        exclude: [svgBase64Reg, svgSpriteReg],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: isProduction
                ? 'static/img/[name].[hash:8].[ext]'
                : 'static/img/[path][name].[ext]'
            }
          },
          'svgo-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|ico)(\?.*)?$/i,
        loader: 'file-loader',
        options: {
          name: isProduction
            ? 'static/img/[name].[hash:8].[ext]'
            : 'static/img/[path][name].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: isProduction
            ? 'static/font/[name].[hash:8].[ext]'
            : 'static/font/[path][name].[ext]'
        }
      },
      {
        test: /\.(css|scss)$/,
        use: [
          { loader: isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.js$/,
        include: [resolve('src')],
        use: [
          {
            loader: 'babel-loader',
            // Use cache carefully 😤It will cache although you have changed .browserslistrc sometimes.
            options: { cacheDirectory: true }
          },
          { loader: 'eslint-loader', options: { cache: true } }
        ]
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new WebpackBar(),
    // Make sure to include the plugin for the magic
    new VueLoaderPlugin(),
    new SpriteLoaderPlugin(),
    // 抽离出css
    new MiniCssExtractPlugin(
      {
        filename: !isProduction ? 'static/css/[path][name].css' : 'static/css/[name].[contenthash:8].css',
        chunkFilename: !isProduction ? 'static/css/[path][name].css' : 'static/css/[name].[contenthash:8].css'
      }
    )
  ]
}
