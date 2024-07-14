const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.js',
    devtool: 'inline-source-map',
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        static: '.dist',
        compress: true,
        port: 9002,
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./src/styles", to: "style"},
                {from: "./src/static/fonts", to: "style/fonts"},
                {from: "./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2", to: "style/fonts"},
                {from: "./node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff", to: "style/fonts"},
                // {from: "./src/static/fonts", to: "fonts"},
                {from: "./src/static/img", to: "img"},
                {from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "style"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", to: "js"},
                {from: "./node_modules/bootstrap-icons/font/bootstrap-icons.min.css", to: "style"},
                {from: "./node_modules/chart.js/dist/chart.umd.js", to: "js"},
            ],
        }),
    ],
};