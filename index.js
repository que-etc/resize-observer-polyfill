import ResizeObserverPolyfill from './src/ResizeObserver';

let ResizeObserver = ResizeObserverPolyfill;

// Export existing implementation if it's available.
if (typeof window.ResizeObserver === 'function') {
    ResizeObserver = window.ResizeObserver;
}

export default ResizeObserver;
