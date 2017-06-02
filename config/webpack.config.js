var HtmlPlugin = require("html-webpack-plugin");
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: "./src/main.js",
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
            template: "./src/index.html",
            inject: "body"
        }),
        new ExtractTextPlugin("[name].css")
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
            { test: /\.glb$/, loader: "file-loader?name=/models/[name].[ext]" },
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