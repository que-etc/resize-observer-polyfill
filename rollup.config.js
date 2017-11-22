import babel from 'rollup-plugin-babel';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

export default {
    input: 'src/app.js',
    output: {
        file: 'dist/app.js',
        name: 'ResizeObserver',
        format: 'iife'
    },
    sourcemap: true,
    plugins: [
        babel({
            plugins: ['transform-class-properties']
        }),

        nodeResolve({
            jsnext: true
        }),

        commonjs({
            include: 'node_modules/**'
        }),

        buble({
            transforms: {
                dangerousForOf: true
            },
            namedFunctionExpressions: false
        }),

        uglify({
            mangle: {
                properties: {
                    regex: /_$/
                }
            }
        })
    ]
};
