const babel = require('rollup-plugin-babel');
const buble = require('rollup-plugin-buble');

const customLaunchers = {
    // Chrome
    SL_CHROME_CURRENT_WINDOWS: {
        base: 'SauceLabs',
        platform: 'Windows 10',
        browserName: 'chrome'
    },

    SL_CHROME_PRECEDING_WINDOWS: {
        base: 'SauceLabs',
        platform: 'Windows 10',
        browserName: 'chrome',
        version: 'latest-1'
    },

    SL_CHROME_CURRENT_OSX: {
        base: 'SauceLabs',
        platform: 'OS X 10.11',
        browserName: 'chrome'
    },

    SL_CHROME_PRECEDING_OSX: {
        base: 'SauceLabs',
        platform: 'OS X 10.11',
        browserName: 'chrome',
        version: 'latest-1'
    },

    SL_CHROME_CURRENT_LINUX: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Linux'
    },

    SL_CHROME_PRECEDING_LINUX: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Linux',
        version: 'latest-1'
    },

    // Firefox
    SL_FIREFOX_CURRENT_WINDOWS: {
        base: 'SauceLabs',
        platform: 'Windows 10',
        browserName: 'firefox'
    },

    SL_FIREFOX_PRECEDING_WINDOWS: {
        base: 'SauceLabs',
        platform: 'Windows 10',
        browserName: 'firefox',
        version: 'latest-1'
    },

    SL_FIREFOX_CURRENT_OSX: {
        base: 'SauceLabs',
        platform: 'OS X 10.11',
        browserName: 'firefox'
    },

    SL_FIREFOX_PRECEDING_OSX: {
        base: 'SauceLabs',
        platform: 'OS X 10.11',
        browserName: 'firefox',
        version: 'latest-1'
    },

    SL_FIREFOX_CURRENT_LINUX: {
        base: 'SauceLabs',
        platform: 'Linux',
        browserName: 'firefox'
    },

    SL_FIREFOX_PRECEDING_LINUX: {
        base: 'SauceLabs',
        platform: 'Linux',
        browserName: 'firefox',
        version: 'latest-1'
    },

    // Safari
    SL_SAFARI_10: {
        base: 'SauceLabs',
        platform: 'OS X 10.12',
        browserName: 'safari',
        version: '10.0'
    },

    SL_SAFARI_9: {
        base: 'SauceLabs',
        platform: 'OS X 10.11',
        browserName: 'safari',
        version: '9.0'
    },

    // IOS
    SL_IOS_10: {
        base: 'SauceLabs',
        browserName: 'safari',
        deviceName: 'iPhone Simulator',
        platform: 'iOS',
        version: '10.0'
    },

    SL_IOS_9: {
        base: 'SauceLabs',
        browserName: 'safari',
        deviceName: 'iPhone Simulator',
        platform: 'iOS',
        version: '9.3'
    },

    // Edge
    SL_EDGE_CURRENT: {
        base: 'SauceLabs',
        platform: 'Windows 10',
        browserName: 'MicrosoftEdge'
    },

    // Internet Explorer
    SL_IE_11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11.0'
    },

    SL_IE_10: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '10.0'
    },

    SL_IE_9: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '9.0'
    }
};

module.exports = function (config) {
    if (config.sauce === true && (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY)) {
        // eslint-disable-next-line no-console
        console.log('SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are not defined.');

        process.exit(1);
    }

    const reporters = ['spec'];
    let browsers = [];

    if (config.sauce === true) {
        browsers = Object.keys(customLaunchers);
        reporters.push('saucelabs');
    } else {
        reporters.push('kjhtml');
    }

    config.set({
        singleRun: true,

        frameworks: ['jasmine'],

        files: [
            './node_modules/regenerator-runtime/runtime.js',
            './node_modules/promise-polyfill/promise.js',
            'tests/**/*.spec.js'
        ],

        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-jasmine-html-reporter',
            'karma-rollup-plugin',
            'karma-sauce-launcher',
            'karma-sourcemap-loader',
            'karma-spec-reporter'
        ],

        port: 9876,
        captureTimeout: 4 * 60 * 1000,
        browserNoActivityTimeout: 4 * 60 * 1000,
        browserDisconnectTimeout: 10 * 1000,
        concurrency: 2,
        browserDisconnectTolerance: 3,

        reporters,

        browsers,

        customLaunchers,

        client: {
            native: config.native === true
        },

        preprocessors: {
            'tests/*.js': ['rollup', 'sourcemap'],
            'src/**/*.js': ['rollup']
        },

        rollupPreprocessor: {
            plugins: [
                babel({
                    presets: ['stage-2'],
                    plugins: [
                        ['transform-regenerator', {
                            async: false,
                            asyncGenerators: false
                        }]
                    ]
                }),
                buble({
                    transforms: {
                        dangerousForOf: true
                    },
                    namedFunctionExpressions: false
                })
            ],
            format: 'iife',
            sourceMap: 'inline'
        },

        sauceLabs: {
            testName: 'resize-observer-polyfill',
            public: 'public'
        }
    });
};
