const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: ['./src/index.js'],
    output: {
        path: path.resolve('./dist'),
        filename: 'dist.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: { presets: ["@babel/env"] }
            },
        ],
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
};