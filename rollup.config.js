import pkg from './package.json';
import typescript from 'rollup-plugin-typescript';

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
        typescript({
            target: 'es5',
            include: ['src/**/*']
        })
    ]
};
