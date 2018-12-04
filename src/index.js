import ResizeObserverPolyfill from './ResizeObserver.js';
import global from './shims/global.js';

export default typeof global.ResizeObserver !== 'undefined' ?
    // Export existing implementation if available.
    global.ResizeObserver :
    ResizeObserverPolyfill;
