const gulp = require('gulp');
const webpack = require('webpack');
const gutil = require('gulp-util');

function createWebpackCallback(callback) {
    return (err, stats) => {
        if (err) {
            throw new gutil.PluginError("webpack", err);
        }

        gutil.log("[webpack]", stats.toString());

        callback();
    };
}

gulp.task('build', callback => {
    webpack({
        entry: './demo/app.js',
        output: {
            libraryTarget: 'umd',
            path: './dist/',
            filename: 'app.js'
        },
        devtool: 'source-map',
        resolve: {
            extensions: ['', '.js']
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
    }, createWebpackCallback(callback));
});
