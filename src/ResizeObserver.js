import {Map} from './shims/es6-collections';
import ResizeObserverController from './ResizeObserverController';
import ResizeObserverSPI from './ResizeObserverSPI';

// Controller that will be assigned to all instances of the ResizeObserver.
const controller = new ResizeObserverController();

// Registry of internal observers. If WeakMap is not available use current shim
// of the Map collection as the former one can't be polyfilled anyway.
const observers = typeof WeakMap === 'function' ? new WeakMap() : new Map();

/**
 * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
 * providing only those methods properties that are define in the spec.
 */
class ResizeObserver {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {ResizeObserverCallback} callback - Callback that is invoked when dimensions of
     *      the observed elements change.
     */
    constructor(callback) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }

        // Create a new instance of an internal ResizeObserver.
        const observer = new ResizeObserverSPI(callback, controller, this);

        // Register internal observer.
        observers.set(this, observer);
    }
}

// Expose public methods of ResizeObserver.
[
    'observe',
    'unobserve',
    'disconnect'
].forEach(method => {
    ResizeObserver.prototype[method] = function () {
        return observers.get(this)[method](...arguments);
    };
});

export default ResizeObserver;
