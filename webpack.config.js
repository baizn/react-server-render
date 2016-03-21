var webpack = require('webpack');
//提取出CSS
//var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.export = {
    entry: [
        'babel-polyfill',
        './client/index.js'
    ],
    output: {
        path: __dirname + '/build/',
        filename: 'bundle.js',
        chunkFilename: '[id].chunk.js',
        publicPath: '/build/'
    },
    //指定不依赖webpack解析的包，可在运行时import
    externals: [
        { 'react': 'React' },
        { 'react-dom': 'ReactDOM' }
    ],
    module: {
        loaders: [
            {
                test: /\.js?$/,
                //exclude用来排除过滤目录
                //exclude: /node_modules/,
                //include用于匹配目录,建议使用include
                include: [
                    path.resolve(__dirname, 'app'),
                    path.resolve(__dirname, 'server'),
                    path.resolve(__dirname, 'client')
                ],
                loader: 'babel',
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015', 'stage-0', 'react']
                }
            }
        ]
    },
    resolve: {
        extendsions: ['', '.js']
    },
    plugins: {
        new webpack.optimize.CommonsChunkPlugin('common.js'),
    }
}
