const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: ['./src/entry.js'],
    output: {
        path: path.resolve('dist'),
        filename: 'index.js',
        libraryTarget: 'commonjs-module',
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.js'],
    },
};