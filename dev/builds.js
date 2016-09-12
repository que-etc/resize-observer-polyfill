const _ = require('lodash');
const webpack = require('webpack');

const builds = {
    general: {
        resolve: {
            extensions: ['', '.js']
        },
        output: {
            libraryTarget: 'umd'
        },
        module: {
            loaders: [{
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015-loose', 'stage-1'],
                    plugins: ['add-module-exports', 'transform-es2015-modules-commonjs']
                }
            }]
        }
    }
};

builds.test = _.merge({}, builds.general, {
    devtool: 'inline-source-map'
});

builds.dev = _.merge({}, builds.general, {
    entry: './src/ResizeObserver.js',
    devtool: 'source-map',
    output: {
        library: 'ResizeObserver',
        path: './tmp/',
        filename: 'ResizeObserver.js'
    }
});

builds.production = _.merge({}, builds.general, {
    entry: './index.js',
    output: {
        library: 'ResizeObserver',
        path: './dist/',
        filename: 'ResizeObserver.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['ResizeObserver', 'ResizeObserverEntry']
            }
        })
    ]
});

builds.prodGlobal = _.merge({}, builds.production, {
    entry: './index.global.js',
    output: {
        filename: 'ResizeObserver.global.js'
    }
});

module.exports = builds;
