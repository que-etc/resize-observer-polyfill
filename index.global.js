import ResizeObserver from './src/ResizeObserver';

if (typeof window.ResizeObserver !== 'function') {
    // ResizeObserver host property is not enumerable
    // in the native implementation.
    Object.defineProperty(window, 'ResizeObserver', {
        value: ResizeObserver,
        writable: true,
        configurable: true
    });
}

// Still export the constructor as for me it seems
// awkward when a module doesn't export anything.
export default window.ResizeObserver;
