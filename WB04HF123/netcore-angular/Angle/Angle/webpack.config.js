const isDevBuild = process.argv.indexOf('--env.prod') < 0;
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;

module.exports = {

    mode: isDevBuild ? 'development' : 'production',

    devtool: isDevBuild ? 'inline-source-map' : false,

    resolve: {
        extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html']
    },

    entry: {
        'polyfills': './ClientApp/app/polyfills.ts',
        'main-client': isDevBuild ? './ClientApp/boot-client.ts' : './ClientApp/boot-client.aot.ts'
    },

    output: {
        filename: '[name].js',
        publicPath: '/dist/',
        path: path.join(__dirname, './wwwroot/dist')
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        },
        sideEffects: false // for ng2-select
    },

    module: {
        rules: [{
                test: isDevBuild ? /\.ts$/ : /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                exclude: isDevBuild ? [/\.spec\.ts$/, /node_modules/] : [/\.spec\.ts$/],
                use: isDevBuild ? [{
                        loader: 'ts-loader',
                        options: {
                            configFile: 'ClientApp/tsconfig.json'
                        }
                    },
                    'angular-router-loader',
                    'angular2-template-loader'
                ] : ['@ngtools/webpack']
            }, {
                test: /\.html$/,
                loader: 'raw-loader'
            }, {
                test: /\.css$/,
                use: [
                    // MiniCssExtractPlugin.loader,
                    'raw-loader'
                ]
            }, {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'url-loader',
                    options: { limit: 100000 }
                }]
            },
            { test: /jquery\.flot\.resize\.js$/, loader: 'imports-loader?this=>window' },
            { test: /\.scss$/, loaders: ['to-string-loader', 'css-loader', 'sass-loader'] },
            { test: /\.json$/, loader: 'json-loader', exclude: [/node_modules/] }
        ]
    },

    plugins: []
        .concat(isDevBuild ? [] : [
            new AngularCompilerPlugin({
                tsConfigPath: 'ClientApp/tsconfig.aot.json',
                entryModule: 'ClientApp/app/app.module#AppModule',
                sourceMap: false
            })
        ])
        .concat([
            // new MiniCssExtractPlugin({
            //     filename: "[name].css",
            //     chunkFilename: "[id].css"
            // }),
            new CleanWebpackPlugin(['./wwwroot/dist/']),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery'
            })
        ])
};