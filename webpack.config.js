const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const env = require('./util/env');

const isProd = env.prod;
const isDev = env.dev;

module.exports = {
    context: path.join(__dirname, '/src/main/resources/assets'),
    entry: {
        bundle: './js/main.js',
    },
    output: {
        path: path.join(__dirname, '/build/resources/main/assets'),
        filename: './js/[name].js',
    },
    resolve: {
        extensions: ['.js', '.less', '.sass', '.css'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.less$/,
                use: [
                    {loader: MiniCssExtractPlugin.loader, options: {publicPath: '../', hmr: isDev}},
                    {loader: 'css-loader', options: {sourceMap: !isProd, importLoaders: 1}},
                    {loader: 'postcss-loader', options: {sourceMap: !isProd}},
                    {loader: 'less-loader', options: {sourceMap: !isProd}},
                ]
            },
            {
                test: /\.(sass|scss)$/,
                use: [
                    {loader: MiniCssExtractPlugin.loader, options: {publicPath: '../', hmr: isDev}},
                    {loader: 'css-loader', options: {sourceMap: !isProd, importLoaders: 1}},
                    {loader: 'postcss-loader', options: {sourceMap: !isProd}},
                    {loader: 'sass-loader', options: {sourceMap: !isProd}},
                ]
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg)$/,
                use: 'file-loader?name=fonts/[name].[ext]'
            }
        ],
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                sourceMap: true,
                terserOptions: {
                    compress: {
                        drop_console: false,
                    },
                },
            }),
        ],
        splitChunks: {
            minSize: 30000,
        },
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: './styles/[name].css',
            chunkFilename: './styles/[id].css',
        }),
    ],
    mode: env.type,
    devtool: isProd ? false : 'inline-source-map',
};
