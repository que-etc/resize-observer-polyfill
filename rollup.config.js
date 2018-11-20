import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const loose = true;

export default {
    input: 'src/index.js',
    output: [{
        name: 'ResizeObserver',
        file: pkg.main,
        format: 'umd'
    }, {
        file: pkg.module,
        format: 'es'
    }],
    plugins: [
        babel({
            presets: [['@babel/env', {loose}]],
            plugins: [
                ['@babel/proposal-class-properties', {loose}],
                ['@babel/plugin-transform-for-of', {assumeArray: true}]
            ]
        })
    ]
};
