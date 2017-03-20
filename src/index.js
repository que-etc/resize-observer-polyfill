import ResizeObserverPolyfill from './ResizeObserver';

export default (() => {
    // Export existing implementation if available.
    if (typeof ResizeObserver != 'undefined') {
        // eslint-disable-next-line no-undef
        return ResizeObserver;
    }

    return ResizeObserverPolyfill;
})();
