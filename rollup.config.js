import babel from 'rollup-plugin-babel';
import buble from 'rollup-plugin-buble';

const pkg = require('./package.json');

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
            plugins: ['transform-class-properties']
        }),

        buble({
            transforms: {
                dangerousForOf: true
            },
            namedFunctionExpressions: false
        })
    ]
};
