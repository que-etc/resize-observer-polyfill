import ResizeObserver from './src/ResizeObserver';
import global from './src/shims/global';

export default (function () {
    // Export existing implementation if it's available.
    if (typeof global.ResizeObserver === 'function') {
        return global.ResizeObserver;
    }

    return ResizeObserver;
})();
