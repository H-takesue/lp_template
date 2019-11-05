//const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ImageminMozjpeg = require('imagemin-mozjpeg');
const ImageminPngquant = require('imagemin-pngquant');
const ImageminGifsicle = require('imagemin-gifsicle');
const ImageminSvgo = require('imagemin-svgo');

const config = {
    entry: [
        "./src/js/index.js",
        "./src/css/style.scss"
    ],
    output: {
        filename: "js/bundle.js",
        path: __dirname + "/build/"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: false,
                            plugins: [
                                require("autoprefixer")({
                                    grid: true,
                                })
                            ]
                        }
                    },
                    {
                        loader: "sass-loader",
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({filename: 'css/[name].css'}),
        new CopyWebpackPlugin(
            [
                {
                    from: './',
                    to: './',
                    ignore: [
                        '!*.html'
                    ]
                },
            ],
            { context: 'src/' }
        ),
        new CopyWebpackPlugin(
            [
                {
                    from: './',
                    to: 'img/',
                },
            ],
            { context: 'src/img' }
        ),
        new ImageminPlugin({
                test: /\.(jpe?g|png|gif|svg)$/i,
                plugins: [
                    ImageminMozjpeg({ quality: 80 }),
                    ImageminPngquant({ quality: '65-80' }),
                    ImageminGifsicle(),
                    ImageminSvgo()
                ]
            },)
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({}),
            new OptimizeCssAssetsPlugin({})
        ]
    }
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.output =  {
            filename: "js/bundle.js",
                path: __dirname + argv.mode ===  "/dist/"
        };
    }
    return config;
};
