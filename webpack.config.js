// import path from 'path'
// import webpack from 'webpack'
// import assetsPlugin from 'assets-webpack-plugin'
// import ExtractTextPlugin from 'extract-text-webpack-plugin'
// import CleanPlugin from 'clean-webpack-plugin'

var path = require('path')
var webpack = require('webpack')
var assetsPlugin = require('assets-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CleanPlugin = require('clean-webpack-plugin')

var DEBUG = process.env.NODE_ENV === 'production'
var env = {
    NODE_ENV: process.env.NODE_ENV,
    API_BASE_URL: process.env.API_BASE_URL
}

var baseConfig = {
    target: 'node',
    node: {
        __filename: true,
        __dirname:  true
    },
    devtool: !DEBUG ? 'source-map' : false,
    entry: {
        app: './app/app.js',
        vendor: [
            'react',
            'react-dom',
            'redux',
            'bluebird',
            'humps',
            'lodash'
        ]
    },
    resolve: {
        root: [ path.join(__dirname, 'app') ],
        extensions: ['', '.js', '.css']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: !DEBUG ? '[name].js' : '[name].[chunkhash].js',
        publicPath: 'dist/'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(env)
        })
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/,
                include: __dirname
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!postcss-loader'
            }
        ]
    }
}

if(!DEBUG) {
    baseConfig.entry.dev = [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server'
    ]

    baseConfig.plugins = baseConfig.plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
    ])

    //config.output.publicPath = 'http://localhost:3000/static' //配置文件里面读取
    baseConfig.module.loaders[0].query = {
        'env': {
            development: {
                'presets': ['react-hmre']
            }
        }
    }
} else {
    baseConfig.plugins = baseConfig.plugins.concat([
        //将相似的文件和chunk合并，以便更好的缓存
        new webpack.optimize.DedupePlugin(),

        //通过在应用中使用chunk和模块的次数来进行优化
        new webpack.optimize.OccurenceOrderPlugin(),

        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 51200
        }),

        //将内联的CSS提取成单独的文件
        new ExtractTextPlugin('style.css', {
            allChunks: false
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: '[name].[chunkhash].js'
        }),

        new webpack.optimize.AggressiveMergingPlugin(),

        new webpack.optimize.UglifyJsPlugin(),

        //每次编译之前都先清除dist目录
        new CleanPlugin('dist'),

        new assetsPlugin({
            path: path.join(__dirname, 'dist')
        })
    ])
    // baseConfig.module.loaders[0].query = {
    //     plugins: ['transform-runtime'],
    //     presets: ['es2015', 'stage-0', 'react', 'react-hmre']
    // }
}

module.exports = baseConfig
