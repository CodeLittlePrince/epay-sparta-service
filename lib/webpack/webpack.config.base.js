const path = require('path')
const isProduction = process.env.NODE_ENV === 'production'
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const WebpackBar = require('webpackbar')

// 减少路径书写
function resolve(dir) {
  return path.resolve(process.cwd(), dir)
}

// 指定以__base64为后缀的svg转为base64
const svgBase64Reg = /__base64\.(svg)(\?.*)?$/

// __dirname: 总是返回被执行的 js 所在文件夹的绝对路径
// __filename: 总是返回被执行的 js 的绝对路径
// process.cwd(): 总是返回运行 node 命令时所在的文件夹的绝对路径
module.exports = {
  resolve: {
    extensions: ['.js', '.vue', '.scss', '.css'],
    alias: {
      src: resolve('src/'),
      common: resolve('src/common/'),
      ajax: resolve('src/common/js/ajax/'),
      utils: resolve('src/common/js/utils/'),
      pages: resolve('src/pages/'),
      components: resolve('src/components/'),
      componentsBase: resolve('src/componentsBase/'),
      directives: resolve('src/directives/'),
      filters: resolve('src/filters/'),
      mixins: resolve('src/mixins/'),
      plugins: resolve('src/plugins/')
    }
  },
  // loaders
  module: {
    noParse: /^(vue|vue-router|vuex)$/,
    rules: [
      {
        test: /\.(svg)(\?.*)?$/,
        include: svgBase64Reg,
        loader: 'url-loader',
        options: {
          limit: 99999,
          name: isProduction
            ? 'static/font/[name].[hash:8].[ext]'
            : 'static/font/[name].[ext]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
        exclude: svgBase64Reg,
        loader: 'file-loader',
        options: {
          name: isProduction
            ? 'static/img/[name].[hash:8].[ext]'
            : 'static/img/[name].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: isProduction
            ? 'static/font/[name].[hash:8].[ext]'
            : 'static/font/[name].[ext]'
        }
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
  ]
}
