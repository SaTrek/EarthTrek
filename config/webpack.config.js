var HtmlPlugin = require("html-webpack-plugin");
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

module.exports = {
    context: path.join(__dirname, '../src'),
    entry: "./main.js",
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
     /*   new UglifyJSPlugin({
            compress: { warnings: false }
        }),*/
        new HtmlPlugin({
            template: "./index.html",
            inject: "body"
        }),
        new ExtractTextPlugin("[name].css"),
        new CopyWebpackPlugin([
            { from: './models', to: 'models/' }, { from: './images', to: 'images/' }, { from: './newassets', to: 'newassets/' }
            ]
            , {copyUnmodified: true}
        )
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
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            { test: /\.(png|gif|jpg|jpeg)$/,  loader: "file-loader?name=/images/[name].[ext]" },
            { test: /Cesium\.js$/, loader: "script" },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file?name=css/fonts/[name].[ext]'
            }
        ]
    }
};