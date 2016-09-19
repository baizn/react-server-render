var path = require('path')
var webpack = require('webpack')
var AssetsPlugin = require('assets-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HappyPack = require('happypack')
var happyThreadPool = HappyPack.ThreadPool({size: 10})

var DEBUG = !(process.env.NODE_ENV === 'production')
console.log('process.env.NODE_ENV=' + process.env.NODE_ENV)
var config = {
  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
  entry: {
    app: './app/client/index'
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
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'happypack/loader',
        //loader: 'babel',
        exclude: /node_modules/,
        include: __dirname,
        query: {
          cacheDirectory: true
        }
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
  config.entry.vendor = [
      'react',
      'react-dom',
      'redux',
      'react-redux',
      'react-router',
      'immutable',
      'echarts',
      'bluebird',
      'redux-thunk',
      'lodash',
      'redux-logger'
  ]

  config.entry.dev = [
    'webpack-dev-server/client?http://localhost:3001',
    'webpack/hot/only-dev-server',
  ]

  config.plugins = config.plugins.concat([
     new HappyPack({
      loaders: [{
        path: 'babel',
        query: {
          presets: ['react-hmre']
        }
      }],
      cache: true,
      threadPool: happyThreadPool
    }),
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
    new HappyPack({
      loaders: ['babel'],
      cache: true,
      threadPool: happyThreadPool
    }),
    new webpack.optimize.UglifyJsPlugin({
      'compress': {
        warnings: false
      }
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require("./dist/lib_manifest.json")
    }),

    new AssetsPlugin({ 
      path: path.join(__dirname, 'dist'),
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
