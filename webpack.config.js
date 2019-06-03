const path = require('path');
const R = require('ramda');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const {
    setEntry,
    addRule,
    addPlugin,
    appendExtensions,
    prependExtensions
} = require('./util/compose');
const env = require('./util/env');

const isProd = env.prod;
const isDev = env.dev;

// ----------------------------------------------------------------------------
// Base config
// ----------------------------------------------------------------------------

const config = {
    context: path.join(__dirname, '/src/main/resources/assets'),
    entry: {},
    output: {
        path: path.join(__dirname, '/build/resources/main/assets'),
        filename: './js/[name].js',
    },
    resolve: {
        extensions: [],
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
    plugins: [],
    mode: env.type,
    devtool: isProd ? false : 'inline-source-map',
}

// ----------------------------------------------------------------------------
// JavaScript loaders
// ----------------------------------------------------------------------------

// TYPESCRIPT
function addTypeScriptSupport(cfg) {
    const rule = {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
            configFile: 'tsconfig.json',
        },
    };

    return R.pipe(
        setEntry('./js/main.js'),
        addRule(rule),
        prependExtensions(['.tsx', '.ts', '.json'])
    )(cfg);
}

// BABEL
function addBabelSupport(cfg) {
    const rule = {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
    };

    return R.pipe(
        setEntry('./js/main.js'),
        addRule(rule),
        prependExtensions(['.jsx', '.js', '.json'])
    )(cfg);
}

// ----------------------------------------------------------------------------
// CSS loaders
// ----------------------------------------------------------------------------

const createDefaultCssLoaders = () => ([
    {loader: MiniCssExtractPlugin.loader, options: {publicPath: '../', hmr: isDev}},
    {loader: 'css-loader', options: {sourceMap: !isProd, importLoaders: 1}},
    {loader: 'postcss-loader', options: {sourceMap: !isProd}},
]);

const createCssPlugin = () => (
    new MiniCssExtractPlugin({
        filename: './styles/[name].css',
        chunkFilename: './styles/[id].css',
    })
);

// LESS
function addLessSupport(cfg) {
    const rule = {
        test: /\.less$/,
        use: [
            ...createDefaultCssLoaders(),
            {loader: 'less-loader', options: {sourceMap: !isProd}},
        ]
    };

    const plugin = createCssPlugin();

    return R.pipe(
        addRule(rule),
        addPlugin(plugin),
        appendExtensions(['.less', '.css'])
    )(cfg);
}

// SASS & SCSS
function addSassSupport(cfg) {
    const rule = {
        test: /\.(sass|scss)$/,
        use: [
            ...createDefaultCssLoaders(),
            {loader: 'sass-loader', options: {sourceMap: !isProd}},
        ]
    };

    const plugin = createCssPlugin();

    return R.pipe(
        addRule(rule),
        addPlugin(plugin),
        appendExtensions(['.sass', '.scss', '.css'])
    )(cfg);
}

// ----------------------------------------------------------------------------
// Resource loaders
// ----------------------------------------------------------------------------

// FONTS IN CSS
function addFontSupport(cfg) {
    const rule = {
        test: /\.(eot|woff|woff2|ttf|svg)$/,
        use: 'file-loader?name=fonts/[name].[ext]'
    };

    return R.pipe(
        addRule(rule)
    )(cfg);
}

// ----------------------------------------------------------------------------
// Result config
// ----------------------------------------------------------------------------

module.exports = R.pipe(
    // addTypeScriptSupport,
    addBabelSupport,
    addLessSupport,
    addSassSupport,
    addFontSupport
)(config);
