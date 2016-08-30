var path = require('path')
var webpack = require('webpack')
var AssetsPlugin = require('assets-webpack-plugin')
var CleanPlugin = require('clean-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var DEBUG = !(process.env.NODE_ENV === 'production')

var env = {
  NODE_ENV: process.env.NODE_ENV,
  API_BASE_URL: process.env.API_BASE_URL
}

var config = {
  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
  entry: {
    app: './app/client/index',
    vendor: [
      'react',
      'react-router',
      'redux',
      'react-dom',
      'lodash',
      'bluebird',
      'humps',
      'history'
    ]
  },
  resolve: {
    root: [ path.join(__dirname, 'app') ],
    extension: ['', '.js', '.css']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: DEBUG ? '[name].js' : '[name].[chunkhash].js'
  },
  plugins: [
    new ExtractTextPlugin('style.css', {
      allChunks: false
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env)
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
                fallbackLoader: "style-loader",
                loader: "css-loader"
            })
      },
      {
        test: /.png$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          mimetype: 'image/png'
        }
      },
      {
        test: /.jpg$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          mimetype: 'image/jpg'
        }
      },
      {
        test: /.gif$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          mimetype: 'image/gif'
        }
      }
    ]
  }
}


if (DEBUG) {
  config.entry.dev = [
    'webpack-dev-server/client?http://localhost:3001',
    'webpack/hot/only-dev-server',
  ]

  config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filname: 'vendor.js'
    })
  ])
  config.output.publicPath = 'http://localhost:3001/dev/'
  config.module.loaders[0].query = {
    "env": {
      "development": {
        "presets": ["react-hmre"]
      }
    }
  }
} else {
  //config.output.publicPath = path.join(__dirname, 'dist')
  config.plugins = config.plugins.concat([
    new CleanPlugin('dist'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filname: '[name].[chunkhash].js'
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new AssetsPlugin(
      {
        filename: 'assets.json'
      }),
    new webpack.optimize.AggressiveMergingPlugin(),
    //将相似文件和chunk合并，以便更好地缓存
    new webpack.optimize.DedupePlugin(),

    //通过在应用中使用chunk和模块的次数来进行优化
    new webpack.optimize.OccurenceOrderPlugin(),

    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 51200
    })
  ])
}

module.exports = config
