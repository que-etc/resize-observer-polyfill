const gulp = require('gulp');
const _ = require('lodash');
const eslint = require('gulp-eslint');
const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const Server = require('karma').Server;

gulp.task('build', () => {
    const baseConfig = {
        format: 'umd',
        moduleName: 'ResizeObserver',
        plugins: [
            babel({
                presets: [
                    ['es2015', {
                        modules: false,
                        loose: true
                    }]
                ],
                plugins: [
                    ['external-helpers']
                ]
            })
        ]
    };

    const tasks = [{
        entry: 'index.js',
        dest: 'dist/ResizeObserver.js'
    }, {
        entry: 'index.global.js',
        dest: 'dist/ResizeObserver.global.js'
    }, {
        entry: 'index.js',
        dest: 'dist/ResizeObserver.min.js',
        sourceMap: true,
        plugins: [...baseConfig.plugins, uglify({
            mangle: {
                except: ['ResizeObserver', 'ResizeObserverEntry']
            }
        })]
    }, {
        entry: 'index.global.js',
        dest: 'dist/ResizeObserver.global.min.js',
        sourceMap: true,
        plugins: [...baseConfig.plugins, uglify({
            mangle: {
                except: ['ResizeObserver', 'ResizeObserverEntry']
            }
        })]
    }].map(config => {
        const taskConfig = _.merge({}, baseConfig, config);

        return rollup(taskConfig)
            .then(bundle => bundle.write(taskConfig));
    });

    return Promise.all(tasks);
});

gulp.task('test:lint', () => {
    return gulp.src(['**/*.js', '!dist/*', '!tmp/*'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('test:spec', callback => {
    new Server({
        configFile: __dirname + '/karma.config.js'
    }, callback).start();
});

gulp.task('test:spec:custom', callback => {
    new Server({
        configFile: __dirname + '/karma.config.js',
        browsers: false
    }, callback).start();
});

gulp.task('test:spec:native', callback => {
    new Server({
        configFile: __dirname + '/karma.config.js',
        browsers: false,
        client: {
            target: 'native'
        }
    }, callback).start();
});

gulp.task('test', ['test:lint', 'test:spec']);
