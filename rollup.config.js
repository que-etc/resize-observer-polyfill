import babel from 'rollup-plugin-babel';

export default {
    entry: 'index.js',
    targets: [
        {
            moduleName: 'ResizeObserver',
            dest: 'dist/ResizeObserver.js',
            format: 'umd'
        },
        {
            dest: 'dist/ResizeObserver.es.js',
            format: 'es'
        }
    ],
    plugins: [
        babel({
            presets: [
                ['latest', {
                    es2015: {
                        loose: true,
                        modules: false
                    }
                }]
            ],
            plugins: ['external-helpers']
        })
    ]
};
