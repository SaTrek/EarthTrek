var HtmlPlugin = require("html-webpack-plugin");
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: "./src/main.js",
    output: {
        path: "./public",
        sourcePrefix: "",
        filename:  'bundle.js'
    },
    plugins: [
        new UglifyJSPlugin({
            compress: { warnings: false }
        }),
        new HtmlPlugin({
            template: "./src/index.html",
            inject: "body"
        })
    ],
    devServer: {
        contentBase: "./public",
        port: 9080
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
