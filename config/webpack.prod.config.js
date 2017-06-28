var HtmlPlugin = require("html-webpack-plugin");
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

module.exports = {
    context: path.join(__dirname, '../example'),
    entry: ['core-js/fn/promise',  './main.js'],
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
        new UglifyJSPlugin({
            compress: { warnings: false }
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
            PRODUCTION: JSON.stringify(true),
            ENVIRONMENT: JSON.stringify('prod'),
            API_URL: JSON.stringify('http://api.orbitaldesign.tk/')
        })
    ],
    devServer: {
        contentBase: "./public",
        port: 9080
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
            { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file?name=css/fonts/[name].[ext]' },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};