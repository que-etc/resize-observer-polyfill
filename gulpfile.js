const gulp = require('gulp');
const webpack = require('webpack');
const gutil = require('gulp-util');
const eslint = require('gulp-eslint');
const builds = require('./dev/builds');
const Server = require('karma').Server;

/* eslint-disable require-jsdoc */
function createWebpackCallback(callback) {
    return (err, stats) => {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }

        gutil.log('[webpack]', stats.toString());

        callback();
    };
}

gulp.task('build', ['build:min'], callback => {
    webpack(builds.production, createWebpackCallback(callback));
});

gulp.task('build:min', callback => {
    webpack(builds.prodMin, createWebpackCallback(callback));
});

gulp.task('test:lint', () => {
    return gulp.src(['**/*.js', '!dist/*', '!tmp/*'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('test:spec', callback => {
    new Server({
        configFile: __dirname + '/karma.config.js'
    }, callback).start();
});

gulp.task('test:spec:custom', callback => {
    new Server({
        configFile: __dirname + '/karma.config.js',
        browsers: false
    }, callback).start();
});

gulp.task('test:spec:native', callback => {
    new Server({
        configFile: __dirname + '/karma.config.js',
        browsers: false,
        client: {
            target: 'native'
        }
    }, callback).start();
});

gulp.task('test', ['test:lint', 'test:spec']);
