// import webpack from 'webpack'
// import webpackDevServer from 'webpack-dev-server'
// import config from './webpack.config'

var webpack = require('webpack')
var webpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config')

const PORT = 3000

new webpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    compress: true,
    stats: {
        colors: true,
        hash: true,
        timing: true,
        chunks: false
    }
}).listen(PORT, 'localhost', (err) => {
    if(err) {
        console.log('err')
    }
    console.log('webpack dev server is listening at localhost:' + PORT)
})