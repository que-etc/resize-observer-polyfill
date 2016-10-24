import {WeakMap} from './shims/es6-collections';
import ResizeObserverController from './ResizeObserverController';
import _ResizeObserver from './_ResizeObserver';

// Controller that will be assigned to all instances of ResizeObserver.
const controller = new ResizeObserverController();

// Registry of the internal observers.
const observers = new WeakMap();

/**
 * ResizeObservers' "Proxy" class which is meant to hide private properties and
 * methods from public instances.
 *
 * Additionally it implements "idleTimeout" and "continuousUpdates" static property
 * accessors to give control over the behavior of the ResizeObserverController
 * instance. Changes made to these properties affect all future and existing
 * observers.
 */
class ResizeObserver {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {Function} callback - Callback that will be invoked when dimensions
     *      of one of the observed elements have been changed.
     */
    constructor(callback) {
        if (!arguments.length) {
            throw new TypeError('1 argument required, but only 0 present.');
        }

        const observer = new _ResizeObserver(callback, controller, this);

        // Register an internal observer.
        observers.set(this, observer);
    }

    /**
     * Extracts controllers' idle timeout value.
     *
     * @returns {Number}
     */
    static get idleTimeout() {
        return controller.idleTimeout;
    }

    /**
     * Sets up new idle timeout.
     *
     * @param {Number} value - New timeout value.
     */
    static set idleTimeout(value) {
        if (typeof value !== 'number') {
            throw new TypeError('type of "idleTimeout" value must be number.');
        }

        if (typeof value < 0) {
            throw new TypeError('"idleTimeout" value must be greater than 0.');
        }

        controller.idleTimeout = value;
    }

    /**
     * Tells whether continuous updates are enabled.
     *
     * @returns {Boolean}
     */
    static get continuousUpdates() {
        return controller.continuousUpdates;
    }

    /**
     * Enables or disables continuous updates.
     *
     * @param {Boolean} value - Whether to enable or disable continuous updates.
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
