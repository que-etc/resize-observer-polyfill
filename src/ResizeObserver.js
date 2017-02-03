import {Map} from './shims/es6-collections';
import ResizeObserverController from './ResizeObserverController';
import ResizeObserverSPI from './ResizeObserverSPI';

// Controller that will be assigned to all instances of ResizeObserver.
const controller = new ResizeObserverController();

// Registry of internal observers.
const observers = typeof WeakMap === 'function' ? new WeakMap() : new Map();

/**
 * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
 * providing only those methods that are define in the spec.
 *
 *
 * Additionally implements the "continuousUpdates" static property accessor to
 * give control over the behavior of the ResizeObserverController instance.
 * Changes made to this property affect all future and existing observers.
 */
class ResizeObserver {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {Function} callback - Callback that is invoked when dimensions of
     *      one of the observed elements change.
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

    /**
     * Tells whether continuous updates are enabled.
     *
     * @returns {boolean}
     */
    static get continuousUpdates() {
        return controller.continuousUpdates;
    }

    /**
     * Enables or disables continuous updates.
     *
     * @param {boolean} value - Whether to enable or disable continuous updates.
     */
    static set continuousUpdates(value) {
        if (typeof value !== 'boolean') {
            throw new TypeError('type of "continuousUpdates" value must be boolean.');
        }

        controller.continuousUpdates = value;
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
