const _ = require('lodash');
const webpack = require('webpack');

const base = {
    resolve: {
        extensions: ['', '.js']
    },
    output: {
        library: 'ResizeObserver',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
                presets: [['es2015', {
                    loose: true
                }]],
                plugins: ['add-module-exports']
            }
        }]
    }
};

const builds = {
    test: _.merge({}, base, {
        devtool: 'inline-source-map',
        module: {
            loaders: [{
                query: {
                    presets: ['latest']
                }
            }]
        },
        output: {
            library: false
        }
    }),

    production: _.merge({}, base, {
        entry: {
            ResizeObserver: './index.js',
            'ResizeObserver.global': './index.global.js'
        },
        output: {
            path: './dist/',
            filename: '[name].js'
        }
    })
};

builds.prodMin = _.merge({}, builds.production, {
    devtool: 'source-map',
    output: {
        filename: '[name].min.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['ResizeObserver', 'ResizeObserverEntry']
            }
        })
    ]
});

module.exports = builds;
