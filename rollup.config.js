import babel from 'rollup-plugin-babel';
import pkg from './package.json';
import replace from 'rollup-plugin-replace';

const loose = true;

const createConfig = ({output, browser = false}) => ({
    input: 'src/index.js',
    output: output.map(format => Object.assign({name: 'ResizeObserver'}, format)),
    plugins: [
        babel({
            presets: [['@babel/env', {loose}]],
            plugins: [
                ['@babel/proposal-class-properties', {loose}],
                ['@babel/plugin-transform-for-of', {assumeArray: true}]
            ]
        }),
        replace({
            'process.env.BROWSER': JSON.stringify(browser)
        })
    ].filter(Boolean)
});

export default [
    createConfig({
        output: [{
            file: pkg.main,
            format: 'umd'
        }, {
            file: pkg.module,
            format: 'es'
        }]
    }),
    createConfig({
        output: [{
            file: pkg.browser[pkg.main],
            format: 'umd'
        }, {
            file: pkg.browser[pkg.module],
            format: 'es'
        }],
        browser: true
    }),
];
