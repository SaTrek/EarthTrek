var HtmlPlugin = require("html-webpack-plugin");
var webpack = require("webpack");
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
var earthtrekConfig = require('./earthtrek.config');

module.exports = {
    context: path.join(__dirname, '../src'),
    entry: ['../main.js'],
    output: {
        path: "./www",
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
        new UglifyJSPlugin({
            compress: { warnings: false }
        }),
        new ExtractTextPlugin("[name].css"),
        new CopyWebpackPlugin([
             /*   { from: './models', to: 'models/' },*/
                { from: './images', to: 'images/' },
               /* { from: './newassets', to: 'newassets/' },
                { from: './data', to: 'data/' },*/
               /* { from: './sounds', to: 'sounds/' }*/
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
        contentBase: "./www",
        port: 8472
    },
    resolve: {
        alias: {
            jquery: 'jquery/dist/jquery.min'
        }
    },
    node: {
        console: true,
        net: 'empty',
        tls: 'empty',
        fs: 'empty'
    },
    module: {
        unknownContextCritical: false,
        loaders: [
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
            { test: /\.(png|gif|jpg|jpeg)$/,  loader: "file-loader?name=/images/[name].[ext]" },
            { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file?name=css/fonts/[name].[ext]' },
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};