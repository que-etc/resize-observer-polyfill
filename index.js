import global from './src/shims/global';
import ResizeObserver from './src/ResizeObserver';

export default (function () {
    // Export existing implementation if it's available.
    if (typeof global.ResizeObserver === 'function') {
        return global.ResizeObserver;
    }

    return ResizeObserver;
})();
