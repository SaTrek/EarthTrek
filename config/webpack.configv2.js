var HtmlPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./app/main.js",
    output: {
        path: __dirname + "/../public",
        filename: "bundle.js",
        sourcePrefix: ""
    },
    plugins: [
        new HtmlPlugin({
            template: "./app/index.html",
            inject: "body"
        })
    ],
    devServer: {
        contentBase: "./public"
    },
    module: {
        unknownContextCritical: false,
        loaders: [
            {
                test: /\.css$/,
                use: [
                    {loader: "css-loader", options: { modules: true }  }
                ]
            },
            {
                test: /\.(png|gif|jpg|jpeg)$/,
                loader: 'file-loader'
            },
            { test: /Cesium\.js$/, loader: "script" }
        ]
    }
};