/**
 * @deprecated Global version of the polyfill is deprecated and will be removed in the next major release.
 */
import ResizeObserver from './src/ResizeObserver';
import global from './src/shims/global';

if (typeof global.ResizeObserver !== 'function') {
    // ResizeObserver host property is not enumerable
    // in the native implementation.
    Object.defineProperty(global, 'ResizeObserver', {
        value: ResizeObserver,
        writable: true,
        configurable: true
    });
}

// Still export the constructor as for me it seems
// awkward when a module doesn't export anything.
export default global.ResizeObserver;
