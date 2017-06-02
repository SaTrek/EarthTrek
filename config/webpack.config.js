var HtmlPlugin = require("html-webpack-plugin");
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var webpack = require("webpack");
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
        })
    ],
    devServer: {
        contentBase: "./public",
        port: 9080
    },
    resolve: {
        alias: {
            jquery: '../node_modules/jquery/dist/jquery.min',
            underscore: '../node_modules/underscore/underscore',
            satellitejs: '../node_modules/satellite.js/dist/satellite.min',
            bootstrap: '../node_modules/bootstrap/dist/js/bootstrap.min',
            slick: '../node_modules/slick-carousel/slick/slick.min',
            tle: '../node_modules/tle/lib/tle',
            moment: '../node_modules/moment/min/moment-with-locales.min',
        }
    },
    module: {
        unknownContextCritical: false,
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.(png|gif|jpg|jpeg)$/,  loader: "file-loader" },
            { test: /Cesium\.js$/, loader: "script" },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file?name=public/fonts/[name].[ext]'
            }
        ]
    }
};