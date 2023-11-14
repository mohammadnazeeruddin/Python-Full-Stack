const path = require('path');

module.exports = {

    mode: 'development',

    devtool: 'inline-source-map',

    performance: {
        hints: false
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [{
            test: /\.ts$/,
            use: [
                'ts-loader',
                'angular2-template-loader',
                'source-map-loader'
            ]
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader'
            ]
        }, {
            test: /\.scss$/,
            use: [
                'raw-loader',
                'sass-loader'
            ]
        }, {
            test: /\.html$/,
            use: 'raw-loader'
        }],
        exprContextCritical: false
    }

};