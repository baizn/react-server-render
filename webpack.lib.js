const webpack = require('webpack')
var path = require('path')
var CleanPlugin = require('clean-webpack-plugin')

const vendors = [
    'react',
    'react-dom',
    'redux',
    'react-redux',
    'react-router',
    'immutable',
    'echarts',
    'bluebird',
    'redux-thunk',
    'lodash'
]

var libConfig = {
    output: {
        path: 'dist',
        filename: '[name]_[chunkhash].js',
        library: '[name]_[chunkhash]'
    },
    entry: {
        vendor: vendors
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new CleanPlugin('dist'),
        new webpack.DllPlugin({
            path: path.join(__dirname, 'dist/lib_manifest.json'),
            name: '[name]_[chunkhash]',
            context: __dirname
        }),
        new webpack.optimize.UglifyJsPlugin({
            'compress': {
                warnings: false
            }
        })
    ]
}

module.exports = libConfig