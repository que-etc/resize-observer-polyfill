const typescript = require('rollup-plugin-typescript');

const launchers = {
    windows: {
        SL_CHROME_CURRENT: {
            base: 'SauceLabs',
            platform: 'Windows 10',
            browserName: 'chrome'
        },
        SL_CHROME_PRECEDING: {
            base: 'SauceLabs',
            platform: 'Windows 10',
            browserName: 'chrome',
            version: 'latest-1'
        },
        SL_FIREFOX_CURRENT: {
            base: 'SauceLabs',
            platform: 'Windows 10',
            browserName: 'firefox'
        },
        SL_FIREFOX_PRECEDING: {
            base: 'SauceLabs',
            platform: 'Windows 10',
            browserName: 'firefox',
            version: 'latest-1'
        },
        SL_EDGE_17: {
            base: 'SauceLabs',
            platform: 'Windows 10',
            browserName: 'MicrosoftEdge',
            version: '17.17134'
        },
        SL_EDGE_16: {
            base: 'SauceLabs',
            platform: 'Windows 10',
            browserName: 'MicrosoftEdge',
            version: '16.16299'
        },
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
    },
    linux: {
        SL_CHROME_CURRENT: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Linux'
        },
        SL_CHROME_PRECEDING: {
            base: 'SauceLabs',
            browserName: 'chrome',
            platform: 'Linux',
            version: 'latest-1'
        },
        SL_FIREFOX_CURRENT: {
            base: 'SauceLabs',
            platform: 'Linux',
            browserName: 'firefox'
        },
        SL_FIREFOX_PRECEDING: {
            base: 'SauceLabs',
            platform: 'Linux',
            browserName: 'firefox',
            version: 'latest-1'
        }
    },
    osx: {
        SL_CHROME_CURRENT: {
            base: 'SauceLabs',
            platform: 'macOS 10.13',
            browserName: 'chrome'
        },
        SL_CHROME_PRECEDING: {
            base: 'SauceLabs',
            platform: 'macOS 10.13',
            browserName: 'chrome',
            version: 'latest-1'
        },
        SL_SAFARI_12: {
            base: 'SauceLabs',
            platform: 'macOS 10.13',
            browserName: 'safari',
            version: '12.0'
        },
        SL_SAFARI_11: {
            base: 'SauceLabs',
            platform: 'macOS 10.13',
            browserName: 'safari',
            version: '11.1'
        }
    },
    ios: {
        SL_IOS_12: {
            base: 'SauceLabs',
            browserName: 'safari',
            deviceName: 'iPhone Simulator',
            platform: 'iOS',
            version: '12.0'
        },
        SL_IOS_11: {
            base: 'SauceLabs',
            browserName: 'safari',
            deviceName: 'iPhone Simulator',
            platform: 'iOS',
            version: '11.3'
        }
    }
};

module.exports = function (config) {
    const reporters = ['spec'];

    let browsers = [],
        customLaunchers = {};

    if (config.sauce) {
        if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
            // eslint-disable-next-line no-console
            console.log('SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are not defined.');

            process.exit(1);
        }

        // SauceLabs may randomly disconnect browsers if all of them are being
        // tested together. So, I'll keep launchers separated by the platform
        // until I figure out a cleaner way to run CI tests.
        customLaunchers = launchers[config.sauce];
        browsers = Object.keys(customLaunchers);

        reporters.push('saucelabs');
    } else {
        reporters.push('kjhtml');
    }

    config.set({
        singleRun: true,
        frameworks: ['jasmine'],
        files: [
            './node_modules/promise-polyfill/dist/polyfill.js',
            './node_modules/es6-collections/es6-collections.js',
            'tests/resources/map-shim.js',
            'tests/**/*.spec.js'
        ],
        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-jasmine-html-reporter',
            'karma-rollup-preprocessor',
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
            'tests/*.js': ['rollup', 'sourcemap']
        },
        rollupPreprocessor: {
            plugins: [
                typescript({
                    target: 'es5',
                    include: [
                        'src/**/*',
                        'tests/**/*'
                    ]
                })
            ],
            output: {
                format: 'iife',
                sourcemap: 'inline'
            }
        },
        sauceLabs: {
            testName: 'resize-observer-polyfill',
            public: 'public'
        }
    });
};
