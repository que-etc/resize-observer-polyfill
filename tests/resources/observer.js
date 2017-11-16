import ResizeObserverEntryPolyfill from '../../src/ResizeObserverEntry';
import ResizeObserverPolyfill from '../../src/ResizeObserver';

let ResizeObserver = ResizeObserverPolyfill,
    ResizeObserverEntry = ResizeObserverEntryPolyfill;

if (window.__karma__.config.native) {
    window.addEventListener('error', error => {
        if (/loop limit/.test(error.message)) {
            error.stopImmediatePropagation();
        }
    });

    ResizeObserver = window.ResizeObserver || {};
    ResizeObserverEntry = window.ResizeObserverEntry || {};
}

export {ResizeObserver, ResizeObserverEntry};
