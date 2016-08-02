import ResizeObserverPolyfill from './src/ResizeObserver';

let ResizeObserver;

if (typeof window.ResizeObserver === 'function') {
    ResizeObserver = window.ResizeObserver;
} else {
    ResizeObserver = ResizeObserverPolyfill;
}

export default ResizeObserver;