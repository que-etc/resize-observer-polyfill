import ResizeObserverEntryPolyfill from '../../src/ResizeObserverEntry';
import ResizeObserverPolyfill from '../../src/ResizeObserver';

let ResizeObserver = ResizeObserverPolyfill,
    ResizeObserverEntry = ResizeObserverEntryPolyfill;

if (window.__karma__.config.native) {
    ResizeObserver = window.ResizeObserver || {};
    ResizeObserverEntry = window.ResizeObserverEntry || {};
}

export {ResizeObserver, ResizeObserverEntry};
