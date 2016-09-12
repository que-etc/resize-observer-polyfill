const webpack = require('karma-webpack');

module.exports = function (config) {
    config.set({
        singleRun: true,
        frameworks: ['jasmine'],
        files: [
            'tests/**/*.spec.js'
        ],
        plugins: [
            webpack,
            'karma-jasmine',
            'karma-sourcemap-loader',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-ie-launcher',
            'karma-spec-reporter',
            'karma-jasmine-html-reporter'
        ],
        reporters: ['spec', 'kjhtml'],
        browsers: [
            'Chrome',
            'Firefox',
            'IE',
            'IE10'
        ],
        customLaunchers: {
            IE10: {
                base: 'IE',
                'x-ua-compatible': 'IE=EmulateIE10'
            }
        },
        preprocessors: {
            'tests/**.spec.js': ['webpack', 'sourcemap'],
            'src/**/*.js': ['webpack']
        },
        webpack: require('./dev/builds').test,
        webpackMiddleware: {noInfo: true}
    });
};
