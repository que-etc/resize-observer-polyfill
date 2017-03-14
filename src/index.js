import ResizeObserverPolyfill from './ResizeObserver';
import isConstructor from './utils/isConstructor';

export default (() => {
    // Export existing implementation if available.
    if (isConstructor('ResizeObserver')) {
        // eslint-disable-next-line no-undef
        return ResizeObserver;
    }

    return ResizeObserverPolyfill;
})();
