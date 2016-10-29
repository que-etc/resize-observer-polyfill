const babel = require('rollup-plugin-babel');

module.exports = function (config) {
    config.set({
        singleRun: true,
        frameworks: ['jasmine'],
        files: [
            'node_modules/babel-polyfill/dist/polyfill.js',
            'tests/**/*.spec.js'
        ],
        plugins: [
            'karma-rollup-plugin',
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
            'tests/*.js': ['rollup', 'sourcemap'],
            'src/**/*.js': ['rollup']
        },
        rollupPreprocessor: {
            plugins: [
                babel({
                    presets: [
                        ['latest', {
                            es2015: {
                                loose: true,
                                modules: false
                            }
                        }]
                    ],
                    plugins: ['external-helpers']
                })
            ],
            format: 'iife',
            sourceMap: 'inline'
        }
    });
};
