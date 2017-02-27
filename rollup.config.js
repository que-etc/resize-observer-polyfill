import babel from 'rollup-plugin-babel';
import buble from 'rollup-plugin-buble';

export default {
    entry: 'src/index.js',
    targets: [{
        moduleName: 'ResizeObserver',
        dest: 'dist/ResizeObserver.js',
        format: 'umd'
    }, {
        dest: 'dist/ResizeObserver.es.js',
        format: 'es'
    }],
    plugins: [
        babel({
            presets: ['stage-2']
        }),

        buble({
            transforms: {
                dangerousForOf: true
            },
            namedFunctionExpressions: false
        })
    ]
};
