import {WeakMap} from './shims/es6-collections';
import ResizeObserverController from './ResizeObserverController';
import _ResizeObserver from './_ResizeObserver';

// Controller which will be assigned to all instances of ResizeObserver.
const controller = new ResizeObserverController();

// Registry of internal observers.
const observers = new WeakMap();

/**
 * ResizeObservers' "Proxy" class which is meant to hide private
 * properties and methods from public instances.
 *
 * Additionally it implements "idleTimeout" and "trackHovers" static property
 * accessors to give a control over the behavior of ResizeObserverController
 * instance. Changes made to these properties will affect all future and
 * existing observers.
 */
class ResizeObserver {
    /**
     * Creates a new instance of ResizeObserver.
     *
     * @param {Function} callback - Callback which will
     *      be invoked when dimensions of one of the
     *      observed elements are changed.
     */
    constructor(callback) {
        if (!arguments.length) {
            throw new TypeError("1 argument required, but only 0 present.");
        }

        const observer = new _ResizeObserver(callback, controller, this);

        // Register internal observer.
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
            throw new TypeError('type of "idleTimeout" value must be a number.');
        }

        if (typeof value < 0) {
            throw new TypeError('"idleTimeout" value must be greater than 0.');
        }

        controller.idleTimeout = value;
    }

    /**
     * Tells whether controller tracks "hover" event.
     *
     * @returns {Boolean}
     */
    static get trackHovers() {
        return controller.isHoverEnabled();
    }

    /**
     * Enables or disables tracking of "hover" event.
     *
     * @param {Boolean} value - Whether to disable or enable tracking.
     */
    static set trackHovers(enable) {
        if (typeof enable !== 'boolean') {
            throw new TypeError('type of "trackHovers" value must be a boolean.');
        }

        enable ?
            controller.enableHover() :
            controller.disableHover();
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
