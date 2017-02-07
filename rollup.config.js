import babel from 'rollup-plugin-babel';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

export default {
    entry: 'src/app.js',
    dest: 'dist/app.js',
    format: 'iife',
    sourceMap: true,
    plugins: [
        nodeResolve({
            jsnext: true
        }),

        commonjs({
            include: 'node_modules/**',
            exclude: 'node_modules/resize-observer-polyfill/**'
        }),

        babel({
            presets: ['stage-2']
        }),

        buble({
            transforms: {
                dangerousForOf: true
            },
            namedFunctionExpressions: false
        }),

        uglify({
            mangleProperties: {
                regex: /^_/
            }
        })
    ]
};
