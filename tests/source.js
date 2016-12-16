import ResizeObserverPolyfill from '../src/ResizeObserver';
import ResizeObserverEntryPolyfill from '../src/ResizeObserverEntry';

let ResizeObserver = ResizeObserverPolyfill,
    ResizeObserverEntry = ResizeObserverEntryPolyfill;

if (window.__karma__.config.native) {
    ResizeObserver = window.ResizeObserver || {};
    ResizeObserverEntry = window.ResizeObserverEntry || {};
}

export {ResizeObserver, ResizeObserverEntry};
