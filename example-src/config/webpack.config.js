var HtmlPlugin = require("html-webpack-plugin");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
var earthtrekConfig = require('./earthtrek.config');

module.exports = {
    context: path.join(__dirname, '../src'),
    entry: ['core-js/fn/promise',  '../main.js'],
    output: {
        path: "./public",
        sourcePrefix: "",
        filename:  'bundle.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new HtmlPlugin({
            template: "./index.html",
            inject: "body"
        }),
        new ExtractTextPlugin("[name].css"),
        new CopyWebpackPlugin([
                { from: './images', to: 'images/' }
            ]
            , {copyUnmodified: true}
        ),
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(false),
            ENVIRONMENT: JSON.stringify(process.env.NODE_ENV),
            API_URL: JSON.stringify(earthtrekConfig.api.url),
            EARTHTREK_USERNAME: JSON.stringify(earthtrekConfig.api.username),
            EARTHTREK_TOKEN: JSON.stringify(earthtrekConfig.api.token),
        }),
        new webpack.EnvironmentPlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ],
    devServer: {
        contentBase: "./public",
        port: 8472
    },
    resolve: {
        alias: {
            jquery: 'jquery/dist/jquery.min'
        }
    },
    node: {
        fs: "empty"
    },
    module: {
        unknownContextCritical: false,
        loaders: [
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
            { test: /\.(png|gif|jpg|jpeg)$/,  loader: "file-loader?name=/images/[name].[ext]" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
            { test: /\.json$/,loader: 'json-loader' },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};
