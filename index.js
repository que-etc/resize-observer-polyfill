import global from './src/shims/global';
import ResizeObserverPolyfill from './src/ResizeObserver';

let ResizeObserver = ResizeObserverPolyfill;

// Export existing implementation if it's available.
if (typeof global.ResizeObserver === 'function') {
    ResizeObserver = global.ResizeObserver;
}

export default ResizeObserver;
