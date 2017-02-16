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
            include: 'node_modules/**'
        }),

        buble({
            transforms: {
                dangerousForOf: true
            },
            namedFunctionExpressions: false
        }),

        uglify({
            mangleProperties: {
                regex: /_$/
            }
        })
    ]
};
